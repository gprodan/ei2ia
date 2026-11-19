/* ==========================================================================
   Specificațiile referatelor: tabele, câmpuri, verificări automate, teste grilă.
   Fișierul este folosit IDENTIC în browser (feedback imediat) și în Google
   Apps Script (notarea oficială). Cheile testelor grilă NU sunt aici — ele
   există doar pe server (apps-script/Code.gs).
   ========================================================================== */
var SPECS = (function () {
  // ---------- utilitare ----------
  function n(x) {
    if (x === null || x === undefined) return NaN;
    if (typeof x === "number") return x;
    var s = String(x).trim().replace(/\s/g, "").replace(",", ".");
    if (s === "") return NaN;
    return Number(s);
  }
  function has(x) { return !isNaN(n(x)); }
  function near(a, b, rel, abs) {
    a = n(a); b = n(b);
    if (isNaN(a) || isNaN(b)) return false;
    return Math.abs(a - b) <= Math.max(Math.abs(b) * (rel || 0), abs || 0);
  }
  function rows(d, id) { return (d && d[id]) || []; }
  function f(d, id) { return (d && d[id]) || {}; }
  function frac(okCount, total) { return total ? okCount / total : 0; }
  function words(s) { return String(s || "").trim().split(/\s+/).filter(Boolean).length; }
  // un rezultat de verificare: ok = fracțiune 0..1, w = pondere
  function C(name, ok, w, msg) { return { name: name, ok: Math.max(0, Math.min(1, ok)), w: w, msg: msg || "" }; }

  var COS = [1, 0.8, 0.5, 0];
  var CLASE_U = ["Întrerupere", "Gol de tensiune / subtensiune", "În limitele SR EN 50160", "Supratensiune"];
  function clasaU(U) { return U < 2.3 ? 0 : U < 207 ? 1 : U <= 253 ? 2 : 3; }
  var CATEG_COS = ["Fără penalizări", "Energie reactivă facturată", "Compensare obligatorie"];
  function categCos(c) { return c >= 0.92 ? 0 : c >= 0.65 ? 1 : 2; }

  var S = {};

  // ======================= LUCRAREA 1 =======================
  S[1] = {
    sectiuni: [
      { id: "tipuri", titlu: "Tipurile de date (pasul 2)", tip: "tabel",
        coloane: [{ k: "tip", t: "dat", l: "Tip" }, { k: "sz", t: "num", l: "sizeof [B]" },
                  { k: "min", t: "text", l: "Minim" }, { k: "max", t: "text", l: "Maxim / epsilon" }],
        randuri: [{ tip: "char" }, { tip: "short" }, { tip: "int" }, { tip: "long long" }, { tip: "float" }, { tip: "double" }] },
      { id: "tens", titlu: "Clasificarea tensiunii (pasul 3)", tip: "tabel",
        coloane: [{ k: "U", t: "dat", l: "U [V]" }, { k: "ab", t: "num", l: "Abatere [%]" },
                  { k: "cl", t: "select", l: "Clasificare afișată", optiuni: CLASE_U },
                  { k: "abc", t: "calc", l: "Abatere calculată [%]", calc: function (r) { return ((n(r.U) - 230) / 230 * 100).toFixed(2); } }],
        randuri: [{ U: 0 }, { U: 150 }, { U: 207 }, { U: 230 }, { U: 253 }, { U: 260 }] },
      { id: "cos", titlu: "Aplicația individuală: cos φ (pasul 6) — trei rulări de test", tip: "tabel",
        coloane: [{ k: "P", t: "num", l: "P [kW]" }, { k: "Q", t: "num", l: "Q [kvar]" }, { k: "S", t: "num", l: "S afișat [kVA]" },
                  { k: "c", t: "num", l: "cos φ afișat" }, { k: "cat", t: "select", l: "Mesaj afișat", optiuni: CATEG_COS },
                  { k: "cc", t: "calc", l: "cos φ calculat", calc: function (r) { var P = n(r.P), Q = n(r.Q); return (has(P) && has(Q)) ? (P / Math.sqrt(P * P + Q * Q)).toFixed(3) : ""; } }],
        randuri: [{}, {}, {}] },
      { id: "app", titlu: "Mediul de lucru și codul aplicației", tip: "campuri",
        campuri: [{ k: "mediu", t: "text", l: "Sistem de operare, versiune Code::Blocks / GCC" },
                  { k: "cod", t: "cod", l: "Codul aplicației individuale (sau link către depozitul Git)" }] }
    ],
    verificari: function (d) {
      var out = [];
      var ref = { "char": 1, "short": 2, "int": 4, "long long": 8, "float": 4, "double": 8 }, ok = 0, R = rows(d, "tipuri");
      for (var i = 0; i < R.length; i++) if (n(R[i].sz) === ref[R[i].tip]) ok++;
      out.push(C("Dimensiunile tipurilor de date", frac(ok, 6), 2, ok + "/6 corecte"));
      var T = rows(d, "tens"), okA = 0, okC = 0;
      for (i = 0; i < T.length; i++) {
        var U = n(T[i].U);
        if (near(T[i].ab, (U - 230) / 230 * 100, 0, 0.06)) okA++;
        if (T[i].cl === CLASE_U[clasaU(U)]) okC++;
      }
      out.push(C("Abaterile tensiunii", frac(okA, 6), 2, okA + "/6 corecte"));
      out.push(C("Clasificarea tensiunii", frac(okC, 6), 2, okC + "/6 corecte (verificați cazurile limită 207 și 253 V)"));
      var Cr = rows(d, "cos"), okS = 0, okc = 0, okK = 0, cats = {};
      for (i = 0; i < Cr.length; i++) {
        var P = n(Cr[i].P), Q = n(Cr[i].Q); if (!has(P) || !has(Q)) continue;
        var S2 = Math.sqrt(P * P + Q * Q), c = P / S2;
        if (near(Cr[i].S, S2, 0.01, 0.01)) okS++;
        if (near(Cr[i].c, c, 0, 0.006)) okc++;
        if (Cr[i].cat === CATEG_COS[categCos(c)]) okK++;
        cats[categCos(c)] = 1;
      }
      out.push(C("Aplicația cos φ: S și cos φ", frac(okS + okc, 6), 2, (okS + okc) + "/6 valori corecte"));
      out.push(C("Aplicația cos φ: mesaje", frac(okK, 3), 1, okK + "/3 corecte"));
      out.push(C("Testele acoperă cele trei cazuri", frac(Object.keys(cats).length, 3), 1, Object.keys(cats).length + "/3 cazuri"));
      return out;
    },
    grila: [
      { q: "Ce afișează printf(\"%d\", 7/2) în C?", a: ["3,5", "3", "4", "eroare de compilare"] },
      { q: "Ce valoare are un unsigned char egal cu 255 după instrucțiunea c = c + 1?", a: ["256", "−1", "0", "255"] },
      { q: "Ce returnează scanf(\"%lf\", &x) dacă utilizatorul tastează „abc”?", a: ["0", "1", "−1 întotdeauna", "valoarea 0.0 în x și 1"] },
      { q: "Conform SR EN 50160, ce interval de tensiune este admis pentru Un = 230 V?", a: ["220–240 V", "207–253 V", "200–250 V", "218,5–241,5 V"] },
      { q: "Ce rol are instrucțiunea break într-un switch?", a: ["oprește programul", "iese din switch după cazul executat", "sare la cazul următor", "repetă cazul curent"] }
    ],
    deschise: 2
  };

  // ======================= LUCRAREA 2 =======================
  S[2] = {
    sectiuni: [
      { id: "put", titlu: "Puteri în regim sinusoidal (U = 230 V, I = 10 A)", tip: "tabel",
        coloane: [{ k: "cos", t: "dat", l: "cos φ" }, { k: "Pn", t: "num", l: "P numeric [W]" }, { k: "Pa", t: "num", l: "P analitic [W]" },
                  { k: "Qn", t: "num", l: "Q numeric [var]" }, { k: "Qa", t: "num", l: "Q analitic [var]" }, { k: "S", t: "num", l: "S [VA]" },
                  { k: "e", t: "calc", l: "Eroare P [%]", calc: function (r) { var a = n(r.Pa), b = n(r.Pn); return (has(a) && has(b) && a !== 0) ? ((b - a) / a * 100).toFixed(3) : ""; } }],
        randuri: COS.map(function (c) { return { cos: c }; }) },
      { id: "arm", titlu: "Analiza armonică (pasul 3)", tip: "campuri",
        campuri: [{ k: "I1", t: "num", l: "I₁ [A]" }, { k: "I3", t: "num", l: "I₃ [A]" }, { k: "I5", t: "num", l: "I₅ [A]" },
                  { k: "THD", t: "num", l: "THD [%]" }, { k: "Ief", t: "num", l: "I_ef numeric [A]" }] },
      { id: "cs", titlu: "Curba de sarcină (pasul 4)", tip: "campuri",
        campuri: [{ k: "W", t: "num", l: "W [kWh]" }, { k: "Pmax", t: "num", l: "P_max [kW]" }, { k: "ora", t: "num", l: "Ora vârfului [h]" },
                  { k: "Pmed", t: "num", l: "P_med [kW]" }, { k: "ki", t: "num", l: "k_î" }, { k: "Tmax", t: "num", l: "T_max [h]" }] },
      { id: "app", titlu: "Aplicația individuală (sistem trifazat)", tip: "campuri",
        campuri: [{ k: "Ptot", t: "num", l: "Puterea activă totală [W]" }, { k: "IN", t: "num", l: "I_N efectiv [A]" },
                  { k: "cod", t: "cod", l: "Codul sau link către depozit" }] }
    ],
    verificari: function (d) {
      var out = [], R = rows(d, "put"), okA = 0, okN = 0, okS = 0;
      for (var i = 0; i < R.length; i++) {
        var c = n(R[i].cos), s = Math.sqrt(Math.max(0, 1 - c * c));
        if (near(R[i].Pa, 2300 * c, 0.002, 1) && near(R[i].Qa, 2300 * s, 0.002, 1)) okA++;
        if (near(R[i].Pn, 2300 * c, 0.01, 5) && near(R[i].Qn, 2300 * s, 0.01, 5)) okN++;
        if (near(R[i].S, 2300, 0.01, 0)) okS++;
      }
      out.push(C("P și Q analitice", frac(okA, 4), 2, okA + "/4 rânduri corecte"));
      out.push(C("P și Q numerice (eroare < 1 %)", frac(okN, 4), 2, okN + "/4 rânduri corecte"));
      out.push(C("Puterea aparentă", frac(okS, 4), 1, okS + "/4"));
      var A = f(d, "arm"), ok = 0;
      if (near(A.I1, 10, 0.01)) ok++; if (near(A.I3, 3, 0.01)) ok++; if (near(A.I5, 1.5, 0.02)) ok++;
      if (near(A.THD, 33.54, 0.01)) ok++; if (near(A.Ief, 10.5475, 0.005)) ok++;
      out.push(C("Analiza armonică", frac(ok, 5), 2, ok + "/5 valori corecte"));
      var K = f(d, "cs"), k = 0;
      if (has(K.W) && has(K.Pmax) && n(K.W) > 0) {
        if (near(K.Pmed, n(K.W) / 24, 0.02)) k++;
        if (near(K.ki, n(K.Pmed) / n(K.Pmax), 0.02)) k++;
        if (near(K.Tmax, n(K.W) / n(K.Pmax), 0.02)) k++;
        if (n(K.ora) >= 16 && n(K.ora) <= 20) k++;
      }
      out.push(C("Indicatorii curbei de sarcină (coerență)", frac(k, 4), 2, k + "/4 relații verificate"));
      var Ap = f(d, "app");
      out.push(C("Aplicația trifazată: P totală", near(Ap.Ptot, 230 * 30 * 0.85, 0.01) ? 1 : 0, 1, "P = 230·(10+12+8)·0,85"));
      return out;
    },
    grila: [
      { q: "Ce condiție face exact calculul valorii efective prin eșantionare?", a: ["numărul de eșantioane să fie putere a lui 2", "fereastra să conțină un număr întreg de perioade", "frecvența de eșantionare să fie 50 Hz", "semnalul să fie sinusoidal"] },
      { q: "Ce frecvență are puterea instantanee p(t) într-o rețea de 50 Hz?", a: ["25 Hz", "50 Hz", "100 Hz", "este constantă"] },
      { q: "Cu NumPy, a = np.array([1,2,3]); ce dă a * 2?", a: ["[1,2,3,1,2,3]", "[2,4,6]", "12", "eroare"] },
      { q: "Pentru a măsura armonica 13 a unui semnal de 50 Hz, frecvența minimă de eșantionare (Nyquist) este:", a: ["650 Hz", "exact 1300 Hz", "peste 1300 Hz", "50 Hz"] },
      { q: "Factorul de încărcare al unei curbe de sarcină este:", a: ["P_max / P_med", "P_med / P_max", "W / P_max", "P_min / P_max"] }
    ],
    deschise: 2
  };

  // ======================= LUCRAREA 3 =======================
  S[3] = {
    sectiuni: [
      { id: "i2c", titlu: "Montaj și magistrala I2C", tip: "campuri",
        campuri: [{ k: "adr", t: "text", l: "Adresele I2C găsite (ex. 0x3C, 0x40)" }] },
      { id: "cmp", titlu: "Comparația cu multimetrul", tip: "tabel",
        coloane: [{ k: "Us", t: "dat", l: "U sursă [V]" }, { k: "Uvi", t: "num", l: "U_VI [V]" }, { k: "Um", t: "num", l: "U_mult [V]" },
                  { k: "Ivi", t: "num", l: "I_VI [A]" }, { k: "Im", t: "num", l: "I_mult [A]" }, { k: "Pvi", t: "num", l: "P_VI [W]" }, { k: "R", t: "num", l: "R [Ω]" },
                  { k: "eU", t: "calc", l: "ε_U [%]", calc: function (r) { return (has(r.Uvi) && has(r.Um)) ? ((n(r.Uvi) - n(r.Um)) / n(r.Um) * 100).toFixed(2) : ""; } },
                  { k: "eI", t: "calc", l: "ε_I [%]", calc: function (r) { return (has(r.Ivi) && has(r.Im)) ? ((n(r.Ivi) - n(r.Im)) / n(r.Im) * 100).toFixed(2) : ""; } }],
        randuri: [{ Us: 3 }, { Us: 6 }, { Us: 9 }, { Us: 12 }] },
      { id: "en", titlu: "Energia în 5 minute la 12 V", tip: "campuri",
        campuri: [{ k: "P", t: "num", l: "P medie [W]" }, { k: "t", t: "num", l: "Durata [s]" }, { k: "Wi", t: "num", l: "W indicat de instrument [Wh]" },
                  { k: "Wc", t: "num", l: "W = P·t [Wh]" }, { k: "Wp", t: "num", l: "W din log.csv (Python) [Wh]" }] },
      { id: "app", titlu: "Aplicația individuală", tip: "campuri",
        campuri: [{ k: "cod", t: "cod", l: "Codul (buton reset + alarmă prag) sau link" }] }
    ],
    verificari: function (d) {
      var out = [], adr = String(f(d, "i2c").adr || "").toLowerCase();
      out.push(C("Adresele I2C (0x40 și 0x3C)", ((adr.indexOf("40") >= 0) + (adr.indexOf("3c") >= 0)) / 2, 1, ""));
      var R = rows(d, "cmp"), full = 0, okP = 0, okR = 0, okE = 0, mono = 0, prevI = -1;
      for (var i = 0; i < R.length; i++) {
        var r = R[i]; if (!(has(r.Uvi) && has(r.Um) && has(r.Ivi) && has(r.Im))) continue; full++;
        if (near(r.Pvi, n(r.Uvi) * n(r.Ivi), 0.03, 0.01)) okP++;
        if (near(r.R, n(r.Uvi) / n(r.Ivi), 0.03, 0.05)) okR++;
        if (Math.abs((n(r.Uvi) - n(r.Um)) / n(r.Um)) < 0.03 && Math.abs((n(r.Ivi) - n(r.Im)) / n(r.Im)) < 0.05) okE++;
        if (n(r.Ivi) > prevI) mono++; prevI = n(r.Ivi);
        if (!near(r.Uvi, r.Us, 0.15)) okE -= 0.5;
      }
      out.push(C("Tabel complet", frac(full, 4), 1, full + "/4 rânduri"));
      out.push(C("P = U·I", frac(okP, 4), 1, okP + "/4"));
      out.push(C("R = U/I", frac(okR, 4), 1, okR + "/4"));
      out.push(C("Precizia instrumentului (ε_U < 3 %, ε_I < 5 %)", frac(okE, 4), 2, ""));
      out.push(C("Curentul crește cu tensiunea", frac(mono, 4), 1, ""));
      var E = f(d, "en"), k = 0;
      if (near(E.Wc, n(E.P) * n(E.t) / 3600, 0.02, 0.01)) k++;
      if (near(E.Wi, E.Wc, 0.05)) k++;
      if (near(E.Wp, E.Wi, 0.05)) k++;
      out.push(C("Energia: calcul și concordanță (< 5 %)", frac(k, 3), 2, k + "/3"));
      return out;
    },
    grila: [
      { q: "Câte fire de semnal folosește magistrala I2C?", a: ["1", "2", "3", "4"] },
      { q: "Cum se selectează un dispozitiv pe magistrala SPI?", a: ["prin adresa de 7 biți", "prin linia CS dedicată", "prin viteza de ceas", "prin pinul MISO"] },
      { q: "Care este curentul maxim măsurabil cu modulul INA219 standard (șunt 0,1 Ω, ±320 mV)?", a: ["0,32 A", "1 A", "3,2 A", "32 A"] },
      { q: "De ce se folosește millis() în locul delay() în bucla principală?", a: ["este mai precis", "nu blochează procesorul între sarcini", "consumă mai puțină memorie", "funcționează și fără cristal"] },
      { q: "Metoda trapezelor față de metoda dreptunghiurilor la integrarea energiei:", a: ["are eroare mai mică la variații ale puterii", "are eroare mai mare", "dau mereu același rezultat", "nu se aplică la pas constant"] }
    ],
    deschise: 2
  };

  // ======================= LUCRAREA 4 =======================
  S[4] = {
    sectiuni: [
      { id: "cmp", titlu: "C SDK vs. MicroPython", tip: "tabel",
        coloane: [{ k: "v", t: "dat", l: "Variantă" }, { k: "kb", t: "num", l: "Dimensiune [KB]" }, { k: "min", t: "num", l: "Timp de lucru [min]" },
                  { k: "T", t: "num", l: "Perioadă medie [ms]" }, { k: "sT", t: "num", l: "Abatere perioadă [ms]" }],
        randuri: [{ v: "C SDK" }, { v: "MicroPython" }] },
      { id: "adc", titlu: "Măsurători ADC", tip: "tabel",
        coloane: [{ k: "poz", t: "dat", l: "Poziție" }, { k: "Um", t: "num", l: "U multimetru [V]" }, { k: "Un", t: "num", l: "U nod [V]" },
                  { k: "e", t: "calc", l: "Eroare [%]", calc: function (r) { return (has(r.Um) && has(r.Un) && n(r.Um) !== 0) ? ((n(r.Un) - n(r.Um)) / n(r.Um) * 100).toFixed(2) : ""; } }],
        randuri: [{ poz: "1" }, { poz: "2" }, { poz: "3" }] },
      { id: "rtt", titlu: "Întârzierea MQTT (RTT)", tip: "tabel",
        coloane: [{ k: "poz", t: "dat", l: "Poziție nod" }, { k: "rssi", t: "num", l: "RSSI [dBm]" }, { k: "mn", t: "num", l: "RTT min [ms]" },
                  { k: "md", t: "num", l: "RTT mediu [ms]" }, { k: "mx", t: "num", l: "RTT max [ms]" }, { k: "p", t: "num", l: "Mesaje pierdute" }],
        randuri: [{ poz: "lângă router" }, { poz: "la distanță" }] },
      { id: "app", titlu: "Aplicația individuală", tip: "campuri",
        campuri: [{ k: "topic", t: "text", l: "Topic-urile folosite" }, { k: "cod", t: "cod", l: "Cod / link" }] }
    ],
    verificari: function (d) {
      var out = [], R = rows(d, "cmp"), k = 0;
      for (var i = 0; i < R.length; i++) if (near(R[i].T, 100, 0.05)) k++;
      out.push(C("Perioada de eșantionare ≈ 100 ms", frac(k, 2), 1, k + "/2"));
      var A = rows(d, "adc"), ok = 0, distinct = {};
      for (i = 0; i < A.length; i++) {
        if (near(A[i].Un, A[i].Um, 0.03, 0.03)) ok++;
        if (has(A[i].Um)) distinct[n(A[i].Um).toFixed(1)] = 1;
        if (n(A[i].Un) > 3.35) ok -= 1;
      }
      out.push(C("ADC: eroare < 3 % și în domeniul 0–3,3 V", frac(ok, 3), 2, ""));
      out.push(C("Trei poziții diferite", frac(Object.keys(distinct).length, 3), 1, ""));
      var T = rows(d, "rtt"), okT = 0;
      for (i = 0; i < T.length; i++) {
        var r = T[i];
        if (n(r.mn) > 0 && n(r.mn) <= n(r.md) && n(r.md) <= n(r.mx) && n(r.rssi) < 0 && n(r.rssi) > -100 && n(r.p) >= 0) okT++;
      }
      out.push(C("Statistica RTT coerentă (min ≤ mediu ≤ max, RSSI negativ)", frac(okT, 2), 2, okT + "/2"));
      if (T.length === 2 && has(T[0].rssi) && has(T[1].rssi))
        out.push(C("RSSI mai slab la distanță", n(T[1].rssi) < n(T[0].rssi) ? 1 : 0, 1, ""));
      var t = String(f(d, "app").topic || "");
      out.push(C("Topic-uri MQTT declarate", t.indexOf("/") > 0 ? 1 : 0, 1, ""));
      return out;
    },
    grila: [
      { q: "Ce rezoluție are ADC-ul microcontrolerului RP2040?", a: ["8 biți", "10 biți", "12 biți", "16 biți"] },
      { q: "Cum se încarcă un fișier .uf2 pe Raspberry Pi Pico?", a: ["prin Wi-Fi", "se copiază pe discul RPI-RP2 după pornirea cu BOOTSEL apăsat", "doar cu un programator SWD", "prin portul serial la 9600 baud"] },
      { q: "Ce valoare maximă returnează ADC(26).read_u16() în MicroPython?", a: ["1023", "4095", "65535", "3,3"] },
      { q: "În MQTT, cine primește un mesaj publicat pe lab/grupa1/nod01/telemetrie?", a: ["toți clienții conectați", "clienții abonați la acel topic (sau la un filtru care îl include)", "doar brokerul", "nodul care l-a publicat"] },
      { q: "De ce este necesar check_msg() în bucla nodului MicroPython?", a: ["pentru a trimite telemetria", "pentru a prelua comenzile primite de la broker", "pentru a reconecta Wi-Fi", "pentru a citi ADC-ul"] }
    ],
    deschise: 2
  };

  // ======================= LUCRAREA 5 =======================
  S[5] = {
    sectiuni: [
      { id: "cal", titlu: "Calibrarea în două puncte (x = a·y + b)", tip: "tabel",
        coloane: [{ k: "c", t: "dat", l: "Canal" }, { k: "x1", t: "num", l: "x₁ (referință)" }, { k: "y1", t: "num", l: "y₁ (indicat)" },
                  { k: "x2", t: "num", l: "x₂ (referință)" }, { k: "y2", t: "num", l: "y₂ (indicat)" }, { k: "a", t: "num", l: "a" }, { k: "b", t: "num", l: "b" },
                  { k: "ac", t: "calc", l: "a calculat", calc: function (r) { var v = (n(r.x2) - n(r.x1)) / (n(r.y2) - n(r.y1)); return isFinite(v) ? v.toFixed(4) : ""; } }],
        randuri: [{ c: "U [V]" }, { c: "I [A]" }, { c: "T [°C]" }] },
      { id: "ver", titlu: "Verificarea după calibrare", tip: "tabel",
        coloane: [{ k: "m", t: "dat", l: "Mărime" }, { k: "ref", t: "num", l: "Referință" }, { k: "ind", t: "num", l: "Indicație platformă" },
                  { k: "e", t: "calc", l: "Eroare [%]", calc: function (r) { return (has(r.ref) && has(r.ind) && n(r.ref) !== 0) ? ((n(r.ind) - n(r.ref)) / n(r.ref) * 100).toFixed(2) : ""; } }],
        randuri: [{ m: "U ≈ 3 V" }, { m: "U ≈ 15 V" }, { m: "U ≈ 27 V" }, { m: "I sarcina 1 [A]" }, { m: "I sarcina 2 [A]" }, { m: "T cameră [°C]" }] },
      { id: "fb", titlu: "Testul cu fierbătorul", tip: "campuri",
        campuri: [{ k: "m", t: "num", l: "Masa apei m [kg]" }, { k: "Ti", t: "num", l: "T inițial [°C]" }, { k: "Tf", t: "num", l: "T final [°C]" },
                  { k: "W", t: "num", l: "Energia absorbită W [kJ]" }, { k: "Q", t: "num", l: "Căldura Q = m·c·ΔT [kJ]" }, { k: "eta", t: "num", l: "Randament η [%]" }] },
      { id: "app", titlu: "Proiectare și aplicația individuală", tip: "campuri",
        campuri: [{ k: "proiect", t: "lung", l: "Calculele de proiectare (domeniu, rezoluție, curent absorbit) pentru fiecare canal" },
                  { k: "cod", t: "cod", l: "Codul detecției lipsei senzorului / alarmei T > 80 °C" }] }
    ],
    verificari: function (d) {
      var out = [], R = rows(d, "cal"), ok = 0, plaus = 0;
      for (var i = 0; i < R.length; i++) {
        var r = R[i], a = (n(r.x2) - n(r.x1)) / (n(r.y2) - n(r.y1));
        if (isFinite(a) && near(r.a, a, 0.01, 0.0005) && near(r.b, n(r.x1) - a * n(r.y1), 0, Math.max(0.01, Math.abs(n(r.x1)) * 0.01))) ok++;
        if (isFinite(a) && a > 0.8 && a < 1.25) plaus++;
      }
      out.push(C("Coeficienții de calibrare calculați corect", frac(ok, 3), 3, ok + "/3 canale"));
      out.push(C("Calibrare plauzibilă (a ≈ 1)", frac(plaus, 3), 1, ""));
      var V = rows(d, "ver"), lim = [0.02, 0.02, 0.02, 0.05, 0.05, null], okV = 0;
      for (i = 0; i < V.length; i++) {
        if (!has(V[i].ref) || !has(V[i].ind)) continue;
        if (lim[i] === null ? near(V[i].ind, V[i].ref, 0, 1.0) : near(V[i].ind, V[i].ref, lim[i])) okV++;
      }
      out.push(C("Precizia după calibrare (U < 2 %, I < 5 %, T < 1 °C)", frac(okV, 6), 2, okV + "/6"));
      var F = f(d, "fb"), k = 0, Qc = n(F.m) * 4.186 * (n(F.Tf) - n(F.Ti));
      if (near(F.Q, Qc, 0.02)) k++;
      if (near(F.eta, n(F.Q) / n(F.W) * 100, 0.02, 0.5)) k++;
      if (n(F.eta) > 50 && n(F.eta) <= 100) k++;
      out.push(C("Bilanțul fierbătorului (Q, η plauzibil)", frac(k, 3), 2, k + "/3"));
      return out;
    },
    grila: [
      { q: "De ce semnalul SCT-013 se polarizează la 1,65 V?", a: ["pentru a crește sensibilitatea", "pentru ca semialternanța negativă să rămână în domeniul ADC 0–3,3 V", "pentru a filtra armonicele", "pentru a limita curentul"] },
      { q: "Ce indică SCT-013 prins pe un cablu care conține faza și neutrul unui consumator?", a: ["dublul curentului", "curentul real", "aproximativ zero", "tensiunea rețelei"] },
      { q: "Cu divizorul R1 = 100 kΩ, R2 = 10 kΩ, tensiunea maximă măsurabilă cu un ADC de 3,3 V este:", a: ["3,3 V", "30 V", "33 V", "36,3 V"] },
      { q: "Calibrarea în două puncte corectează:", a: ["doar decalajul", "doar câștigul", "câștigul și decalajul", "și neliniaritatea"] },
      { q: "Pentru 2 kW la 230 V și cos φ = 1, curentul este aproximativ:", a: ["2,3 A", "8,7 A", "11,5 A", "23 A"] }
    ],
    deschise: 2
  };

  // ======================= LUCRAREA 6 =======================
  S[6] = {
    sectiuni: [
      { id: "cfg", titlu: "Configurarea platformei", tip: "campuri",
        campuri: [{ k: "profil", t: "text", l: "Profil de dispozitiv" }, { k: "dev", t: "text", l: "Dispozitiv (nume, ID)" },
                  { k: "chei", t: "text", l: "Chei de telemetrie și unități" }, { k: "attr", t: "text", l: "Atribute shared" },
                  { k: "alarme", t: "lung", l: "Reguli de alarmă (condiție, severitate, ștergere)" }, { k: "reguli", t: "text", l: "Noduri adăugate în lanțul de reguli" }] },
      { id: "al", titlu: "Testarea alarmelor", tip: "tabel",
        coloane: [{ k: "a", t: "dat", l: "Alarmă" }, { k: "act", t: "text", l: "Acțiunea de test" }, { k: "t1", t: "text", l: "Trecerea pragului (hh:mm:ss)" },
                  { k: "t2", t: "text", l: "Apariția alarmei (hh:mm:ss)" }, { k: "dt", t: "num", l: "Întârziere [s]" }],
        randuri: [{ a: "Supracurent" }, { a: "Supratemperatură" }, { a: "Nod inactiv" }] },
      { id: "rap", titlu: "Raportul automat (ultima oră)", tip: "campuri",
        campuri: [{ k: "Wa", t: "num", l: "Energie din medii la 1 min [Wh]" }, { k: "Wb", t: "num", l: "Energie din date brute [Wh]" },
                  { k: "Pmax", t: "num", l: "P maximă [W]" }, { k: "cod", t: "cod", l: "Scriptul de raport zilnic (cod sau link)" }] }
    ],
    verificari: function (d) {
      var out = [], F = f(d, "cfg"), k = 0, keys = ["profil", "dev", "chei", "attr", "alarme", "reguli"];
      for (var i = 0; i < keys.length; i++) if (String(F[keys[i]] || "").trim().length > 2) k++;
      out.push(C("Configurația documentată", frac(k, 6), 2, k + "/6 câmpuri"));
      out.push(C("Atributul interval_s declarat", /interval_s/.test(String(F.attr || "")) ? 1 : 0, 1, ""));
      function sec(t) { var m = String(t || "").match(/^(\d{1,2}):(\d{2}):(\d{2})$/); return m ? (+m[1]) * 3600 + (+m[2]) * 60 + (+m[3]) : NaN; }
      var A = rows(d, "al"), okA = 0;
      for (i = 0; i < A.length; i++) {
        var dt = sec(A[i].t2) - sec(A[i].t1);
        if (!isNaN(dt) && dt >= 0 && near(A[i].dt, dt, 0, 1.5) && (i < 2 ? dt <= 60 : dt >= 55 && dt <= 180)) okA++;
      }
      out.push(C("Alarmele testate, întârzieri coerente", frac(okA, 3), 3, okA + "/3 (nod inactiv: ≈ 60 s + întârzierea verificării)"));
      var R = f(d, "rap"), r = 0;
      if (n(R.Wa) > 0 && near(R.Wa, R.Wb, 0.05)) r++;
      if (n(R.Pmax) > 0 && n(R.Pmax) >= n(R.Wa)) r++;
      out.push(C("Energia agregată vs. brută (< 5 %)", frac(r, 2), 2, ""));
      return out;
    },
    grila: [
      { q: "Ce topic MQTT folosește un dispozitiv ThingsBoard pentru telemetrie?", a: ["devices/telemetry", "v1/devices/me/telemetry", "tb/{token}/data", "v1/telemetry/{deviceId}"] },
      { q: "Ce tip de atribut este setat în platformă și transmis dispozitivului?", a: ["client", "server", "shared", "telemetrie"] },
      { q: "Ce face agregarea AVG cu interval = 60000 în API REST?", a: ["returnează ultimele 60000 de valori", "returnează media pe intervale de 1 minut", "returnează media pe 60 de secunde a întregii perioade", "returnează valorile la fiecare 60 s, fără mediere"] },
      { q: "De ce pragul de ștergere a unei alarme diferă de pragul de declanșare?", a: ["din motive de securitate", "pentru a evita declanșări și ștergeri repetate în jurul pragului (histerezis)", "pentru a economisi memorie", "pentru că așa cere MQTT"] },
      { q: "Ce antet HTTP poartă tokenul JWT în API-ul REST ThingsBoard?", a: ["Authorization: Basic", "X-Authorization: Bearer <token>", "Cookie: token", "X-Token"] }
    ],
    deschise: 2
  };

  // ======================= LUCRAREA 7 =======================
  S[7] = {
    sectiuni: [
      { id: "id", titlu: "Identificarea parametrilor", tip: "campuri",
        campuri: [{ k: "Ta", t: "num", l: "T ambiant [°C]" }, { k: "P", t: "num", l: "P încălzitor [W]" }, { k: "C", t: "num", l: "C [J/K]" },
                  { k: "R", t: "num", l: "R [K/W]" }, { k: "tau", t: "num", l: "τ = R·C [min]" }, { k: "Tinf", t: "num", l: "T∞ [°C]" },
                  { k: "rmse1", t: "num", l: "RMSE identificare [K]" }, { k: "rmse2", t: "num", l: "RMSE validare [K]" }, { k: "sig", t: "num", l: "σ reziduu normal [K]" }, { k: "prag", t: "num", l: "Prag anomalie [K]" }] },
      { id: "an", titlu: "Testul de anomalie", tip: "tabel",
        coloane: [{ k: "pert", t: "text", l: "Perturbație" }, { k: "t1", t: "text", l: "Aplicare (hh:mm:ss)" }, { k: "rmax", t: "num", l: "Reziduu maxim [K]" },
                  { k: "t2", t: "text", l: "Alarmă (hh:mm:ss)" }, { k: "dt", t: "num", l: "Timp de detecție [s]" }],
        randuri: [{}] },
      { id: "cmd", titlu: "Comanda bazată pe model (30 min)", tip: "tabel",
        coloane: [{ k: "s", t: "dat", l: "Strategie" }, { k: "ov", t: "num", l: "Supracreștere peste 45 °C [K]" }, { k: "sw", t: "num", l: "Comutări" }, { k: "W", t: "num", l: "Energie [Wh]" }],
        randuri: [{ s: "Termostat cu histerezis" }, { s: "Termostat cu predicție (DT)" }] },
      { id: "app", titlu: "Cod", tip: "campuri",
        campuri: [{ k: "cod", t: "cod", l: "twin.py cu termostatul predictiv (cod sau link)" }] }
    ],
    verificari: function (d) {
      var out = [], I = f(d, "id"), k = 0;
      if (near(I.tau, n(I.R) * n(I.C) / 60, 0.03)) k++;
      if (near(I.Tinf, n(I.Ta) + n(I.R) * n(I.P), 0.03, 0.5)) k++;
      out.push(C("τ și T∞ calculate corect", frac(k, 2), 2, k + "/2"));
      out.push(C("C plauzibil (≥ capacitatea apei, ≈ 1256–3000 J/K)", (n(I.C) >= 1150 && n(I.C) <= 3500) ? 1 : 0, 1, ""));
      out.push(C("P încălzitor ≈ U²/4,7 Ω", (n(I.P) > 20 && n(I.P) < 40) ? 1 : 0, 1, ""));
      out.push(C("Modelul validat (RMSE < 1,5 K pe ambele seturi)", ((n(I.rmse1) > 0 && n(I.rmse1) < 1.5) + (n(I.rmse2) > 0 && n(I.rmse2) < 1.5)) / 2, 2, ""));
      out.push(C("Pragul de anomalie ≈ 3σ", near(I.prag, 3 * n(I.sig), 0.15) ? 1 : 0, 1, ""));
      var A = rows(d, "an")[0] || {};
      out.push(C("Anomalie detectată și documentată", (String(A.pert || "").length > 3 && n(A.dt) > 0 && n(A.rmax) > n(I.prag)) ? 1 : 0, 2, "reziduul maxim trebuie să depășească pragul"));
      var M = rows(d, "cmd"), m = 0;
      if (M.length === 2 && has(M[0].ov) && has(M[1].ov)) { m++; if (n(M[1].ov) <= n(M[0].ov)) m++; }
      out.push(C("Comparația strategiilor de comandă", frac(m, 2), 1, ""));
      return out;
    },
    grila: [
      { q: "Ce deosebește un geamăn digital de o „umbră digitală”?", a: ["geamănul are interfață 3D", "fluxul de date este bidirecțional (modelul poate comanda activul)", "umbra nu folosește senzori", "nu există nicio diferență"] },
      { q: "În modelul C·dT/dt = P − (T − Ta)/R, constanta de timp este:", a: ["R/C", "C/R", "R·C", "P·R"] },
      { q: "Temperatura de regim pentru P = 30 W, R = 1,25 K/W și Ta = 22 °C este:", a: ["37,5 °C", "52 °C", "59,5 °C", "24 °C"] },
      { q: "Un reziduu persistent mare (T măsurat − T model) indică:", a: ["funcționare normală", "o schimbare a sistemului sau un defect de senzor", "că pasul de timp e prea mic", "că modelul e perfect"] },
      { q: "De ce protecția la supratemperatură se implementează local, pe nod?", a: ["e mai ieftin", "funcționează și când rețeaua sau serverul cad", "ThingsBoard nu suportă alarme", "geamănul nu poate citi temperatura"] }
    ],
    deschise: 2
  };

  // ======================= notare comună =======================
  // Grila (10 p): măsurători și calcule 4 p (automat), test grilă 3 p (automat),
  // aplicație individuală 2 p (provizoriu automat, verificare manuală),
  // întrebări deschise + concluzii 1 p (provizoriu automat, verificare manuală).
  function noteaza(lab, d, raspGrila, chei) {
    var sp = S[lab], ver = sp.verificari(d), sw = 0, so = 0;
    for (var i = 0; i < ver.length; i++) { sw += ver[i].w; so += ver[i].ok * ver[i].w; }
    var pMas = sw ? 4 * so / sw : 0;
    var corecte = 0;
    if (chei) for (i = 0; i < chei.length; i++) if (raspGrila && Number(raspGrila[i]) === chei[i]) corecte++;
    var pGr = chei ? 3 * corecte / chei.length : null;
    var cod = "";
    for (i = 0; i < sp.sectiuni.length; i++) {
      var s = sp.sectiuni[i];
      if (s.tip === "campuri") for (var j = 0; j < s.campuri.length; j++)
        if (s.campuri[j].t === "cod") cod += String(f(d, s.id)[s.campuri[j].k] || "");
    }
    var codOk = /https?:\/\/\S+/.test(cod) || cod.split("\n").length >= 8;
    var pApp = codOk ? 2 : (cod.trim().length > 20 ? 1 : 0);
    var desc = f(d, "_text"), wOpen = 0, nOpen = 0;
    for (i = 0; i < sp.deschise; i++) { var w = words(desc["q" + i]); if (w >= 25) nOpen++; }
    wOpen = words(desc.concluzii);
    var pText = Math.min(1, 0.25 * nOpen + (wOpen >= 50 ? 0.5 : wOpen >= 25 ? 0.25 : 0));
    var total = pMas + (pGr === null ? 0 : pGr) + pApp + pText;
    var nota = Math.max(1, Math.round(total * 100) / 100);
    return { verificari: ver, puncte: { masuratori: r2(pMas), grila: pGr === null ? null : r2(pGr), aplicatie: pApp, text: r2(pText) },
             grilaCorecte: chei ? corecte : null, nota: nota };
  }
  function r2(x) { return Math.round(x * 100) / 100; }

  return { S: S, n: n, noteaza: noteaza, CLASE_U: CLASE_U };
})();
if (typeof module !== "undefined") module.exports = SPECS;
