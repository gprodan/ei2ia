import re, json, subprocess
src = open("tools/curs.md", encoding="utf-8").read()
src = re.sub(r"```latex\n(.*?)\n```", lambda m: "$$" + m.group(1).strip() + "$$", src, flags=re.S)
def md2html(md):
    return subprocess.run(["pandoc", "-f", "markdown+tex_math_dollars", "-t", "html", "--mathjax", "--no-highlight"],
                          input=md, capture_output=True, text=True, check=True).stdout
parts = re.split(r"^## (Cursul \d+\..*)$", src, flags=re.M)
cursuri = []
for i in range(1, len(parts), 2):
    title = parts[i].strip(); body = parts[i + 1]
    num = int(re.match(r"Cursul (\d+)", title).group(1))
    secs = {}
    for h, b in re.findall(r"^### (.+?)\n(.*?)(?=^### |\Z)", body, flags=re.M | re.S):
        key = next((k for k in ("Obiective", "Rezultatele", "Conținut", "Exerciții", "Temă") if h.startswith(k)), h)
        secs[key] = (h, b)
    cont = secs.get("Conținut", ("", ""))[1]
    sub = re.findall(r"^#### (.+)$", cont, flags=re.M)
    cursuri.append({
        "id": num, "titlu": title.split(". ", 1)[1],
        "obiective": md2html(secs["Obiective"][1]), "rezultate": md2html(secs["Rezultatele"][1]),
        "continut": md2html(cont), "subsectiuni": sub,
        "exercitii": md2html(secs["Exerciții"][1]),
        "tema_titlu": secs["Temă"][0], "tema": md2html(secs["Temă"][1]),
    })
intro = parts[0].split("## Introducere", 1)[1]
out = "/* Generat automat din Notele de curs — rulați tools/gen_curs.py */\n"
out += "window.CURS_INTRO = " + json.dumps(md2html(intro), ensure_ascii=False) + ";\n"
out += "window.CURSURI = " + json.dumps(cursuri, ensure_ascii=False) + ";\n"
open("assets/curs.js", "w", encoding="utf-8").write(out)
print(len(cursuri), [c["subsectiuni"][:2] for c in cursuri[:2]])
