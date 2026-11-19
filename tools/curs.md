# Informatică aplicată – Note de curs

Program de studii: Energetică industrială · Anul II, sem. 3 · Nov 19, 2026 · @Gabi

## Introducere

Notele acoperă cele 14 cursuri (28 ore) din fișa disciplinei ME2116a, de la algoritmi și limbaje de programare până la sisteme embedded, virtualizare și aplicații IoT pentru sisteme energetice.

| Element | Detalii |
| --- | --- |
| Disciplina | Informatică aplicată (ME2116a), DF/DO |
| Program | Energetică Industrială, Licență, anul II, semestrul 3 |
| Ore | 2 C + 1 L pe săptămână; 28 C + 14 L pe semestru; 4 credite |
| Evaluare | Colocviu (C) |
| Titular | Conf. univ. dr. Prodan Gabriel |

**Obiectivul general.** Studentul analizează cerințele unei probleme, alege metoda de rezolvare (numerică, dacă e cazul), descrie algoritmul în pseudocod, îl implementează în cod sursă, gestionează un proiect software, achiziționează date și prelucrează și interpretează date experimentale.

**Structura fiecărui curs.** Obiective → Rezultatele învățării (cunoștințe, aptitudini, responsabilitate și autonomie) → Conținut → Exerciții și probleme rezolvate → Temă de casă. Exemplele sunt alese din domeniul energetic: consumuri, randamente, puteri, temperaturi, curbe de sarcină.

**Software recomandat (gratuit).** Code::Blocks (MinGW), JDK 21 + VS Code, Python 3.12 (NumPy, Matplotlib, pandas), LibreOffice Calc / Excel, GNU Octave, SciDAVis, Arduino IDE 2, Raspberry Pi Pico SDK + VS Code, Thonny (MicroPython), Docker Desktop, ThingsBoard CE.

## Cursul 1. Sisteme de calcul. Sisteme de numerație. Algoritmi. Pseudocod. Limbaje de programare

### Obiective

- Descrierea arhitecturii unui sistem de calcul (modelul von Neumann) și a rolului fiecărei componente.
- Înțelegerea reprezentării informației în sistemele binar, octal și hexazecimal.
- Definirea noțiunii de algoritm și a proprietăților sale; descrierea algoritmilor în pseudocod și prin scheme logice.
- Clasificarea limbajelor de programare și a modului de execuție (compilare, interpretare).

### Rezultatele învățării

- **Cunoștințe:** studentul identifică componentele hardware și software ale unui sistem de calcul și explică diferența dintre pseudocod și un limbaj de programare.
- **Aptitudini:** convertește numere între bazele 2, 8, 10, 16; scrie pseudocodul pentru probleme simple de calcul ingineresc.
- **Responsabilitate și autonomie:** formulează independent pașii de rezolvare ai unei probleme tehnice înainte de a scrie cod.

### Conținut

#### 1.1 Structura unui sistem de calcul

Un sistem de calcul prelucrează date conform unui program memorat. Modelul von Neumann are cinci componente:

- **Unitatea centrală de prelucrare (CPU)** — unitatea aritmetic-logică (UAL), unitatea de comandă și registrele.
- **Memoria internă** — RAM (volatilă, date și programe în execuție) și ROM/Flash (firmware).
- **Memoria externă** — SSD, HDD, carduri SD.
- **Dispozitive de intrare/ieșire** — tastatură, display, convertoare A/D și D/A, interfețe seriale.
- **Magistralele** — de date, de adrese și de control.

Ciclul instrucțiunii: *fetch* (aducerea instrucțiunii din memorie) → *decode* (decodificare) → *execute* (execuție) → *write-back* (scrierea rezultatului). Un microcontroler (Arduino, RP2040) integrează CPU, memorie și periferice pe un singur cip; un calculator personal le are separate.

Software-ul se împarte în: software de sistem (sistem de operare, drivere), software de dezvoltare (compilatoare, interpretoare, IDE) și software de aplicație (SCADA, foi de calcul, simulatoare).

#### 1.2 Sisteme de numerație

Într-un sistem pozițional cu baza b, un număr cu cifrele d se scrie:

```latex
N = d_{n-1} b^{n-1} + \dots + d_1 b^1 + d_0 b^0 + d_{-1} b^{-1} + \dots
```

| Baza | Cifre | Utilizare |
| --- | --- | --- |
| 2 (binar) | 0, 1 | reprezentarea internă a datelor, registre |
| 8 (octal) | 0–7 | permisiuni de fișiere Linux |
| 10 (zecimal) | 0–9 | calcul uman |
| 16 (hexazecimal) | 0–9, A–F | adrese de memorie, registre I2C, culori |

**Conversia zecimal → bază b:** partea întreagă se împarte succesiv la b, iar resturile citite de jos în sus dau cifrele. Partea fracționară se înmulțește succesiv cu b, iar părțile întregi citite de sus în jos dau cifrele.

**Conversia binar ↔ hexazecimal:** fiecare grup de 4 biți corespunde unei cifre hexa (binar ↔ octal: grupuri de 3 biți).

**Numere cu semn.** Se folosește complementul față de 2: pentru −x pe n biți se inversează biții lui x și se adună 1. Pe 8 biți domeniul este −128 … +127.

**Numere reale.** Standardul IEEE 754: simpla precizie (float, 32 biți: 1 semn, 8 exponent, 23 mantisă, \~7 cifre semnificative) și dubla precizie (double, 64 biți, \~15 cifre).

**Unități de măsură:** 1 octet (byte) = 8 biți; 1 KiB = 1024 B; 1 kB = 1000 B.

#### 1.3 Algoritmi

Un algoritm este o succesiune finită de operații, bine definite, care transformă datele de intrare în date de ieșire. Proprietăți: **generalitate** (rezolvă o clasă de probleme), **finitudine** (se termină după un număr finit de pași), **claritate/determinism** (fiecare pas e unic interpretabil), **eficiență**.

Structurile fundamentale (teorema Böhm–Jacopini) sunt: **secvența**, **decizia** (dacă…atunci…altfel) și **repetiția** (cât timp, repetă…până când, pentru). Orice algoritm se poate scrie folosind doar aceste trei structuri.

#### 1.4 Pseudocod și scheme logice

Pseudocodul descrie algoritmul în limbaj natural structurat, independent de limbajul de programare. Convenții folosite în acest curs:

```
citeste a, b
scrie expresie
x ← expresie                    (atribuire)
daca conditie atunci ... altfel ... sfarsit daca
cat timp conditie executa ... sfarsit cat timp
pentru i ← 1, n executa ... sfarsit pentru
```

Schema logică folosește simboluri grafice: oval (start/stop), paralelogram (intrare/ieșire), dreptunghi (calcul), romb (decizie), săgeți (flux).

#### 1.5 Limbaje de programare

| Nivel | Exemple | Execuție |
| --- | --- | --- |
| Cod mașină / asamblare | ARM Thumb, AVR asm | direct pe procesor |
| Nivel înalt compilat | C, C++, Fortran | compilare → executabil nativ |
| Compilat în bytecode | Java, C# | mașină virtuală (JVM, .NET) |
| Interpretat | Python, MATLAB/Octave, JavaScript | interpretor linie cu linie |
| Grafic | LabVIEW, Simulink, Node-RED | diagrame de flux de date |

Etapele dezvoltării unui program: analiza problemei → proiectarea algoritmului → codificarea → compilarea/editarea legăturilor → testarea și depanarea → documentarea și întreținerea.

### Exerciții și probleme rezolvate

**Problema 1.1.** Convertiți 2026 din baza 10 în bazele 2 și 16.

*Rezolvare.* Împărțiri succesive la 2: 2026/2 = 1013 r 0; 1013 r 1 → 506; 506 r 0 → 253; 253 r 1 → 126; 126 r 0 → 63; 63 r 1 → 31; 31 r 1 → 15; 15 r 1 → 7; 7 r 1 → 3; 3 r 1 → 1; 1 r 1 → 0. Citind resturile de jos în sus: 2026₁₀ = 11111101010₂. Grupe de 4 biți de la dreapta: 0111 1110 1010 = 7EA₁₆. Verificare: 7·256 + 14·16 + 10 = 1792 + 224 + 10 = 2026.

**Problema 1.2.** Convertiți 0,625 în binar.

*Rezolvare.* 0,625·2 = 1,25 → 1; 0,25·2 = 0,5 → 0; 0,5·2 = 1,0 → 1. Rezultat: 0,101₂ (= 1/2 + 1/8).

**Problema 1.3.** Reprezentați −35 pe 8 biți în complement față de 2.

*Rezolvare.* 35 = 00100011₂. Inversare: 11011100. +1: 11011101₂ = DD₁₆.

**Problema 1.4.** Un senzor de temperatură conectat la un ADC pe 10 biți (referință 5 V) returnează 0x0CC. Ce tensiune s-a măsurat?

*Rezolvare.* 0x0CC = 12·16 + 12 = 204. U = 204 · 5 / 1023 ≈ 0,997 V. Pentru un LM35 (10 mV/°C) rezultă circa 99,7 °C.

**Problema 1.5.** Scrieți pseudocodul care citește consumurile lunare de energie (kWh) pe un an și afișează consumul total, media și luna cu consum maxim.

```
citeste E[1..12]
total ← 0; lunaMax ← 1
pentru i ← 1, 12 executa
    total ← total + E[i]
    daca E[i] > E[lunaMax] atunci lunaMax ← i sfarsit daca
sfarsit pentru
medie ← total / 12
scrie total, medie, lunaMax
```

**Problema 1.6.** Scrieți pseudocodul pentru rezolvarea ecuației de gradul II a·x² + b·x + c = 0, cu tratarea tuturor cazurilor.

```
citeste a, b, c
daca a = 0 atunci
    daca b = 0 atunci
        daca c = 0 atunci scrie "infinitate de solutii"
        altfel scrie "fara solutie" sfarsit daca
    altfel scrie "x =", -c/b
    sfarsit daca
altfel
    d ← b*b - 4*a*c
    daca d >= 0 atunci
        scrie (-b + sqrt(d))/(2a), (-b - sqrt(d))/(2a)
    altfel
        scrie "radacini complexe:", -b/(2a), "± i·", sqrt(-d)/(2a)
    sfarsit daca
sfarsit daca
```

### Temă de casă

1. Convertiți în bazele 2, 8 și 16 numerele: 255, 1000, 4095, 13,375.
2. Convertiți în baza 10: 1011 0110₂, 0x3FF, 0o755, 0xA5,8.
3. Reprezentați pe 16 biți, în complement față de 2: −1, −1000, +32767.
4. Un contor de energie transmite valoarea 0x0001E240 Wh. Exprimați consumul în kWh.
5. Scrieți pseudocodul și schema logică pentru calculul randamentului η = P\_util / P\_absorbit al unui motor, cu verificarea că 0 < η ≤ 1 și afișarea unui mesaj de eroare altfel.
6. Scrieți pseudocodul pentru determinarea factorului de putere cos φ dintr-un set de n măsurători (P, S) și numărarea măsurătorilor cu cos φ < 0,92 (penalizabile).
7. Comparați, într-un tabel, C, Java și Python după: mod de execuție, tipizare, viteză, domenii de utilizare în energetică.

## Cursul 2. Dezvoltarea algoritmilor. Metode numerice. Exemple

### Obiective

- Prezentarea etapelor de proiectare, verificare și evaluare a complexității unui algoritm.
- Introducerea erorilor numerice (de rotunjire, de trunchiere) și a criteriilor de oprire.
- Prezentarea metodelor numerice de bază: rezolvarea ecuațiilor neliniare, integrarea numerică, regresia liniară, integrarea ecuațiilor diferențiale (Euler).

### Rezultatele învățării

- **Cunoștințe:** studentul explică principiul metodelor bisecției, Newton–Raphson, trapezelor, Simpson, celor mai mici pătrate și Euler.
- **Aptitudini:** alege metoda numerică potrivită unei probleme energetice și o descrie în pseudocod; estimează eroarea rezultatului.
- **Responsabilitate și autonomie:** verifică critic rezultatele numerice (convergență, ordin de mărime, unități de măsură).

### Conținut

#### 2.1 Proiectarea algoritmilor

Pași recomandați: (1) definirea datelor de intrare, ieșire și a restricțiilor; (2) alegerea modelului matematic; (3) rafinarea succesivă (*top-down*) — problema se descompune în subprobleme; (4) scrierea pseudocodului; (5) verificarea manuală pe un caz cu rezultat cunoscut (*trace table*); (6) implementarea și testarea pe cazuri limită.

**Complexitatea** se exprimă în notația O: O(1) constant, O(log n) căutare binară, O(n) parcurgere, O(n log n) sortare eficientă, O(n²) sortare prin comparații simple. Pentru 10⁶ măsurători, un algoritm O(n²) face \~10¹² operații, inacceptabil; unul O(n log n) face \~2·10⁷.

#### 2.2 Erori numerice

- **Eroarea absolută:** e = |x − x\*|; **eroarea relativă:** ε = e / |x|.
- **Eroarea de rotunjire** apare din reprezentarea finită (IEEE 754). Exemplu: 0,1 + 0,2 ≠ 0,3 exact în virgulă mobilă.
- **Eroarea de trunchiere** apare când un proces infinit (serie, limită) e oprit după un număr finit de pași.
- **Criterii de oprire:** |xₖ₊₁ − xₖ| < tol, |f(xₖ)| < tol sau număr maxim de iterații.

#### 2.3 Rezolvarea ecuațiilor neliniare f(x) = 0

**Metoda bisecției.** Dacă f este continuă pe \[a, b\] și f(a)·f(b) < 0, există o rădăcină. Se ia c = (a+b)/2 și se păstrează jumătatea în care f își schimbă semnul. După n pași intervalul are lungimea (b−a)/2ⁿ. Converge sigur, dar lent (liniar).

```
functie bisectie(f, a, b, tol)
    cat timp (b - a)/2 > tol executa
        c ← (a + b)/2
        daca f(a)*f(c) <= 0 atunci b ← c altfel a ← c sfarsit daca
    sfarsit cat timp
    returneaza (a + b)/2
```

**Metoda Newton–Raphson.** Pornind de la x₀, iterația folosește tangenta:

```latex
x_{k+1} = x_k - \frac{f(x_k)}{f'(x_k)}
```

Converge pătratic lângă rădăcină, dar poate diverge dacă f′(x) ≈ 0 sau x₀ e ales prost.

#### 2.4 Integrarea numerică

Energia consumată este integrala puterii în timp. Pentru măsurători la pas constant h:

**Metoda trapezelor** (eroare O(h²)):

```latex
I \approx \frac{h}{2}\left[f_0 + 2(f_1 + f_2 + \dots + f_{n-1}) + f_n\right]
```

**Metoda Simpson 1/3** (n par, eroare O(h⁴)):

```latex
I \approx \frac{h}{3}\left[f_0 + 4(f_1 + f_3 + \dots) + 2(f_2 + f_4 + \dots) + f_n\right]
```

#### 2.5 Regresia liniară (metoda celor mai mici pătrate)

Pentru n perechi (xᵢ, yᵢ) se caută dreapta y = a·x + b care minimizează suma pătratelor abaterilor:

```latex
a = \frac{n\sum x_i y_i - \sum x_i \sum y_i}{n\sum x_i^2 - \left(\sum x_i\right)^2}, \qquad b = \frac{\sum y_i - a\sum x_i}{n}
```

Calitatea ajustării se măsoară cu coeficientul de determinare R² (1 = ajustare perfectă). Aplicații: calibrarea senzorilor, caracteristica consum–producție, dependența consum–temperatură exterioară (grade-zile).

#### 2.6 Ecuații diferențiale — metoda Euler

Pentru dy/dt = f(t, y), y(t₀) = y₀, cu pasul h:

```latex
y_{k+1} = y_k + h\, f(t_k, y_k)
```

