// Simulează Google Sheets / Apps Script ca să testăm fluxul complet al backend-ului.
const fs = require("fs");
const sheets = {};
function Sheet(name){ this.name=name; this.rows=[]; }
Sheet.prototype = {
  appendRow(r){ this.rows.push(r.slice()); }, setFrozenRows(){}, setFrozenColumns(){}, getName(){return this.name;},
  getLastRow(){ return this.rows.length; },
  getDataRange(){ const s=this; return { getValues(){ return s.rows.map(r=>r.slice()); } }; },
  getRange(r,c,nr,nc){ const s=this; return { setValues(v){ v.forEach((row,i)=>{ s.rows[r-1+i]=s.rows[r-1+i]||[]; row.forEach((x,j)=>s.rows[r-1+i][c-1+j]=x); }); return this; },
    setValue(x){ s.rows[r-1][c-1]=x; }, setFontWeight(){return this;}, setBackground(){return this;}, setNumberFormat(){return this;}, setDataValidation(){return this;} }; },
  clear(){ this.rows=[]; }
};
global.SpreadsheetApp = { getActiveSpreadsheet(){ return { getSheetByName(n){return sheets[n];}, insertSheet(n){ return sheets[n]=new Sheet(n);} }; } };
global.LockService = { getScriptLock(){ return { waitLock(){}, releaseLock(){} }; } };
global.ContentService = { MimeType:{JSON:1}, createTextOutput(t){ return { setMimeType(){ return JSON.parse(t); } }; } };
global.Utilities = { formatDate(d){ return new Date(d).toISOString(); } };
global.Session = { getScriptTimeZone(){ return "Europe/Bucharest"; } };
eval(fs.readFileSync("apps-script/Code.gs","utf8") + "\nglobal.doPost=doPost; global.foaie=foaie; global.catalog=catalog;");
global.SpreadsheetApp.getUi = () => ({ alert(m){ console.log("[UI]", m); }, createMenu(){ return this; } });
// pregătire
foaie("Config").appendRow(["DOMENIU_EMAIL","@365.univ-ovidius.ro",""]);
const now = new Date(); const hh = d => String(d.getHours()).padStart(2,"0")+":"+String(d.getMinutes()).padStart(2,"0");
foaie("Sesiuni").appendRow([1,"2312",now, hh(new Date(now-3600e3)), hh(new Date(+now+3600e3)), "AB12CD", new Date(+now+7*864e5), "DA"]);
const post = o => doPost({ postData:{ contents: JSON.stringify(o) } });
const st = { email:"ion.pop@365.univ-ovidius.ro", nume:"Ion Pop", grupa:"2312" };
console.log(post({actiune:"prezenta", ...st, email:"x@gmail.com", lucrare:1, cod:"AB12CD"}).mesaj);
console.log(post({actiune:"prezenta", ...st, lucrare:1, cod:"ZZZZZZ"}).mesaj);
console.log(post({actiune:"prezenta", ...st, lucrare:1, cod:"ab12cd"}).mesaj);
console.log(post({actiune:"prezenta", ...st, lucrare:1, cod:"AB12CD"}).mesaj);
const S = require("../assets/specs.js");
const date = { tipuri:[1,2,4,8,4,8].map((s,i)=>({tip:["char","short","int","long long","float","double"][i],sz:s})),
  tens:[0,150,207,230,253,260].map(U=>({U,ab:((U-230)/230*100).toFixed(2),cl:S.CLASE_U[U<2.3?0:U<207?1:U<=253?2:3]})), cos:[{},{},{}], app:{cod:"https://github.com/a/b"} };
const r = post({actiune:"referat", ...st, lucrare:1, date, grila:[1,2,0,1,0], text:{q0:"a ".repeat(30), concluzii:"b ".repeat(55)}});
console.log(r.mesaj, "nota", r.nota, JSON.stringify(r.puncte), "grila", r.grilaCorecte, "prezenta", r.prezenta, "termen", r.laTermen);
console.log(JSON.stringify(post({actiune:"status", email:st.email})));
catalog(); console.log(sheets.Catalog.rows.slice(0,2).map(r=>r.join(" | ")).join("\n"));
