/* ==========================================================================
   Informatică aplicată – Laborator: backend Google Apps Script
   Legat de o foaie de calcul Google (Extensions → Apps Script).
   Implementează: prezența cu cod de sesiune, primirea referatelor,
   notarea automată, catalogul și meniul profesorului.
   ========================================================================== */

// ---- Cheile testelor grilă (indexul răspunsului corect, de la 0). NU se publică. ----
var KEYS = {
  1: [1, 2, 0, 1, 1],
  2: [1, 2, 1, 2, 1],
  3: [1, 1, 2, 1, 0],
  4: [2, 1, 2, 1, 1],
  5: [1, 2, 3, 2, 1],
  6: [1, 2, 1, 1, 1],
  7: [1, 2, 2, 1, 1]
};

var FOI = {
  Config: ["Cheie", "Valoare", "Descriere"],
  Studenti: ["Email", "Nume", "Grupa"],
  Sesiuni: ["Lucrare", "Grupa", "Data", "Ora start", "Ora sfârșit", "Cod", "Termen referat", "Activă"],
  Prezenta: ["Timestamp", "Email", "Nume", "Grupa", "Lucrare", "Cod", "Status"],
  Referate: ["Timestamp", "Email", "Nume", "Grupa", "Lucrare", "Încercare", "Nota automată", "P măsurători (4)",
             "P grilă (3)", "P aplicație (2)", "P text (1)", "Grilă corecte", "Prezență", "La termen",
             "Verificare manuală", "Nota finală", "Observații profesor", "Detalii verificări", "Date (JSON)", "Răspunsuri text"],
  Catalog: ["Email", "Nume", "Grupa"]
};
var CONFIG_IMPLICIT = [
  ["DOMENIU_EMAIL", "", "Ex.: @365.univ-ovidius.ro (gol = orice adresă)"],
  ["VERIFICA_LISTA", "NU", "DA = acceptă doar studenții din foaia Studenti"],
  ["NR_MAX_TRIMITERI", "3", "Numărul maxim de trimiteri ale aceluiași referat"],
  ["TOLERANTA_PREZENTA_MIN", "10", "Minute acceptate înainte de ora de start / după ora de sfârșit"],
  ["AFISEAZA_DETALII", "DA", "DA = studentul vede verificările automate după trimitere"]
];

// ------------------------------------------------------------------ web
function doGet(e) {
  return json({ ok: true, serviciu: "Informatică aplicată – laborator", ora: new Date().toISOString() });
}

function doPost(e) {
  var lock = LockService.getScriptLock();
  try {
    lock.waitLock(20000);
    var req = JSON.parse(e.postData.contents);
    var r;
    switch (req.actiune) {
      case "prezenta": r = prezenta(req); break;
      case "referat": r = referat(req); break;
      case "status": r = status(req); break;
      case "ping": r = { ok: true }; break;
      default: r = { ok: false, mesaj: "Acțiune necunoscută." };
    }
    return json(r);
  } catch (err) {
    return json({ ok: false, mesaj: "Eroare server: " + err.message });
  } finally {
    try { lock.releaseLock(); } catch (x) {}
  }
}

function json(o) {
  return ContentService.createTextOutput(JSON.stringify(o)).setMimeType(ContentService.MimeType.JSON);
}

// ------------------------------------------------------------------ utilitare
function foaie(nume) {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sh = ss.getSheetByName(nume);
  if (!sh) { sh = ss.insertSheet(nume); sh.appendRow(FOI[nume]); sh.setFrozenRows(1); }
  return sh;
}
function cfg(cheie) {
  var v = foaie("Config").getDataRange().getValues();
  for (var i = 1; i < v.length; i++) if (v[i][0] === cheie) return String(v[i][1]).trim();
  for (i = 0; i < CONFIG_IMPLICIT.length; i++) if (CONFIG_IMPLICIT[i][0] === cheie) return CONFIG_IMPLICIT[i][1];
  return "";
}
function norm(s) { return String(s || "").trim().toLowerCase(); }