Metoda e de ordinul 1; pentru precizie mai bună se folosește Runge–Kutta de ordinul 4 (RK4). Exemplu tipic: încălzirea unui corp (boiler, înfășurare de motor) cu constanta de timp τ.

### Exerciții și probleme rezolvate

**Problema 2.1 (bisecție).** Găsiți rădăcina lui f(x) = x³ − x − 2 pe \[1, 2\] cu toleranța 0,05.

*Rezolvare.* f(1) = −2, f(2) = 4, deci există rădăcină.

| k | a | b | c | f(c) |
| --- | --- | --- | --- | --- |
| 1 | 1 | 2 | 1,5 | −0,125 |
| 2 | 1,5 | 2 | 1,75 | 1,609 |
| 3 | 1,5 | 1,75 | 1,625 | 0,666 |
| 4 | 1,5 | 1,625 | 1,5625 | 0,252 |
| 5 | 1,5 | 1,5625 | 1,53125 | 0,059 |

După pasul 5, intervalul \[1,5; 1,53125\] are semilungimea 0,0156 < 0,05; x ≈ 1,516 (valoarea exactă 1,5214).

**Problema 2.2 (Newton).** Aceeași ecuație, x₀ = 1,5. f′(x) = 3x² − 1.

*Rezolvare.* x₁ = 1,5 − (−0,125)/5,75 = 1,52174. f(x₁) = 0,00213, f′(x₁) = 5,9470; x₂ = 1,52174 − 0,000358 = 1,52138. În două iterații s-au obținut 5 cifre corecte, față de 5 iterații și 2 cifre la bisecție.

**Problema 2.3 (energie din curba de sarcină).** Puterea absorbită de un consumator, măsurată din oră în oră între 8:00 și 12:00, este: 20, 35, 42, 38, 30 kW. Calculați energia consumată.

*Rezolvare.* h = 1 h, n = 4. Trapeze: W = 0,5·\[20 + 2·(35 + 42 + 38) + 30\] = 0,5·280 = 140 kWh. Simpson: W = (1/3)·\[20 + 4·(35 + 38) + 2·42 + 30\] = (1/3)·426 = 142 kWh.

**Problema 2.4 (regresie, calibrare senzor).** Un traductor de temperatură dă tensiunile: 0 °C → 0,50 V; 25 °C → 0,75 V; 50 °C → 1,01 V; 75 °C → 1,24 V; 100 °C → 1,50 V. Determinați caracteristica U = a·T + b.

*Rezolvare.* n = 5; Σx = 250; Σy = 5,00; Σx² = 18750; Σxy = 0 + 18,75 + 50,5 + 93 + 150 = 312,25. a = (5·312,25 − 250·5)/(5·18750 − 250²) = (1561,25 − 1250)/(93750 − 62500) = 311,25/31250 = 0,00996 V/°C. b = (5 − 0,00996·250)/5 = (5 − 2,49)/5 = 0,502 V. Caracteristica: U = 0,00996·T + 0,502; inversa: T = (U − 0,502)/0,00996.

**Problema 2.5 (Euler, încălzire boiler).** Temperatura apei într-un boiler respectă dT/dt = (T∞ − T)/τ, cu T∞ = 60 °C, τ = 2 h, T(0) = 15 °C. Estimați T(1 h) cu h = 0,25 h.

*Rezolvare.* Tₖ₊₁ = Tₖ + 0,25·(60 − Tₖ)/2 = Tₖ + 0,125·(60 − Tₖ). T₁ = 15 + 5,625 = 20,63; T₂ = 20,63 + 4,92 = 25,55; T₃ = 25,55 + 4,31 = 29,86; T₄ = 29,86 + 3,77 = 33,63 °C. Soluția exactă: T(1) = 60 − 45·e^(−0,5) = 32,71 °C. Eroarea Euler: 0,92 °C (2,8 %); scade la jumătate dacă h se înjumătățește.

### Temă de casă

1. Rezolvați cos x = x prin bisecție (pe \[0, 1\], tol = 0,01) și prin Newton (x₀ = 0,5, 3 iterații). Comparați numărul de iterații.
2. Scrieți pseudocodul metodei Newton cu criteriu de oprire dublu (toleranță și număr maxim de iterații) și cu protecție la f′(x) = 0.
3. Puterea produsă de un panou fotovoltaic, la fiecare 2 h între 6:00 și 18:00, este: 0; 120; 280; 340; 270; 110; 0 W. Calculați energia zilnică prin trapeze și Simpson.
4. Consumul lunar de gaz al unei clădiri în funcție de temperatura medie exterioară: (−2 °C; 2100 m³), (2 °C; 1750 m³), (6 °C; 1400 m³), (10 °C; 1000 m³), (14 °C; 700 m³). Determinați dreapta de regresie și estimați consumul la 0 °C.
5. Un motor se încălzește după dθ/dt = (θ∞ − θ)/τ cu θ∞ = 80 K supratemperatură și τ = 40 min. Calculați cu Euler (h = 10 min) supratemperatura la 60 min și comparați cu soluția exactă.
6. Explicați de ce suma 0,1 adunată de 10 ori în float nu dă exact 1,0 și cum se compară corect două numere reale într-un program.

## Cursul 3. Limbajul C. Aplicații consolă, aplicații Win32

### Obiective

- Prezentarea structurii unui program C, a procesului de compilare și a tipurilor de date.
- Utilizarea operatorilor, a instrucțiunilor de control, a funcțiilor, tablourilor, pointerilor și structurilor.
- Lucrul cu fișiere text pentru salvarea și citirea datelor de măsură.
- Introducerea programării Win32 bazate pe evenimente (fereastră, bucla de mesaje, procedura ferestrei).

### Rezultatele învățării

- **Cunoștințe:** studentul descrie etapele preprocesare → compilare → asamblare → link-editare și diferența dintre o aplicație consolă și una Win32.
- **Aptitudini:** implementează în C algoritmi de calcul ingineresc cu funcții, tablouri și fișiere; construiește o fereastră Win32 minimală.
- **Responsabilitate și autonomie:** depanează independent erorile de compilare și de execuție folosind mesajele compilatorului și debuggerul.

### Conținut

#### 3.1 Structura unui program C și compilarea

```c
#include <stdio.h>          /* directivă de preprocesare */
#define TENSIUNE 230.0      /* constantă simbolică */

int main(void)              /* punctul de intrare */
{
    double I = 4.5;         /* declarație + inițializare */
    double P = TENSIUNE * I;
    printf("P = %.1f W\n", P);
    return 0;               /* cod de ieșire către sistemul de operare */
}
```

Etape (gcc): `gcc -E` preprocesare (.i) → `gcc -S` compilare (.s) → `gcc -c` asamblare (.o) → link-editare cu bibliotecile → executabil (.exe). În Code::Blocks toate etapele se fac cu *Build* (F9 = Build and run).

#### 3.2 Tipuri de date, variabile, operatori

| Tip | Dimensiune tipică | Domeniu / precizie | Specificator printf/scanf |
| --- | --- | --- | --- |
| char | 1 B | −128 … 127 | %c, %d |
| int | 4 B | −2³10⁹ … 2³10⁹ | %d |
| unsigned int | 4 B | 0 … 4·10⁹ | %u |
| long long | 8 B | ±9·10¹⁸ | %lld |
| float | 4 B | \~7 cifre | %f |
| double | 8 B | \~15 cifre | %f (printf), %lf (scanf) |

Operatori: aritmetici (+ − \* / %), relaționali (== != < > <= >=), logici (&& || !), pe biți (& | ^ \~ << >>), de atribuire (= += −= …), increment (++ −−), condițional (?:). Atenție: 7/2 = 3 (împărțire întreagă), 7.0/2 = 3.5.

#### 3.3 Instrucțiuni de control

```c
if (T > 90.0) printf("Supratemperatura!\n");
else if (T > 70.0) printf("Avertizare\n");
else printf("Normal\n");

switch (regim) { case 1: puts("zi"); break; case 2: puts("noapte"); break; default: puts("?"); }

for (i = 0; i < n; i++) suma += P[i];
while (eroare > tol) { /* iteratie */ }
do { scanf("%d", &opt); } while (opt < 1 || opt > 4);
```

#### 3.4 Funcții, tablouri, pointeri, structuri

```c
#include <math.h>

double putere_activa(double U, double I, double cosfi) { return U * I * cosfi; }

void statistica(const double x[], int n, double *medie, double *max)
{
    double s = 0; *max = x[0];
    for (int i = 0; i < n; i++) { s += x[i]; if (x[i] > *max) *max = x[i]; }
    *medie = s / n;
}

typedef struct { char nume[20]; double Pn; double eta; } Motor;
```

Tablourile se transmit funcțiilor prin adresă; pentru a returna mai multe valori se folosesc pointeri (`double *medie`). Operatorul `&` dă adresa, `*` dă valoarea de la adresă. Memoria dinamică: `malloc`, `free` (stdlib.h).

#### 3.5 Fișiere text

```c
FILE *f = fopen("masuratori.csv", "w");
if (f == NULL) { perror("fopen"); return 1; }
fprintf(f, "t_s;U_V;I_A\n");
for (int k = 0; k < n; k++) fprintf(f, "%d;%.2f;%.3f\n", k, U[k], I[k]);
fclose(f);
```

Moduri: "r" citire, "w" scriere (suprascrie), "a" adăugare. Citirea: `fscanf(f, "%d;%lf;%lf", &t, &u, &i)` returnează numărul de câmpuri citite (bucla se oprește când nu mai returnează 3).

#### 3.6 Aplicații Win32

O aplicație Win32 este bazată pe evenimente: sistemul de operare trimite mesaje (WM\_CREATE, WM\_COMMAND, WM\_PAINT, WM\_DESTROY), iar programul le tratează în procedura ferestrei. În Code::Blocks: *File → New → Project → Win32 GUI project*.

```c
#include <windows.h>
#include <stdio.h>
#include <stdlib.h>
#define ID_CALC 1
HWND hU, hI, hRez;

LRESULT CALLBACK WndProc(HWND hwnd, UINT msg, WPARAM wp, LPARAM lp)
{
    char bU[32], bI[32], bR[64];
    switch (msg) {
    case WM_CREATE:
        CreateWindow("STATIC", "U [V]:", WS_CHILD|WS_VISIBLE, 10,10,60,20, hwnd, 0,0,0);
        hU = CreateWindow("EDIT", "230", WS_CHILD|WS_VISIBLE|WS_BORDER, 80,10,100,20, hwnd,0,0,0);
        CreateWindow("STATIC", "I [A]:", WS_CHILD|WS_VISIBLE, 10,40,60,20, hwnd, 0,0,0);
        hI = CreateWindow("EDIT", "5", WS_CHILD|WS_VISIBLE|WS_BORDER, 80,40,100,20, hwnd,0,0,0);
        CreateWindow("BUTTON", "Calculeaza P", WS_CHILD|WS_VISIBLE, 10,70,170,25, hwnd,(HMENU)ID_CALC,0,0);
        hRez = CreateWindow("STATIC", "", WS_CHILD|WS_VISIBLE, 10,105,200,20, hwnd,0,0,0);
        break;
    case WM_COMMAND:
        if (LOWORD(wp) == ID_CALC) {
            GetWindowText(hU, bU, 32); GetWindowText(hI, bI, 32);
            sprintf(bR, "P = %.1f W", atof(bU) * atof(bI));
            SetWindowText(hRez, bR);
        }
        break;
    case WM_DESTROY: PostQuitMessage(0); break;
    default: return DefWindowProc(hwnd, msg, wp, lp);
    }
    return 0;
}

int WINAPI WinMain(HINSTANCE hInst, HINSTANCE hPrev, LPSTR cmd, int show)
{
    WNDCLASS wc = {0};
    wc.lpfnWndProc = WndProc; wc.hInstance = hInst;
    wc.lpszClassName = "Calc"; wc.hbrBackground = (HBRUSH)(COLOR_WINDOW + 1);
    wc.hCursor = LoadCursor(NULL, IDC_ARROW);
    RegisterClass(&wc);
    HWND h = CreateWindow("Calc", "Calcul putere", WS_OVERLAPPEDWINDOW,
                          100, 100, 240, 180, NULL, NULL, hInst, NULL);
    ShowWindow(h, show);
    MSG m;
    while (GetMessage(&m, NULL, 0, 0)) { TranslateMessage(&m); DispatchMessage(&m); }
    return (int)m.wParam;
}
```

Pașii oricărei aplicații Win32: înregistrarea clasei ferestrei → crearea ferestrei → afișarea → bucla de mesaje → tratarea mesajelor în WndProc.

### Exerciții și probleme rezolvate

**Problema 3.1.** Program consolă care citește tensiunea de linie, curentul și cos φ ale unui consumator trifazat și afișează P, Q, S.

```c
#include <stdio.h>
#include <math.h>
int main(void)
{
    double U, I, cf;
    printf("U linie [V], I [A], cos fi: ");
    if (scanf("%lf %lf %lf", &U, &I, &cf) != 3 || cf < 0 || cf > 1) {
        printf("Date invalide\n"); return 1;
    }
    double S = sqrt(3.0) * U * I;
    double P = S * cf, Q = S * sin(acos(cf));
    printf("S = %.2f kVA\nP = %.2f kW\nQ = %.2f kvar\n", S/1e3, P/1e3, Q/1e3);
    return 0;
}
```

Pentru U = 400 V, I = 50 A, cos φ = 0,85: S = 34,64 kVA, P = 29,44 kW, Q = 18,25 kvar.

**Problema 3.2.** Funcție care calculează energia prin metoda trapezelor dintr-un tablou de puteri.

```c
double energie_trapez(const double P[], int n, double h)
{
    double s = 0.5 * (P[0] + P[n-1]);
    for (int k = 1; k < n - 1; k++) s += P[k];
    return s * h;
}
/* P = {20,35,42,38,30} kW, h = 1 h -> 140 kWh (vezi Problema 2.3) */
```

**Problema 3.3.** Program care citește din fișierul `temp.txt` valori de temperatură (câte una pe linie) și afișează numărul de valori, media, minimul și maximul.

```c
#include <stdio.h>
int main(void)
{
    FILE *f = fopen("temp.txt", "r");
    if (!f) { perror("temp.txt"); return 1; }
    double t, s = 0, mn = 1e9, mx = -1e9; int n = 0;
    while (fscanf(f, "%lf", &t) == 1) {
        s += t; n++;
        if (t < mn) mn = t;
        if (t > mx) mx = t;
    }
    fclose(f);
    if (n) printf("n=%d medie=%.2f min=%.2f max=%.2f\n", n, s/n, mn, mx);
    return 0;
}
```

**Problema 3.4.** Ce afișează secvența: `int a = 7, b = 2; double r = a / b; printf("%.2f", r);`?

*Rezolvare.* 3.00 — împărțirea se face între întregi înainte de conversia la double. Corect: `r = (double)a / b;` → 3.50.

### Temă de casă

1. Scrieți un program C care calculează căderea de tensiune ΔU = 2·ρ·L·I / S pe un cablu monofazat de cupru (ρ = 0,0175 Ω·mm²/m) și semnalează dacă ΔU > 3 % din 230 V.
2. Scrieți o funcție `int citeste_csv(const char *nume, double t[], double P[], int nmax)` care citește perechi timp;putere și returnează numărul de linii citite.
3. Definiți o structură `Transformator` (Sn, U1, U2, P0, Pk) și o funcție care calculează randamentul la încărcarea β și cos φ dați: η = β·Sn·cos φ / (β·Sn·cos φ + P0 + β²·Pk). Afișați η pentru β = 0,25; 0,5; 0,75; 1.
4. Implementați în C metoda bisecției pentru o funcție transmisă prin pointer: `double bisectie(double (*f)(double), double a, double b, double tol)`.
5. Extindeți aplicația Win32 din curs cu un al treilea câmp (cos φ) și afișați P, Q și S.
6. Explicați diferența dintre `scanf("%f", &x)` și `scanf("%lf", &x)` pentru o variabilă `double x`.

## Cursul 4. Limbajul Java

### Obiective

