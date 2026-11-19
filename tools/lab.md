# Informatică aplicată – Îndrumar de laborator

Program de studii: Energetică industrială · Anul II, sem. 3 · Nov 19, 2026 · @Gabi

## Introducere

Îndrumarul conține cele 7 lucrări din fișa disciplinei ME2116a (14 ore, câte o ședință de 2 ore la două săptămâni). Lucrările se leagă între ele: de la programarea în C și Python (L1–L2), la achiziția de date cu microcontrolere (L3–L5), până la platforma IoT și geamănul digital (L6–L7).

| Lucrarea | Tema | Legătura cu cursul |
| --- | --- | --- |
| L1 | Code::Blocks, C: tipuri de date, condiționare, I/O | C1–C3 |
| L2 | Python: NumPy, Matplotlib | C2, C5, C7 |
| L3 | Instrument virtual, Arduino, I2C/SPI | C8 |
| L4 | Raspberry Pi Pico și sisteme IoT | C9, C10, C12 |
| L5 | Platformă de măsură U, I, T pentru sisteme energetice | C7–C10 |
| L6 | Achiziție și prelucrare date în ThingsBoard | C11–C13 |
| L7 | Platformă Digital Twin pentru sisteme energetice | C2, C5, C13, C14 |

**Structura fiecărei lucrări:** obiective, rezultatele învățării, noțiuni teoretice, echipamente și software, desfășurarea lucrării, prelucrarea rezultatelor, întrebări de verificare, model de referat.

**Norme de lucru.** Montajele se fac și se modifică numai cu alimentarea deconectată. Pinii Raspberry Pi Pico lucrează la 3,3 V și nu tolerează 5 V. Tensiunile peste 50 V c.a. sau 120 V c.c. nu se măsoară direct cu montajele de laborator. Se folosesc surse cu limitare de curent la testarea circuitelor noi.

**Referatul** se predă în platforma Teams (Echipa FIMIM-EI-2023-2027, canalul Informatică aplicată) până la ședința următoare, în format PDF, cu codul sursă atașat (sau link către depozitul Git).

**Evaluare la laborator:** prezență și activitate (30 %), referate (40 %), răspunsurile la întrebările de verificare (30 %).

## Lucrarea 1. Mediul de dezvoltare Code::Blocks. Elemente de programare în C: tipuri de date, structuri de condiționare, operații de intrare/ieșire

### Obiective

- Instalarea și configurarea Code::Blocks cu compilatorul GCC (MinGW); crearea, compilarea, rularea și depanarea unui proiect consolă.
- Determinarea dimensiunii și domeniului tipurilor de date C pe sistemul de lucru.
- Utilizarea instrucțiunilor `if-else` și `switch` în probleme cu date energetice.
- Citirea și validarea datelor cu `scanf`, afișarea formatată cu `printf`.

### Rezultatele învățării

- **Cunoștințe:** studentul identifică tipurile de date C, specificatorii de format și structurile de condiționare.
- **Aptitudini:** scrie, compilează și depanează programe C care citesc, validează și clasifică mărimi electrice.
- **Responsabilitate și autonomie:** interpretează independent mesajele de eroare și atenționările compilatorului.

### Noțiuni teoretice

Code::Blocks este un IDE gratuit care integrează editorul, compilatorul (GCC) și depanatorul (GDB). Proiectul consolă se creează cu *File → New → Project → Console application → C*. Comenzi: *Build* (Ctrl+F9), *Run* (Ctrl+F10), *Build and run* (F9), *Debug* (F8) cu puncte de oprire (F5) și fereastra *Watches* pentru variabile. Pentru avertizări complete: *Settings → Compiler → Compiler flags* → bifați `-Wall` și `-Wextra`.

Operatorul `sizeof` dă dimensiunea în octeți a unui tip; constantele `INT_MAX`, `INT_MIN` (limits.h) și `FLT_EPSILON`, `DBL_MAX` (float.h) dau limitele. `scanf` returnează numărul de valori citite corect — se folosește pentru validare.

Conform standardului SR EN 50160, tensiunea nominală a rețelei de joasă tensiune este 230 V, cu variații admise de ±10 % (207–253 V) pentru valorile medii pe 10 minute.

### Echipamente și software

Calculator cu Windows sau Linux; Code::Blocks 20.03 (pachetul *mingw-setup*, care include GCC).

### Desfășurarea lucrării

**Pasul 1 — Primul proiect.** Creați proiectul `L1_tipuri`, rulați programul implicit „Hello world!”, apoi introduceți intenționat o eroare (ștergeți un `;`) și urmăriți mesajul din fereastra *Build messages*.

**Pasul 2 — Tipuri de date.**

```c
#include <stdio.h>
#include <limits.h>
#include <float.h>
int main(void)
{
    /* (int)sizeof(...) cu %d: compatibil și cu versiunile vechi de MinGW */
    printf("char        %d B  [%d, %d]\n", (int)sizeof(char), CHAR_MIN, CHAR_MAX);
    printf("short       %d B  [%d, %d]\n", (int)sizeof(short), SHRT_MIN, SHRT_MAX);
    printf("int         %d B  [%d, %d]\n", (int)sizeof(int), INT_MIN, INT_MAX);
    printf("long long   %d B  [%lld, %lld]\n", (int)sizeof(long long), LLONG_MIN, LLONG_MAX);
    printf("float       %d B  eps=%g max=%g\n", (int)sizeof(float), FLT_EPSILON, FLT_MAX);
    printf("double      %d B  eps=%g max=%g\n", (int)sizeof(double), DBL_EPSILON, DBL_MAX);

    unsigned char c = 255; c = c + 1;            /* depășire */
    int i = INT_MAX; i = i + 1;                   /* comportament nedefinit! */
    float f = 0.1f; double d = 0.1;
    printf("255+1 (uchar) = %u\n", c);
    printf("INT_MAX+1 = %d\n", i);
    printf("0.1f = %.20f\n0.1  = %.20f\n", f, d);
    printf("7/2 = %d, 7.0/2 = %.2f, 7%%2 = %d\n", 7/2, 7.0/2, 7%2);
    return 0;
}
```

**Pasul 3 — Structuri de condiționare: calitatea tensiunii.** Programul citește tensiunea măsurată și o clasifică.

```c
#include <stdio.h>
int main(void)
{
    const double Un = 230.0;
    double U;
    printf("Tensiunea masurata [V]: ");
    if (scanf("%lf", &U) != 1 || U < 0) { printf("Valoare invalida!\n"); return 1; }
    double abatere = (U - Un) / Un * 100.0;
    printf("Abatere: %+.2f %%\n", abatere);
    if (U < 0.01 * Un)          printf("Intrerupere\n");
    else if (U < 0.90 * Un)     printf("Gol de tensiune / subtensiune\n");
    else if (U <= 1.10 * Un)    printf("In limitele SR EN 50160\n");
    else                        printf("Supratensiune\n");
    return 0;
}
```

**Pasul 4 — switch: convertor de unități energetice.**

```c
#include <stdio.h>
int main(void)
{
    int opt; double x;
    do {
        printf("\n1) kWh -> MJ  2) MJ -> kWh  3) CP -> kW  4) kW -> CP  5) tep -> MWh  0) Iesire\nOptiune: ");
        if (scanf("%d", &opt) != 1) { while (getchar() != '\n'); opt = -1; continue; }
        if (opt == 0) break;
        printf("Valoare: "); scanf("%lf", &x);
        switch (opt) {
            case 1: printf("%.3f kWh = %.3f MJ\n", x, x * 3.6); break;
            case 2: printf("%.3f MJ = %.3f kWh\n", x, x / 3.6); break;
            case 3: printf("%.3f CP = %.3f kW\n", x, x * 0.7355); break;
            case 4: printf("%.3f kW = %.3f CP\n", x, x / 0.7355); break;
            case 5: printf("%.3f tep = %.3f MWh\n", x, x * 11.63); break;
            default: printf("Optiune inexistenta\n");
        }
    } while (1);
    return 0;
}
```

**Pasul 5 — Depanare.** Puneți un punct de oprire (F5) pe linia cu `abatere` din pasul 3, porniți *Debug → Start* (F8), introduceți 215 și urmăriți în *Watches* valorile `U` și `abatere`; avansați pas cu pas (F7).

**Pasul 6 — Aplicație individuală.** Scrieți un program care citește P \[kW\] și Q \[kvar\] ale unui consumator, calculează S și cos φ și afișează: „Fără penalizări” (cos φ ≥ 0,92), „Energie reactivă facturată” (0,65 ≤ cos φ < 0,92) sau „Compensare obligatorie” (cos φ < 0,65). (Pragurile sunt cele uzuale din reglementările ANRE.)

### Prelucrarea rezultatelor

1. Completați tabelul tipurilor de date cu valorile obținute la pasul 2.
2. Rulați programul de la pasul 3 pentru 0, 150, 207, 230, 253, 260 V și treceți rezultatele în tabel.
3. Verificați manual două conversii din pasul 4.

### Întrebări de verificare

1. Care sunt etapele prin care codul sursă devine executabil și ce fișiere rezultă la fiecare etapă?
2. De ce 0.1f afișat cu 20 de zecimale nu este exact 0,1? Ce implicație are acest lucru asupra comparării numerelor reale cu `==`?
3. Ce se întâmplă la depășirea domeniului unui `unsigned char` și de ce depășirea unui `int` cu semn este periculoasă?
4. Care este diferența dintre `%f` și `%lf` la `printf` și la `scanf`?
5. Ce returnează `scanf` și cum se folosește această valoare la validarea datelor?
6. Când se preferă `switch` față de o succesiune `if-else if`? Ce rol are `break`?
7. Ce afișează `printf("%d", 5/2*2.0)`? Dar `printf("%f", 5/2*2.0)`? Explicați.
8. Ce informații oferă depanatorul și când este mai util decât afișarea cu `printf`?

### Model de referat

**Universitatea „Ovidius” din Constanța — FIMIM — Energetică Industrială, anul II** **Informatică aplicată — Referat Lucrarea 1** Student: ……………… Grupa: …… Data: ………

**1. Scopul lucrării.** (2–3 rânduri, cu cuvintele proprii.)

**2. Mediul de lucru.** Sistem de operare, versiunea Code::Blocks și GCC (*Help → About*, respectiv `gcc --version`).

**3. Tipurile de date.**