function valideazaStudent(req) {
  var email = norm(req.email), nume = String(req.nume || "").trim(), grupa = String(req.grupa || "").trim();
  if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) return { ok: false, mesaj: "Adresă de e-mail invalidă." };
  if (nume.length < 3 || !grupa) return { ok: false, mesaj: "Completați numele și grupa." };
  var dom = norm(cfg("DOMENIU_EMAIL"));
  if (dom && email.slice(-dom.length) !== dom) return { ok: false, mesaj: "Folosiți adresa instituțională (" + dom + ")." };
  if (cfg("VERIFICA_LISTA") === "DA") {
    var v = foaie("Studenti").getDataRange().getValues(), gasit = false;
    for (var i = 1; i < v.length; i++) if (norm(v[i][0]) === email) { gasit = true; nume = v[i][1] || nume; grupa = String(v[i][2] || grupa); }
    if (!gasit) return { ok: false, mesaj: "Adresa nu figurează în lista studenților. Contactați cadrul didactic." };
  }
  return { ok: true, email: email, nume: nume, grupa: grupa };
}

function laMinute(data, ora) {
  // data: obiect Date (celulă dată); ora: Date (celulă oră) sau text "hh:mm"
  if (!(data instanceof Date)) data = new Date(data);
  var h = 0, m = 0;
  if (ora instanceof Date) { h = ora.getHours(); m = ora.getMinutes(); }
  else { var p = String(ora).split(":"); h = +p[0] || 0; m = +p[1] || 0; }
  var d = new Date(data.getFullYear(), data.getMonth(), data.getDate(), h, m, 0);
  return d.getTime();
}

function cautaSesiune(lucrare, grupa, cod) {
  var v = foaie("Sesiuni").getDataRange().getValues();
  for (var i = v.length - 1; i >= 1; i--) {
    var r = v[i];
    if (Number(r[0]) !== Number(lucrare)) continue;
    if (r[1] && norm(r[1]) !== norm(grupa)) continue;
    if (cod !== null && norm(r[5]) !== norm(cod)) continue;
    return { rand: i + 1, lucrare: r[0], grupa: r[1], data: r[2], start: r[3], sfarsit: r[4], cod: r[5], termen: r[6], activa: norm(r[7]) !== "nu" };
  }
  return null;
}

// ------------------------------------------------------------------ prezența
function prezenta(req) {
  var s = valideazaStudent(req); if (!s.ok) return s;
  var lucrare = Number(req.lucrare);
  if (!(lucrare >= 1 && lucrare <= 7)) return { ok: false, mesaj: "Lucrare invalidă." };
  if (!req.cod) return { ok: false, mesaj: "Introduceți codul sesiunii afișat de cadrul didactic." };
  var ses = cautaSesiune(lucrare, s.grupa, req.cod);
  if (!ses) return { ok: false, mesaj: "Cod de sesiune incorect pentru lucrarea " + lucrare + " și grupa " + s.grupa + "." };
  if (!ses.activa) return { ok: false, mesaj: "Sesiunea nu este activă." };
  var acum = Date.now(), tol = (+cfg("TOLERANTA_PREZENTA_MIN") || 10) * 60000;
  var t0 = laMinute(ses.data, ses.start), t1 = laMinute(ses.data, ses.sfarsit);
  if (acum < t0 - tol || acum > t1 + tol) return { ok: false, mesaj: "Codul este valabil doar în timpul ședinței de laborator." };
  var sh = foaie("Prezenta"), v = sh.getDataRange().getValues();
  for (var i = 1; i < v.length; i++)
    if (norm(v[i][1]) === s.email && Number(v[i][4]) === lucrare) return { ok: true, mesaj: "Prezența era deja înregistrată (" + fmt(v[i][0]) + ").", deja: true };
  var stat = acum > t0 + 15 * 60000 ? "Întârziat" : "Prezent";
  sh.appendRow([new Date(), s.email, s.nume, s.grupa, lucrare, String(req.cod).toUpperCase(), stat]);
  return { ok: true, mesaj: "Prezență înregistrată: " + stat + ".", status: stat };
}

function fmt(d) { return Utilities.formatDate(new Date(d), Session.getScriptTimeZone(), "dd.MM.yyyy HH:mm"); }