- Prezentarea platformei Java (JDK, JRE, JVM, bytecode) și a principiului „write once, run anywhere”.
- Introducerea programării orientate pe obiecte: clase, obiecte, încapsulare, moștenire, polimorfism, interfețe.
- Utilizarea colecțiilor, a excepțiilor și a fișierelor în Java.
- Construirea unei interfețe grafice simple (Swing).

### Rezultatele învățării

- **Cunoștințe:** studentul explică conceptele POO și diferențele dintre C (procedural, compilat nativ) și Java (obiectual, rulat pe JVM).
- **Aptitudini:** modelează echipamente energetice prin clase și ierarhii de clase; tratează erorile prin excepții.
- **Responsabilitate și autonomie:** organizează codul în pachete și clase reutilizabile, gata de întreținut în echipă.

### Conținut

#### 4.1 Platforma Java

Codul sursă `.java` este compilat de `javac` în *bytecode* (`.class`), executat de Mașina Virtuală Java (JVM) pe orice sistem de operare. JDK = instrumente de dezvoltare + JRE; JRE = JVM + biblioteci standard. Comenzi: `javac Main.java`, `java Main`. Din Java 11 se poate rula direct `java Main.java`.

```java
public class Main {
    public static void main(String[] args) {
        double U = 230, I = 4.5;
        System.out.printf("P = %.1f W%n", U * I);
    }
}
```

Tipuri primitive: byte, short, int, long, float, double, char (Unicode, 2 B), boolean. Restul sunt tipuri referință (obiecte), inclusiv `String` și tablourile. Memoria e eliberată automat de *garbage collector* (nu există `free`).

#### 4.2 Clase și obiecte

O clasă definește atribute (stare) și metode (comportament); un obiect este o instanță a clasei, creată cu `new`.

```java
public class Motor {
    private final String nume;      // încapsulare: acces doar prin metode
    private final double Pn;        // putere nominală [kW]
    private final double eta;       // randament [-]

    public Motor(String nume, double Pn, double eta) {   // constructor
        if (eta <= 0 || eta > 1) throw new IllegalArgumentException("eta invalid");
        this.nume = nume; this.Pn = Pn; this.eta = eta;
    }
    public double putereAbsorbita() { return Pn / eta; }
    public double energieAnuala(double ore) { return putereAbsorbita() * ore; } // kWh
    @Override public String toString() { return nume + " (" + Pn + " kW)"; }
}
```

#### 4.3 Moștenire, polimorfism, interfețe

```java
interface Consumator { double putere(); }          // contract

abstract class Echipament implements Consumator {
    protected String id;
    Echipament(String id) { this.id = id; }
}
class Rezistenta extends Echipament {
    double U, R;
    Rezistenta(String id, double U, double R) { super(id); this.U = U; this.R = R; }
    public double putere() { return U * U / R; }
}
class MotorAsincron extends Echipament {
    double U, I, cosfi;
    MotorAsincron(String id, double U, double I, double cosfi) {
        super(id); this.U = U; this.I = I; this.cosfi = cosfi;
    }
    public double putere() { return Math.sqrt(3) * U * I * cosfi; }
}
```

Polimorfism: o listă `List<Consumator>` poate conține orice obiect care implementează interfața, iar apelul `c.putere()` execută metoda clasei reale.

#### 4.4 Colecții, excepții, fișiere

- `ArrayList<Double>`, `HashMap<String, Double>` — colecții dinamice.
- Excepțiile se tratează cu `try { … } catch (IOException e) { … } finally { … }`; excepțiile *checked* (IOException) trebuie tratate sau declarate cu `throws`.
- Citirea unui fișier: `List<String> linii = Files.readAllLines(Path.of("date.csv"));`
- Stream-uri: `lista.stream().mapToDouble(Double::doubleValue).average()`.

#### 4.5 Interfață grafică Swing

```java
import javax.swing.*;
public class CalcGUI {
    public static void main(String[] a) {
        JFrame f = new JFrame("Calcul putere");
        JTextField tU = new JTextField("230", 6), tI = new JTextField("5", 6);
        JLabel rez = new JLabel(" ");
        JButton b = new JButton("Calculeaza");
        b.addActionListener(e -> {
            try {
                double P = Double.parseDouble(tU.getText()) * Double.parseDouble(tI.getText());
                rez.setText(String.format("P = %.1f W", P));
            } catch (NumberFormatException ex) { rez.setText("Valoare invalida"); }
        });
        JPanel p = new JPanel();
        p.add(new JLabel("U [V]")); p.add(tU); p.add(new JLabel("I [A]")); p.add(tI);
        p.add(b); p.add(rez);
        f.add(p); f.setSize(360, 120); f.setDefaultCloseOperation(JFrame.EXIT_ON_CLOSE);
        f.setVisible(true);
    }
}
```

Comparați cu varianta Win32 din Cursul 3: același model bazat pe evenimente, dar cu cod mai scurt și portabil.

### Exerciții și probleme rezolvate

**Problema 4.1.** Folosind clasele din 4.3, calculați puterea totală a unui atelier cu o rezistență de 230 V / 26,45 Ω și două motoare de 400 V, 15 A, cos φ = 0,82.

```java
import java.util.*;
public class Atelier {
    public static void main(String[] a) {
        List<Consumator> c = List.of(
            new Rezistenta("R1", 230, 26.45),
            new MotorAsincron("M1", 400, 15, 0.82),
            new MotorAsincron("M2", 400, 15, 0.82));
        double Ptot = 0;
        for (Consumator x : c) Ptot += x.putere();
        System.out.printf("P total = %.2f kW%n", Ptot / 1000);
    }
}
```

*Rezolvare numerică.* P\_R = 230²/26,45 = 2000 W; P\_M = √3·400·15·0,82 = 8521,6 W; total = 2000 + 2·8521,6 = 19,04 kW.

**Problema 4.2.** Citește fișierul `consum.csv` (lună;kWh) și afișează luna cu consum maxim, cu tratarea excepțiilor.

```java
import java.nio.file.*; import java.io.IOException; import java.util.*;
public class Consum {
    public static void main(String[] a) {
        Map<String, Double> m = new LinkedHashMap<>();
        try {
            for (String l : Files.readAllLines(Path.of("consum.csv"))) {
                String[] p = l.split(";");
                m.put(p[0], Double.parseDouble(p[1]));
            }
        } catch (IOException e) { System.err.println("Fisier lipsa: " + e.getMessage()); return; }
          catch (NumberFormatException e) { System.err.println("Valoare gresita"); return; }
        var max = Collections.max(m.entrySet(), Map.Entry.comparingByValue());
        System.out.println("Maxim: " + max.getKey() + " = " + max.getValue() + " kWh");
    }
}
```

**Problema 4.3.** Pentru `Motor m = new Motor("Pompă", 7.5, 0.9);` calculați energia absorbită în 4000 h/an și costul la 1,1 lei/kWh.

*Rezolvare.* P\_abs = 7,5/0,9 = 8,333 kW; W = 8,333·4000 = 33 333 kWh; cost = 36 667 lei/an. Înlocuirea cu un motor IE4 (η = 0,93) dă P\_abs = 8,065 kW, W = 32 258 kWh, economie 1075 kWh/an (≈ 1183 lei/an).

### Temă de casă

1. Creați clasa `PanouFotovoltaic` (Pmax, arie, coeficient de temperatură γ = −0,4 %/°C) cu metoda `putere(double G, double Tc)` = Pmax·(G/1000)·\[1 + γ·(Tc − 25)\]. Testați pentru G = 800 W/m² și Tc = 45 °C.
2. Adăugați în ierarhia din 4.3 clasa `Iluminat` (număr corpuri × putere unitară) și calculați puterea totală a unei hale cu 3 motoare, 2 rezistențe și 40 de corpuri LED de 36 W.
3. Scrieți un program Java care citește un CSV cu măsurători (timp;putere) și calculează energia prin metoda trapezelor.
4. Construiți o interfață Swing pentru calculul pierderilor într-un conductor (R = ρ·L/S, ΔP = R·I²), cu validarea datelor.
5. Explicați, cu un exemplu propriu, diferența dintre o clasă abstractă și o interfață.

## Cursul 5. Limbajul Python

### Obiective

- Prezentarea limbajului Python: sintaxă, tipuri de date dinamice, structuri de date (listă, tuplu, dicționar, mulțime).
- Utilizarea funcțiilor, modulelor, excepțiilor și fișierelor.
- Introducerea bibliotecilor științifice: NumPy (calcul vectorial), Matplotlib (grafice), pandas (date tabelare), SciPy (metode numerice).
- Gestionarea mediilor de lucru (pip, medii virtuale `venv`).

### Rezultatele învățării

- **Cunoștințe:** studentul descrie modul de execuție interpretat și ecosistemul de biblioteci Python pentru inginerie.
- **Aptitudini:** dezvoltă scripturi pentru prelucrarea, filtrarea și vizualizarea datelor experimentale; automatizează calcule repetitive și generarea de rapoarte.
- **Responsabilitate și autonomie:** alege biblioteca potrivită și documentează dependențele unui proiect (`requirements.txt`).

### Conținut

#### 5.1 Elemente de bază

Python este interpretat, cu tipizare dinamică și blocuri delimitate prin indentare (4 spații).

```python
U = 230.0                 # float
I = 4.5
nume = "Boiler"           # str
activ = True              # bool
P = U * I
print(f"{nume}: P = {P:.1f} W")

if P > 3000:
    print("Peste limita circuitului")
elif P > 2000:
    print("Aproape de limita")
else:
    print("OK")

for h in range(0, 24, 6):        # 0, 6, 12, 18
    print(h)
```

#### 5.2 Structuri de date

| Structură | Exemplu | Proprietăți |
| --- | --- | --- |
| list | `P = [20, 35, 42]` | ordonată, modificabilă |
| tuple | `punct = (230, 4.5)` | ordonat, nemodificabil |
| dict | `motor = {"Pn": 7.5, "eta": 0.9}` | perechi cheie–valoare |
| set | `{"L1", "L2", "L3"}` | elemente unice |

List comprehension: `Pkw = [p / 1000 for p in P_w if p > 0]`. Indexare și felii: `P[0]`, `P[-1]`, `P[1:3]`.

#### 5.3 Funcții, module, excepții, fișiere

```python
import math

def putere_trifazata(U, I, cosfi=0.85):
    """Returnează (P, Q, S) în W, var, VA."""
    S = math.sqrt(3) * U * I
    return S * cosfi, S * math.sin(math.acos(cosfi)), S

P, Q, S = putere_trifazata(400, 50)

try:
    with open("masuratori.csv", encoding="utf-8") as f:
        next(f)                                  # sare peste antet
        valori = [float(linie.split(";")[1]) for linie in f]
except FileNotFoundError:
    print("Fișierul lipsește")
except ValueError as e:
    print("Valoare invalidă:", e)
```

Blocul `with` închide automat fișierul. Bibliotecile se instalează cu `pip install numpy matplotlib pandas scipy`, de preferat într-un mediu virtual: `python -m venv .venv`, apoi activare și instalare.

#### 5.4 NumPy — calcul vectorial

NumPy lucrează cu tablouri omogene (`ndarray`); operațiile se aplică pe tot tabloul, fără bucle, de zeci de ori mai rapid decât listele.

```python
import numpy as np
t = np.linspace(0, 0.04, 2001)                  # 2 perioade la 50 Hz
u = 230 * np.sqrt(2) * np.sin(2 * np.pi * 50 * t)
i = 10 * np.sqrt(2) * np.sin(2 * np.pi * 50 * t - np.pi / 6)
U_rms = np.sqrt(np.mean(u**2))                  # ≈ 230 V
P = np.mean(u * i)                              # putere activă ≈ 1992 W
print(U_rms, P, P / (U_rms * np.sqrt(np.mean(i**2))))  # cos fi ≈ 0,866
```

Funcții utile: `np.mean, np.std, np.min, np.max, np.cumsum, np.trapz` (`np.trapezoid` în NumPy 2), `np.polyfit, np.polyval, np.loadtxt, np.savetxt`.

#### 5.5 Matplotlib — grafice

```python
import matplotlib.pyplot as plt
fig, ax = plt.subplots(figsize=(8, 4))
ax.plot(t * 1000, u, label="u(t) [V]")
ax.plot(t * 1000, i * 10, label="10·i(t) [A]")
ax.set_xlabel("t [ms]"); ax.set_ylabel("Amplitudine")
ax.grid(True); ax.legend(); ax.set_title("Tensiune și curent, sarcină inductivă")
fig.savefig("forme_unda.png", dpi=150)
plt.show()
```

#### 5.6 pandas — date tabelare

```python
import pandas as pd
df = pd.read_csv("contor.csv", sep=";", parse_dates=["timp"], index_col="timp")
zilnic = df["P_kW"].resample("D").mean() * 24        # kWh/zi
print(df.describe())
zilnic.to_excel("raport_zilnic.xlsx")                # necesită openpyxl
```

Cu pandas se pot genera automat rapoarte (Excel, CSV, HTML) — unul dintre rezultatele învățării disciplinei.

### Exerciții și probleme rezolvate

**Problema 5.1.** Calculați energia zilnică dintr-o curbă de sarcină orară și afișați ora de vârf.

```python
import numpy as np
P = np.array([12,11,10,10,11,14,22,35,42,40,38,36,
              34,36,38,40,44,48,46,40,32,24,18,14])   # kW, orele 0..23
W = P.sum() * 1.0                                       # pas 1 h -> kWh
print(f"W = {W:.0f} kWh, vârf {P.max()} kW la ora {P.argmax()}")
print(f"Factor de încărcare = {P.mean() / P.max():.2f}")
```

*Rezultat.* W = 695 kWh; vârf 48 kW la ora 17; factor de încărcare = 28,96/48 = 0,60.

**Problema 5.2.** Calibrarea unui senzor (datele din Problema 2.4) cu `np.polyfit`.

```python
T = np.array([0, 25, 50, 75, 100]); U = np.array([0.50, 0.75, 1.01, 1.24, 1.50])
a, b = np.polyfit(T, U, 1)
R2 = 1 - np.sum((U - (a*T + b))**2) / np.sum((U - U.mean())**2)
print(f"U = {a:.5f}·T + {b:.4f}, R² = {R2:.4f}")
```

*Rezultat.* U = 0,00996·T + 0,5020, R² ≈ 0,9997 — același rezultat ca la calculul manual.

**Problema 5.3.** Rezolvați x³ − x − 2 = 0 cu SciPy.

```python
from scipy.optimize import brentq, newton
f = lambda x: x**3 - x - 2
print(brentq(f, 1, 2), newton(f, 1.5))   # 1.5213797...
```

**Problema 5.4.** Filtrarea unui semnal zgomotos cu medie mobilă pe 5 eșantioane.

```python
rng = np.random.default_rng(1)
T_mas = 60 + rng.normal(0, 1.5, 200)            # temperatură cu zgomot
T_filt = np.convolve(T_mas, np.ones(5)/5, mode="valid")
print(T_mas.std(), T_filt.std())                # abaterea scade de ~√5 ori
```

### Temă de casă

1. Scrieți funcția `pierderi_cablu(L, S, I, rho=0.0175)` care returnează rezistența și pierderile ΔP; afișați un tabel pentru S = 1,5; 2,5; 4; 6; 10 mm² la L = 50 m și I = 16 A.
2. Generați cu NumPy un semnal de curent cu armonicele 1, 3 și 5 (amplitudini 10, 3, 1,5 A) și calculați valoarea efectivă și THD = √(I₃² + I₅²)/I₁.
3. Reprezentați grafic cu Matplotlib, pe același grafic, curba de sarcină din Problema 5.1 (bare) și puterea medie (linie orizontală).
4. Citește cu pandas un CSV cu măsurători la 15 minute pe o săptămână (generați-l voi) și calculați consumul zilnic, maximul săptămânii și ziua cu consumul cel mai mic; salvați rezultatul în Excel.
5. Implementați în Python metoda Euler pentru Problema 2.5 și comparați grafic soluția numerică (h = 0,25 h și h = 0,05 h) cu soluția exactă.

