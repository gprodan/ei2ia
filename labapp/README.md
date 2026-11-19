# Informatică aplicată – aplicația web de laborator

Site static (GitHub Pages) pentru cele 7 lucrări de laborator. Prezența și referatele se trimit într-o foaie de calcul Google printr-un script Google Apps Script, care face și notarea automată.

## Ce conține

| Fișier | Rol |
| --- | --- |
| `index.html` | pagina de start: lista lucrărilor, situația studentului (prezențe, note) |
| `lucrare.html?id=N` | pagina lucrării: breviar teoretic sus, modul de lucru în stânga, panoul cu materiale / cod sursă / referat / întrebări în dreapta |
| `config.js` | **singurul fișier de editat**: URL-ul scriptului Google, domeniul e-mail |
| `assets/content.js` | conținutul lucrărilor, generat din îndrumar (`tools/gen_content.py`) |
| `assets/specs.js` | tabelele referatelor, verificările automate, întrebările grilă (fără răspunsuri) |
| `apps-script/Code.gs` | backend-ul complet pentru Google Apps Script (conține și cheile grilei) |

Fără `SCRIPT_URL` în `config.js`, aplicația rulează în **mod demonstrativ**: totul funcționează local, dar nimic nu se trimite.

## Instalare (≈ 15 minute)

### 1. Foaia de calcul și scriptul

1. Creați o foaie de calcul Google nouă (de ex. „Informatică aplicată – Laborator 2026-2027”).
2. *Extensions → Apps Script*. Ștergeți conținutul din `Code.gs` și lipiți **tot** fișierul `apps-script/Code.gs`. Salvați.
3. În editor, setați fusul orar: *Project Settings → Time zone → (GMT+02:00) Bucharest*.
4. Reîncărcați foaia de calcul. Apare meniul **Laborator** → *1. Inițializează foile* (la prima rulare Google cere autorizarea; acceptați).
   Se creează foile: `Config`, `Studenti`, `Sesiuni`, `Prezenta`, `Referate`, `Catalog`.
5. În `Config`, completați `DOMENIU_EMAIL` (ex. `@365.univ-ovidius.ro`) și, dacă doriți, `VERIFICA_LISTA = DA` (atunci completați foaia `Studenti`: e-mail, nume, grupă).

### 2. Publicarea scriptului ca aplicație web

1. În editorul Apps Script: *Deploy → New deployment → Select type: Web app*.
2. *Execute as*: **Me**; *Who has access*: **Anyone**.
3. *Deploy* → copiați URL-ul care se termină în `/exec`.
4. Puneți URL-ul în `config.js` la `SCRIPT_URL` (și același domeniu la `DOMENIU_EMAIL`).

La orice modificare ulterioară a scriptului: *Deploy → Manage deployments → Edit → Version: New version*. URL-ul rămâne același.

### 3. Publicarea site-ului pe GitHub Pages

1. Creați un depozit nou (de ex. `informatica-aplicata-lab`) și încărcați toate fișierele din acest folder.
2. *Settings → Pages → Source: Deploy from a branch → main / (root)*.
3. Site-ul apare la `https://<utilizator>.github.io/informatica-aplicata-lab/`. Link-ul se poate pune în canalul Teams al disciplinei.

## Utilizare la laborator

1. **Înainte de ședință**: în foaia `Sesiuni`, o linie pentru fiecare lucrare și grupă: `Lucrare` (1–7), `Grupa`, `Data`, `Ora start`, `Ora sfârșit` (ca text `10:00`), `Termen referat`.
2. Selectați rândul și rulați *Laborator → 2. Generează cod pentru sesiunea selectată*. Afișați codul pe ecran la începutul laboratorului.
3. Studenții introduc codul în pagina lucrării. Codul este acceptat doar în intervalul ședinței (± 10 minute, configurabil). După 15 minute de la start prezența se marchează „Întârziat”.
4. Studenții completează și trimit referatul (maximum 3 trimiteri, configurabil). Fiecare trimitere apare în foaia `Referate`, cu nota automată și detaliile verificărilor.
5. Verificați aplicația individuală și răspunsurile deschise, apoi completați coloana galbenă **Nota finală** (și, opțional, *Observații profesor*). Studentul vede nota finală pe pagina de start.
6. *Laborator → 3. Actualizează catalogul* generează foaia `Catalog`: prezența (P / I / A) și cea mai bună notă pentru fiecare lucrare, plus media.

## Notarea automată (10 puncte)

| Componentă | Puncte | Cum se calculează |
| --- | --- | --- |
| Măsurători și calcule | 4 | verificări specifice fiecărei lucrări: relații fizice (P = U·I, R = U/I, τ = R·C, Q = m·c·ΔT…), coerența tabelelor, precizia față de valorile de referință |
| Test grilă | 3 | 5 întrebări; cheile sunt doar în `Code.gs`, nu ajung în browser |
| Aplicația individuală | 2 | provizoriu: 2 p dacă există link sau minimum 8 linii de cod; confirmă profesorul |
| Întrebări deschise și concluzii | 1 | provizoriu, după lungimea răspunsurilor; confirmă profesorul |

Nota automată are minimum 1. Ponderile și pragurile se modifică în `assets/specs.js` (funcția `verificari` a fiecărei lucrări). După modificare rulați `tools/build.sh`, actualizați `Code.gs` în Apps Script și publicați o versiune nouă. *Laborator → Recalculează notele automate* reaplică regulile pe referatele deja trimise.

## Limitări și securitate

- Studenții nu se autentifică cu contul Microsoft/Google (site-ul static nu poate face asta fără un server). Identitatea se bazează pe adresa instituțională declarată, pe lista din foaia `Studenti` și pe codul de sesiune valabil doar în timpul laboratorului.
- URL-ul scriptului este public în `config.js`. Scriptul acceptă doar acțiunile `prezenta`, `referat` și `status` și validează fiecare cerere. Cine are linkul poate vedea doar situația unei adrese pe care o cunoaște.
- Verificările automate pot fi „păcălite” de un student care inventează valori coerente. De aceea aplicația individuală și textul rămân la aprecierea profesorului, iar măsurătorile pot fi comparate între echipe.

## Actualizarea conținutului

Conținutul lucrărilor vine din îndrumarul de laborator (`tools/lab.md`, exportat din documentul Claude). După modificarea îndrumarului: exportați din nou fișierul Markdown în `tools/lab.md` și rulați `tools/build.sh` (necesită Python 3 și pandoc).