// ------------------------------------------------------------------ referatul
function referat(req) {
  var s = valideazaStudent(req); if (!s.ok) return s;
  var lucrare = Number(req.lucrare);
  if (!SPECS.S[lucrare]) return { ok: false, mesaj: "Lucrare invalidă." };
  var sh = foaie("Referate"), v = sh.getDataRange().getValues(), incercari = 0;
  for (var i = 1; i < v.length; i++) if (norm(v[i][1]) === s.email && Number(v[i][4]) === lucrare) incercari++;
  var max = +cfg("NR_MAX_TRIMITERI") || 3;
  if (incercari >= max) return { ok: false, mesaj: "Ați atins numărul maxim de trimiteri (" + max + ") pentru această lucrare." };

  var date = req.date || {};
  date._text = req.text || {};
  var rez = SPECS.noteaza(lucrare, date, req.grila || [], KEYS[lucrare]);

  // prezența și termenul
  var pz = foaie("Prezenta").getDataRange().getValues(), prezent = "NU";
  for (i = 1; i < pz.length; i++) if (norm(pz[i][1]) === s.email && Number(pz[i][4]) === lucrare) prezent = pz[i][6] || "DA";
  var ses = cautaSesiune(lucrare, s.grupa, null), laTermen = "—";
  if (ses && ses.termen) laTermen = (Date.now() <= new Date(ses.termen).getTime() + 86399000) ? "DA" : "ÎNTÂRZIAT";

  var detalii = rez.verificari.map(function (c) { return (c.ok >= 0.999 ? "✔ " : c.ok > 0 ? "◐ " : "✘ ") + c.name + (c.msg ? " (" + c.msg + ")" : ""); }).join("\n");
  var textRasp = Object.keys(date._text).map(function (k) { return k + ": " + date._text[k]; }).join("\n\n");
  sh.appendRow([new Date(), s.email, s.nume, s.grupa, lucrare, incercari + 1, rez.nota,
                rez.puncte.masuratori, rez.puncte.grila, rez.puncte.aplicatie, rez.puncte.text,
                rez.grilaCorecte + "/" + KEYS[lucrare].length, prezent, laTermen, "DA – aplicație și text", "", "",
                detalii, JSON.stringify(Object.assign({}, date, { _grila: req.grila || [] })).slice(0, 45000), textRasp.slice(0, 45000)]);
  var r = { ok: true, mesaj: "Referat înregistrat (încercarea " + (incercari + 1) + " din " + max + ").",
            nota: rez.nota, puncte: rez.puncte, grilaCorecte: rez.grilaCorecte, din: KEYS[lucrare].length,
            prezenta: prezent, laTermen: laTermen };
  if (cfg("AFISEAZA_DETALII") !== "NU") r.verificari = rez.verificari;
  return r;
}

// ------------------------------------------------------------------ situația studentului
function status(req) {
  var email = norm(req.email); if (!email) return { ok: false, mesaj: "Lipsește adresa." };
  var res = { ok: true, prezente: {}, referate: {} };
  var pz = foaie("Prezenta").getDataRange().getValues();
  for (var i = 1; i < pz.length; i++) if (norm(pz[i][1]) === email) res.prezente[pz[i][4]] = pz[i][6];
  var rf = foaie("Referate").getDataRange().getValues();
  for (i = 1; i < rf.length; i++) if (norm(rf[i][1]) === email) {
    var L = rf[i][4];
    res.referate[L] = { incercari: rf[i][5], notaAuto: rf[i][6], notaFinala: rf[i][15] || null };
  }
  return res;
}

// ------------------------------------------------------------------ meniul profesorului
function onOpen() {
  SpreadsheetApp.getUi().createMenu("Laborator")
    .addItem("1. Inițializează foile", "initializeaza")
    .addItem("2. Generează cod pentru sesiunea selectată", "genereazaCod")
    .addItem("3. Actualizează catalogul", "catalog")
    .addSeparator()
    .addItem("Recalculează notele automate (după schimbarea cheilor)", "recalculeaza")
    .addToUi();
}

function initializeaza() {
  Object.keys(FOI).forEach(function (n) {
    var sh = foaie(n);
    if (sh.getLastRow() === 0) sh.appendRow(FOI[n]);
    sh.getRange(1, 1, 1, FOI[n].length).setFontWeight("bold").setBackground("#dce4ee");
  });
  var c = foaie("Config"), v = c.getDataRange().getValues(), exist = {};
  for (var i = 1; i < v.length; i++) exist[v[i][0]] = 1;
  CONFIG_IMPLICIT.forEach(function (r) { if (!exist[r[0]]) c.appendRow(r); });
  var s = foaie("Sesiuni");
  s.getRange("C2:C").setNumberFormat("dd.mm.yyyy"); s.getRange("D2:E").setNumberFormat("@");
  s.getRange("G2:G").setNumberFormat("dd.mm.yyyy");
  s.getRange("H2:H").setDataValidation(SpreadsheetApp.newDataValidation().requireValueInList(["DA", "NU"]).build());
  foaie("Referate").getRange("P2:P").setBackground("#fff7d6");
  SpreadsheetApp.getUi().alert("Foile au fost create. Completați Sesiuni (o linie per lucrare și grupă) și, opțional, Studenti.");
}