## Cursul 6. Elemente de calcul tabelar: Excel, LibreOffice Calc

### Obiective

- Prezentarea organizării unei foi de calcul: registru, foi, celule, referințe relative, absolute și mixte.
- Utilizarea formulelor și funcțiilor matematice, statistice, logice și de căutare.
- Construirea graficelor și a liniilor de tendință; utilizarea instrumentelor Goal Seek și Solver.
- Importul datelor de măsură (CSV) și realizarea de tabele pivot.

### Rezultatele învățării

- **Cunoștințe:** studentul identifică funcțiile de calcul tabelar potrivite pentru analiza datelor energetice.
- **Aptitudini:** realizează foi de calcul pentru bilanțuri energetice, costuri și analize de eficiență; rezolvă probleme de optimizare simple cu Solver.
- **Responsabilitate și autonomie:** organizează foi de calcul verificabile (date separate de calcule, unități în antet, parametri în celule dedicate).

### Conținut

#### 6.1 Organizare și referințe

Celula se adresează prin coloană și rând (B3). La copierea unei formule:

| Referință | Exemplu | La copiere |
| --- | --- | --- |
| relativă | `=B3*C3` | se ajustează rândul și coloana |
| absolută | `=B3*$F$1` | `$F$1` rămâne fixă (ex. prețul kWh) |
| mixtă | `=$A3*B$2` | se fixează doar coloana sau doar rândul |

Celulele cu parametri se pot denumi (*Name Box* în Excel, *Sheet → Named Ranges* în Calc): `=B3*pret_kWh`. În LibreOffice separatorul argumentelor este `;` (în Excel cu setări românești tot `;`, în engleză `,`).

#### 6.2 Funcții uzuale

| Categorie | Funcții |
| --- | --- |
| Matematice | SUM, SUMPRODUCT, ROUND, SQRT, POWER, ABS, PI, EXP, LN |
| Statistice | AVERAGE, MEDIAN, STDEV.S, MIN, MAX, COUNT, COUNTIF, AVERAGEIF, PERCENTILE |
| Logice | IF, AND, OR, IFERROR, IFS |
| Căutare | VLOOKUP / XLOOKUP, INDEX, MATCH |
| Regresie | SLOPE, INTERCEPT, RSQ, LINEST, FORECAST, TREND |
| Financiare | PMT, NPV, IRR (analiza investițiilor în eficiență energetică) |
| Dată / oră | DATE, HOUR, WEEKDAY, MONTH |

#### 6.3 Grafice și linii de tendință

Pentru date experimentale se folosește graficul **XY (Scatter)**, nu cel de tip *Line* (care tratează axa X ca simple etichete). Linia de tendință (*Add Trendline*) poate fi liniară, polinomială, exponențială sau logaritmică, cu afișarea ecuației și a lui R². Curbele de sarcină se reprezintă cu grafice coloană sau arie.

#### 6.4 Goal Seek și Solver

- **Goal Seek** (*Data → What-If Analysis*; în Calc *Tools → Goal Seek*) modifică o singură celulă de intrare până când o celulă cu formulă atinge o valoare țintă. Echivalent cu rezolvarea numerică a unei ecuații.
- **Solver** optimizează (min/max) o celulă obiectiv modificând mai multe celule, cu restricții. Exemplu: repartizarea sarcinii între generatoare pentru cost minim.

#### 6.5 Import de date și tabele pivot

Fișierele CSV de la achiziție se importă cu *Data → From Text/CSV* (Excel) sau deschidere directă (Calc), alegând separatorul (`;` sau `,`) și separatorul zecimal. Tabelul pivot (*Insert → PivotTable*; Calc: *Insert → Pivot Table*) agregă rapid datele: consum pe lună, pe zi a săptămânii, pe consumator.

**Formatarea condiționată** evidențiază automat valorile anormale (de ex. cos φ < 0,92 cu roșu).

### Exerciții și probleme rezolvate

**Problema 6.1 (bilanț de consum).** Foaia conține: A – consumator, B – putere instalată \[kW\], C – coeficient de utilizare, D – ore/zi; în F1 prețul 1,10 lei/kWh, în F2 numărul de zile lucrătoare 250.

| A | B | C | D | E (energie anuală, kWh) | F (cost, lei) |
| --- | --- | --- | --- | --- | --- |
| Compresor | 22 | 0,7 | 16 | `=B4*C4*D4*$F$2` → 61 600 | `=E4*$F$1` → 67 760 |
| Pompă | 7,5 | 0,8 | 20 | 30 000 | 33 000 |
| Iluminat | 4,8 | 1 | 12 | 14 400 | 15 840 |
| **Total** | `=SUM(B4:B6)` → 34,3 |  |  | `=SUM(E4:E6)` → 106 000 | 116 600 |

Ponderea compresorului: `=E4/$E$7` → 58,1 %.

**Problema 6.2 (tarif în trepte cu IF).** Calculați factura pentru consumul din B2 dacă primii 255 kWh costă 0,68 lei/kWh, iar restul 1,30 lei/kWh.

*Rezolvare.* `=IF(B2<=255; B2*0,68; 255*0,68 + (B2-255)*1,30)`. Pentru 400 kWh: 173,40 + 188,50 = 361,90 lei.

**Problema 6.3 (regresie).** Pentru datele din Problema 2.4 (T în A2:A6, U în B2:B6): `=SLOPE(B2:B6;A2:A6)` → 0,00996; `=INTERCEPT(B2:B6;A2:A6)` → 0,502; `=RSQ(B2:B6;A2:A6)` → 0,9997. Aceeași ecuație apare pe grafic cu *Trendline → Display equation*.

**Problema 6.4 (Goal Seek).** O investiție de 40 000 lei într-un sistem de recuperare a căldurii economisește E kWh/an la 0,45 lei/kWh (gaz). Ce economie anuală e necesară pentru recuperare în 4 ani?

*Rezolvare.* B1 = 40000; B2 = E (valoare inițială 10000); B3 = `=B1/(B2*0,45)` (ani). Goal Seek: Set cell B3, To value 4, By changing B2 → E = 22 222 kWh/an. Verificare: 40000/(22222·0,45) = 4,0 ani.

**Problema 6.5 (Solver — dispecer economic).** Două generatoare acoperă o sarcină de 150 MW. Costurile: C₁ = 0,004·P₁² + 8·P₁ + 200 și C₂ = 0,006·P₂² + 7·P₂ + 180 \[lei/h\]. Limite: 20 ≤ P₁, P₂ ≤ 120 MW.

*Rezolvare.* Celule variabile B1 = P₁, B2 = P₂; obiectiv B5 = C₁ + C₂ (Min); restricții: B1 + B2 = 150 și limitele; metoda GRG Nonlinear. Verificare analitică (costuri marginale egale): 0,008·P₁ + 8 = 0,012·P₂ + 7 și P₁ + P₂ = 150 ⇒ 0,008·P₁ + 1 = 0,012·(150 − P₁) ⇒ 0,02·P₁ = 0,8 ⇒ P₁ = 40 MW, P₂ = 110 MW. Cost minim = (6,4 + 320 + 200) + (72,6 + 770 + 180) = 1549 lei/h.

### Temă de casă

1. Realizați o foaie de calcul pentru inventarul consumatorilor unui atelier (minimum 8 consumatori) cu putere, coeficient de utilizare, ore de funcționare și cost anual; adăugați un grafic Pareto (sortare descrescătoare + procent cumulat).
2. Importați un CSV cu măsurători la 15 minute pe o lună (P, Q) și calculați cu formule: energia activă și reactivă, cos φ mediu, numărul de intervale cu cos φ < 0,92 (COUNTIF), puterea maximă și momentul ei (INDEX/MATCH).
3. Construiți tabelul pivot „consum mediu pe oră a zilei” și graficul curbei de sarcină tipice.
4. Calculați cu NPV și IRR rentabilitatea înlocuirii a 100 de corpuri fluorescente de 58 W cu LED-uri de 24 W (cost 90 lei/buc, 3000 h/an, 1,1 lei/kWh, 10 ani, rată de actualizare 8 %).
5. Folosind Solver, repetați Problema 6.5 pentru o sarcină de 200 MW și verificați analitic rezultatul.

## Cursul 7. Statistică și grafică pentru prelucrarea datelor experimentale (MATLAB / Octave / SciDAVis)

### Obiective

- Prezentarea mărimilor statistice ale unui șir de măsurători: medie, dispersie, abatere standard, incertitudine.
- Tratarea erorilor: sistematice, aleatoare, grosolane (criteriul 3σ); propagarea incertitudinilor.
- Ajustarea curbelor (liniară, polinomială, exponențială) și interpolarea.
- Realizarea graficelor tehnice în GNU Octave (compatibil MATLAB) și SciDAVis.

### Rezultatele învățării

- **Cunoștințe:** studentul definește indicatorii statistici și explică semnificația intervalului de încredere.
- **Aptitudini:** prelucrează șiruri de măsurători, elimină valorile aberante, exprimă rezultatul cu incertitudine și îl reprezintă grafic corect (axe, unități, bare de eroare).
- **Responsabilitate și autonomie:** ia decizii tehnice pe baza datelor, ținând cont de incertitudinea măsurării.

### Conținut

#### 7.1 Indicatori statistici

Pentru n măsurători x₁ … xₙ:

```latex
\bar{x} = \frac{1}{n}\sum_{i=1}^{n} x_i, \qquad s = \sqrt{\frac{1}{n-1}\sum_{i=1}^{n}(x_i - \bar{x})^2}, \qquad s_{\bar{x}} = \frac{s}{\sqrt{n}}
```

Rezultatul se exprimă: x = x̄ ± t·s/√n, unde t este coeficientul Student (pentru 95 % și n = 10, t = 2,26; pentru n mare, t ≈ 1,96). Alte mărimi: mediana, amplitudinea (max − min), coeficientul de variație CV = s/x̄.

**Histograma** arată distribuția valorilor; pentru erori aleatoare are formă de clopot (distribuție normală). În intervalul x̄ ± σ se află \~68 % din valori, în x̄ ± 2σ \~95 %, în x̄ ± 3σ \~99,7 %.

#### 7.2 Tipuri de erori

- **Sistematice** — același sens și mărime (decalaj de zero, calibrare greșită); se corectează prin calibrare.
- **Aleatoare** — variații imprevizibile; se reduc prin mediere (abaterea mediei scade cu √n).
- **Grosolane** — valori aberante (*outliers*); se elimină cu criteriul 3σ sau Grubbs, cu justificare.

**Propagarea incertitudinilor** pentru y = f(x₁, x₂, …) cu mărimi independente:

```latex
u_y = \sqrt{\sum_i \left(\frac{\partial f}{\partial x_i}\, u_{x_i}\right)^2}
```

Pentru produs sau cât (P = U·I, R = U/I) incertitudinile relative se adună pătratic: u\_P/P = √\[(u\_U/U)² + (u\_I/I)²\].

#### 7.3 Ajustare și interpolare

- Ajustarea (*fitting*) caută o funcție care trece *aproape* de puncte (cele mai mici pătrate): `polyfit`, `lsqcurvefit`.
- Interpolarea trece *exact* prin puncte: liniară, spline (`interp1(x, y, xi, 'spline')`).
- Modele neliniare se liniarizează: y = a·e^(bx) ⇒ ln y = ln a + b·x.

#### 7.4 GNU Octave

```matlab
% citirea datelor si statistica
date = csvread('masuratori.csv', 1, 0);    % sare antetul
t = date(:,1); U = date(:,2); I = date(:,3);
P = U .* I;                                % produs element cu element
printf('P medie = %.2f W, s = %.2f W\n', mean(P), std(P));

% eliminarea valorilor aberante (3 sigma)
ok = abs(P - mean(P)) < 3*std(P);
P = P(ok); t = t(ok);

% ajustare polinomiala si grafic
p = polyfit(t, P, 2);
plot(t, P, 'o', t, polyval(p, t), 'r-', 'LineWidth', 1.5);
xlabel('t [s]'); ylabel('P [W]'); grid on;
legend('masurat', sprintf('fit: %.3gt^2 + %.3gt + %.3g', p));
print -dpng grafic_P.png
```

Instrucțiuni utile: `mean, median, std, var, hist, histc, errorbar, subplot, interp1, fzero, quad, ode45`. Operatorii cu punct (`.*`, `./`, `.^`) lucrează element cu element.

#### 7.5 SciDAVis

SciDAVis (gratuit, similar Origin) lucrează cu tabele și grafice: *File → Import ASCII* (CSV), *Plot → Scatter / Line + Symbol*, *Analysis → Fit Wizard* (funcții predefinite sau definite de utilizator, cu afișarea parametrilor, erorilor și R²), *Analysis → Statistics on columns*, bare de eroare din coloane (*Add Error Bars*). Graficele se exportă vectorial (SVG, PDF, EPS) pentru referate și articole.

#### 7.6 Reguli pentru grafice tehnice

Fiecare axă are mărimea și unitatea de măsură (`P [kW]`); punctele măsurate se reprezintă cu markeri, modelul cu linie; legendă când sunt mai multe serii; bare de eroare când incertitudinea contează; scală logaritmică când datele acoperă mai multe ordine de mărime.

### Exerciții și probleme rezolvate

**Problema 7.1.** Zece măsurători ale tensiunii de alimentare: 229,8; 230,4; 231,0; 229,5; 230,2; 230,9; 229,9; 230,6; 230,1; 230,6 V. Exprimați rezultatul cu interval de încredere 95 %.

*Rezolvare.* Σ = 2303,0 ⇒ x̄ = 230,30 V. Abaterile: −0,5; 0,1; 0,7; −0,8; −0,1; 0,6; −0,4; 0,3; −0,2; 0,3. Suma pătratelor = 0,25 + 0,01 + 0,49 + 0,64 + 0,01 + 0,36 + 0,16 + 0,09 + 0,04 + 0,09 = 2,14. s = √(2,14/9) = 0,488 V; s\_x̄ = 0,154 V. Cu t = 2,26: U = 230,30 ± 0,35 V (95 %).

Octave: `x = [229.8 230.4 231.0 229.5 230.2 230.9 229.9 230.6 230.1 230.6]; m = mean(x), s = std(x), u = 2.26*s/sqrt(10)`.

**Problema 7.2 (valoare aberantă).** La șirul de mai sus se adaugă valoarea 236,0 V. Se elimină?

*Rezolvare.* Cu 11 valori: x̄ = 230,82 V, s = 1,78 V; |236,0 − 230,82| = 5,18 V < 3s = 5,34 V, deci criteriul 3σ nu o elimină — criteriul e slab pentru șiruri scurte, pentru că valoarea aberantă însăși umflă s. Criteriul Grubbs: G = 5,18/1,78 = 2,91 > G\_critic(n = 11, 95 %) = 2,36 ⇒ valoarea se elimină. Concluzie: pentru n mic se folosește Grubbs.

**Problema 7.3 (propagarea incertitudinii).** U = 230,3 ± 0,35 V, I = 8,20 ± 0,05 A. Calculați P și incertitudinea.

*Rezolvare.* P = 1888,5 W. u\_U/U = 0,152 %, u\_I/I = 0,610 %; u\_P/P = √(0,152² + 0,610²) = 0,629 %; u\_P = 11,9 W. Rezultat: P = 1889 ± 12 W. Incertitudinea e dominată de măsurarea curentului.

**Problema 7.4 (liniarizare).** Răcirea unui transformator după deconectare: θ(t) = θ₀·e^(−t/τ). Măsurători de supratemperatură: t = 0, 30, 60, 90, 120 min; θ = 50,0; 30,3; 18,4; 11,2; 6,8 K. Determinați τ.