| Tip | sizeof \[B\] | Minim | Maxim / epsilon |
| --- | --- | --- | --- |
| char |  |  |  |
| short |  |  |  |
| int |  |  |  |
| long long |  |  |  |
| float |  |  |  |
| double |  |  |  |

**4. Clasificarea tensiunii.**

| U \[V\] | Abatere \[%\] | Clasificare afișată | Corectă? (da/nu) |
| --- | --- | --- | --- |
| 0 |  |  |  |
| 150 |  |  |  |
| 207 |  |  |  |
| 230 |  |  |  |
| 253 |  |  |  |
| 260 |  |  |  |

**5. Aplicația individuală.** Pseudocodul, codul sursă (anexă) și trei rulări de test, câte una pentru fiecare caz de cos φ.

**6. Erori întâlnite și rezolvarea lor.** Mesajul compilatorului, cauza, corectura.

**7. Răspunsuri la întrebările de verificare** (minimum 4 la alegere).

**8. Concluzii.** Ce ați învățat, ce a fost dificil, ce ați îmbunătăți.

## Lucrarea 2. Elemente de calcul în Python. Utilizarea pachetului NumPy. Reprezentări grafice cu Matplotlib

### Obiective

- Instalarea Python, crearea unui mediu virtual și instalarea pachetelor NumPy și Matplotlib.
- Calculul vectorial cu NumPy: generarea semnalelor, valori efective, puteri, analiză armonică (FFT).
- Prelucrarea unei curbe de sarcină citite din fișier: energie, vârf, factor de încărcare.
- Realizarea graficelor tehnice cu Matplotlib (mai multe serii, subgrafice, salvare).

### Rezultatele învățării

- **Cunoștințe:** studentul descrie structura `ndarray` și avantajul calculului vectorial.
- **Aptitudini:** dezvoltă scripturi pentru prelucrarea și vizualizarea semnalelor și datelor energetice.
- **Responsabilitate și autonomie:** verifică rezultatele numerice prin comparație cu calculul analitic.

### Noțiuni teoretice

Pentru semnale periodice eșantionate (N eșantioane pe un număr întreg de perioade):

```latex
U_{ef} = \sqrt{\frac{1}{N}\sum_{k=1}^{N} u_k^2}, \qquad P = \frac{1}{N}\sum_{k=1}^{N} u_k i_k, \qquad S = U_{ef} I_{ef}, \qquad \lambda = P/S
```

Pentru semnale sinusoidale λ = cos φ. Distorsiunea armonică totală a curentului: THD\_I = √(I₂² + I₃² + …)/I₁. Transformata Fourier discretă (`np.fft.rfft`) dă amplitudinile componentelor de frecvență; rezoluția în frecvență este Δf = f\_e/N.

Factorul de încărcare al unei curbe de sarcină: k\_î = P\_med / P\_max; durata de utilizare a puterii maxime: T\_max = W / P\_max.

### Echipamente și software

Python 3.12 sau mai nou; VS Code (extensia Python) sau Thonny/Spyder; pachetele `numpy`, `matplotlib`.

```bash
python -m venv .venv
.venv\Scripts\activate          # Windows (Linux: source .venv/bin/activate)
pip install numpy matplotlib
```

### Desfășurarea lucrării

**Pasul 1 — Operații cu tablouri.** În consola Python, executați și notați rezultatele:

```python
import numpy as np
a = np.array([1, 2, 3, 4]); b = np.arange(0, 1, 0.25); M = np.eye(3)
print(a * 2, a ** 2, a + b, a.sum(), a.mean(), a.dtype, a.shape)
print(np.linspace(0, 1, 5), M @ np.array([1, 2, 3]))
x = np.array([2.0, 5.0, 3.0]); A = np.array([[4, -1, 0], [-1, 4, -1], [0, -1, 4]])
print(np.linalg.solve(A, x))            # sistem liniar (de ex. potențiale noduri)
```

**Pasul 2 — Semnale monofazate și puteri.** Script `l2_puteri.py`:

```python
import numpy as np
import matplotlib.pyplot as plt
f, fe, T = 50, 10_000, 0.1                       # 5 perioade, f_e = 10 kHz
t = np.arange(0, T, 1/fe)
phi = np.deg2rad(36.87)                          # cos(phi) = 0,8
u = 230*np.sqrt(2)*np.sin(2*np.pi*f*t)
i = 10*np.sqrt(2)*np.sin(2*np.pi*f*t - phi)
Uef, Ief = np.sqrt(np.mean(u**2)), np.sqrt(np.mean(i**2))
P = np.mean(u*i); S = Uef*Ief; Q = np.sqrt(S**2 - P**2)
print(f"Uef={Uef:.2f} V Ief={Ief:.3f} A P={P:.1f} W Q={Q:.1f} var S={S:.1f} VA cos={P/S:.3f}")

fig, ax = plt.subplots(2, 1, figsize=(9, 6), sharex=True)
ax[0].plot(t*1e3, u, label="u [V]"); ax[0].plot(t*1e3, i*20, label="20·i [A]")
ax[0].set_ylabel("u, i"); ax[0].legend(); ax[0].grid()
ax[1].plot(t*1e3, u*i/1e3, color="tab:red"); ax[1].axhline(P/1e3, ls="--", label="P medie")
ax[1].set_xlabel("t [ms]"); ax[1].set_ylabel("p(t) [kW]"); ax[1].legend(); ax[1].grid()
fig.tight_layout(); fig.savefig("l2_puteri.png", dpi=150); plt.show()
```

Repetați pentru cos φ = 1; 0,8; 0,5; 0 (φ = 0°; 36,87°; 60°; 90°) și completați tabelul.

**Pasul 3 — Curent distorsionat și FFT.**

```python
i_d = np.sqrt(2)*(10*np.sin(2*np.pi*50*t) + 3*np.sin(2*np.pi*150*t) + 1.5*np.sin(2*np.pi*250*t))
N = len(t); X = np.fft.rfft(i_d); fr = np.fft.rfftfreq(N, 1/fe)
Ih = np.abs(X) * 2 / N / np.sqrt(2)              # valori efective pe armonici
I1, I3, I5 = (Ih[np.argmin(abs(fr - h*50))] for h in (1, 3, 5))
THD = np.sqrt(I3**2 + I5**2) / I1
print(f"I1={I1:.2f} I3={I3:.2f} I5={I5:.2f} A, THD={THD*100:.1f} %, Ief={np.sqrt(np.mean(i_d**2)):.3f} A")
plt.stem(fr[:30], Ih[:30]); plt.xlabel("f [Hz]"); plt.ylabel("I_h [A]"); plt.grid(); plt.show()
```

**Pasul 4 — Curba de sarcină din fișier.** Generați fișierul de test, apoi prelucrați-l ca și cum ar proveni de la un contor:

```python
rng = np.random.default_rng(7)
h = np.arange(0, 24, 0.25)                                   # pas 15 min
P = 20 + 15*np.exp(-((h-10)/3)**2) + 20*np.exp(-((h-18)/2)**2) + rng.normal(0, 1.5, h.size)
np.savetxt("curba_sarcina.csv", np.column_stack([h, P]), delimiter=";",
           header="ora;P_kW", comments="", fmt="%.2f")

d = np.loadtxt("curba_sarcina.csv", delimiter=";", skiprows=1)
h, P = d[:, 0], d[:, 1]
W = np.trapezoid(P, h) if hasattr(np, "trapezoid") else np.trapz(P, h)
Pmax, hmax = P.max(), h[P.argmax()]
print(f"W={W:.1f} kWh  Pmax={Pmax:.1f} kW la {hmax:.2f} h  k_i={P.mean()/Pmax:.2f}  Tmax={W/Pmax:.1f} h")
Ps = np.convolve(P, np.ones(4)/4, mode="same")               # medie mobilă 1 h
plt.bar(h, P, width=0.22, alpha=0.5, label="P (15 min)")
plt.plot(h, Ps, "r", label="medie mobilă 1 h")
plt.axhline(P.mean(), ls="--", color="k", label="P medie")
plt.xlabel("ora"); plt.ylabel("P [kW]"); plt.legend(); plt.grid(alpha=.3)
plt.savefig("l2_curba.png", dpi=150); plt.show()
```

**Pasul 5 — Aplicație individuală.** Generați tensiunile unui sistem trifazat simetric (230 V, defazate cu 120°) și curenți pe faze de 10, 12 și 8 A cu cos φ = 0,85. Calculați puterea activă totală, curentul în conductorul neutru (suma instantanee a curenților) și reprezentați grafic cele trei tensiuni și curentul de neutru.

### Prelucrarea rezultatelor

1. Comparați P, Q, S calculate numeric la pasul 2 cu valorile analitice P = U·I·cos φ, Q = U·I·sin φ; calculați eroarea relativă.
2. Verificați la pasul 3 că I\_ef² = I₁² + I₃² + I₅².
3. Interpretați forma curbei de sarcină: când apar vârfurile, ce valoare are k\_î și ce înseamnă.

### Întrebări de verificare

1. De ce operațiile NumPy sunt mai rapide decât buclele Python pe liste?
2. Ce condiție trebuie îndeplinită pentru ca valoarea efectivă calculată numeric să fie exactă? Ce se întâmplă dacă fereastra nu conține un număr întreg de perioade?
3. De ce puterea instantanee p(t) are frecvența 100 Hz și poate deveni negativă?
4. Ce reprezintă rezoluția în frecvență a FFT și cum se poate îmbunătăți?
5. Ce frecvență de eșantionare minimă este necesară pentru a măsura armonica 13 a unui semnal de 50 Hz (teorema Nyquist–Shannon)?
6. Care este diferența dintre `plt.plot` și `plt.bar` și când se folosește fiecare pentru date energetice?
7. Ce efect are media mobilă asupra vârfurilor curbei de sarcină și de ce contează acest lucru la stabilirea puterii contractate?
8. Ce face `np.linalg.solve` și în ce problemă de rețele electrice se poate folosi?

### Model de referat

**Informatică aplicată — Referat Lucrarea 2** — Student: ………… Grupa: …… Data: ………

**1. Scopul lucrării.**

**2. Mediul de lucru.** Versiunea Python (`python --version`), NumPy (`np.__version__`), Matplotlib.

**3. Puteri în regim sinusoidal.**