function genereazaCod() {
  var sh = SpreadsheetApp.getActiveSheet();
  if (sh.getName() !== "Sesiuni") { SpreadsheetApp.getUi().alert("Selectați un rând din foaia Sesiuni."); return; }
  var r = sh.getActiveRange().getRow(); if (r < 2) return;
  var alf = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789", cod = "";
  for (var i = 0; i < 6; i++) cod += alf.charAt(Math.floor(Math.random() * alf.length));
  sh.getRange(r, 6).setValue(cod); sh.getRange(r, 8).setValue("DA");
  SpreadsheetApp.getUi().alert("Codul sesiunii: " + cod + "\n\nAfișați-l studenților la începutul laboratorului.");
}

function catalog() {
  var st = {}, ord = [];
  function add(email, nume, grupa) {
    email = norm(email); if (!email) return null;
    if (!st[email]) { st[email] = { nume: nume, grupa: grupa, P: {}, N: {} }; ord.push(email); }
    return st[email];
  }
  var lst = foaie("Studenti").getDataRange().getValues();
  for (var i = 1; i < lst.length; i++) add(lst[i][0], lst[i][1], lst[i][2]);
  var pz = foaie("Prezenta").getDataRange().getValues();
  for (i = 1; i < pz.length; i++) { var o = add(pz[i][1], pz[i][2], pz[i][3]); if (o) o.P[pz[i][4]] = pz[i][6] === "Întârziat" ? "I" : "P"; }
  var rf = foaie("Referate").getDataRange().getValues();
  for (i = 1; i < rf.length; i++) {
    o = add(rf[i][1], rf[i][2], rf[i][3]); if (!o) continue;
    var nota = rf[i][15] !== "" && rf[i][15] !== null ? Number(rf[i][15]) : Number(rf[i][6]);
    var L = rf[i][4];
    if (!(L in o.N) || nota > o.N[L]) o.N[L] = nota; // cea mai bună încercare
  }
  var cap = ["Email", "Nume", "Grupa"];
  for (var L = 1; L <= 7; L++) cap.push("P" + L, "N" + L);
  cap.push("Prezențe", "Media referatelor");
  var out = [cap];
  ord.sort(function (a, b) { return String(st[a].grupa + st[a].nume).localeCompare(String(st[b].grupa + st[b].nume)); });
  ord.forEach(function (e) {
    var o = st[e], r = [e, o.nume, o.grupa], np = 0, s = 0, k = 0;
    for (var L = 1; L <= 7; L++) {
      r.push(o.P[L] || "A", o.N[L] !== undefined ? o.N[L] : "");
      if (o.P[L]) np++;
      if (o.N[L] !== undefined) { s += o.N[L]; k++; }
    }
    r.push(np + "/7", k ? Math.round(s / 7 * 100) / 100 : "");
    out.push(r);
  });
  var sh = foaie("Catalog"); sh.clear();
  sh.getRange(1, 1, out.length, cap.length).setValues(out);
  sh.getRange(1, 1, 1, cap.length).setFontWeight("bold").setBackground("#dce4ee");
  sh.setFrozenRows(1); sh.setFrozenColumns(3);
  SpreadsheetApp.getUi().alert("Catalog actualizat: " + (out.length - 1) + " studenți. Media se calculează la 7 lucrări (lucrările netrimise = 0).");
}

function recalculeaza() {
  var sh = foaie("Referate"), v = sh.getDataRange().getValues(), n = 0;
  for (var i = 1; i < v.length; i++) {
    try {
      var L = Number(v[i][4]), date = JSON.parse(v[i][18] || "{}");
      var gr = date._grila || [];
      var rez = SPECS.noteaza(L, date, gr, KEYS[L]);
      sh.getRange(i + 1, 7, 1, 6).setValues([[rez.nota, rez.puncte.masuratori, rez.puncte.grila, rez.puncte.aplicatie, rez.puncte.text, rez.grilaCorecte + "/" + KEYS[L].length]]);
      n++;
    } catch (e) {}
  }
  SpreadsheetApp.getUi().alert("Recalculate: " + n + " referate.");
}