*Rezolvare.* ln θ: 3,912; 3,411; 2,912; 2,416; 1,917. Panta dreptei ln θ = ln θ₀ − t/τ: (1,917 − 3,912)/120 = −0,01663 min⁻¹ ⇒ τ = 60,1 min, θ₀ = e^3,912 = 50,0 K. În Octave: `p = polyfit(t, log(theta), 1); tau = -1/p(1)`.

### Temă de casă

1. Măsurând de 12 ori temperatura unui schimbător de căldură s-au obținut: 72,1; 71,8; 72,4; 72,0; 71,6; 72,3; 72,2; 71,9; 72,5; 71,7; 72,0; 72,1 °C. Calculați x̄, s, intervalul 95 % (t = 2,20) și desenați histograma în Octave.
2. Rezistența unui conductor se determină din R = U/I cu U = 12,05 ± 0,02 V și I = 2,410 ± 0,008 A. Calculați R și incertitudinea.
3. Caracteristica unui ventilator: Q = 0, 1, 2, 3, 4, 5 m³/s; Δp = 820, 800, 745, 650, 520, 350 Pa. Ajustați un polinom de gradul 2 în Octave și în SciDAVis; comparați coeficienții și R².
4. Generați în Octave 1000 de valori normale (μ = 50, σ = 2), adăugați 5 valori aberante și scrieți un script care le detectează și le elimină.
5. Pentru datele din Problema 7.4, reprezentați în SciDAVis θ(t) cu fit exponențial direct și comparați τ cu valoarea obținută prin liniarizare.

## Cursul 8. Dezvoltarea aplicațiilor cu Arduino (C/C++)

### Obiective

- Prezentarea arhitecturii plăcii Arduino Uno (ATmega328P) și a mediului Arduino IDE 2.
- Utilizarea intrărilor/ieșirilor digitale, a convertorului A/D, a PWM și a comunicației seriale.
- Programarea neblocantă cu `millis()`, întreruperi și mașini de stări.
- Utilizarea interfețelor I2C și SPI și a bibliotecilor pentru senzori.

### Rezultatele învățării

- **Cunoștințe:** studentul descrie resursele unui microcontroler (memorie, timere, ADC, interfețe) și structura `setup()`/`loop()`.
- **Aptitudini:** realizează un instrument virtual simplu: achiziție de la senzori, conversie în mărimi fizice, afișare și transmitere serială.
- **Responsabilitate și autonomie:** alege senzorii și interfațele potrivite unei măsurări și verifică limitele electrice (niveluri de tensiune, curenți admisibili).

### Conținut

#### 8.1 Placa Arduino Uno

| Resursă | Arduino Uno R3 |
| --- | --- |
| Microcontroler | ATmega328P, 8 biți, 16 MHz |
| Memorie | 32 KB Flash, 2 KB SRAM, 1 KB EEPROM |
| I/O digitale | 14 (D0–D13), din care 6 PWM (D3, 5, 6, 9, 10, 11) |
| Intrări analogice | 6 (A0–A5), ADC 10 biți (0–1023) |
| Tensiune logică | 5 V; max. 20 mA recomandat pe pin |
| Interfețe | UART (D0/D1), I2C (A4 = SDA, A5 = SCL), SPI (D10–D13) |

Un program Arduino (*sketch*) este C++ cu două funcții obligatorii: `setup()` (rulată o dată) și `loop()` (rulată repetat). Compilatorul este avr-gcc; nu există sistem de operare.

#### 8.2 I/O digitale, ADC, PWM

```cpp
const int LED = 13, BUTON = 2, POT = A0, MOTOR = 9;

void setup() {
  pinMode(LED, OUTPUT);
  pinMode(BUTON, INPUT_PULLUP);         // rezistență internă de pull-up
  Serial.begin(115200);
}

void loop() {
  int n = analogRead(POT);              // 0..1023
  float U = n * 5.0 / 1023.0;           // tensiunea [V]
  analogWrite(MOTOR, n / 4);            // PWM 0..255, ~490 Hz
  digitalWrite(LED, digitalRead(BUTON) == LOW);
  Serial.print("U="); Serial.println(U, 3);
  delay(200);
}
```

Rezoluția ADC la 5 V: 5/1023 ≈ 4,89 mV. Pentru precizie se poate folosi referința internă de 1,1 V: `analogReference(INTERNAL)`.

#### 8.3 Programare neblocantă și întreruperi

`delay()` blochează procesorul. Pentru sarcini periodice independente se folosește `millis()`:

```cpp
unsigned long tMas = 0, tSend = 0;
void loop() {
  unsigned long t = millis();
  if (t - tMas >= 100)  { tMas = t;  masoara(); }    // la 100 ms
  if (t - tSend >= 1000) { tSend = t; trimite(); }   // la 1 s
}
```

Întreruperile externe (pinii 2 și 3 la Uno) numără impulsuri, de exemplu de la un contor de energie cu ieșire S0 sau un debitmetru:

```cpp
volatile unsigned long impulsuri = 0;
void isr() { impulsuri++; }
void setup() { attachInterrupt(digitalPinToInterrupt(2), isr, FALLING); }
```

Variabilele modificate în ISR se declară `volatile`; ISR-ul trebuie să fie scurt (fără `Serial`, fără `delay`).

#### 8.4 I2C și SPI

**I2C** — două fire (SDA, SCL), mai multe dispozitive pe aceeași magistrală, fiecare cu adresă de 7 biți (ex. INA219 la 0x40, BME280 la 0x76, ecran OLED la 0x3C). Viteze 100/400 kHz. Biblioteca `Wire`.

**SPI** — patru fire (MOSI, MISO, SCK, CS), un pin CS pentru fiecare dispozitiv, viteze de MHz (carduri SD, ADC-uri externe, MAX31855 pentru termocupluri). Biblioteca `SPI`.

```cpp
#include <Wire.h>
#include <Adafruit_INA219.h>
Adafruit_INA219 ina;               // senzor I2C de tensiune și curent
void setup() { Serial.begin(115200); ina.begin(); }
void loop() {
  float U = ina.getBusVoltage_V();
  float I = ina.getCurrent_mA() / 1000.0;
  Serial.print(U); Serial.print(';'); Serial.print(I, 3); Serial.print(';');
  Serial.println(U * I, 3);         // P [W], format CSV
  delay(500);
}
```

Scanerul I2C (exemplu din *File → Examples → Wire*) afișează adresele dispozitivelor conectate — primul pas la depanare.

#### 8.5 Instrumentul virtual

Un instrument virtual combină hardware de achiziție (senzor + microcontroler) cu software care prelucrează, afișează și stochează datele (Serial Plotter, script Python, LabVIEW, ThingsBoard). Lanțul de măsură: mărime fizică → traductor → condiționare semnal → ADC → prelucrare numerică (calibrare, filtrare) → afișare/transmitere.

### Exerciții și probleme rezolvate

**Problema 8.1 (termometru LM35).** LM35 dă 10 mV/°C. Scrieți programul care afișează temperatura medie pe 16 eșantioane și aprinde un LED peste 40 °C, cu histerezis de 2 °C.

```cpp
const int SENZ = A0, LED = 8;
bool alarma = false;
void setup() { pinMode(LED, OUTPUT); Serial.begin(9600); }
void loop() {
  long s = 0;
  for (int k = 0; k < 16; k++) { s += analogRead(SENZ); delay(5); }
  float T = (s / 16.0) * 5.0 / 1023.0 * 100.0;     // V -> °C
  if (!alarma && T > 40.0) alarma = true;
  if (alarma && T < 38.0) alarma = false;           // histerezis
  digitalWrite(LED, alarma);
  Serial.println(T, 1);
  delay(500);
}
```

Rezoluția: 4,89 mV / 10 mV/°C = 0,49 °C; medierea pe 16 eșantioane reduce zgomotul de circa 4 ori.

**Problema 8.2 (contor S0).** Un contor de energie emite 1000 impulsuri/kWh. Într-un interval de 60 s s-au numărat 25 de impulsuri. Calculați puterea medie.

*Rezolvare.* E = 25/1000 = 0,025 kWh în 1/60 h ⇒ P = 0,025·60 = 1,5 kW. În cod: `float P_kW = imp * 3600.0 / (1000.0 * dt_s);`.

**Problema 8.3 (divizor de tensiune).** Trebuie măsurată tensiunea unei baterii de 0–24 V cu ADC-ul de 5 V. Alegeți divizorul.

*Rezolvare.* Raport ≥ 24/5 = 4,8; se alege R1 = 39 kΩ, R2 = 10 kΩ ⇒ k = (R1+R2)/R2 = 4,9; la 24 V intrarea are 4,90 V. U\_bat = n·5/1023·4,9; rezoluția: 24 mV. Curentul absorbit: 24/49 kΩ ≈ 0,49 mA.

### Temă de casă

1. Scrieți un program care măsoară tensiunea unui panou fotovoltaic (0–25 V, divizor) și curentul (ACS712-5A, 185 mV/A, offset 2,5 V) și transmite serial U, I, P în format CSV la fiecare secundă, fără `delay()`.
2. Comandați viteza unui ventilator prin PWM în funcție de temperatură: 0 % sub 25 °C, liniar până la 100 % la 45 °C.
3. Folosind un senzor I2C (BME280 sau SHT31), afișați temperatura și umiditatea pe un ecran OLED SSD1306 (I2C, 0x3C). Ce adrese are fiecare dispozitiv? Rulați scanerul I2C.
4. Implementați o mașină de stări cu 3 stări (OPRIT, PORNIRE, FUNCȚIONARE) pentru pornirea unei pompe: PORNIRE durează 3 s cu LED clipitor, apoi FUNCȚIONARE; butonul de stop revine în OPRIT.
5. Calculați cât timp până la depășirea variabilei `millis()` (unsigned long, 32 biți) și explicați de ce scrierea `t - tMas >= T` funcționează corect și la depășire.

## Cursul 9. Dezvoltarea aplicațiilor cu Raspberry Pi Pico (C/C++)

### Obiective

- Prezentarea microcontrolerelor RP2040 (Pico) și RP2350 (Pico 2) și a diferențelor față de Arduino Uno.
- Configurarea mediului Pico C/C++ SDK (CMake, extensia Raspberry Pi Pico pentru VS Code) și încărcarea programelor (UF2).
- Utilizarea GPIO, ADC, PWM, timerelor, I2C/SPI și a celor două nuclee.

### Rezultatele învățării

- **Cunoștințe:** studentul descrie structura unui proiect Pico SDK (`CMakeLists.txt`, biblioteci `hardware_*`) și resursele RP2040.
- **Aptitudini:** compilează și încarcă programe C pe Pico; realizează achiziție periodică cu timer și comandă PWM.
- **Responsabilitate și autonomie:** respectă nivelurile logice de 3,3 V și documentează conexiunile hardware ale proiectului.

### Conținut

#### 9.1 Placa Raspberry Pi Pico

| Resursă | Pico (RP2040) | Pico 2 (RP2350) |
| --- | --- | --- |
| Nuclee | 2 × Cortex-M0+, 133 MHz | 2 × Cortex-M33 (sau RISC-V), 150 MHz |
| SRAM / Flash | 264 KB / 2 MB | 520 KB / 4 MB |
| GPIO | 26 utilizabile, logică 3,3 V | 26 utilizabile, logică 3,3 V |
| ADC | 12 biți, 3 intrări externe (GP26–GP28) + senzor intern de temperatură | similar |
| Interfețe | 2 UART, 2 SPI, 2 I2C, 16 canale PWM, 8 mașini PIO | + securitate, 12 mașini PIO |
| Variante wireless | Pico W (Wi-Fi + Bluetooth) | Pico 2 W |

Atenție: GPIO-urile nu tolerează 5 V. Senzorii de 5 V se conectează prin divizor sau convertor de nivel.

#### 9.2 Mediul de dezvoltare

Varianta recomandată: VS Code + extensia oficială *Raspberry Pi Pico*, care instalează SDK-ul, toolchain-ul ARM și CMake. Un proiect minimal:

```cmake
cmake_minimum_required(VERSION 3.13)
include(pico_sdk_import.cmake)
project(termometru C CXX ASM)
pico_sdk_init()
add_executable(termometru main.c)
target_link_libraries(termometru pico_stdlib hardware_adc hardware_pwm)
pico_enable_stdio_usb(termometru 1)      # printf prin USB
pico_enable_stdio_uart(termometru 0)
pico_add_extra_outputs(termometru)       # generează termometru.uf2
```

Încărcare: se ține apăsat butonul BOOTSEL la conectarea USB, Pico apare ca disc (RPI-RP2) și se copiază fișierul `.uf2`. Alternativ: `picotool load -x termometru.uf2` sau depanare cu Debug Probe (SWD).

#### 9.3 GPIO și ADC

```c
#include <stdio.h>
#include "pico/stdlib.h"
#include "hardware/adc.h"

int main(void) {
    stdio_init_all();
    const uint LED = PICO_DEFAULT_LED_PIN;   // GP25 pe Pico (pe Pico W LED-ul e pe cipul Wi-Fi)
    gpio_init(LED); gpio_set_dir(LED, GPIO_OUT);

    adc_init();
    adc_gpio_init(26);                       // GP26 = ADC0
    adc_set_temp_sensor_enabled(true);
    const float k = 3.3f / 4095.0f;

    while (true) {
        adc_select_input(0);
        float U = adc_read() * k;
        adc_select_input(4);                 // senzorul intern
        float Ut = adc_read() * k;
        float T = 27.0f - (Ut - 0.706f) / 0.001721f;
        printf("U=%.3f V  Tcip=%.1f C\n", U, T);
        gpio_put(LED, !gpio_get(LED));
        sleep_ms(500);
    }
}
```

#### 9.4 PWM și timere

PWM-ul RP2040 are 8 *slice*-uri a câte 2 canale; frecvența este f = f\_sys / ((TOP + 1)·div). Frecvența de sistem implicită depinde de versiunea SDK (125 MHz în versiunile vechi, mai mare în cele recente), de aceea în cod se citește cu `clock_get_hz(clk_sys)`; în problemele de mai jos se consideră f\_sys = 125 MHz.

```c
#include "hardware/pwm.h"
void pwm_init_pin(uint pin, uint32_t f_hz) {
    gpio_set_function(pin, GPIO_FUNC_PWM);
    uint slice = pwm_gpio_to_slice_num(pin);
    uint32_t top = clock_get_hz(clk_sys) / f_hz - 1;   // div = 1; necesită "hardware/clocks.h"
    pwm_set_wrap(slice, top);
    pwm_set_enabled(slice, true);
}
/* factor de umplere d în [0, 1]: pwm_set_gpio_level(pin, d * (top + 1)); */
```

Achiziția la intervale exacte se face cu un timer repetitiv, nu cu `sleep_ms` în buclă:

```c
volatile bool gata = false;
bool cb(repeating_timer_t *rt) { gata = true; return true; }   // continuă
...
repeating_timer_t t;
add_repeating_timer_ms(-100, cb, NULL, &t);   // la fiecare 100 ms (semn minus = de la start la start)
while (true) { if (gata) { gata = false; masoara(); } tight_loop_contents(); }
```

#### 9.5 I2C, SPI și al doilea nucleu

```c
#include "hardware/i2c.h"
i2c_init(i2c0, 400 * 1000);
gpio_set_function(4, GPIO_FUNC_I2C); gpio_set_function(5, GPIO_FUNC_I2C);
gpio_pull_up(4); gpio_pull_up(5);
uint8_t reg = 0x02, buf[2];
i2c_write_blocking(i2c0, 0x40, &reg, 1, true);    // INA219: registrul tensiunii pe bus
i2c_read_blocking(i2c0, 0x40, buf, 2, false);
float Ubus = ((buf[0] << 8 | buf[1]) >> 3) * 0.004f;   // LSB = 4 mV
```

Cu `multicore_launch_core1(functie)` (biblioteca `pico_multicore`) nucleul 1 poate face achiziția, iar nucleul 0 comunicația; datele se schimbă prin FIFO (`multicore_fifo_push_blocking`).

### Exerciții și probleme rezolvate

**Problema 9.1.** Calculați rezoluția ADC a Pico și comparați cu Arduino Uno.

