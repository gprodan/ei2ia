const S = require("../assets/specs.js");
const KEYS = {1:[1,2,0,1,1],2:[1,2,1,2,1],3:[1,1,2,1,0],4:[2,1,2,1,1],5:[1,2,3,2,1],6:[1,2,1,1,1],7:[1,2,2,1,1]};
const longt = "cuvant ".repeat(30), code = "https://github.com/x/y";
const T = {_text:{q0:longt,q1:longt,concluzii:"a ".repeat(60)}};
const D = {
 1:{tipuri:[["char",1],["short",2],["int",4],["long long",8],["float",4],["double",8]].map(([t,s])=>({tip:t,sz:s})),
    tens:[0,150,207,230,253,260].map(U=>({U, ab:((U-230)/230*100).toFixed(2), cl:S.CLASE_U[U<2.3?0:U<207?1:U<=253?2:3]})),
    cos:[[10,3],[10,8],[10,20]].map(([P,Q])=>{const s=Math.hypot(P,Q),c=P/s;return {P,Q,S:s.toFixed(2),c:c.toFixed(3),cat:["Fără penalizări","Energie reactivă facturată","Compensare obligatorie"][c>=.92?0:c>=.65?1:2]}}),
    app:{cod:code}},
 2:{put:[1,.8,.5,0].map(c=>({cos:c,Pa:2300*c,Pn:2300*c*1.0005,Qa:2300*Math.sqrt(1-c*c),Qn:2300*Math.sqrt(1-c*c),S:2300})),
    arm:{I1:10,I3:3,I5:1.5,THD:33.54,Ief:10.548}, cs:{W:620.8,Pmax:40.68,ora:18.5,Pmed:25.87,ki:0.636,Tmax:15.26}, app:{Ptot:5865,cod:code}},
 3:{i2c:{adr:"0x3C, 0x40"},cmp:[3,6,9,12].map(U=>({Us:U,Uvi:U*0.99,Um:U,Ivi:U/10*1.01,Im:U/10,Pvi:(U*0.99*U/10*1.01).toFixed(3),R:(U*0.99/(U/10*1.01)).toFixed(2)})),
    en:{P:14.3,t:300,Wc:1.19,Wi:1.2,Wp:1.19},app:{cod:code}},
 4:{cmp:[{v:"C SDK",T:100},{v:"MicroPython",T:101}],adc:[{Um:0.5,Un:0.51},{Um:1.6,Un:1.61},{Um:3.1,Un:3.08}],rtt:[{rssi:-45,mn:20,md:35,mx:90,p:0},{rssi:-75,mn:25,md:60,mx:300,p:1}],app:{topic:"lab/g1/nod01/#",cod:code}},
 5:{cal:[{x1:5,y1:4.9,x2:25,y2:24.6},{x1:0.4,y1:0.42,x2:8.7,y2:8.5},{x1:0.5,y1:1.2,x2:60,y2:59.1}].map(r=>{const a=(r.x2-r.x1)/(r.y2-r.y1);return {...r,a:a.toFixed(4),b:(r.x1-a*r.y1).toFixed(4)}}),
    ver:[{ref:3,ind:3.02},{ref:15,ind:15.1},{ref:27,ind:26.9},{ref:0.4,ind:0.41},{ref:8.7,ind:8.6},{ref:22.5,ind:22.9}],
    fb:{m:1,Ti:20,Tf:80,W:285,Q:251.16,eta:88.1},app:{cod:code}},
 6:{cfg:{profil:"Platforma masura",dev:"PM-g1",chei:"U V, I A",attr:"interval_s=5",alarme:"I>9 Major",reguli:"Script P_W"},
    al:[{t1:"10:00:00",t2:"10:00:06",dt:6},{t1:"10:05:00",t2:"10:05:05",dt:5},{t1:"10:10:00",t2:"10:11:10",dt:70}],rap:{Wa:120,Wb:121,Pmax:2000,cod:code}},
 7:{id:{Ta:22,P:30.6,C:1450,R:1.25,tau:30.2,Tinf:60.25,rmse1:0.3,rmse2:0.5,sig:0.2,prag:0.6},an:[{pert:"capac scos",rmax:1.8,dt:90}],cmd:[{ov:2.1},{ov:0.6}],app:{cod:code}}
};
for (let L=1;L<=7;L++){ const r=S.noteaza(L,{...D[L],...T},KEYS[L],KEYS[L]); console.log(L,r.nota,JSON.stringify(r.puncte), r.verificari.filter(c=>c.ok<1).map(c=>c.name+":"+c.ok.toFixed(2)).join("; ")); }
console.log("gol:", S.noteaza(1,{},[],KEYS[1]).nota);
