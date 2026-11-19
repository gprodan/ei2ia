/* Funcții comune: identitatea studentului, comunicarea cu Google Apps Script, utilitare UI. */
(function () {
  var CFG = window.APP_CONFIG || {};
  var DEMO = !CFG.SCRIPT_URL;

  function store(k, v) {
    try {
      if (v === undefined) return JSON.parse(localStorage.getItem(k) || "null");
      localStorage.setItem(k, JSON.stringify(v));
    } catch (e) { return null; }
  }

  function esc(s) { return String(s == null ? "" : s).replace(/[&<>"]/g, function (c) { return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]; }); }

  function toast(msg, kind) {
    var t = document.getElementById("toast");
    if (!t) { t = document.createElement("div"); t.id = "toast"; t.className = "toast"; document.body.appendChild(t); }
    t.textContent = msg; t.className = "toast on " + (kind || "");
    clearTimeout(t._h); t._h = setTimeout(function () { t.className = "toast"; }, 4200);
  }

  // ---------- student ----------
  function student() { return store("student"); }
  function cereStudent(force) {
    return new Promise(function (res) {
      var s = student();
      if (s && !force) return res(s);
      var d = document.getElementById("dlg-student");
      if (!d) {
        d = document.createElement("dialog"); d.id = "dlg-student";
        d.innerHTML = '<form method="dialog"><h2>Identificare student</h2>' +
          '<p class="muted" style="margin-top:-6px">Datele sunt folosite pentru prezență și pentru referat. Se păstrează în acest browser.</p>' +
          '<div class="row full"><label>Adresa de e-mail instituțională</label><input name="email" type="email" required placeholder="prenume.nume@...' + esc(CFG.DOMENIU_EMAIL || "") + '"></div>' +
          '<div class="row full"><label>Nume și prenume</label><input name="nume" required></div>' +
          '<div class="row full"><label>Grupa</label><input name="grupa" required placeholder="ex. 2312"></div>' +
          '<div style="display:flex;gap:10px;justify-content:flex-end"><button class="btn" value="cancel" formnovalidate>Renunță</button><button class="btn primary" value="ok">Salvează</button></div></form>';
        document.body.appendChild(d);
      }
      var f = d.querySelector("form"), s0 = student() || {};
      f.email.value = s0.email || ""; f.nume.value = s0.nume || ""; f.grupa.value = s0.grupa || "";
      d.onclose = function () {
        if (d.returnValue !== "ok") return res(student());
        var em = f.email.value.trim().toLowerCase(), dom = (CFG.DOMENIU_EMAIL || "").toLowerCase();
        if (dom && em.slice(-dom.length) !== dom) { toast("Folosiți adresa instituțională (" + dom + ").", "bad"); return res(student()); }
        var ns = { email: em, nume: f.nume.value.trim(), grupa: f.grupa.value.trim() };
        store("student", ns); afiseazaStudent(); res(ns);
      };
      d.showModal();
    });
  }
  function afiseazaStudent() {
    var el = document.getElementById("who"); if (!el) return;
    var s = student();
    el.innerHTML = (DEMO ? '<span class="demo-flag" title="SCRIPT_URL nu este configurat în config.js">mod demonstrativ</span>' : "") +
      (s ? '<span><b>' + esc(s.nume) + '</b> · grupa ' + esc(s.grupa) + '</span>' : '<span>Neidentificat</span>') +
      '<button class="btn ghost" id="btn-who">' + (s ? "Schimbă" : "Identificare") + "</button>";
    document.getElementById("btn-who").onclick = function () { cereStudent(true); };
  }

  // ---------- server ----------
  function api(actiune, payload) {
    payload = Object.assign({ actiune: actiune }, student() || {}, payload || {});
    if (DEMO) return Promise.resolve(demo(actiune, payload));
    // text/plain = cerere „simplă”, fără preflight CORS (compatibilă cu Apps Script)
    return fetch(CFG.SCRIPT_URL, { method: "POST", body: JSON.stringify(payload), redirect: "follow" })
      .then(function (r) { return r.json(); })
      .catch(function (e) { return { ok: false, mesaj: "Nu s-a putut contacta serverul (" + e.message + "). Verificați conexiunea." }; });
  }

  function demo(actiune, p) {
    var st = store("demo_state") || { prezente: {}, referate: {} };
    var r;
    if (actiune === "prezenta") {
      if (!p.cod || p.cod.length < 4) r = { ok: false, mesaj: "Introduceți codul sesiunii (în modul demonstrativ orice cod de 4+ caractere)." };
      else { st.prezente[p.lucrare] = "Prezent"; r = { ok: true, mesaj: "Prezență înregistrată local (mod demonstrativ)." }; }
    } else if (actiune === "referat") {
      var date = Object.assign({}, p.date, { _text: p.text });
      var rez = SPECS.noteaza(p.lucrare, date, p.grila, null);
      var prev = st.referate[p.lucrare] || { incercari: 0 };
      st.referate[p.lucrare] = { incercari: prev.incercari + 1, notaAuto: rez.nota };
      r = { ok: true, demo: true, mesaj: "Mod demonstrativ: referatul NU a fost trimis. Testul grilă se notează doar pe server.",
            nota: rez.nota, puncte: rez.puncte, verificari: rez.verificari, grilaCorecte: null, din: 5, prezenta: st.prezente[p.lucrare] || "NU", laTermen: "—" };
    } else if (actiune === "status") {
      r = { ok: true, prezente: st.prezente, referate: st.referate };
    } else r = { ok: true };
    store("demo_state", st);
    return r;
  }

  window.APP = { CFG: CFG, DEMO: DEMO, store: store, esc: esc, toast: toast, student: student, cereStudent: cereStudent, afiseazaStudent: afiseazaStudent, api: api };
  document.addEventListener("DOMContentLoaded", afiseazaStudent);
})();