*Rezolvare.* Pico: 3,3 V / 4095 = 0,806 mV. Uno: 5 V / 1023 = 4,89 mV. Pico are o rezoluție de \~6 ori mai fină, dar domeniul de intrare este mai mic (0–3,3 V). Notă: numărul efectiv de biți (ENOB) al ADC-ului RP2040 este \~9 biți, deci medierea e recomandată.

**Problema 9.2.** Configurați PWM la 20 kHz pentru un driver de motor și calculați valoarea registrului pentru un factor de umplere de 35 %.

*Rezolvare.* TOP = 125 000 000 / 20 000 − 1 = 6249. Nivelul pentru 35 %: 0,35·6250 = 2187,5 → 2188. Rezoluția factorului de umplere: 1/6250 = 0,016 %.

**Problema 9.3.** Senzorul intern indică U\_t = 0,689 V. Ce temperatură are cipul?

*Rezolvare.* T = 27 − (0,689 − 0,706)/0,001721 = 27 + 9,88 = 36,9 °C.

**Problema 9.4.** Program complet: achiziție la 10 Hz a tensiunii de pe GP26, filtru de medie exponențială (α = 0,2) și afișare la 1 Hz.

```c
#include <stdio.h>
#include "pico/stdlib.h"
#include "hardware/adc.h"
static volatile bool tick = false;
bool cb(repeating_timer_t *t) { tick = true; return true; }
int main(void) {
    stdio_init_all(); adc_init(); adc_gpio_init(26); adc_select_input(0);
    repeating_timer_t t; add_repeating_timer_ms(-100, cb, NULL, &t);
    float Uf = 0; int n = 0;
    while (true) {
        if (!tick) continue;
        tick = false;
        float U = adc_read() * 3.3f / 4095.0f;
        Uf = 0.2f * U + 0.8f * Uf;           // y[k] = a·x[k] + (1-a)·y[k-1]
        if (++n == 10) { n = 0; printf("%.3f\n", Uf); }
    }
}
```

### Temă de casă

1. Creați un proiect Pico SDK care citește un potentiometru pe GP27 și comandă luminozitatea unui LED prin PWM la 1 kHz; trimiteți prin USB valorile în procente.
2. Calculați TOP și divizorul pentru un semnal PWM de 50 Hz (servomotor) și nivelul pentru impulsuri de 1 ms, 1,5 ms și 2 ms. (Indicație: TOP maxim este 65535, deci e nevoie de divizor.)
3. Implementați achiziția pe nucleul 1 (100 Hz) și transmiterea mediei pe nucleul 0 (1 Hz) folosind FIFO-ul între nuclee.
4. Citiți un senzor I2C la alegere (SHT31, BME280, INA219) direct cu funcțiile `i2c_write_blocking`/`i2c_read_blocking`, pe baza fișei tehnice.
5. Comparați într-un tabel Arduino Uno, Raspberry Pi Pico și Raspberry Pi 4 (procesor, memorie, sistem de operare, timp real, consum, preț, aplicații tipice în energetică).

## Cursul 10. Dezvoltarea aplicațiilor cu Raspberry Pi Pico (MicroPython)

### Obiective

- Prezentarea MicroPython: firmware, REPL, sistem de fișiere, `boot.py`/`main.py`.
- Utilizarea modulului `machine` (Pin, ADC, PWM, I2C, SPI, Timer, UART) și a modulului `time`.
- Conectarea Pico W la Wi-Fi și transmiterea datelor prin HTTP și MQTT.
- Compararea dezvoltării în MicroPython cu dezvoltarea în C/C++ SDK.

### Rezultatele învățării

- **Cunoștințe:** studentul explică avantajele (dezvoltare rapidă, REPL) și limitările (viteză, memorie) MicroPython.
- **Aptitudini:** dezvoltă scripturi MicroPython pentru achiziție de date, comandă și transmitere Wi-Fi către o platformă IoT.
- **Responsabilitate și autonomie:** alege limbajul potrivit (C sau MicroPython) în funcție de cerințele de timp real ale aplicației.

### Conținut

#### 10.1 Instalare și mediu de lucru

1. Se descarcă firmware-ul `.uf2` pentru placa folosită (Pico, Pico W, Pico 2, Pico 2 W) de pe micropython.org.
2. Cu BOOTSEL apăsat la conectare, se copiază fișierul pe discul RPI-RP2.
3. În Thonny: *Tools → Options → Interpreter → MicroPython (Raspberry Pi Pico)*. Consola REPL permite execuția interactivă a comenzilor.
4. Fișierul `main.py` salvat pe placă rulează automat la alimentare.

Alternative: VS Code cu extensia MicroPico, utilitarul `mpremote` din linia de comandă.

#### 10.2 Modulul machine

```python
from machine import Pin, ADC, PWM
import time

led = Pin("LED", Pin.OUT)              # LED-ul plăcii (Pico și Pico W)
buton = Pin(15, Pin.IN, Pin.PULL_UP)
pot = ADC(26)                          # GP26 = ADC0
senz_t = ADC(4)                        # senzorul intern de temperatură
ventilator = PWM(Pin(16)); ventilator.freq(25000)

while True:
    u = pot.read_u16() * 3.3 / 65535   # read_u16 întoarce 0..65535
    t = 27 - (senz_t.read_u16() * 3.3 / 65535 - 0.706) / 0.001721
    ventilator.duty_u16(pot.read_u16())
    led.value(buton.value() == 0)
    print(f"U={u:.3f} V, Tcip={t:.1f} C")
    time.sleep(0.5)
```

Notă: `read_u16()` scalează rezultatul pe 16 biți, deși ADC-ul are 12 biți.

#### 10.3 Timere, întreruperi, I2C

```python
from machine import Timer, I2C, Pin

impulsuri = 0
def numara(pin):
    global impulsuri
    impulsuri += 1
Pin(14, Pin.IN, Pin.PULL_UP).irq(trigger=Pin.IRQ_FALLING, handler=numara)

def la_secunda(tim):
    global impulsuri
    n, impulsuri = impulsuri, 0
    print("P =", n * 3600 / 1000, "kW")   # contor 1000 imp/kWh, fereastră 1 s
Timer(period=1000, mode=Timer.PERIODIC, callback=la_secunda)

i2c = I2C(0, sda=Pin(4), scl=Pin(5), freq=400_000)
print([hex(a) for a in i2c.scan()])          # ex. ['0x40', '0x76']
```

Citirea unui registru: `i2c.readfrom_mem(0x40, 0x02, 2)`; pentru mulți senzori există drivere MicroPython (de ex. `ina219.py`, `bme280.py`) care se copiază pe placă (sau `mip.install(...)`).

#### 10.4 Pico W: Wi-Fi, HTTP, MQTT

```python
import network, time, urequests, json
wlan = network.WLAN(network.STA_IF); wlan.active(True)
wlan.connect("RETEA", "PAROLA")
while not wlan.isconnected(): time.sleep(0.5)
print("IP:", wlan.ifconfig()[0])

# trimitere telemetrie către ThingsBoard prin HTTP
URL = "http://thingsboard.local:8080/api/v1/TOKEN_DISPOZITIV/telemetry"
r = urequests.post(URL, data=json.dumps({"U": 229.8, "I": 4.2}),
                   headers={"Content-Type": "application/json"})
r.close()
```

Pentru MQTT se folosește biblioteca `umqtt.simple`: `client = MQTTClient("pico", "broker", user="TOKEN"); client.connect(); client.publish(b"v1/devices/me/telemetry", payload)`. Credentialele se țin într-un fișier separat (`secrets.py`), nu în cod.

#### 10.5 MicroPython vs. C/C++ SDK

| Criteriu | MicroPython | C/C++ SDK |
| --- | --- | --- |
| Timp de dezvoltare | mic, REPL interactiv | mai mare, ciclul compilare–încărcare |
| Viteză de execuție | de 10–100 ori mai mică | maximă |
| Determinism (timp real) | limitat (garbage collector) | bun |
| Memorie disponibilă | \~190 KB heap pe RP2040 | aproape toată SRAM |
| Utilizare tipică | prototipare, IoT, achiziție lentă (< 1 kHz) | control rapid, achiziție de înaltă frecvență |

### Exerciții și probleme rezolvate

**Problema 10.1.** `read_u16()` returnează 41 500 pe un canal conectat la un divizor 1:11 (100 kΩ + 10 kΩ) care măsoară tensiunea unei baterii. Calculați tensiunea.

*Rezolvare.* U\_ADC = 41500·3,3/65535 = 2,090 V; U\_bat = 2,090·11 = 22,99 V.

**Problema 10.2.** Termostat cu histerezis: releu pe GP17, senzor DS18B20 pe GP22 (protocol 1-Wire), consemn 21 °C, histerezis ±0,5 °C.

```python
import onewire, ds18x20, time
from machine import Pin
rele = Pin(17, Pin.OUT)
ds = ds18x20.DS18X20(onewire.OneWire(Pin(22)))
senz = ds.scan()[0]
CONS, H = 21.0, 0.5
while True:
    ds.convert_temp(); time.sleep_ms(750)        # conversia pe 12 biți durează 750 ms
    T = ds.read_temp(senz)
    if T < CONS - H: rele.on()
    elif T > CONS + H: rele.off()
    print(f"T={T:.2f} C, incalzire={'ON' if rele.value() else 'OFF'}")
    time.sleep(2)
```

**Problema 10.3.** Câte mesaje pe zi trimite un Pico W care raportează la 30 s și ce volum de date rezultă dacă un mesaj are 120 octeți (inclusiv antete)?

*Rezolvare.* 86400/30 = 2880 mesaje/zi; 2880·120 = 345 600 B ≈ 338 KiB/zi ≈ 10 MiB/lună.

### Temă de casă

1. Scrieți un script MicroPython care citește tensiunea și curentul de la un INA219 (I2C) la fiecare secundă, calculează energia cumulată (Wh) și o salvează într-un fișier `energie.csv` pe placă, o dată pe minut.
2. Conectați un Pico W la Wi-Fi și trimiteți temperatura cipului la ThingsBoard (HTTP) la fiecare 10 s; tratați cazul pierderii conexiunii (reconectare automată).
3. Rescrieți Problema 9.4 (filtru exponențial) în MicroPython cu `Timer` și măsurați cu `time.ticks_us()` cât durează o iterație. Comparați cu varianta C.
4. Comandați un ventilator PWM în funcție de temperatura citită de DS18B20 (curbă liniară între 25 și 45 °C).
5. Explicați de ce în funcția de tratare a întreruperii nu trebuie alocată memorie (de ex. crearea de liste sau șiruri) și ce face `micropython.alloc_emergency_exception_buf()`.

## Cursul 11. Utilizarea mașinilor virtuale. Aplicații Hyper-V și Docker

### Obiective

- Prezentarea conceptului de virtualizare: hipervizor de tip 1 și 2, mașini virtuale, containere.
- Crearea și configurarea unei mașini virtuale în Hyper-V (rețea, discuri, puncte de control).
- Utilizarea Docker: imagini, containere, volume, rețele, Dockerfile, Docker Compose.
- Rularea serviciilor pentru aplicații IoT (broker MQTT, bază de date, ThingsBoard) în containere.

### Rezultatele învățării

- **Cunoștințe:** studentul explică diferența dintre o mașină virtuală și un container și rolul fiecăruia într-o infrastructură software.
- **Aptitudini:** creează o mașină virtuală Linux în Hyper-V; pornește o platformă IoT completă cu Docker Compose.
- **Responsabilitate și autonomie:** administrează un mediu de lucru reproductibil și izolat (copii de siguranță, puncte de control, fișiere de configurare versionate).

### Conținut

#### 11.1 Virtualizare

- **Hipervizor tip 1** (*bare-metal*): rulează direct pe hardware — Hyper-V, VMware ESXi, Proxmox VE, KVM.
- **Hipervizor tip 2** (*hosted*): rulează ca aplicație în sistemul de operare gazdă — VirtualBox, VMware Workstation.
- **Mașina virtuală (VM)** emulează un calculator complet, cu propriul nucleu de sistem de operare.
- **Containerul** împarte nucleul sistemului gazdă și izolează doar procesele, fișierele și rețeaua aplicației.

| Criteriu | Mașină virtuală | Container |
| --- | --- | --- |
| Izolare | completă (nucleu propriu) | la nivel de proces |
| Pornire | zeci de secunde – minute | sub o secundă – câteva secunde |
| Dimensiune | GB | zeci–sute de MB |
| Sisteme de operare diferite pe aceeași gazdă | da (Windows, Linux) | nu (același tip de nucleu) |
| Utilizare tipică | servere SCADA, sisteme vechi, laboratoare | microservicii, platforme IoT, medii de dezvoltare |

Aplicații în energetică: rularea unui server SCADA/HMI într-o VM izolată, testarea actualizărilor pe puncte de control, simularea unei rețele industriale cu mai multe VM-uri, pachetarea aplicațiilor de achiziție în containere.

#### 11.2 Hyper-V

Disponibil în Windows 10/11 Pro, Education și Enterprise. Activare (PowerShell ca administrator):

```powershell
Enable-WindowsOptionalFeature -Online -FeatureName Microsoft-Hyper-V -All
```

Crearea unei VM Ubuntu Server din PowerShell:

```powershell
New-VMSwitch -Name "Extern" -NetAdapterName "Ethernet" -AllowManagementOS $true
New-VM -Name "IoT-Server" -Generation 2 -MemoryStartupBytes 4GB `
       -NewVHDPath "D:\VM\IoT-Server.vhdx" -NewVHDSizeBytes 40GB -SwitchName "Extern"
Set-VMFirmware -VMName "IoT-Server" -SecureBootTemplate MicrosoftUEFICertificateAuthority
Add-VMDvdDrive -VMName "IoT-Server" -Path "D:\ISO\ubuntu-24.04-live-server-amd64.iso"
Set-VMProcessor -VMName "IoT-Server" -Count 2
Start-VM "IoT-Server"
Checkpoint-VM -Name "IoT-Server" -SnapshotName "dupa-instalare"
```

Tipuri de comutatoare virtuale: **External** (VM în rețeaua fizică), **Internal** (gazdă + VM-uri), **Private** (doar între VM-uri). Aceeași configurare se face și grafic din *Hyper-V Manager*. Pentru Linux cu Secure Boot se alege șablonul *Microsoft UEFI Certificate Authority*.

#### 11.3 Docker — concepte și comenzi

- **Imagine** — șablon read-only (de ex. `eclipse-mosquitto:2`), descris de un `Dockerfile`, descărcat din Docker Hub.
- **Container** — instanță în execuție a unei imagini.
- **Volum** — spațiu de stocare persistent (datele rămân după ștergerea containerului).
- **Rețea** — containerele dintr-o rețea se găsesc după nume.

| Comandă | Efect |
| --- | --- |
| `docker pull python:3.12-slim` | descarcă o imagine |
| `docker run -d --name mq -p 1883:1883 eclipse-mosquitto:2` | pornește un container în fundal, cu port publicat |
| `docker ps -a` | listează containerele |
| `docker logs -f mq` | afișează jurnalul |
| `docker exec -it mq sh` | deschide un terminal în container |
| `docker stop mq` / `docker rm mq` | oprește / șterge containerul |
| `docker build -t achizitie:1.0 .` | construiește o imagine din Dockerfile |
| `docker compose up -d` / `down` | pornește / oprește un set de servicii |

Pe Windows, Docker Desktop folosește WSL 2 (sau Hyper-V) pentru a rula nucleul Linux.

#### 11.4 Dockerfile pentru o aplicație de achiziție

```dockerfile
FROM python:3.12-slim
WORKDIR /app
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt   # paho-mqtt, pandas
COPY achizitie.py .
ENV BROKER=mosquitto INTERVAL=5
CMD ["python", "achizitie.py"]
```

#### 11.5 Docker Compose — platformă IoT

```yaml
services:
  thingsboard:
    image: thingsboard/tb-postgres
    restart: always
    ports:
      - "8080:9090"        # interfața web: http://localhost:8080
      - "1883:1883"        # MQTT
      - "7070:7070"        # Edge RPC
      - "5683-5688:5683-5688/udp"   # CoAP / LwM2M
    environment:
      TB_QUEUE_TYPE: in-memory
    volumes:
      - tb-data:/data
      - tb-logs:/var/log/thingsboard
  simulator:
    build: ./simulator          # Dockerfile-ul din 11.4
    environment:
      BROKER: thingsboard
      TOKEN: ${TB_TOKEN}
    depends_on: [thingsboard]