| cos φ | P numeric \[W\] | P analitic \[W\] | Q numeric \[var\] | Q analitic \[var\] | S \[VA\] | Eroare P \[%\] |
| --- | --- | --- | --- | --- | --- | --- |
| 1 |  |  |  |  |  |  |
| 0,8 |  |  |  |  |  |  |
| 0,5 |  |  |  |  |  |  |
| 0 |  |  |  |  |  |  |

Graficul `l2_puteri.png` pentru cos φ = 0,8.

**4. Analiza armonică.**

| I₁ \[A\] | I₃ \[A\] | I₅ \[A\] | THD \[%\] | I\_ef numeric \[A\] | √(I₁²+I₃²+I₅²) \[A\] |
| --- | --- | --- | --- | --- | --- |
|  |  |  |  |  |  |

Spectrul de armonici (grafic).

**5. Curba de sarcină.**

| W \[kWh\] | P\_max \[kW\] | Ora vârfului | P\_med \[kW\] | k\_î | T\_max \[h\] |
| --- | --- | --- | --- | --- | --- |
|  |  |  |  |  |  |

Graficul `l2_curba.png` și interpretarea (3–5 rânduri).

**6. Aplicația individuală.** Codul (anexă), puterea totală, valoarea efectivă a curentului de neutru, graficul.

**7. Răspunsuri la întrebări** (minimum 4).

**8. Concluzii.**

## Lucrarea 3. Instrumentul virtual. Implementarea unui algoritm în C/C++. Operații de intrare/ieșire în Arduino IDE folosind interfețele I2C și SPI

### Obiective

- Realizarea unui instrument virtual de măsură a puterii și energiei în curent continuu cu Arduino Uno.
- Citirea unui senzor I2C (INA219) și afișarea pe un ecran I2C (OLED SSD1306).
- Stocarea datelor pe card microSD prin interfața SPI.
- Implementarea în C++ a unui algoritm de prelucrare (medie mobilă, integrarea energiei, minim/maxim) ca o clasă reutilizabilă.
- Vizualizarea datelor pe PC (Serial Plotter și script Python).

### Rezultatele învățării

- **Cunoștințe:** studentul explică funcționarea magistralelor I2C și SPI și structura unui instrument virtual.
- **Aptitudini:** conectează și programează senzori și periferice I2C/SPI; implementează algoritmi de prelucrare a măsurătorilor în C++.
- **Responsabilitate și autonomie:** verifică instrumentul realizat prin comparație cu un aparat de măsură etalon și estimează eroarea.

### Noțiuni teoretice

Un **instrument virtual** înlocuiește funcțiile unui aparat clasic (afișare, prelucrare, înregistrare) cu software, folosind un hardware de achiziție general. Avantaje: flexibilitate, cost redus, stocare și prelucrare automată.

**INA219** măsoară tensiunea pe un șunt (±320 mV, rezoluție 10 µV) și tensiunea pe magistrală (0–26 V, rezoluție 4 mV). Cu șuntul de 0,1 Ω de pe modul, curentul maxim este 3,2 A. Adresa I2C implicită: 0x40 (0x41, 0x44, 0x45 prin jumperii A0/A1).

**I2C**: SDA (A4), SCL (A5) la Arduino Uno, rezistențe de pull-up (de obicei pe module), adresă de 7 biți. **SPI**: MOSI (D11), MISO (D12), SCK (D13), CS (ales, de ex. D10), transfer full-duplex, un pin CS pentru fiecare dispozitiv.

Energia se obține prin integrarea numerică a puterii: Wₖ = Wₖ₋₁ + Pₖ·Δt (metoda dreptunghiurilor) sau Wₖ = Wₖ₋₁ + (Pₖ + Pₖ₋₁)/2·Δt (trapeze).

### Echipamente și software

Arduino Uno R3; modul INA219; ecran OLED 0,96" SSD1306 I2C (0x3C); modul card microSD (SPI, cu adaptor de nivel); sursă de laborator 0–15 V; sarcină rezistivă (rezistență de putere 10 Ω / 10 W sau bec auto 12 V / 5 W); multimetru; breadboard și fire. Arduino IDE 2 cu bibliotecile *Adafruit INA219*, *Adafruit SSD1306*, *Adafruit GFX*, *SD*. Python cu `pyserial`.

### Desfășurarea lucrării

**Pasul 1 — Montajul.**

| Modul | Conexiune la Arduino Uno |
| --- | --- |
| INA219 VCC, GND | 5 V, GND |
| INA219 SDA, SCL | A4, A5 |
| INA219 Vin+ / Vin− | în serie cu sarcina: sursă(+) → Vin+ → Vin− → sarcină → sursă(−); sursă(−) la GND Arduino |
| OLED VCC, GND, SDA, SCL | 5 V, GND, A4, A5 (aceeași magistrală) |
| microSD VCC, GND | 5 V, GND |
| microSD MOSI, MISO, SCK, CS | D11, D12, D13, D10 |

**Pasul 2 — Scanarea magistralei I2C.** Încărcați exemplul *File → Examples → Wire → i2c\_scanner* (sau scanerul de mai jos) și notați adresele găsite (așteptat: 0x3C și 0x40).

```cpp
#include <Wire.h>
void setup() {
  Serial.begin(115200); Wire.begin();
  for (byte a = 1; a < 127; a++) {
    Wire.beginTransmission(a);
    if (Wire.endTransmission() == 0) { Serial.print("Dispozitiv la 0x"); Serial.println(a, HEX); }
  }
}
void loop() {}
```

**Pasul 3 — Algoritmul de prelucrare (clasă C++).** Creați în proiect fila `Prelucrare.h`:

```cpp
#pragma once
template <int N>
class MedieMobila {                       // medie pe ultimele N eșantioane, O(1) pe eșantion
  float buf[N] = {0}; float suma = 0; int k = 0, n = 0;
public:
  float adauga(float x) {
    suma += x - buf[k]; buf[k] = x; k = (k + 1) % N; if (n < N) n++;
    return suma / n;
  }
};
class Contor {                            // energie prin metoda trapezelor + statistică
  float Pant = 0; bool primul = true;
public:
  double Wh = 0; float Pmin = 1e9, Pmax = -1e9;
  void adauga(float P, float dt_s) {
    if (!primul) Wh += (P + Pant) / 2.0 * dt_s / 3600.0;
    primul = false; Pant = P;
    if (P < Pmin) Pmin = P; if (P > Pmax) Pmax = P;
  }
};
```

**Pasul 4 — Programul instrumentului virtual.**

```cpp
#include <Wire.h>
#include <SPI.h>
#include <SD.h>
#include <Adafruit_INA219.h>
#include <Adafruit_SSD1306.h>
#include "Prelucrare.h"

Adafruit_INA219 ina;
Adafruit_SSD1306 oled(128, 64, &Wire, -1);
MedieMobila<8> mU, mI;
Contor contor;
const int CS_SD = 10;
bool sdOK = false;
unsigned long tAnt = 0, tScr = 0;

void setup() {
  Serial.begin(115200);
  if (!ina.begin()) { Serial.println("INA219 lipsa"); while (1); }
  oled.begin(SSD1306_SWITCHCAPVCC, 0x3C);
  sdOK = SD.begin(CS_SD);
  if (sdOK) { File f = SD.open("log.csv", FILE_WRITE); f.println("t_ms;U_V;I_A;P_W;W_Wh"); f.close(); }
  tAnt = millis();
}

void loop() {
  unsigned long t = millis();
  if (t - tAnt < 200) return;                       // eșantionare la 200 ms
  float dt = (t - tAnt) / 1000.0; tAnt = t;

  float U = mU.adauga(ina.getBusVoltage_V() + ina.getShuntVoltage_mV() / 1000.0);
  float I = mI.adauga(ina.getCurrent_mA() / 1000.0);
  float P = U * I;
  contor.adauga(P, dt);

  Serial.print("U:"); Serial.print(U, 3); Serial.print(" I:"); Serial.print(I, 3);
  Serial.print(" P:"); Serial.println(P, 3);          // format pentru Serial Plotter

  if (t - tScr >= 1000) {                            // afișare și înregistrare la 1 s
    tScr = t;
    oled.clearDisplay(); oled.setTextColor(SSD1306_WHITE); oled.setTextSize(1);
    oled.setCursor(0, 0);  oled.print("U = "); oled.print(U, 2); oled.println(" V");
    oled.print("I = "); oled.print(I, 3); oled.println(" A");
    oled.setTextSize(2); oled.print(P, 2); oled.println(" W");
    oled.setTextSize(1); oled.print("W = "); oled.print(contor.Wh, 3); oled.println(" Wh");
    oled.print("Pmax "); oled.print(contor.Pmax, 2); oled.print(sdOK ? " SD" : " --");
    oled.display();
    if (sdOK) {
      File f = SD.open("log.csv", FILE_WRITE);
      f.print(t); f.print(';'); f.print(U, 3); f.print(';'); f.print(I, 3); f.print(';');
      f.print(P, 3); f.print(';'); f.println(contor.Wh, 4); f.close();
    }
  }
}
```

Notă: programul ocupă o mare parte din cei 2 KB SRAM ai Uno (ecranul folosește 1 KB pentru buffer). Dacă placa se resetează sau ecranul nu pornește, se renunță la cardul SD sau se folosește o placă cu mai multă memorie (Arduino Mega, Nano ESP32).

**Pasul 5 — Interfața pe PC.** Deschideți *Tools → Serial Plotter* (115200 baud). Apoi închideți-l și rulați scriptul Python care afișează și salvează datele (portul: COM3 pe Windows, /dev/ttyACM0 pe Linux):

```python
import serial, time, re, matplotlib.pyplot as plt
port = serial.Serial("COM3", 115200, timeout=1); time.sleep(2)
t0 = time.time(); T, P = [], []
plt.ion(); fig, ax = plt.subplots()
with open("vi_pc.csv", "w") as f:
    f.write("t_s;U;I;P\n")
    while time.time() - t0 < 120:                     # 2 minute
        m = re.findall(r"[-\d.]+", port.readline().decode(errors="ignore"))
        if len(m) != 3: continue
        U, I, p = map(float, m); t = time.time() - t0
        f.write(f"{t:.2f};{U};{I};{p}\n"); T.append(t); P.append(p)
        if len(T) % 5 == 0:
            ax.clear(); ax.plot(T, P); ax.set_xlabel("t [s]"); ax.set_ylabel("P [W]"); plt.pause(0.01)
```

