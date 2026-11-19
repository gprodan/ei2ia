/* Pagina unei lucrări: randarea conținutului, prezența, formularul de referat. */
(function () {
  var esc = APP.esc;
  var id = Number(new URLSearchParams(location.search).get("id") || 1);
  var L = LABS.filter(function (x) { return x.id === id; })[0] || LABS[0];
  id = L.id;
  var SP = SPECS.S[id];
  var KEY = "referat_L" + id;
  var $ = function (s, r) { return (r || document).querySelector(s); };
  var $$ = function (s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); };

  // ---------------- conținut ----------------
  document.title = "Lucrarea " + id + " – Informatică aplicată";
  $("#tag").textContent = "LUCRAREA " + id + " DIN 7";
  $("#titlu").textContent = L.titlu;
  $("#crumb").textContent = "Lucrarea " + id;
  $("#prev").href = "lucrare.html?id=" + Math.max(1, id - 1); if (id === 1) $("#prev").style.visibility = "hidden";
  $("#next").href = "lucrare.html?id=" + Math.min(7, id + 1); if (id === 7) $("#next").style.visibility = "hidden";
  $("#breviar").innerHTML = L.breviar;
  $("#obiective").innerHTML = L.obiective;
  $("#rezultate").innerHTML = L.rezultate;
  $("#mod").innerHTML = L.mod;
  $("#prelucrare").innerHTML = L.prelucrare;
  $("#p-materiale").innerHTML = "<h3>Echipamente și software</h3>" + L.materiale +
    '<h3>Înainte de a începe</h3><ul><li>Verificați montajul cu alimentarea deconectată.</li><li>Pinii Raspberry Pi Pico lucrează la 3,3 V.</li><li>Completați referatul pe măsură ce măsurați: ciorna se salvează automat în acest browser.</li></ul>';
  $("#p-intrebari").innerHTML = "<h3>Întrebări de verificare</h3>" + L.intrebari +
    '<p class="muted">Alegeți ' + SP.deschise + " dintre ele și răspundeți în secțiunea finală a referatului.</p>";
  $("#more").onclick = function () { var b = $("#breviar"); b.classList.toggle("open"); this.textContent = b.classList.contains("open") ? "Restrânge breviarul" : "Afișează tot breviarul"; };
  if (L.breviar.length < 1400) $("#more").style.display = "none";

  // cod sursă
  var lab = {}; // numerotare etichete repetate
  $("#p-cod").innerHTML = L.cod.map(function (c, i) {
    lab[c.label] = (lab[c.label] || 0) + 1;
    var et = c.label + (L.cod.filter(function (x) { return x.label === c.label; }).length > 1 ? " (" + lab[c.label] + ")" : "");
    var lg = { python: "python", c: "c", cpp: "cpp", java: "java", bash: "bash", cmake: "cmake", javascript: "javascript", powershell: "powershell", yaml: "yaml", dockerfile: "dockerfile", matlab: "matlab" }[c.lang] || "plaintext";
    return '<div class="snip" id="snip-' + i + '"><header><span class="lang">' + esc(c.lang) + "</span>" + esc(et) +
      '<span class="sp"></span><button class="btn" data-copy="' + i + '">Copiază</button></header><pre><code class="language-' + lg + '">' + esc(c.code) + "</code></pre></div>";
  }).join("") || '<p class="muted">Lucrarea nu are cod sursă de pornire.</p>';
  $$("[data-copy]").forEach(function (b) {
    b.onclick = function () {
      var t = L.cod[+b.dataset.copy].code;
      (navigator.clipboard ? navigator.clipboard.writeText(t) : Promise.reject()).then(function () { APP.toast("Cod copiat.", "ok"); }, function () { APP.toast("Selectați textul și copiați manual (Ctrl+C)."); });
    };
  });

  // tab-uri
  function arata(t) {
    $$(".tab").forEach(function (b) { b.classList.toggle("on", b.dataset.t === t); });
    $$(".pane").forEach(function (p) { p.classList.toggle("on", p.id === "p-" + t); });
  }
  $$(".tab").forEach(function (b) { b.onclick = function () { arata(b.dataset.t); }; });
  $$(".code-chip").forEach(function (b) {
    b.onclick = function () {
      arata("cod"); var s = $("#snip-" + b.dataset.code);
      s.scrollIntoView({ behavior: "smooth", block: "start" });
      s.classList.remove("flash"); void s.offsetWidth; s.classList.add("flash");
    };
  });
  $("#widen").onclick = function () {
    var w = $("#work").classList.toggle("wide");
    this.textContent = w ? "⇔ Arată modul de lucru" : "⇔ Lărgește";
  };

  window.addEventListener("load", function () {
    if (window.hljs) $$("#p-cod pre code").forEach(function (c) { hljs.highlightElement(c); });
  });

  // ---------------- prezența ----------------
  function setPrezenta(s) {
    $("#att-st").innerHTML = s ? '<b style="color:var(--ok)">✔ ' + esc(s) + "</b>" : "neînregistrată";
    if (s) { $("#att-cod").style.display = "none"; $("#att-btn").style.display = "none"; }
  }
  $("#att-btn").onclick = function () {
    APP.cereStudent().then(function (st) {
      if (!st) return;
      var b = $("#att-btn"); b.disabled = true;
      APP.api("prezenta", { lucrare: id, cod: $("#att-cod").value.trim().toUpperCase() }).then(function (r) {
        b.disabled = false;
        APP.toast(r.mesaj, r.ok ? "ok" : "bad");
        if (r.ok) setPrezenta(r.status || "Prezent");
      });
    });
  };
  if (APP.student()) APP.api("status").then(function (r) { if (r.ok && r.prezente && r.prezente[id]) setPrezenta(r.prezente[id]); });

  // ---------------- referatul ----------------
  var nr = 0;
  function inputHtml(c, sec, row, val) {
    var a = ' data-s="' + sec + '" data-r="' + row + '" data-k="' + c.k + '"';
    if (c.t === "select") return "<select" + a + '><option value=""></option>' + c.optiuni.map(function (o) { return "<option>" + esc(o) + "</option>"; }).join("") + "</select>";
    return "<input" + a + ' inputmode="' + (c.t === "num" ? "decimal" : "text") + '" autocomplete="off">';
  }
  var html = ['<p class="muted" style="margin-top:0">Completați valorile proprii. Coloanele verzi se calculează automat. Folosiți punct sau virgulă pentru zecimale.</p>'];
  SP.sectiuni.forEach(function (s) {
    nr++;
    html.push('<div class="ref-sec"><h3><span class="n">' + nr + "</span>" + esc(s.titlu) + "</h3>");
    if (s.tip === "tabel") {
      html.push('<div class="ref-table"><table><tr>' + s.coloane.map(function (c) { return "<th>" + esc(c.l) + "</th>"; }).join("") + "</tr>");
      s.randuri.forEach(function (r, ri) {
        html.push("<tr>" + s.coloane.map(function (c) {
          if (c.t === "dat") return '<td class="given">' + esc(r[c.k]) + "</td>";
          if (c.t === "calc") return '<td class="calc" data-calc="' + s.id + "|" + ri + "|" + c.k + '"></td>';
          return "<td>" + inputHtml(c, s.id, ri) + "</td>";
        }).join("") + "</tr>");
      });
      html.push("</table></div>");
    } else {
      html.push('<div class="fields">' + s.campuri.map(function (c) {
        var a = ' data-s="' + s.id + '" data-r="-1" data-k="' + c.k + '"';
        if (c.t === "cod") return '<div class="full"><label>' + esc(c.l) + '</label><textarea class="code"' + a + ' spellcheck="false" placeholder="Lipiți codul sau un link https://github.com/…"></textarea></div>';
        if (c.t === "lung") return '<div class="full"><label>' + esc(c.l) + "</label><textarea" + a + "></textarea></div>";
        return "<div><label>" + esc(c.l) + "</label><input" + a + ' inputmode="' + (c.t === "num" ? "decimal" : "text") + '" autocomplete="off"></div>';
      }).join("") + "</div>");
    }
    html.push("</div>");
  });
  nr++;
  html.push('<div class="ref-sec quiz"><h3><span class="n">' + nr + "</span>Test grilă (" + SP.grila.length + " întrebări, un singur răspuns corect)</h3>");
  SP.grila.forEach(function (q, qi) {
    html.push('<div class="q"><p>' + (qi + 1) + ". " + esc(q.q) + "</p>" + q.a.map(function (a, ai) {
      return '<label><input type="radio" name="g' + qi + '" value="' + ai + '"> ' + esc(a) + "</label>";
    }).join("") + "</div>");
  });
  html.push("</div>");
  nr++;
  var intrebari = (function () { var d = document.createElement("div"); d.innerHTML = L.intrebari; return $$("li", d).map(function (li) { return li.textContent.trim(); }); })();
  html.push('<div class="ref-sec"><h3><span class="n">' + nr + "</span>Întrebări deschise și concluzii</h3>");
  for (var i = 0; i < SP.deschise; i++) {
    html.push('<div class="full" style="margin-bottom:10px"><label>Întrebarea aleasă</label><select data-t="q' + i + '_nr"><option value=""></option>' +
      intrebari.map(function (q, k) { return '<option value="' + (k + 1) + '">' + (k + 1) + ". " + esc(q.length > 110 ? q.slice(0, 108) + "…" : q) + "</option>"; }).join("") +
      '</select><textarea data-t="q' + i + '" placeholder="Răspunsul (minimum 25 de cuvinte)"></textarea></div>');
  }
  html.push('<div class="full"><label>Concluzii (ce ați obținut, precizia, dificultăți, îmbunătățiri — minimum 50 de cuvinte)</label><textarea data-t="concluzii" style="min-height:120px"></textarea></div></div>');
  html.push('<div id="rez"></div><div class="actions"><button class="btn" id="b-ver">Verifică</button><button class="btn" id="b-print">Tipărește / PDF</button><span style="flex:1"></span><button class="btn accent" id="b-send">Trimite referatul</button></div>');
  $("#p-referat").innerHTML = html.join("");

  function colecteaza() {
    var date = {};
    $$("#p-referat [data-s]").forEach(function (el) {
      var s = el.dataset.s, r = +el.dataset.r, k = el.dataset.k, v = el.value;
      var sec = SP.sectiuni.filter(function (x) { return x.id === s; })[0];
      if (sec.tip === "tabel") {
        date[s] = date[s] || sec.randuri.map(function (rr) { var o = {}; for (var q in rr) o[q] = rr[q]; return o; });
        date[s][r][k] = v;
      } else { date[s] = date[s] || {}; date[s][k] = v; }
    });
    var grila = SP.grila.map(function (q, qi) { var c = $('input[name="g' + qi + '"]:checked'); return c ? +c.value : null; });
    var text = {};
    $$("#p-referat [data-t]").forEach(function (el) { text[el.dataset.t] = el.value; });
    return { date: date, grila: grila, text: text };
  }
  function calculeaza() {
    var d = colecteaza().date;
    $$("[data-calc]").forEach(function (td) {
      var p = td.dataset.calc.split("|"), sec = SP.sectiuni.filter(function (x) { return x.id === p[0]; })[0];
      var col = sec.coloane.filter(function (c) { return c.k === p[2]; })[0];
      var v = ""; try { v = col.calc(d[p[0]][+p[1]]); } catch (e) {}
      td.textContent = (v === "NaN" || v === "Infinity") ? "" : v;
    });
  }
  function salveaza() { APP.store(KEY, colecteaza()); }
  function restaureaza() {
    var s = APP.store(KEY); if (!s) return;
    $$("#p-referat [data-s]").forEach(function (el) {
      var d = s.date[el.dataset.s]; if (!d) return;
      var v = +el.dataset.r >= 0 ? (d[+el.dataset.r] || {})[el.dataset.k] : d[el.dataset.k];
      if (v != null) el.value = v;
    });
    (s.grila || []).forEach(function (v, qi) { if (v != null) { var r = $('input[name="g' + qi + '"][value="' + v + '"]'); if (r) r.checked = true; } });
    $$("#p-referat [data-t]").forEach(function (el) { if (s.text && s.text[el.dataset.t] != null) el.value = s.text[el.dataset.t]; });
  }
  restaureaza(); calculeaza();
  var tSave;
  $("#p-referat").addEventListener("input", function () { calculeaza(); clearTimeout(tSave); tSave = setTimeout(salveaza, 400); });
  $("#p-referat").addEventListener("change", function () { calculeaza(); salveaza(); });

  function afiseazaRezultat(r, local) {
    var ic = function (c) { return c.ok >= 0.999 ? '<span class="ic ok">✔</span>' : c.ok > 0 ? '<span class="ic part">◐</span>' : '<span class="ic no">✘</span>'; };
    var p = r.puncte || {};
    var h = '<div class="result"><div style="display:flex;justify-content:space-between;align-items:center;gap:10px;flex-wrap:wrap"><div>' +
      (local ? "<b>Verificare locală</b> (nu s-a trimis nimic)" : "<b>" + esc(r.mesaj) + "</b>") +
      '<div class="muted" style="font-size:.88rem">' + (local ? "Nota estimată fără testul grilă, care se notează doar la trimitere." :
        "Prezență: " + esc(r.prezenta) + " · La termen: " + esc(r.laTermen) + (r.grilaCorecte != null ? " · Grilă: " + r.grilaCorecte + "/" + r.din : "")) + "</div></div>" +
      '<div class="nota">' + (local ? "≈ " : "") + r.nota + '<span class="muted" style="font-size:1rem"> / 10</span></div></div>' +
      '<div class="pts"><div>Măsurători<b>' + p.masuratori + ' / 4</b></div><div>Grilă<b>' + (p.grila == null ? "—" : p.grila) + ' / 3</b></div><div>Aplicație*<b>' + p.aplicatie + ' / 2</b></div><div>Text*<b>' + p.text + " / 1</b></div></div>" +
      (r.verificari ? "<ul>" + r.verificari.map(function (c) { return "<li>" + ic(c) + "<span>" + esc(c.name) + (c.msg ? ' <span class="muted">— ' + esc(c.msg) + "</span>" : "") + "</span></li>"; }).join("") + "</ul>" : "") +
      '<p class="muted" style="font-size:.82rem;margin:.6em 0 0">* punctaj provizoriu, confirmat de cadrul didactic.</p></div>';
    $("#rez").innerHTML = h; $("#rez").scrollIntoView({ behavior: "smooth", block: "center" });
  }

  $("#b-ver").onclick = function () {
    var c = colecteaza(), d = c.date; d._text = c.text;
    afiseazaRezultat(SPECS.noteaza(id, d, c.grila, null), true);
  };
  $("#b-send").onclick = function () {
    APP.cereStudent().then(function (st) {
      if (!st) return;
      var c = colecteaza();
      var lipsa = c.grila.filter(function (x) { return x == null; }).length;
      if (!confirm("Trimiteți referatul pentru Lucrarea " + id + "?" + (lipsa ? "\n\nAtenție: " + lipsa + " întrebări grilă fără răspuns." : "") + "\n\nNumărul de trimiteri este limitat.")) return;
      var b = $("#b-send"); b.disabled = true; b.textContent = "Se trimite…";
      APP.api("referat", { lucrare: id, date: c.date, grila: c.grila, text: c.text }).then(function (r) {
        b.disabled = false; b.textContent = "Trimite referatul";
        if (!r.ok) { APP.toast(r.mesaj, "bad"); return; }
        APP.toast(r.mesaj, "ok"); afiseazaRezultat(r, false);
      });
    });
  };

  $("#b-print").onclick = function () {
    var c = colecteaza(), st = APP.student() || {};
    var h = ["<h1>Referat – Lucrarea " + id + "</h1><p><b>" + esc(L.titlu) + "</b></p>",
      "<p>Universitatea „Ovidius” din Constanța · FIMIM · " + esc(APP.CFG.PROGRAM) + "<br>Student: <b>" + esc(st.nume || "……………") + "</b> · Grupa: " + esc(st.grupa || "……") + " · E-mail: " + esc(st.email || "") + " · Data: " + new Date().toLocaleDateString("ro-RO") + "</p>"];
    SP.sectiuni.forEach(function (s, si) {
      h.push("<h2>" + (si + 1) + ". " + esc(s.titlu) + "</h2>");
      var d = c.date[s.id];
      if (s.tip === "tabel") {
        h.push("<table><tr>" + s.coloane.map(function (k) { return "<th>" + esc(k.l) + "</th>"; }).join("") + "</tr>" + d.map(function (r) {
          return "<tr>" + s.coloane.map(function (k) { var v = k.t === "calc" ? (function () { try { return k.calc(r); } catch (e) { return ""; } })() : r[k.k]; return "<td>" + esc(v == null ? "" : v) + "</td>"; }).join("") + "</tr>";
        }).join("") + "</table>");
      } else s.campuri.forEach(function (k) {
        var v = (d || {})[k.k] || "";
        h.push(k.t === "cod" || k.t === "lung" ? "<p><b>" + esc(k.l) + ":</b></p><pre>" + esc(v) + "</pre>" : "<p><b>" + esc(k.l) + ":</b> " + esc(v) + "</p>");
      });
    });
    h.push("<h2>Test grilă</h2><ol>" + SP.grila.map(function (q, qi) { return "<li>" + esc(q.q) + " — <i>" + esc(c.grila[qi] != null ? q.a[c.grila[qi]] : "fără răspuns") + "</i></li>"; }).join("") + "</ol>");
    h.push("<h2>Întrebări deschise</h2>");
    for (var i = 0; i < SP.deschise; i++) h.push("<p><b>Întrebarea " + esc(c.text["q" + i + "_nr"] || "—") + ".</b> " + esc(c.text["q" + i] || "") + "</p>");
    h.push("<h2>Concluzii</h2><p>" + esc(c.text.concluzii || "") + "</p>");
    $("#print-area").innerHTML = h.join("");
    try { window.print(); } catch (e) { APP.toast("Tipărirea nu este disponibilă aici."); }
  };
})();