volumes:
  tb-data:
  tb-logs:
```

Cu `docker compose up -d` pornesc ambele servicii; simulatorul ajunge la ThingsBoard prin numele serviciului (`thingsboard`). Contul implicit este `tenant@thingsboard.org` / `tenant` și se schimbă la prima utilizare. Prima pornire durează câteva minute (inițializarea bazei de date).

### Exerciții și probleme rezolvate

**Problema 11.1.** Un server are 64 GB RAM și 16 nuclee. Trebuie să ruleze 3 servere SCADA Windows (8 GB, 4 vCPU fiecare) și cât mai multe instanțe ale unui serviciu de achiziție (container, 256 MB). Gazda reține 8 GB. Câte containere se pot rula?

*Rezolvare.* Memorie rămasă: 64 − 8 − 3·8 = 32 GB. Dacă containerele rulează într-o VM Linux cu 2 GB pentru sistem: (32 − 2)·1024/256 = 120 containere (în limita memoriei; procesorul trebuie verificat separat). Cu VM-uri de 1 GB per serviciu ar încăpea doar 32.

**Problema 11.2.** Porniți un broker MQTT și testați-l.

```bash
mkdir -p mosquitto/config
printf "listener 1883\nallow_anonymous true\n" > mosquitto/config/mosquitto.conf
docker run -d --name mq -p 1883:1883 \
  -v "$PWD/mosquitto/config:/mosquitto/config" eclipse-mosquitto:2
docker exec mq mosquitto_sub -t "atelier/#" -v &      # abonare
docker exec mq mosquitto_pub -t "atelier/motor1/P" -m "7.4"   # publicare
```

*Rezultat.* Abonatul afișează `atelier/motor1/P 7.4`. Fără fișierul de configurare, Mosquitto 2 acceptă doar conexiuni locale. Pentru producție se dezactivează accesul anonim (`password_file`).

**Problema 11.3.** Explicați ce se întâmplă cu datele ThingsBoard dacă se execută `docker compose down` și apoi `docker compose up -d` în configurația din 11.5, respectiv dacă se execută `docker compose down -v`.

*Rezolvare.* În primul caz datele se păstrează, deoarece sunt în volumul `tb-data`. Opțiunea `-v` șterge și volumele, deci toate dispozitivele, telemetria și panourile se pierd.

### Temă de casă

1. Creați în Hyper-V (sau VirtualBox) o VM Ubuntu Server cu 2 vCPU, 4 GB RAM și comutator extern; instalați Docker Engine și faceți un punct de control.
2. Scrieți un Dockerfile pentru un script Python care generează date simulate de putere (curbă de sarcină + zgomot) și le publică prin MQTT la 5 s.
3. Realizați un fișier `compose.yaml` cu trei servicii: Mosquitto, simulatorul de la punctul 2 și un abonat care salvează mesajele într-un fișier CSV pe un volum.
4. Porniți ThingsBoard CE cu Docker Compose, creați un dispozitiv și trimiteți telemetrie de test cu `mosquitto_pub -h localhost -u TOKEN -t v1/devices/me/telemetry -m '{"T":25}'`.
5. Comparați, într-un tabel, timpul de pornire, memoria ocupată și spațiul pe disc pentru serviciul Mosquitto rulat într-o VM și într-un container (măsurători proprii).

## Cursul 12. Dezvoltarea aplicațiilor IoT

### Obiective

- Prezentarea arhitecturii stratificate a unui sistem IoT industrial (IIoT).
- Compararea protocoalelor de comunicație: Modbus, MQTT, HTTP/REST, CoAP, LoRaWAN, Wi-Fi, BLE.
- Formatul datelor (JSON), modelul publicare/abonare, calitatea serviciului (QoS).
- Conceptele platformei ThingsBoard: dispozitive, telemetrie, atribute, lanțuri de reguli, alarme, RPC, panouri de bord.
- Securitatea sistemelor IoT.

### Rezultatele învățării

- **Cunoștințe:** studentul descrie straturile unui sistem IoT și rolul protocoalelor și bazelor de date în stocarea și gestionarea datelor de proces.
- **Aptitudini:** proiectează arhitectura unei aplicații IoT pentru monitorizare energetică și alege protocolul potrivit (rază, consum, debit de date).
- **Responsabilitate și autonomie:** integrează măsuri de securitate (autentificare, criptare, separarea rețelelor) încă din faza de proiectare.

### Conținut

#### 12.1 Arhitectura unui sistem IoT

1. **Stratul de percepție** — senzori și elemente de execuție: contoare de energie, traductoare de curent/tensiune, senzori de temperatură, relee.
2. **Stratul de margine (edge)** — microcontrolere și gateway-uri (Arduino, Pico W, ESP32, Raspberry Pi) care achiziționează, filtrează și împachetează datele.
3. **Stratul de rețea** — Ethernet, Wi-Fi, LoRaWAN, NB-IoT/LTE-M, RS-485.
4. **Stratul platformă** — broker de mesaje, bază de date de serii temporale, motor de reguli (ThingsBoard, Node-RED + InfluxDB, Azure IoT, AWS IoT).
5. **Stratul de aplicație** — panouri de bord, alarme, rapoarte, analiză, comandă de la distanță, gemeni digitali.

#### 12.2 Protocoale

| Protocol | Model | Transport | Utilizare tipică |
| --- | --- | --- | --- |
| Modbus RTU / TCP | master–slave, registre | RS-485 / TCP 502 | contoare, invertoare, PLC-uri |
| MQTT | publicare/abonare prin broker | TCP 1883 (8883 cu TLS) | telemetrie de la dispozitive |
| HTTP / REST | cerere–răspuns | TCP 80/443 | integrare cu aplicații, API |
| CoAP | cerere–răspuns ușor | UDP 5683 | dispozitive cu resurse foarte reduse |
| OPC UA | client–server, model informațional | TCP 4840 | automatizări industriale |
| LoRaWAN | radio, consum redus | 868 MHz în Europa | senzori la distanță (km), mesaje rare |

**MQTT în detaliu.** Clienții publică mesaje pe *topic*-uri ierarhice (`uzina/hala2/motor1/temperatura`) și se abonează folosind caractere de notație: `+` (un nivel), `#` (toate nivelurile următoare). Niveluri QoS: 0 (cel mult o dată), 1 (cel puțin o dată), 2 (exact o dată). Mesajul *retained* este păstrat de broker pentru abonații noi; *Last Will* anunță deconectarea neașteptată a unui dispozitiv.

**JSON** este formatul uzual al datelor: `{"ts": 1763539200000, "values": {"U": 230.1, "I": 4.25, "P": 978}}` (`ts` = timp Unix în milisecunde).

#### 12.3 Baze de date pentru date de proces

- **Relationale** (PostgreSQL, MySQL) — tabele cu relații; potrivite pentru configurații, active, utilizatori.
- **Serii temporale** (InfluxDB, TimescaleDB, Cassandra în ThingsBoard) — optimizate pentru șiruri (timp, valoare), agregare și retenție.
- **Istoricele industriale** (OSIsoft PI / AVEVA PI) — în energetică la scară mare.

Interogare SQL de agregare orară (TimescaleDB): `SELECT time_bucket('1 hour', ts) AS ora, avg(p_kw) FROM masuratori GROUP BY ora ORDER BY ora;`

#### 12.4 Platforma ThingsBoard

| Concept | Descriere |
| --- | --- |
| Dispozitiv (*device*) | entitate care trimite date; autentificat prin *access token* |
| Telemetrie | serii temporale (ts, cheie, valoare) |
| Atribute | valori statice sau de configurare: client, server, shared |
| Activ (*asset*) | grupare logică (clădire, hală, post de transformare) |
| Lanț de reguli (*rule chain*) | prelucrarea mesajelor: filtrare, transformare, alarme, notificări |
| Alarmă | eveniment cu severitate, creat de reguli (ex. T > 80 °C) |
| RPC | comandă de la platformă la dispozitiv (pornire pompă, consemn) |
| Panou de bord (*dashboard*) | widget-uri: grafice, indicatoare, tabele, hărți, butoane |

API dispozitiv MQTT: utilizator = token, topic telemetrie `v1/devices/me/telemetry`, atribute `v1/devices/me/attributes`, comenzi RPC pe `v1/devices/me/rpc/request/+`.

#### 12.5 Securitate

Riscuri principale: parole implicite, comunicație necriptată, firmware neactualizat, expunerea dispozitivelor direct la Internet. Măsuri: TLS (MQTTS 8883, HTTPS), token-uri sau certificate X.509 unice pe dispozitiv, rețele separate (VLAN) pentru IoT, acces la distanță prin VPN, principiul privilegiului minim, actualizări periodice. În energetică se aplică standardul IEC 62443 și, în UE, directiva NIS2.

#### 12.6 Etapele proiectării unei aplicații IoT

1. Definirea cerințelor: mărimi, frecvență de eșantionare, precizie, utilizatori, alarme.
2. Alegerea senzorilor și a nodului de achiziție.
3. Alegerea rețelei și a protocolului (rază, energie, debit, cost).
4. Proiectarea modelului de date (dispozitive, chei de telemetrie, unități, topic-uri).
5. Configurarea platformei: dispozitive, reguli, alarme, panouri.
6. Testare (inclusiv pierderea conexiunii, valori anormale), punere în funcțiune, documentare.

### Exerciții și probleme rezolvate

**Problema 12.1 (dimensionarea traficului).** 50 de contoare trimit la fiecare 15 s un mesaj JSON de 150 B cu QoS 1 (plus \~60 B antete MQTT/TCP/IP). Estimați traficul zilnic și numărul de puncte de date pe an, dacă fiecare mesaj conține 6 mărimi.

*Rezolvare.* Mesaje: 50·86400/15 = 288 000/zi. Trafic: 288 000·210 B = 60,5 MB/zi (fără confirmările PUBACK, \~4 B fiecare plus antete). Puncte de date: 288 000·6·365 = 630,7 milioane/an — motiv pentru a folosi baze de date de serii temporale și agregare (de ex. medii la 15 min păstrate permanent, date brute 90 de zile).

**Problema 12.2 (alegerea protocolului).** Alegeți protocolul pentru: (a) un contor trifazat cu RS-485 într-un tablou electric; (b) un senzor de nivel într-un rezervor la 3 km, alimentat din baterie; (c) un invertor fotovoltaic cu Wi-Fi către ThingsBoard.

*Rezolvare.* (a) Modbus RTU către un gateway (Raspberry Pi) care republică prin MQTT; (b) LoRaWAN — rază de kilometri și baterie pentru ani, cu mesaje rare și mici; (c) MQTT direct pe TCP/IP, cu TLS.

**Problema 12.3 (topic-uri MQTT).** Ce mesaje primește un client abonat la `uzina/+/motor1/#`?

*Rezolvare.* Primește `uzina/hala1/motor1/temperatura`, `uzina/hala2/motor1/curent/L1` și, în general, orice topic care începe cu `uzina/`, are pe al doilea nivel orice hală și pe al treilea `motor1` (inclusiv `uzina/hala1/motor1`, deoarece `#` acoperă și nivelul părinte). Nu primește `uzina/hala1/motor2/temperatura` și nici `uzina/hala1/linia3/motor1/temperatura` (`+` acoperă un singur nivel).

**Problema 12.4 (client Python MQTT către ThingsBoard).**

```python
import json, time, random
import paho.mqtt.client as mqtt          # paho-mqtt 2.x
c = mqtt.Client(mqtt.CallbackAPIVersion.VERSION2)
c.username_pw_set("TOKEN_DISPOZITIV")
c.connect("localhost", 1883); c.loop_start()
while True:
    P = 20 + 5 * random.random()
    c.publish("v1/devices/me/telemetry", json.dumps({"P_kW": round(P, 2)}), qos=1)
    time.sleep(5)
```

### Temă de casă

1. Proiectați arhitectura IoT (desen pe straturi + tabel cu componente) pentru monitorizarea consumului unui campus cu 5 clădiri: contoare Modbus, temperaturi interioare, centrale termice.
2. Definiți structura de topic-uri MQTT și cheile de telemetrie (cu unități) pentru sistemul de la punctul 1.
3. Calculați spațiul de stocare pe 5 ani dacă fiecare punct de date ocupă 30 B în baza de date și se înregistrează 200 mărimi la 1 minut. Propuneți o politică de retenție.
4. Scrieți un client Python care se abonează la comenzile RPC ThingsBoard (`v1/devices/me/rpc/request/+`), execută metoda `setPompa` (afișare mesaj) și răspunde pe `v1/devices/me/rpc/response/{id}`.
5. Enumerați cinci vulnerabilități ale unei instalații IoT tipice de laborator și măsura de remediere pentru fiecare.

## Cursul 13. Exemplu de aplicație IoT: monitorizarea unui sistem fotovoltaic cu stocare

### Obiective

- Parcurgerea completă a unei aplicații IoT, de la cerințe la panoul de bord.
- Integrarea senzorilor de tensiune, curent, iradianță și temperatură pe un nod Pico W.
- Configurarea ThingsBoard: profil de dispozitiv, lanț de reguli cu alarme, comandă RPC, panou de bord.
- Calculul indicatorilor energetici (energie, randament, raport de performanță) din datele colectate.

### Rezultatele învățării

- **Cunoștințe:** studentul explică fluxul datelor de la senzor la panoul de bord și rolul fiecărei componente.
- **Aptitudini:** realizează un sistem de monitorizare funcțional și calculează automat indicatori de performanță energetică.
- **Responsabilitate și autonomie:** transpune o instalație energetică reală într-un model digital ușor de administrat și monitorizat.

### Conținut

#### 13.1 Cerințele aplicației

Un panou fotovoltaic de 100 Wp încărcă o baterie de 12 V / 50 Ah printr-un controler MPPT, care alimentează o sarcină de iluminat. Se cer: măsurarea U, I, P la panou, baterie și sarcină, a iradianței și a temperaturii panoului; raportare la 10 s; energia zilnică produsă și consumată; alarme pentru tensiune minimă a bateriei (11,8 V) și temperatură a panoului peste 70 °C; deconectarea sarcinii de la distanță.

#### 13.2 Componente

| Componentă | Rol | Interfață |
| --- | --- | --- |
| Raspberry Pi Pico W | nod de achiziție și comunicație | Wi-Fi |
| 3 × INA219 (0x40, 0x41, 0x44) | U și I la panou, baterie, sarcină | I2C |
| OPT3001 sau celulă de referință | iradianță (estimată) | I2C / ADC |
| DS18B20 lipit pe spatele panoului | temperatura panoului | 1-Wire |
| Modul releu 3,3 V | deconectarea sarcinii | GPIO |
| ThingsBoard CE (Docker, Cursul 11) | stocare, reguli, panou de bord | MQTT |

INA219 cu șuntul standard de 0,1 Ω măsoară până la 3,2 A și 26 V; pentru curenți mai mari se înlocuiește șuntul și se recalibrează.

#### 13.3 Modelul de date

Telemetrie (chei și unități): `Upv` \[V\], `Ipv` \[A\], `Ppv` \[W\], `Ubat`, `Ibat`, `Usar`, `Isar`, `Psar`, `G` \[W/m²\], `Tpv` \[°C\], `Epv_zi` \[Wh\], `Esar_zi` \[Wh\]. Atribute client: `firmware`, `ip`. Atribute shared: `interval_s` (perioada de raportare, modificabilă din platformă), `prag_Ubat`. Metodă RPC: `setSarcina` cu parametru `true/false`.