**Pasul 6 — Măsurători.** Pentru sarcina rezistivă, reglați sursa la 3, 6, 9, 12 V. Notați U și I indicate de instrumentul virtual și de multimetru. Mențineți 12 V timp de 5 minute și notați energia; comparați cu W = P·t.

**Pasul 7 — Aplicație individuală.** Adăugați un buton (D2, `INPUT_PULLUP`) care resetează contorul de energie și o alarmă (LED pe D7) când puterea depășește un prag introdus prin interfața serială (de ex. comanda `P=10`).

### Prelucrarea rezultatelor

1. Calculați erorile relative ale tensiunii și curentului față de multimetru: ε = (X\_VI − X\_ref)/X\_ref·100 %.
2. Determinați rezistența sarcinii R = U/I pentru fiecare punct; explicați variația (în cazul becului: rezistența crește cu temperatura filamentului).
3. Comparați energia măsurată în 5 minute cu valoarea calculată și cu energia obținută în Python din fișierul `log.csv` (metoda trapezelor).

### Întrebări de verificare

1. Care sunt componentele unui instrument virtual și ce avantaje are față de un aparat clasic?
2. Prin ce se deosebesc I2C și SPI (număr de fire, adresare, viteză, număr de dispozitive)?
3. Cum pot fi conectate două module INA219 pe aceeași magistrală I2C?
4. De ce INA219 se montează pe partea pozitivă a sarcinii (*high-side*) și ce s-ar întâmpla la conectarea pe partea negativă?
5. Ce avantaj are implementarea mediei mobile cu buffer circular față de recalcularea sumei la fiecare pas?
6. Ce eroare introduce metoda dreptunghiurilor față de metoda trapezelor la integrarea energiei? Când devine importantă?
7. De ce se folosește `millis()` în loc de `delay()` în bucla principală?
8. Care este puterea maximă care poate fi măsurată cu modulul INA219 standard și cum se poate extinde domeniul?

### Model de referat

**Informatică aplicată — Referat Lucrarea 3** — Student: ………… Grupa: …… Data: ………

**1. Scopul lucrării.**

**2. Schema montajului** (desen sau fotografie cu conexiunile notate) și adresele I2C găsite: ……

**3. Algoritmul de prelucrare.** Pseudocodul mediei mobile și al integrării energiei.

**4. Comparația cu multimetrul.**

| U\_sursă \[V\] | U\_VI \[V\] | U\_mult \[V\] | ε\_U \[%\] | I\_VI \[A\] | I\_mult \[A\] | ε\_I \[%\] | P\_VI \[W\] | R \[Ω\] |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| 3 |  |  |  |  |  |  |  |  |
| 6 |  |  |  |  |  |  |  |  |
| 9 |  |  |  |  |  |  |  |  |
| 12 |  |  |  |  |  |  |  |  |

**5. Energia în 5 minute.**

| W instrument \[Wh\] | W = P·t \[Wh\] | W din log.csv (Python) \[Wh\] | Diferență \[%\] |
| --- | --- | --- | --- |
|  |  |  |  |

**6. Grafice.** Captură Serial Plotter și graficul P(t) din scriptul Python.

**7. Aplicația individuală.** Cod (anexă) și descrierea testării butonului și alarmei.

**8. Răspunsuri la întrebări** (minimum 4).

**9. Concluzii.** Precizia obținută, surse de eroare, îmbunătățiri posibile.

## Lucrarea 4. Dezvoltarea aplicațiilor pentru sisteme Raspberry Pi Pico și sisteme IoT

### Obiective

- Programarea Raspberry Pi Pico W în C/C++ (Pico SDK) și în MicroPython; compararea celor două abordări.
- Achiziția periodică a unei mărimi analogice cu timer.
- Conectarea Pico W la Wi-Fi și publicarea datelor prin MQTT către un broker Mosquitto.
- Primirea de comenzi de la distanță (abonare MQTT) și măsurarea întârzierii comunicației.

### Rezultatele învățării

- **Cunoștințe:** studentul descrie fluxul de dezvoltare pentru Pico (UF2, REPL) și modelul publicare/abonare MQTT.
- **Aptitudini:** realizează un nod IoT care trimite măsurători și execută comenzi primite prin rețea.
- **Responsabilitate și autonomie:** alege limbajul și protocolul potrivite cerințelor de timp și de fiabilitate.

### Noțiuni teoretice

Raspberry Pi Pico W are microcontrolerul RP2040 (2 nuclee Cortex-M0+), ADC pe 12 biți (0–3,3 V, intrările GP26–GP28) și cipul Wi-Fi CYW43439. Programele C se compilează în fișiere `.uf2`, copiate pe placa pornită cu BOOTSEL apăsat. MicroPython se instalează tot ca fișier `.uf2`; apoi scripturile se rulează direct din Thonny.

**MQTT**: clienții se conectează la un broker; publisher-ul trimite mesaje pe un *topic*, iar abonații la acel topic le primesc. Exemplu de structură: `lab/grupaX/nodY/telemetrie` (date) și `lab/grupaX/nodY/comanda` (comenzi).

### Echipamente și software

Raspberry Pi Pico W; potentiometru 10 kΩ (sau fotorezistență în divizor); LED + rezistență 220 Ω; cablu micro-USB; rețea Wi-Fi a laboratorului; PC cu VS Code + extensia Raspberry Pi Pico, Thonny, Docker Desktop (broker Mosquitto) și Python cu `paho-mqtt`.

### Desfășurarea lucrării

**Pasul 1 — Montajul.** Potentiometrul între 3V3 (pin 36) și GND, cursorul la GP26 (ADC0). LED-ul extern cu rezistență între GP15 și GND.

**Pasul 2 — Program C (Pico SDK).** Creați cu extensia VS Code un proiect nou (*New C/C++ Project*, placa *pico\_w*, bifat *stdio over USB*) și înlocuiți codul cu:

```c
#include <stdio.h>
#include "pico/stdlib.h"
#include "hardware/adc.h"

static volatile bool tick = false;
bool cb(repeating_timer_t *t) { tick = true; return true; }

int main(void) {
    stdio_init_all();
    gpio_init(15); gpio_set_dir(15, GPIO_OUT);
    adc_init(); adc_gpio_init(26); adc_select_input(0);
    repeating_timer_t t; add_repeating_timer_ms(-100, cb, NULL, &t);   // 10 Hz
    uint32_t n = 0; float s = 0;
    while (true) {
        if (!tick) { tight_loop_contents(); continue; }
        tick = false;
        s += adc_read() * 3.3f / 4095.0f;
        if (++n % 10 == 0) {                      // media pe 1 s
            float U = s / 10; s = 0;
            gpio_put(15, U > 1.65f);              // LED aprins peste jumătatea domeniului
            printf("%lu;%.3f\n", (unsigned long)(n / 10), U);
        }
    }
}
```

În CMakeLists.txt trebuie să existe `target_link_libraries(... pico_stdlib hardware_adc)`. Compilați, încărcați `.uf2` și urmăriți ieșirea în *Serial Monitor* (VS Code). Notați dimensiunea fișierului `.uf2`.

**Pasul 3 — Același program în MicroPython.** Instalați firmware-ul MicroPython pentru Pico W și rulați în Thonny:

```python
from machine import ADC, Pin, Timer
adc, led = ADC(26), Pin(15, Pin.OUT)
acc = {"s": 0.0, "n": 0}
def masoara(t):
    acc["s"] += adc.read_u16() * 3.3 / 65535; acc["n"] += 1
    if acc["n"] == 10:
        U = acc["s"] / 10; acc["s"], acc["n"] = 0.0, 0
        led.value(U > 1.65); print(f"{U:.3f}")
Timer(period=100, mode=Timer.PERIODIC, callback=masoara)
```

**Pasul 4 — Brokerul MQTT.** Pe PC-ul din laborator porniți Mosquitto (vezi Cursul 11, Problema 11.2) și aflați adresa IP a PC-ului (`ipconfig` / `ip a`). Permiteți portul 1883 în firewall.

**Pasul 5 — Nodul IoT (MicroPython).** Salvați pe placă `secrets.py` (`SSID`, `PASS`, `BROKER`) și `main.py`:

```python
import network, time, json, machine
from machine import ADC, Pin
from umqtt.simple import MQTTClient
from secrets import SSID, PASS, BROKER

NOD = "nod01"; BAZA = b"lab/grupa1/" + NOD.encode()
adc, led = ADC(26), Pin(15, Pin.OUT)

w = network.WLAN(network.STA_IF); w.active(True); w.connect(SSID, PASS)
while not w.isconnected(): time.sleep(0.3)
print("IP", w.ifconfig()[0])

def comanda(topic, msg):
    d = json.loads(msg)
    if "led" in d: led.value(d["led"])
    if "ping" in d:                                   # ecou pentru măsurarea întârzierii
        c.publish(BAZA + b"/pong", json.dumps({"ping": d["ping"]}))

c = MQTTClient(NOD, BROKER, keepalive=30)
c.set_callback(comanda); c.connect(); c.subscribe(BAZA + b"/comanda")
t_ant = time.ticks_ms()
while True:
    c.check_msg()
    if time.ticks_diff(time.ticks_ms(), t_ant) >= 2000:
        t_ant = time.ticks_ms()
        U = sum(adc.read_u16() for _ in range(16)) / 16 * 3.3 / 65535
        c.publish(BAZA + b"/telemetrie", json.dumps({"U": round(U, 3), "led": led.value(), "rssi": w.status("rssi")}))
    time.sleep_ms(20)
```

**Pasul 6 — Clientul de pe PC.** Abonare, afișare și comenzi:

```bash
mosquitto_sub -h localhost -t "lab/grupa1/#" -v
mosquitto_pub -h localhost -t "lab/grupa1/nod01/comanda" -m '{"led": 1}'
```

Măsurarea întârzierii dus-întors cu Python:

```python
import time, json, statistics, paho.mqtt.client as mqtt
RTT = []
def la_mesaj(c, u, m):
    RTT.append((time.perf_counter() - json.loads(m.payload)["ping"]) * 1000)
c = mqtt.Client(mqtt.CallbackAPIVersion.VERSION2); c.on_message = la_mesaj
c.connect("localhost"); c.subscribe("lab/grupa1/nod01/pong"); c.loop_start()
for _ in range(50):
    c.publish("lab/grupa1/nod01/comanda", json.dumps({"ping": time.perf_counter()})); time.sleep(0.5)
time.sleep(2)
print(f"n={len(RTT)} min={min(RTT):.1f} med={statistics.mean(RTT):.1f} max={max(RTT):.1f} ms")
```

