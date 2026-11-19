#!/bin/sh
# Regenerează conținutul din îndrumar și fișierul unic pentru Apps Script.
cd "$(dirname "$0")/.."
python3 tools/gen_content.py >/dev/null
{ echo "// ===== GENERAT: assets/specs.js + apps-script/server.gs — copiați tot fișierul în editorul Apps Script ====="; cat assets/specs.js; echo; cat apps-script/server.gs; } > apps-script/Code.gs
echo "OK: assets/content.js și apps-script/Code.gs regenerate"