#### 13.4 Programul nodului (MicroPython)

```python
# main.py - Pico W, nod monitorizare PV
import network, time, json, onewire, ds18x20
from machine import Pin, I2C
from umqtt.simple import MQTTClient
from ina219 import INA219                    # driver copiat pe placă
from secrets import SSID, PASS, TB_HOST, TOKEN

i2c = I2C(0, sda=Pin(4), scl=Pin(5), freq=400_000)
ina = {k: INA219(0.1, i2c, address=a) for k, a in (("pv", 0x40), ("bat", 0x41), ("sar", 0x44))}
for s in ina.values(): s.configure()
ds = ds18x20.DS18X20(onewire.OneWire(Pin(22))); rom = ds.scan()[0]
rele = Pin(17, Pin.OUT, value=1)
interval = 10
E = {"pv": 0.0, "sar": 0.0}; zi = time.localtime()[2]

def wifi():
    w = network.WLAN(network.STA_IF); w.active(True)
    if not w.isconnected():
        w.connect(SSID, PASS)
        for _ in range(40):
            if w.isconnected(): break
            time.sleep(0.5)
    return w.isconnected()

def la_mesaj(topic, msg):
    global interval
    t = topic.decode(); d = json.loads(msg)
    if "/rpc/request/" in t and d.get("method") == "setSarcina":
        rele.value(1 if d["params"] else 0)
        cli.publish(t.replace("request", "response"), json.dumps({"sarcina": rele.value()}))
    elif "interval_s" in d.get("shared", d):
        interval = int(d.get("shared", d)["interval_s"])

wifi()
cli = MQTTClient("pico-pv", TB_HOST, user=TOKEN, password="", keepalive=60)
cli.set_callback(la_mesaj); cli.connect()
cli.subscribe(b"v1/devices/me/rpc/request/+")
cli.subscribe(b"v1/devices/me/attributes")

t_ant = time.ticks_ms()
while True:
    try:
        cli.check_msg()
        ds.convert_temp(); time.sleep_ms(750)
        m = {}
        for k, s in ina.items():
            U = s.voltage(); I = s.current() / 1000
            m["U" + k], m["I" + k], m["P" + k] = round(U, 3), round(I, 3), round(U * I, 2)
        dt_h = time.ticks_diff(time.ticks_ms(), t_ant) / 3.6e6; t_ant = time.ticks_ms()
        E["pv"] += m["Ppv"] * dt_h; E["sar"] += m["Psar"] * dt_h      # Wh, metoda dreptunghiurilor
        if time.localtime()[2] != zi: E = {"pv": 0.0, "sar": 0.0}; zi = time.localtime()[2]
        m.update(Tpv=round(ds.read_temp(rom), 1), Epv_zi=round(E["pv"], 1), Esar_zi=round(E["sar"], 1))
        cli.publish(b"v1/devices/me/telemetry", json.dumps(m))
    except OSError:                          # pierderea conexiunii
        time.sleep(5); wifi(); cli.connect()
        cli.subscribe(b"v1/devices/me/rpc/request/+")
    time.sleep(max(0, interval - 1))
```

Notă: ceasul Pico W se sincronizează cu `ntptime.settime()` la pornire, altfel resetarea zilnică a energiei nu este corectă. Varianta mai robustă este calculul energiei zilnice în ThingsBoard (nod de agregare în lanțul de reguli).

#### 13.5 Configurarea ThingsBoard

1. *Profiles → Device profiles → Add*: profilul „Nod PV”, transport MQTT.
2. În profil, *Alarm rules*: „Baterie descărcată” — condiție `Ubat < 11.8` timp de 60 s, severitate *Critical*, ștergere când `Ubat > 12.4`; „Supratemperatură panou” — `Tpv > 70`, severitate *Major*.
3. *Entities → Devices → Add*: dispozitivul „PV-Laborator” cu profilul de mai sus; se copiază *access token*-ul în `secrets.py`.
4. Lanțul de reguli (*Root Rule Chain*): nodul *script* calculează randamentul instantaneu al controlerului `eta = Pbat_incarcare / Ppv` (când Ppv > 5 W) și îl salvează ca telemetrie; nodul *send email/notification* trimite alarmele critice.
5. *Dashboards*: grafic timp-serie Ppv și Psar, indicatoare radiale Ubat și Tpv, carduri Epv\_zi și Esar\_zi, tabel de alarme, widget *switch* conectat la RPC `setSarcina`.

#### 13.6 Indicatori energetici

- **Energia produsă**: E\_pv = Σ P\_pv·Δt.
- **Randamentul controlerului**: η\_MPPT = E\_iesire / E\_pv.
- **Randamentul panoului**: η\_pv = P\_pv / (G·A).
- **Raportul de performanță**: PR = (E\_pv / P\_n) / (H / 1000 W/m²), unde H este iradierea zilnică \[Wh/m²\] și P\_n puterea nominală \[Wp\].
- **Corecția de temperatură**: P(T) = P\_25·\[1 + γ·(T − 25 °C)\], γ ≈ −0,4 %/°C pentru siliciu cristalin.

### Exerciții și probleme rezolvate

**Problema 13.1.** Într-o zi senină panoul de 100 Wp a produs E\_pv = 520 Wh, iar iradierea măsurată în planul panoului a fost H = 6,2 kWh/m². Calculați PR.

*Rezolvare.* Orele echivalente la STC: H/1 kW/m² = 6,2 h. Energia teoretică: 100·6,2 = 620 Wh. PR = 520/620 = 0,84 (valoare bună pentru un sistem mic; pierderi din temperatură, controler, cabluri).

**Problema 13.2.** La G = 900 W/m² și T\_pv = 55 °C panoul livrează 74 W. Aria panoului este 0,54 m². Calculați randamentul panoului și puterea așteptată după modelul liniar.

*Rezolvare.* η\_pv = 74/(900·0,54) = 15,2 %. Puterea așteptată: 100·0,9·\[1 − 0,004·(55 − 25)\] = 90·0,88 = 79,2 W. Abaterea măsurat/așteptat = 74/79,2 = 0,934 — se verifică murdăria panoului sau umbrirea dacă abaterea persistă.

**Problema 13.3.** Bateria de 12 V / 50 Ah alimentează o sarcină medie de 18 W timp de 10 h pe noapte. Ce adâncime de descărcare (DoD) rezultă și câtă energie trebuie produsă ziua, dacă randamentul de încărcare–descărcare al bateriei este 85 % și al controlerului 95 %?

*Rezolvare.* Energie consumată: 180 Wh. Capacitate: 12·50 = 600 Wh ⇒ DoD = 30 %. Energia necesară de la panou: 180/(0,85·0,95) = 223 Wh/zi, sub cei 520 Wh produși într-o zi senină, dar aproape de producția unei zile înorate de iarnă (\~150–250 Wh).

### Temă de casă

1. Desenați schema bloc completă a sistemului (energie + date) și schema de conectare a celor trei INA219 (adrese setate prin pinii A0/A1).
2. Modificați programul nodului astfel încât să păstreze ultimele 360 de mesaje într-un buffer local când conexiunea lipsește și să le retrimită cu marcaj de timp (`{"ts": …, "values": …}`) la reconectare.
3. Scrieți scriptul nodului *script* din lanțul de reguli care calculează η\_MPPT și semnalează o alarmă când η\_MPPT < 0,85 mai mult de 5 minute.
4. Folosind datele unei zile exportate din ThingsBoard (CSV), calculați în Python E\_pv, E\_sar, PR și desenați profilul zilnic Ppv(t) și Psar(t).
5. Calculați câte zile de autonomie (fără soare) are sistemul din Problema 13.3 dacă DoD maxim admis este 50 %.

## Cursul 14. Dezvoltarea și implementarea unui proiect. Rezolvarea problemelor tehnice complexe

### Obiective

- Prezentarea ciclului de viață al unui proiect software/hardware și a metodelor de gestionare (cascadă, iterativ/Agile).
- Utilizarea controlului versiunilor (Git) și a documentării tehnice.
- Aplicarea unei metodologii sistematice de depanare și de analiză a cauzelor (5 De ce, Ishikawa).
- Planificarea unui proiect (structura activităților, drum critic, riscuri).

### Rezultatele învățării

- **Cunoștințe:** studentul descrie etapele unui proiect și instrumentele de gestionare a codului și a sarcinilor.
- **Aptitudini:** planifică un proiect de aplicație energetică, îl versionează cu Git, îl testează și îl documentează.
- **Responsabilitate și autonomie:** gestionează activități complexe într-o echipă interdisciplinară și ia decizii bazate pe date și pe analiza riscurilor.

### Conținut

#### 14.1 Ciclul de viață al unui proiect

1. **Inițiere** — problema, scopul, beneficiarii, criteriile de succes (măsurabile: „erori de măsură sub 1 %”, „alarmă în maximum 30 s”).
2. **Analiza cerințelor** — funcționale (ce face sistemul) și nefuncționale (precizie, disponibilitate, securitate, cost).
3. **Proiectare** — arhitectură, scheme electrice, model de date, algoritmi în pseudocod.
4. **Implementare** — cod, montaj, configurare platformă.
5. **Testare** — unitară (funcții), de integrare (componente împreună), de sistem (scenarii reale), de acceptanță (beneficiar).
6. **Punere în funcțiune și întreținere** — documentație, instruire, actualizări.

**Cascadă** — etapele se parcurg o singură dată, în ordine; potrivită când cerințele sunt fixe (proiecte de instalații). **Iterativ / Agile (Scrum, Kanban)** — livrări mici la 1–4 săptămâni, cu ajustarea cerințelor; potrivit pentru software și prototipuri.

#### 14.2 Controlul versiunilor cu Git

```bash
git init monitorizare-pv && cd monitorizare-pv
git add main.py README.md && git commit -m "Achizitie INA219 si trimitere MQTT"
git switch -c alarme                 # ramură nouă pentru o funcționalitate
# ... modificări ...
git commit -am "Alarma tensiune minima baterie"
git switch main && git merge alarme
git remote add origin https://github.com/<utilizator>/monitorizare-pv.git
git push -u origin main
git log --oneline --graph            # istoric
```

Reguli: un *commit* = o modificare logică cu mesaj clar; fișierele cu parole (`secrets.py`) se trec în `.gitignore`; codul se însocește de `README.md` (scop, conexiuni, instalare, utilizare).

#### 14.3 Testarea

```python
# test_calcule.py - rulare: pytest
from calcule import energie_trapez, randament
def test_energie():
    assert abs(energie_trapez([20, 35, 42, 38, 30], 1.0) - 140) < 1e-9
def test_randament_invalid():
    import pytest
    with pytest.raises(ValueError):
        randament(110, 100)          # P_util > P_absorbit
```

Pe lângă testele automate se testează hardware-ul cu valori cunoscute (sursă de laborator, multimetru etalon) și cazurile limită: senzor deconectat, Wi-Fi căzut, valori în afara domeniului, repornire după căderea tensiunii.

#### 14.4 Rezolvarea problemelor tehnice complexe

Metodologie de depanare:

1. **Reproduce** — problema se poate reproduce? În ce condiții?
2. **Izolează** — împarte sistemul (senzor → nod → rețea → platformă) și verifică fiecare interfață (înjumătățire, ca la metoda bisecției).
3. **Formulează ipoteze** și testează-le pe rând, modificând un singur lucru o dată.
4. **Corectează cauza**, nu simptomul.
5. **Verifică și documentează** — ce s-a întâmplat, cauza, soluția, cum se previne.

**5 De ce** — se întreabă repetat „de ce?” până la cauza rădăcină. **Diagrama Ishikawa** grupează cauzele posibile pe categorii: Om, Metodă, Mașină (hardware), Material, Măsurare, Mediu.

#### 14.5 Planificarea și drumul critic

Proiectul se descompune în activități (WBS), fiecare cu durată și predecesori. **Drumul critic** este cel mai lung lanț de activități dependente; o întârziere pe el întârzie tot proiectul. Activitățile din afara lui au rezervă de timp. Riscurile se trec într-un registru: probabilitate × impact, măsură de reducere, responsabil.

### Exerciții și probleme rezolvate

**Problema 14.1 (drum critic).** Proiectul „Monitorizare PV” are activitățile:

| Cod | Activitate | Durată \[zile\] | Predecesori |
| --- | --- | --- | --- |
| A | Analiza cerințelor | 2 | – |
| B | Achiziția componentelor | 7 | A |
| C | Proiectarea modelului de date și a platformei | 3 | A |
| D | Instalarea ThingsBoard (Docker) | 1 | C |
| E | Programarea nodului și montajul | 5 | B |
| F | Configurare reguli și panou de bord | 3 | D |
| G | Integrare și testare | 3 | E, F |
| H | Documentare și predare | 2 | G |

Determinați durata minimă și drumul critic.

*Rezolvare.* Termene minime de terminare: A = 2; B = 9; C = 5; D = 6; E = 14; F = 9; G = max(14, 9) + 3 = 17; H = 19 zile. Drumul critic: A → B → E → G → H (2 + 7 + 5 + 3 + 2 = 19). Ramura C → D → F se termină în ziua 9 și are 5 zile rezervă (G începe în ziua 14). Concluzie: comanda componentelor (B) e activitatea de urmărit; o livrare mai rapidă scurtează direct proiectul.

**Problema 14.2 (depanare).** Panoul de bord arată că nodul PV nu mai trimite date în fiecare zi între 19:00 și 07:00. Aplicați metoda 5 De ce.

*Rezolvare.* (1) De ce lipsesc datele? Nodul nu e conectat la broker. (2) De ce? Pico W s-a oprit. (3) De ce? Alimentarea de 5 V lipsește noaptea. (4) De ce? Nodul e alimentat din ieșirea USB a controlerului, care se deconectează odată cu sarcina la tensiune mică a bateriei. (5) De ce? Pragul de deconectare al controlerului (12,0 V) e atins seara din cauza unei sarcini prea mari. Cauza rădăcină: nodul de măsură depinde de circuitul pe care îl monitorizează. Soluție: alimentare separată a nodului (convertor DC–DC direct din baterie, consum \~0,5 W) și reducerea sarcinii; se adaugă telemetria `Unod` și o alarmă „nod inactiv” (*inactivity timeout* în ThingsBoard).

**Problema 14.3 (registru de riscuri).** Evaluați riscul „se arde INA219 la un scurtcircuit pe sarcină” (probabilitate 3/5, impact 4/5).

*Rezolvare.* Scor = 3·4 = 12 (ridicat, ≥ 10). Măsuri: siguranță fuzibilă pe circuitul sarcinii, dimensionată sub 3,2 A; senzor de rezervă în stoc; test de scurtcircuit doar cu sursă cu limitare de curent. Scor rezidual estimat: 1·4 = 4.

### Temă de casă (proiectul de semestru)

Alegeți o temă, în echipă de 2–3 studenți, și predați la colocviu: specificația cerințelor, arhitectura, planificarea (activități + drum critic + 5 riscuri), depozitul Git cu cod și README, rezultatele testelor și o prezentare de 10 minute.

1. Monitorizarea consumului unui laborator (curent, tensiune, putere, energie) cu alarmă la depășirea puterii contractate.
2. Sistem de reglare a temperaturii într-o incintă (termostat cu histerezis sau PID) cu raportare IoT și consemn modificabil de la distanță.
3. Monitorizarea unui sistem fotovoltaic cu calculul zilnic al PR și raport automat (Python, PDF/Excel).
4. Monitorizarea vibrațiilor și temperaturii unui motor (accelerometru I2C) cu detecția valorilor anormale.
5. Geamăn digital simplificat al unui rezervor de apă caldă (model termic + măsurători reale + comparație în timp real).
6. Temă propusă de echipă, aprobată de titular.

Criterii de evaluare a proiectului: funcționalitate (40 %), calitatea codului și a documentării (25 %), testare și analiza rezultatelor (20 %), prezentare (15 %).