**Pasul 7 — Aplicație individuală.** Adăugați senzorul intern de temperatură (ADC 4) în mesajul de telemetrie și comanda `{"interval": N}` care modifică perioada de raportare. Scrieți pe PC un abonat Python care salvează telemetria într-un CSV și reprezintă grafic U(t).

### Prelucrarea rezultatelor

1. Comparați varianta C și varianta MicroPython: dimensiunea programului, timpul de dezvoltare, stabilitatea perioadei de eșantionare (măsurată cu `time.ticks_us()` / `time_us_64()`).
2. Calculați statistica întârzierii MQTT (min, medie, max, abatere standard) și reprezentați histograma.
3. Repetați măsurarea întârzierii cu nodul la distanță mai mare de router și notați RSSI.

### Întrebări de verificare

1. Care sunt diferențele hardware dintre Raspberry Pi Pico, Pico W și Arduino Uno relevante pentru această lucrare?
2. Ce conține un fișier `.uf2` și cum ajunge programul în memoria Flash?
3. De ce LED-ul de pe placă al Pico W nu se comandă prin GP25, ca la Pico?
4. Ce rol are brokerul MQTT? Ce se întâmplă cu mesajele dacă brokerul este oprit?
5. Explicați rolul parametrului `keepalive` și al funcției `check_msg()`.
6. Ce factori influențează întârzierea dus-întors măsurată la pasul 6?
7. Ce riscuri de securitate are configurația din laborator (broker fără autentificare) și cum se elimină?
8. Pentru ce tip de aplicație energetică ați alege C SDK și pentru ce tip MicroPython? Argumentați.

### Model de referat

**Informatică aplicată — Referat Lucrarea 4** — Student: ………… Grupa: …… Data: ………

**1. Scopul lucrării.**

**2. Schema montajului** și arhitectura sistemului (Pico W → Wi-Fi → broker → client PC), cu topic-urile folosite.

**3. C SDK vs. MicroPython.**

| Criteriu | C SDK | MicroPython |
| --- | --- | --- |
| Dimensiunea programului / firmware \[KB\] |  |  |
| Timp de scriere și testare \[min\] |  |  |
| Perioada de eșantionare măsurată: medie ± abatere \[ms\] |  |  |
| Observații |  |  |

**4. Măsurători ADC.** Trei poziții ale potentiometrului: U măsurată cu multimetrul, U raportată de nod, eroarea \[%\].

**5. Întârzierea MQTT.**

| Poziție nod | RSSI \[dBm\] | RTT min \[ms\] | RTT mediu \[ms\] | RTT max \[ms\] | Mesaje pierdute |
| --- | --- | --- | --- | --- | --- |
| lângă router |  |  |  |  |  |
| la distanță |  |  |  |  |  |

Histograma RTT.

**6. Aplicația individuală.** Cod (anexă), fișierul CSV, graficul U(t).

**7. Răspunsuri la întrebări** (minimum 4).

**8. Concluzii.**

## Lucrarea 5. Proiectarea unei platforme de măsură pentru sisteme energetice (tensiune, curent, temperatură)

### Obiective

- Proiectarea lanțului de măsură pentru tensiune continuă, curent alternativ și temperatură cu Raspberry Pi Pico W.
- Dimensionarea circuitelor de condiționare: divizor de tensiune, polarizarea senzorului de curent, divizor pentru termistor.
- Implementarea algoritmilor: valoare efectivă a curentului alternativ, ecuația Beta a termistorului, calibrare în două puncte.
- Evaluarea preciziei platformei prin comparație cu aparate etalon.

### Rezultatele învățării

- **Cunoștințe:** studentul descrie lanțul de măsură traductor → condiționare → ADC → prelucrare numerică și sursele de eroare.
- **Aptitudini:** dimensionează circuitele de condiționare, calibrează canalele de măsură și calculează mărimi derivate (I\_ef, P, energie).
- **Responsabilitate și autonomie:** respectă regulile de securitate electrică (măsurare neinvazivă a curentului de rețea, tensiuni joase) și documentează precizia obținută.

### Noțiuni teoretice

**Tensiune continuă (0–30 V).** Divizorul R1–R2 aduce tensiunea în domeniul ADC (0–3,3 V): U\_in = U\_ADC·(R1 + R2)/R2. Cu R1 = 100 kΩ și R2 = 10 kΩ, raportul este 11, deci domeniul maxim este 36,3 V.

**Curent alternativ (0–30 A) cu transformatorul de curent SCT-013-030.** Senzorul se prinde pe un singur conductor (fără contact electric) și dă 1 V efectiv la 30 A (rezistență de sarcină internă). Semnalul alternativ se polarizează la 1,65 V (jumătatea domeniului ADC) cu un divizor 10 kΩ / 10 kΩ și un condensator de 10 µF. Valoarea efectivă se calculează din N eșantioane pe un număr întreg de perioade, după scăderea componentei continue:

```latex
I_{ef} = k_I \sqrt{\frac{1}{N}\sum_{k=1}^{N}\left(u_k - \bar{u}\right)^2}, \qquad k_I = 30\ \mathrm{A/V}
```

**Temperatură.** Senzorul digital DS18B20 (1-Wire, ±0,5 °C) este referința. Termistorul NTC 10 kΩ (B = 3950 K) în divizor cu R\_fix = 10 kΩ (NTC spre GND):

```latex
R_{NTC} = R_{fix}\frac{U_{ADC}}{U_{ref} - U_{ADC}}, \qquad \frac{1}{T} = \frac{1}{T_0} + \frac{1}{B}\ln\frac{R_{NTC}}{R_0}, \quad T_0 = 298{,}15\ \mathrm{K}
```

**Calibrarea în două puncte.** Pentru două valori de referință (x₁, x₂) și indicațiile corespunzătoare (y₁, y₂): x = a·y + b, cu a = (x₂ − x₁)/(y₂ − y₁) și b = x₁ − a·y₁. Corectează erorile de câștig și de decalaj.

**Securitate.** Nu se conectează nimic galvanic la rețeaua de 230 V. Curentul alternativ se măsoară doar cu SCT-013 pe un prelungitor cu conductoarele separate (cutie de măsură pregătită în laborator), nu pe cablul complet (fază + neutru dă curent rezultant zero).

### Echipamente și software

Raspberry Pi Pico W cu MicroPython; rezistențe 100 kΩ, 3 × 10 kΩ; condensator 10 µF; senzor SCT-013-030 cu mufă jack 3,5 mm; termistor NTC 10 kΩ B3950; DS18B20 (cu rezistență 4,7 kΩ); sursă de laborator 0–30 V; cutie de măsură cu conductoare separate și consumatori (fierbător \~2 kW, bec / radiator); multimetru; clemă ampermetrică de referință; pahar cu apă caldă și apă cu gheață.

### Desfășurarea lucrării

**Pasul 1 — Proiectarea și montajul.**

| Canal | Circuit | Pin Pico |
| --- | --- | --- |
| U continuă | R1 = 100 kΩ de la +U la nod, R2 = 10 kΩ de la nod la GND | GP26 (ADC0) |
| I alternativ | SCT-013: un capăt la nodul de polarizare (10 kΩ la 3V3, 10 kΩ la GND, 10 µF la GND), celălalt capăt la ADC | GP27 (ADC1) |
| NTC | R\_fix = 10 kΩ de la 3V3 la nod, NTC de la nod la GND | GP28 (ADC2) |
| DS18B20 | DQ cu 4,7 kΩ la 3V3 | GP22 |

Notați în referat calculul pentru fiecare circuit (domeniu, rezoluție, curent absorbit).

**Pasul 2 — Programul platformei.** `platforma.py`:

```python
from machine import ADC, Pin
import time, math, onewire, ds18x20

adcU, adcI, adcT = ADC(26), ADC(27), ADC(28)
ds = ds18x20.DS18X20(onewire.OneWire(Pin(22))); rom = ds.scan()[0]
KV = 3.3 / 65535

# coeficienți de calibrare x = a*y + b (se actualizează la pasul 4)
CAL = {"U": (11.0, 0.0), "I": (30.0, 0.0), "T": (1.0, 0.0)}

def medie(adc, n=32):
    return sum(adc.read_u16() for _ in range(n)) / n * KV

def tensiune():
    a, b = CAL["U"]; return a * medie(adcU) + b

def curent_ef(perioade=10, f=50, fe=5000):
    N = int(perioade * fe / f); dt = 1_000_000 // fe; x = []
    t = time.ticks_us()
    for _ in range(N):
        x.append(adcI.read_u16())
        t += dt
        while time.ticks_diff(t, time.ticks_us()) > 0: pass
    m = sum(x) / N
    uef = math.sqrt(sum((v - m) ** 2 for v in x) / N) * KV
    a, b = CAL["I"]; return max(0.0, a * uef + b)

def temp_ntc(R0=10_000, B=3950, Rf=10_000):
    u = medie(adcT)
    R = Rf * u / (3.3 - u)
    T = 1 / (1 / 298.15 + math.log(R / R0) / B) - 273.15
    a, b = CAL["T"]; return a * T + b

def temp_ds():
    ds.convert_temp(); time.sleep_ms(750); return ds.read_temp(rom)

if __name__ == "__main__":
    print("t_s;U_V;I_A;T_ntc_C;T_ds_C")
    t0 = time.time()
    while True:
        print(f"{time.time()-t0};{tensiune():.3f};{curent_ef():.3f};{temp_ntc():.2f};{temp_ds():.2f}")
        time.sleep(1)
```

**Pasul 3 — Verificarea frecvenței de eșantionare.** Măsurați cu `time.ticks_us()` durata reală a achiziției celor N = 1000 de eșantioane din `curent_ef()`; trebuie să fie 200 ms (10 perioade). Dacă durează mai mult, reduceți `fe` la 2500 Hz.

**Pasul 4 — Calibrarea.**

