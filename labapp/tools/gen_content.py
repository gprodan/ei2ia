import re, json, subprocess, html
src = open("tools/lab.md", encoding="utf-8").read()
src = re.sub(r"```latex\n(.*?)\n```", lambda m: "$$" + m.group(1).strip() + "$$", src, flags=re.S)
parts = re.split(r"^## (Lucrarea \d+\..*)$", src, flags=re.M)
intro = parts[0]
labs = []
def md2html(md):
    r = subprocess.run(["pandoc", "-f", "markdown+tex_math_dollars", "-t", "html", "--mathjax", "--no-highlight"],
                       input=md, capture_output=True, text=True, check=True)
    return r.stdout
for i in range(1, len(parts), 2):
    title = parts[i].strip(); body = parts[i+1]
    num = int(re.match(r"Lucrarea (\d+)", title).group(1))
    secs = dict(re.findall(r"^### (.+?)\n(.*?)(?=^### |\Z)", body, flags=re.M | re.S))
    codes = []
    def grab(md):
        out, last_label = [], ""
        lines = md.split("\n"); k = 0
        while k < len(lines):
            ln = lines[k]
            m = re.match(r"\*\*(Pasul \d+ — [^*]+?)\.?\*\*", ln)
            if m: last_label = m.group(1)
            if ln.startswith("```"):
                lang = ln[3:].strip() or "text"; buf = []; k += 1
                while not lines[k].startswith("```"): buf.append(lines[k]); k += 1
                n = len(codes)
                codes.append({"lang": lang, "code": "\n".join(buf), "label": last_label or "Cod"})
                out.append(f"\n[[COD:{n}]]\n")
            else:
                out.append(ln)
            k += 1
        return "\n".join(out)
    mod = grab(secs.get("Desfășurarea lucrării", ""))
    def chips(h):
        return re.sub(r"<p>\[\[COD:(\d+)\]\]</p>",
            lambda m: f'<button class="code-chip" data-code="{m.group(1)}"><span>‹/›</span> {html.escape(codes[int(m.group(1))]["label"])} — <b>{codes[int(m.group(1))]["lang"]}</b><em>vezi în panoul din dreapta</em></button>', h)
    sub = title.split(". ", 1)[1]
    labs.append({
        "id": num, "titlu": sub,
        "obiective": md2html(secs.get("Obiective", "")),
        "rezultate": md2html(secs.get("Rezultatele învățării", "")),
        "breviar": md2html(secs.get("Noțiuni teoretice", "")),
        "materiale": md2html(secs.get("Echipamente și software", "")),
        "mod": chips(md2html(mod)),
        "prelucrare": md2html(secs.get("Prelucrarea rezultatelor", "")),
        "intrebari": md2html(secs.get("Întrebări de verificare", "")),
        "cod": codes,
    })
introsec = intro.split("## Introducere", 1)[1]
out = "/* Generat automat din Îndrumarul de laborator — nu editați manual; rulați tools/gen_content.py */\n"
out += "window.LAB_INTRO = " + json.dumps(md2html(introsec), ensure_ascii=False) + ";\n"
out += "window.LABS = " + json.dumps(labs, ensure_ascii=False, indent=1) + ";\n"
open("assets/content.js", "w", encoding="utf-8").write(out)
for l in labs: print(l["id"], l["titlu"][:50], len(l["cod"]), [c["label"][:25] for c in l["cod"]])