- *Tensiune:* reglați sursa la 5 V și 25 V (măsurate cu multimetrul); notați indicațiile platformei și calculați a, b.
- *Curent:* măsurați cu clema de referință două sarcini (de ex. bec \~0,4 A și fierbător \~8,7 A); pentru curenți mici treceți conductorul de 5 ori prin senzor și împărțiți indicația la 5.
- *Temperatură:* introduceți NTC și DS18B20 împreună în apă cu gheață și în apă caldă (\~60 °C); DS18B20 este referința.

**Pasul 5 — Verificarea după calibrare.** Cu coeficienții actualizați în `CAL`, măsurați 5 puncte de tensiune (3, 9, 15, 21, 27 V), 3 sarcini de curent și temperatura camerei; calculați erorile.

**Pasul 6 — Înregistrare și prelucrare.** Porniți fierbătorul cu apă și înregistrați 3 minute I(t) și T(t) (senzorii de temperatură în apă). Copiați datele din consola Thonny într-un fișier CSV și calculați în Python: energia absorbită W = Σ 230·I·Δt (cos φ = 1 pentru rezistență), căldura primită de apă Q = m·c·ΔT (c = 4186 J/kg·K) și randamentul η = Q/W.

**Pasul 7 — Aplicație individuală.** Adăugați în program o funcție care detectează automat lipsa senzorului de curent (abatere standard sub prag și medie departe de 1,65 V) și un mesaj de alarmă la T > 80 °C.

### Prelucrarea rezultatelor

1. Calculați coeficienții de calibrare pentru fiecare canal și erorile înainte și după calibrare.
2. Determinați rezoluția fiecărui canal (tensiune: 3,3/4095·11 ≈ 8,9 mV; curent: 3,3/4095·30 ≈ 24 mA pe eșantion; temperatură: variația lui T pentru un pas ADC în jurul a 25 °C).
3. Calculați randamentul fierbătorului și comentați sursele de eroare (pierderi spre mediu, inerția senzorilor, cos φ, tensiunea rețelei diferită de 230 V).

### Întrebări de verificare

1. De ce semnalul de la SCT-013 trebuie polarizat la 1,65 V înainte de ADC?
2. Ce se întâmplă dacă senzorul SCT-013 se prinde pe un cablu care conține atât faza cât și neutrul?
3. De ce valoarea efectivă se calculează pe un număr întreg de perioade? Ce eroare apare altfel?
4. Cum se alege R\_fix pentru termistor astfel încât sensibilitatea să fie maximă în jurul temperaturii de interes?
5. Ce erori corectează calibrarea în două puncte și ce erori nu poate corecta?
6. Cum se poate măsura și puterea activă (nu doar I\_ef) a unui consumator inductiv? Ce senzor suplimentar e necesar?
7. De ce trecerea conductorului de 5 ori prin senzor crește precizia la curenți mici?
8. Ce rezistență de intrare „vede” ADC-ul la canalul de tensiune și de ce o valoare prea mare a divizorului poate introduce erori?

### Model de referat

**Informatică aplicată — Referat Lucrarea 5** — Student: ………… Grupa: …… Data: ………

**1. Scopul lucrării.**

**2. Proiectarea circuitelor de condiționare.** Schema electrică și calculele (domeniu, rezoluție, curent absorbit) pentru fiecare canal.

**3. Calibrarea.**

| Canal | x₁ (ref.) | y₁ (indicat) | x₂ (ref.) | y₂ (indicat) | a | b |
| --- | --- | --- | --- | --- | --- | --- |
| U \[V\] |  |  |  |  |  |  |
| I \[A\] |  |  |  |  |  |  |
| T \[°C\] |  |  |  |  |  |  |

**4. Verificarea după calibrare.**

| Mărime | Valoare de referință | Indicație platformă | Eroare absolută | Eroare relativă \[%\] |
| --- | --- | --- | --- | --- |
| U = 3 V |  |  |  |  |
| U = 15 V |  |  |  |  |
| U = 27 V |  |  |  |  |
| I sarcina 1 |  |  |  |  |
| I sarcina 2 |  |  |  |  |
| T cameră |  |  |  |  |

**5. Testul cu fierbătorul.** Masa apei m = … kg; T\_inițial = … °C; T\_final = … °C; W = … kJ; Q = … kJ; η = … %. Graficele I(t) și T(t).

**6. Aplicația individuală.** Cod (anexă) și testele efectuate.

**7. Răspunsuri la întrebări** (minimum 4).

**8. Concluzii.** Precizia platformei pe fiecare canal și propuneri de îmbunătățire.

## Lucrarea 6. Achiziția și prelucrarea datelor în sisteme IoT (ThingsBoard)

### Obiective

- Instalarea ThingsBoard Community Edition în Docker și configurarea unui profil de dispozitiv și a unui dispozitiv.
- Transmiterea telemetriei de la platforma de măsură din Lucrarea 5 prin MQTT și utilizarea atributelor partajate pentru configurare de la distanță.
- Prelucrarea datelor în motorul de reguli: mărimi calculate, alarme.
- Realizarea unui panou de bord și extragerea datelor agregate prin API REST pentru prelucrare în Python.

### Rezultatele învățării

- **Cunoștințe:** studentul explică modul în care ThingsBoard stochează și gestionează datele de proces (telemetrie, atribute, alarme, entități).
- **Aptitudini:** configurează o aplicație de monitorizare completă și automatizează generarea unui raport din datele stocate.
- **Responsabilitate și autonomie:** ia decizii pe baza datelor monitorizate (praguri de alarmă, interval de raportare) și le justifică.

### Noțiuni teoretice

**Telemetria** este o serie temporală (timp, cheie, valoare) — de exemplu `I`, `T`. **Atributele** sunt valori fără istoric: *client* (trimise de dispozitiv, ex. versiunea firmware), *server* (setate în platformă) și *shared* (setate în platformă și transmise dispozitivului, ex. intervalul de raportare). Mesajele intră în **lanțul de reguli** (*Root Rule Chain*), unde noduri de filtrare, transformare și acțiune le prelucrează înainte de salvare. **Alarmele** se definesc simplu în profilul de dispozitiv (*Alarm rules*).

API MQTT al dispozitivului (utilizator = token de acces):

| Topic | Sens | Rol |
| --- | --- | --- |
| `v1/devices/me/telemetry` | dispozitiv → platformă | trimite telemetrie |
| `v1/devices/me/attributes` | dispozitiv → platformă | trimite atribute client |
| `v1/devices/me/attributes` (abonare) | platformă → dispozitiv | primește modificările atributelor shared |
| `v1/devices/me/rpc/request/+` (abonare) | platformă → dispozitiv | primește comenzi RPC |

### Echipamente și software

Platforma de măsură din Lucrarea 5 (Pico W + senzori); PC cu Docker Desktop (minimum 4 GB RAM liberi); browser; Python cu `requests`, `pandas`, `matplotlib`.

### Desfășurarea lucrării

**Pasul 1 — Pornirea ThingsBoard.** Creați fișierul `compose.yaml` (Cursul 11, secțiunea 11.5, doar serviciul `thingsboard`) și rulați `docker compose up -d`. După 2–5 minute deschideți `http://localhost:8080` și autentificați-vă cu `tenant@thingsboard.org` / `tenant`. În laborator se poate folosi și serverul comun indicat de cadrul didactic.

**Pasul 2 — Profil și dispozitiv.**

1. *Profiles → Device profiles → +*: nume „Platforma masura”, transport MQTT.
2. *Alarm rules → Add alarm rule*: tipul „Supracurent”, condiția `I > 9` (tip *Time series*, cheie `I`), severitate *Major*; condiție de ștergere `I < 8`. A doua regulă: „Supratemperatură”, `T_ds > 80`, *Critical*.
3. *Entities → Devices → +*: nume `PM-grupa1-echipa1`, profilul de mai sus. Deschideți dispozitivul → *Copy access token*.
4. Tab-ul *Attributes → Shared attributes → +*: cheia `interval_s`, valoarea 5.

**Pasul 3 — Nodul IoT.** Extindeți programul din Lucrarea 5: în `secrets.py` adăugați `TB_HOST` (IP-ul serverului) și `TOKEN`; salvați `main.py`:

```python
import network, time, json
from umqtt.simple import MQTTClient
from platforma import tensiune, curent_ef, temp_ntc, temp_ds
from secrets import SSID, PASS, TB_HOST, TOKEN

cfg = {"interval_s": 5}
w = network.WLAN(network.STA_IF); w.active(True); w.connect(SSID, PASS)
while not w.isconnected(): time.sleep(0.3)

def la_mesaj(topic, msg):
    d = json.loads(msg); d = d.get("shared", d)        # răspuns la cerere sau actualizare
    if "interval_s" in d: cfg["interval_s"] = max(1, int(d["interval_s"]))
    print("config:", cfg)

c = MQTTClient("pm1", TB_HOST, user=TOKEN, password="", keepalive=60)
c.set_callback(la_mesaj); c.connect()
c.subscribe(b"v1/devices/me/attributes")
c.subscribe(b"v1/devices/me/attributes/response/+")
c.publish(b"v1/devices/me/attributes/request/1", b'{"sharedKeys":"interval_s"}')
c.publish(b"v1/devices/me/attributes", json.dumps({"firmware": "pm-1.0", "ip": w.ifconfig()[0]}))

t_ant = time.ticks_ms() - 60_000
while True:
    c.check_msg()
    if time.ticks_diff(time.ticks_ms(), t_ant) >= cfg["interval_s"] * 1000:
        t_ant = time.ticks_ms()
        m = {"U": round(tensiune(), 2), "I": round(curent_ef(), 3),
             "T_ntc": round(temp_ntc(), 2), "T_ds": round(temp_ds(), 2)}
        c.publish(b"v1/devices/me/telemetry", json.dumps(m))
    time.sleep_ms(50)
```

Verificați în dispozitiv, tab-ul *Latest telemetry*, că sosesc datele. Modificați atributul `interval_s` la 2 și observați schimbarea ritmului mesajelor.

**Pasul 4 — Lanțul de reguli: putere și energie.** *Rule chains → Root Rule Chain*. Între ieșirea *Post telemetry* a nodului *Message Type Switch* și nodul *Save Timeseries*, inserați un nod *Transformation → Script*:

```javascript
// putere aparentă și activă estimate pentru o sarcină rezistivă la 230 V
if (msg.I != null) {
    msg.S_VA = msg.I * 230;
    msg.P_W  = msg.S_VA * 1.0;          // cos(phi) = 1 pentru fierbător
}
return {msg: msg, metadata: metadata, msgType: msgType};
```

Salvați lanțul și verificați apariția cheilor `S_VA` și `P_W` în telemetrie. (Energia se va calcula în Python, pasul 6, sau cu nodul *Calculated fields*/*Statistics* disponibil în versiunile recente.)

**Pasul 5 — Panoul de bord.** *Dashboards → + → Create new dashboard* „Monitorizare PM”. Adăugați un alias de entitate pentru dispozitiv și widget-urile:

- *Time series chart* cu `I` și `P_W` (ultima oră);
- *Analog gauge* pentru `T_ds` (0–100 °C) și *Digital gauge* pentru `U`;
- *Value card* pentru `P_W`;
- *Alarms table* pentru alarmele dispozitivului;
- *Update shared attribute* pentru `interval_s`.

Porniți fierbătorul (sau sarcina de test) și provocați alarma de supracurent (prag ajustat temporar) și alarma de temperatură (senzorul în apă caldă). Confirmați (*Acknowledge*) și ștergeți (*Clear*) alarmele.

**Pasul 6 — Extragerea datelor prin API REST și raportul automat.** În *Devices* copiați ID-ul dispozitivului (*Copy device Id*).

```python
import requests, time, pandas as pd, matplotlib.pyplot as plt
URL, DEV = "http://localhost:8080", "ID-UL-DISPOZITIVULUI"
tok = requests.post(f"{URL}/api/auth/login",
                    json={"username": "tenant@thingsboard.org", "password": "tenant"}).json()["token"]
H = {"X-Authorization": f"Bearer {tok}"}
end = int(time.time() * 1000); start = end - 3600_000          # ultima oră
r = requests.get(f"{URL}/api/plugins/telemetry/DEVICE/{DEV}/values/timeseries", headers=H,
                 params={"keys": "I,P_W,T_ds", "startTs": start, "endTs": end,
                         "interval": 60_000, "agg": "AVG", "limit": 1000}).json()
df = pd.concat({k: pd.DataFrame(v).set_index("ts")["value"].astype(float) for k, v in r.items()}, axis=1)
df.index = pd.to_datetime(df.index, unit="ms"); df = df.sort_index()
W_Wh = df["P_W"].sum() * 1 / 60                                 # medii la 1 min -> Wh
print(df.describe()); print(f"Energie in ultima ora: {W_Wh:.1f} Wh")
ax = df[["P_W"]].plot(figsize=(9, 4), grid=True, ylabel="P [W]"); ax.figure.savefig("raport_P.png", dpi=150)
with pd.ExcelWriter("raport.xlsx") as xw:
    df.to_excel(xw, sheet_name="medii_1min")
    df.describe().to_excel(xw, sheet_name="statistica")
```

Notă: în producție nu se scriu parolele în cod; se folosește un utilizator dedicat și variabile de mediu.

**Pasul 7 — Aplicație individuală.** Adăugați în profil o alarmă de tip „Nod inactiv” (activitate dispozitiv / *inactivity timeout* 60 s) și verificați-o deconectând placa. Extindeți scriptul Python astfel încât să genereze raportul zilnic pentru ultimele 24 h, cu agregare la 15 minute și calculul puterii maxime pe 15 minute (mărime folosită la facturare).

### Prelucrarea rezultatelor

1. Verificați că valorile din panoul de bord coincid cu cele afișate local de platformă (consola Thonny).
2. Măsurați întârzierea dintre trecerea pragului și apariția alarmei.
3. Comparați energia calculată din medii la 1 minut cu energia calculată din datele brute (fără agregare, `agg=NONE`).

### Întrebări de verificare

1. Care este diferența dintre telemetrie și atribute? Dați câte un exemplu din lucrare pentru fiecare tip de atribut.
2. Ce rol are token-ul de acces și ce se întâmplă dacă este compromis?
3. Unde este preferabil să se calculeze mărimile derivate (P, energie): pe dispozitiv, în lanțul de reguli sau în aplicația de raportare? Argumentați.
4. Ce face agregarea `AVG` cu `interval = 60000` și ce informație se pierde față de datele brute?
5. Ce înseamnă condiția de ștergere a unei alarme și de ce se folosește un prag diferit de cel de declanșare?
6. Cum primește dispozitivul noua valoare a lui `interval_s` dacă era deconectat în momentul modificării?
7. Ce informații trebuie să conțină un raport tehnic generat automat pentru un responsabil energetic?
8. Ce măsuri de securitate trebuie luate dacă serverul ThingsBoard este accesibil din Internet?

### Model de referat

**Informatică aplicată — Referat Lucrarea 6** — Student: ………… Grupa: …… Data: ………

**1. Scopul lucrării.**

**2. Arhitectura sistemului.** Schema: senzori → Pico W → MQTT → ThingsBoard (reguli, stocare, alarme) → panou de bord / API REST → raport Python.

**3. Configurarea platformei.**

| Element | Configurație |
| --- | --- |
| Profil de dispozitiv |  |
| Dispozitiv (nume, ID) |  |
| Chei de telemetrie și unități |  |
| Atribute shared |  |
| Reguli de alarmă (condiție, severitate, ștergere) |  |
| Noduri adăugate în lanțul de reguli |  |

**4. Panoul de bord.** Captură de ecran cu alarmele active și descrierea widget-urilor.

**5. Testarea alarmelor.**

| Alarmă | Acțiunea de test | Momentul trecerii pragului | Momentul apariției alarmei | Întârziere \[s\] |
| --- | --- | --- | --- | --- |
| Supracurent |  |  |  |  |
| Supratemperatură |  |  |  |  |
| Nod inactiv |  |  |  |  |

**6. Raportul automat.** Tabelul statistic, graficul `raport_P.png`, energia în ultima oră (agregat vs. brut).

**7. Aplicația individuală.** Codul (anexă) și raportul zilnic generat.

**8. Răspunsuri la întrebări** (minimum 4).

**9. Concluzii.**

## Lucrarea 7. Proiectarea și dezvoltarea unei platforme Digital Twin pentru sisteme energetice

### Obiective

- Înțelegerea conceptului de geamăn digital (*Digital Twin*): activ fizic, model, flux de date bidirecțional.
- Realizarea geamănului digital al unui rezervor de apă caldă de laborator (încălzitor de 12 V), pe baza unui model termic de ordinul 1.
- Identificarea parametrilor modelului (capacitate termică C, rezistență termică R) din date măsurate, prin metoda celor mai mici pătrate.
- Rularea modelului în paralel cu procesul real, detecția anomaliilor din reziduuri, predicția și comanda optimizată.

### Rezultatele învățării

- **Cunoștințe:** studentul descrie componentele unui geamăn digital și diferența față de un model de simulare sau un sistem de monitorizare.
- **Aptitudini:** identifică parametrii unui model fizic din date experimentale, îl sincronizează cu măsurătorile și îl folosește pentru predicție și optimizare.
- **Responsabilitate și autonomie:** transpune o instalație energetică reală într-un model digital ușor de administrat și monitorizat și evaluează critic validitatea lui.

### Noțiuni teoretice

Un **geamăn digital** este o reprezentare software a unui activ fizic, actualizată continuu cu date măsurate, care permite: (1) estimarea mărimilor nemăsurate, (2) predicția evoluției, (3) detecția abaterilor (defecte, degradări), (4) testarea scenariilor „ce-ar-fi-dacă” și (5) transmiterea de comenzi înapoi către activ. Niveluri: *model digital* (fără legătură cu activul) → *umbră digitală* (date de la activ către model) → *geamăn digital* (flux în ambele sensuri).

**Modelul termic.** Rezervorul cu apă (capacitate termică C \[J/K\]) primește puterea P de la încălzitor și pierde căldură spre mediu prin rezistența termică R \[K/W\]:

```latex
C\frac{dT}{dt} = P(t) - \frac{T - T_a}{R}, \qquad \tau = R\,C, \qquad T_\infty = T_a + R\,P
```

**Identificarea parametrilor.** Discretizat cu pasul Δt: (Tₖ₊₁ − Tₖ)/Δt = α·Pₖ − β·(Tₖ − T\_a), cu α = 1/C și β = 1/(RC). Ecuația este liniară în α și β, deci se rezolvă cu cele mai mici pătrate (`np.linalg.lstsq`); rezultă C = 1/α și R = α/β.

**Detecția anomaliilor.** Reziduul r = T\_măsurat − T\_model rămâne mic în funcționare normală. Un reziduu persistent peste prag (de ex. 3σ din perioada de validare) indică o schimbare a sistemului: capac deschis (R scade), depuneri pe încălzitor, defect de senzor.

### Echipamente și software

Platforma din lucrările 5–6 (Pico W, DS18B20, canalul de tensiune); recipient izolat (termos sau pahar în polistiren) cu 0,3 L apă; rezistență de încălzire 4,7 Ω / 50 W în carcasă de aluminiu, etanșată (sau element de încălzire de 12 V pentru acvariu); sursă de 12 V / 5 A; modul MOSFET (IRF520 sau similar, comandat la 3,3 V) pe GP16; al doilea DS18B20 pentru temperatura ambiantă; ThingsBoard (Lucrarea 6); Python cu `numpy`, `pandas`, `matplotlib`, `requests`, `paho-mqtt`.

Notă: la 12 V, P = 12²/4,7 ≈ 30,6 W; încălzitorul nu se alimentează în aer mai mult de câteva secunde.

### Desfășurarea lucrării

**Pasul 1 — Arhitectura geamănului digital.**

| Componentă | Realizare | Flux |
| --- | --- | --- |
| Activ fizic | recipient + încălzitor + senzori | → măsurători |
| Nod de margine | Pico W: măsoară T, T\_a, U; comandă MOSFET (RPC `setIncalzire`) | ↔ MQTT |
| Platformă | ThingsBoard: dispozitivul „Boiler-real” și dispozitivul „Boiler-DT” | stocare, panou |
| Model | script Python `twin.py`: model termic, identificare, predicție, reziduu | REST (citire) / MQTT (scriere) |
| Aplicație | panou de bord comun real + geamăn, alarmă de anomalie | utilizator |

**Pasul 2 — Nodul (extinderea programului din Lucrarea 6).** Adăugați în telemetrie `T` (apa), `Ta` (ambiant), `U` și starea încălzitorului `h` (0/1), iar în callback-ul MQTT tratarea comenzii RPC:

```python
from machine import Pin
incalzitor = Pin(16, Pin.OUT, value=0)

def la_mesaj(topic, msg):
    t = topic.decode(); d = json.loads(msg)
    if "/rpc/request/" in t and d.get("method") == "setIncalzire":
        incalzitor.value(1 if d["params"] else 0)
        c.publish(t.replace("request", "response"), json.dumps({"h": incalzitor.value()}))
# în bucla principală:
# m = {"T": ..., "Ta": ..., "U": round(tensiune(), 2), "h": incalzitor.value()}
# protecție locală (independentă de rețea): if m["T"] > 70: incalzitor.value(0)
```

Pe panou adăugați un widget *Switch control* legat de metoda RPC `setIncalzire`.

**Pasul 3 — Experimentul de identificare.** Cu raportare la 5 s: încălzire 15 minute (h = 1), apoi răcire 15 minute (h = 0). Exportați datele (API REST, ca la Lucrarea 6, fără agregare) în `identificare.csv` cu coloanele `ts, T, Ta, U, h`.

**Pasul 4 — Identificarea parametrilor.**

```python
import numpy as np, pandas as pd, matplotlib.pyplot as plt
R_INC = 4.7
d = pd.read_csv("identificare.csv").sort_values("ts")
t = (d.ts - d.ts.iloc[0]).to_numpy() / 1000; T = d["T"].to_numpy(); Ta = d["Ta"].to_numpy()   # d.T ar fi transpusa tabelului!
P = d.h.to_numpy() * d.U.to_numpy() ** 2 / R_INC
dt = np.diff(t); dTdt = np.diff(T) / dt
X = np.column_stack([P[:-1], -(T[:-1] - Ta[:-1])])
(alfa, beta), *_ = np.linalg.lstsq(X, dTdt, rcond=None)
C, R = 1 / alfa, alfa / beta
print(f"C = {C:.0f} J/K, R = {R:.3f} K/W, tau = {R*C/60:.1f} min")

def simuleaza(T0, P, Ta, t, C, R):                   # Euler, același pas ca datele
    Tm = np.empty_like(t); Tm[0] = T0
    for k in range(len(t) - 1):
        Tm[k+1] = Tm[k] + (t[k+1] - t[k]) / C * (P[k] - (Tm[k] - Ta[k]) / R)
    return Tm
Tm = simuleaza(T[0], P, Ta, t, C, R)
rmse = np.sqrt(np.mean((T - Tm) ** 2))
plt.plot(t/60, T, ".", ms=3, label="măsurat"); plt.plot(t/60, Tm, label=f"model (RMSE={rmse:.2f} K)")
plt.xlabel("t [min]"); plt.ylabel("T [°C]"); plt.grid(); plt.legend(); plt.savefig("identificare.png", dpi=150)
```

Comparați C identificat cu valoarea teoretică m·c = 0,3·4186 ≈ 1256 J/K (diferența = capacitatea recipientului și a încălzitorului). Derivata numerică amplifică zgomotul: dacă rezultatele sunt instabile, filtrați T cu o medie mobilă pe 5 eșantioane înainte de identificare.

**Pasul 5 — Geamănul în timp real.** Creați în ThingsBoard dispozitivul „Boiler-DT” (token propriu). Scriptul `twin.py` citește la 5 s ultimele valori ale dispozitivului real, avansează modelul, calculează reziduul și predicția și le publică pe dispozitivul geamăn:

```python
import time, json, math, requests, paho.mqtt.client as mqtt
URL, DEV_REAL, TOKEN_DT = "http://localhost:8080", "ID-BOILER-REAL", "TOKEN-BOILER-DT"
C, R, R_INC, PRAG = 1450.0, 1.25, 4.7, 1.5          # din pasul 4; PRAG = 3·sigma reziduu [K]
tok = requests.post(f"{URL}/api/auth/login", json={"username": "tenant@thingsboard.org",
                                                  "password": "tenant"}).json()["token"]
H = {"X-Authorization": f"Bearer {tok}"}
cli = mqtt.Client(mqtt.CallbackAPIVersion.VERSION2); cli.username_pw_set(TOKEN_DT)
cli.connect("localhost", 1883); cli.loop_start()

def ultimele():
    r = requests.get(f"{URL}/api/plugins/telemetry/DEVICE/{DEV_REAL}/values/timeseries",
                     headers=H, params={"keys": "T,Ta,U,h"}).json()
    return {k: float(v[0]["value"]) for k, v in r.items()}

m = ultimele(); Tm = m["T"]; t_ant = time.time(); anomalie_n = 0
while True:
    time.sleep(5)
    m = ultimele(); now = time.time(); dt = now - t_ant; t_ant = now
    P = m["h"] * m["U"] ** 2 / R_INC
    Tm += dt / C * (P - (Tm - m["Ta"]) / R)          # modelul avansează cu intrările reale
    rez = m["T"] - Tm
    anomalie_n = anomalie_n + 1 if abs(rez) > PRAG else 0
    Tinf = m["Ta"] + R * P                            # temperatura de regim pentru starea actuală
    T_tinta = 45.0                                    # timpul până la 45 °C dacă se încălzește acum
    Tinf_on = m["Ta"] + R * m["U"] ** 2 / R_INC
    t45 = (R * C * math.log((Tinf_on - m["T"]) / (Tinf_on - T_tinta)) / 60
           if m["T"] < T_tinta < Tinf_on else None)
    out = {"T_model": round(Tm, 2), "reziduu": round(rez, 2), "P_est": round(P, 1),
           "T_regim": round(Tinf, 1), "anomalie": anomalie_n >= 6}  # 30 s peste prag
    if t45 is not None: out["min_pana_45C"] = round(t45, 1)
    if anomalie_n == 0 and abs(rez) < 0.3: Tm = 0.9 * Tm + 0.1 * m["T"]   # corecție lentă a stării
    cli.publish("v1/devices/me/telemetry", json.dumps(out)); print(out)
```

Pe panoul de bord, pe același grafic: `T` (real) și `T_model` (geamăn); separat: `reziduu`, `min_pana_45C` și un indicator pentru `anomalie`. În profilul dispozitivului „Boiler-DT” definiți alarma `anomalie == true`.

**Pasul 6 — Validare și test de anomalie.** (a) Porniți încălzirea și urmăriți 10 minute; reziduul trebuie să rămână sub prag. (b) Scoateți capacul recipientului (pierderi mai mari) sau adăugați 50 mL de apă rece; observați creșterea reziduului și apariția alarmei. (c) Notați timpul până la detecție.

**Pasul 7 — Utilizarea geamănului pentru comandă.** Adăugați în `twin.py` un termostat bazat pe model: încălzitorul se oprește când temperatura prezisă peste 2 minute (inclusiv inerția încălzitorului) depășește consemnul de 45 °C și se pornește sub 43 °C; comanda se trimite prin RPC către dispozitivul real (`POST /api/rpc/oneway/{deviceId}` cu `{"method": "setIncalzire", "params": true}`). Comparați supracreșterea temperaturii cu cea a unui termostat simplu cu histerezis.

### Prelucrarea rezultatelor

1. Raportați C, R, τ și T∞ (la 30,6 W) și comparați C cu valoarea teoretică.
2. Calculați RMSE pe datele de identificare și pe un set nou de validare (altă încălzire); un model bun are RMSE apropiat pe ambele.
3. Determinați abaterea standard a reziduului în funcționare normală și justificați pragul de anomalie ales.
4. Calculați energia consumată pentru menținerea apei la 45 °C timp de 1 oră (din model: P\_med = (45 − T\_a)/R) și comparați cu valoarea măsurată.

### Întrebări de verificare

1. Prin ce se deosebește un geamăn digital de un model de simulare și de un sistem SCADA de monitorizare?
2. Ce semnificație fizică au parametrii C, R și τ și cum influențează izolarea termică fiecare parametru?
3. De ce identificarea folosește atât faza de încălzire, cât și faza de răcire? Ce s-ar întâmpla doar cu una dintre ele?
4. De ce modelul rulat „in buclă deschisă” se abate în timp de măsurători și ce rol are corecția lentă a stării din `twin.py`? (Legătura cu filtrul Kalman.)
5. Ce limitări are modelul de ordinul 1 (stratificarea apei, inerția încălzitorului, variația lui R cu temperatura)?
6. Ce tipuri de defecte ale unui boiler industrial s-ar putea detecta cu aceeași metodă a reziduurilor?
7. De ce protecția la supratemperatură trebuie implementată local, pe nod, și nu doar în geamănul digital?
8. Cum s-ar extinde platforma pentru un sistem real: boiler electric + panouri fotovoltaice + tarif orar (optimizarea momentului încălzirii)?

### Model de referat

**Informatică aplicată — Referat Lucrarea 7** — Student: ………… Grupa: …… Data: ………

**1. Scopul lucrării.**

**2. Arhitectura geamănului digital.** Schema activ → nod → platformă → model → comandă, cu dispozitivele ThingsBoard, cheile de telemetrie și metodele RPC.

**3. Identificarea parametrilor.**

| Parametru | Valoare identificată | Valoare teoretică / așteptată | Observații |
| --- | --- | --- | --- |
| C \[J/K\] |  | ≈ 1256 (doar apa) |  |
| R \[K/W\] |  | – |  |
| τ = RC \[min\] |  | – |  |
| T∞ la 30,6 W \[°C\] |  | – |  |
| RMSE identificare \[K\] |  | – |  |
| RMSE validare \[K\] |  | – |  |

Graficul `identificare.png`.

**4. Funcționarea în timp real.** Captură a panoului de bord (T real și T\_model suprapuse, reziduu, predicție).

**5. Testul de anomalie.**

| Perturbație | Momentul aplicării | Reziduu maxim \[K\] | Momentul alarmei | Timp de detecție \[s\] |
| --- | --- | --- | --- | --- |
|  |  |  |  |  |

**6. Comanda bazată pe model.**

| Strategie | Supracreștere peste 45 °C \[K\] | Număr de comutări / 30 min | Energie consumată / 30 min \[Wh\] |
| --- | --- | --- | --- |
| Termostat cu histerezis |  |  |  |
| Termostat cu predicție (DT) |  |  |  |

**7. Răspunsuri la întrebări** (minimum 4).

**8. Concluzii.** Validitatea modelului, utilitatea geamănului digital, propuneri de extindere.
