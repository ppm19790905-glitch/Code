// Final presentation layer: original pixel-art depth, feedback and UI polish.
const baseTree=tree,baseLantern=lantern,baseDrawArea=drawArea,baseDrawDialog=drawDialog,baseDrawBattle=drawBattle;

tree=function(a,b,s=1){
 const sway=Math.round(Math.sin(performance.now()/820+a*.07)*s);
 r(a-3*s,b+10*s,6*s,18*s,'#574334');r(a-13*s+sway,b-4*s,26*s,20*s,'#405d43');r(a-9*s+sway,b-10*s,18*s,13*s,'#56764f');r(a-16*s+sway,b+2*s,12*s,10*s,'#496947');r(a+5*s+sway,b,11*s,12*s,'#65835a');r(a-7*s+sway,b-7*s,6*s,3*s,'#789467');r(a+4*s+sway,b+3*s,4*s,3*s,'#789467');
};
lantern=function(a,b){
 const glow=.08+((Math.sin(performance.now()/260+a)+1)/2)*.09;x.fillStyle=`rgba(232,190,103,${glow})`;x.fillRect(Math.round(a-9),Math.round(b-10),22,20);r(a,b,4,22,'#5b4b3c');r(a-4,b-5,12,8,'#8d785a');r(a-2,b-3,8,4,'#e0bd75');r(a-5,b+21,14,3,'#514338');
};
function publicForeground(type){
 if(type==='south'){tree(18,330,1.25);tree(626,326,1.1);r(0,342,122,18,'#425c40');r(528,343,112,17,'#425c40')}
 else if(type==='daimon'){r(18,330,82,30,'#44392f');awning(20,330,78,'#6e5145');r(544,334,96,26,'#47372f');lantern(526,324)}
 else if(type==='river'){for(let q=0;q<110;q+=13)r(q,330-(q%4)*3,3,30,'#466847');for(let q=530;q<640;q+=14)r(q,334-(q%5)*2,3,26,'#466847')}
 else if(type==='temple'){tree(8,330,1.35);tree(632,330,1.35)}
 else if(type==='station'||type==='central'){r(0,340,150,20,'#494947');r(490,340,150,20,'#494947')}
 else if(type==='fort'){fence(0,338,145);fence(495,338,145);tree(24,334,1.15);tree(616,334,1.05)}
 else if(type==='swamp'){for(let q=0;q<125;q+=14)r(q,332-(q%4)*3,3,28,'#3f6145');for(let q=520;q<640;q+=13)r(q,334-(q%5)*2,3,26,'#3f6145')}
 else if(type==='hill'){tree(15,333,1.2);tree(625,334,1.2)}
 else if(type==='tower'){r(0,337,640,23,'#28232e');for(let q=26;q<630;q+=54){r(q,331,34,29,'#3b3442');r(q+5,326,24,8,'#51475a')}}
 else if(type==='live'){for(let q=22;q<620;q+=48){const bob=Math.round(Math.sin(performance.now()/180+q)*2);r(q,326+bob,30,34,'#201d27');r(q+7,319+bob,16,10,'#30283a')}}
}
function publicHud(){
 panel(10,8,620,32);tx(areas[state.area].name,22,17,C.paper,11);tx(`HP ${state.hp}/${state.max}  ${state.gold}G`,618,14,C.paper,10,'right');const ratio=Math.max(0,state.hp/state.max);r(492,30,116,4,'#3a2b31');r(492,30,116*ratio,4,ratio<.3?'#d35a55':'#6fa35f');
 const goals=['609号室から始まる','父を探す','ダイモーン通り','609号室へ戻る','町のノイズを追う','寺前へ','駅前へ','家族に報告','三方向の低音','コーフダイ砦','ギョートク沼地','ナカヤーマ丘陵','発信源を調査','銀河ライブ塔','カウントダウンを止める（たぶん）'];const goal=goals[Math.min(state.stage,goals.length-1)];r(154,42,332,18,'#f3ead2dd');r(154,42,4,18,C.gold);tx(goal,320,46,'#2c241d',9,'center');
}
function publicFx(){
 for(const p of state.fx.particles){const s=p.t>.3?3:2;r(p.x,p.y,s,s,p.color)}for(const n of state.fx.floaters)tx(n.text,n.x,n.y,n.color,13,'center');if(state.fx.fade>0){x.fillStyle=`rgba(16,17,22,${Math.min(.62,state.fx.fade*1.6)})`;x.fillRect(0,0,W,H)}
}
drawArea=function(){
 baseDrawArea();const A=areas[state.area];publicForeground(A.type);publicHud();const n=nearest();if(n){const bob=Math.round(Math.sin(performance.now()/180)*2);panel(456,309,174,39);tx('◆',469,320+bob,C.gold,10);tx(n[0],487,319,C.paper,10);tx('Z / 決定',616,333,'#aaa58f',8,'right')}if(state.tt>0){panel(190,47,260,34);tx(state.toast,320,57,C.gold,11,'center')}publicFx();
};
drawDialog=function(){
 drawArea();const d=state.dlg,l=d.lines[d.i];panel(24,250,592,96);const nw=Math.max(76,l.name.length*14+18);r(36,256,nw,22,'#2b2630');r(36,276,nw,2,C.gold);tx(l.name,46,260,C.gold,12);wrap(l.text,42,286,545,18,C.paper,13);const bob=Math.round(Math.sin(performance.now()/150)*2);tx('▼',592,324+bob,C.gold,12,'right');tx(`${d.i+1}/${d.lines.length}`,574,258,'#8f8b7e',8,'right');
};
function impactBurst(cx,cy,t,col){const k=Math.max(0,t/.16),len=8+Math.round(k*12);r(cx-len,cy-2,len*2,4,col);r(cx-2,cy-len,4,len*2,col);r(cx-8,cy-8,5,5,'#fff8dc');r(cx+4,cy+5,4,4,'#fff8dc')}
drawBattle=function(){
 r(0,0,W,H,'#29252d');const f=state.fx,sx=f.shake>0?Math.floor(Math.random()*7)-3:0,sy=f.shake>0?Math.floor(Math.random()*5)-2:0;x.save();x.translate(sx,sy);battleBackdrop();drawYuta(140,135,'right',2,false);r(181,116,50,5,'#6b4a2e');battleSprite(state.battle.id,480,130);if(f.enemyFlash>0)impactBurst(480,110,f.enemyFlash,C.gold);if(f.playerFlash>0)impactBurst(140,116,f.playerFlash,'#e27a6d');for(const p of f.particles){const s=p.t>.3?3:2;r(p.x,p.y,s,s,p.color)}for(const n of f.floaters)tx(n.text,n.x,n.y,n.color,13,'center');x.restore();
 const b=state.battle;panel(18,196,604,146);tx(`ユータアーン HP ${state.hp}/${state.max}`,32,207,C.paper,11);tx(`${b.name} HP ${b.hp}/${b.max}`,608,207,C.paper,11,'right');r(32,222,176,5,'#3b2b31');r(32,222,176*Math.max(0,state.hp/state.max),5,'#6fa35f');r(432,222,176,5,'#3b2b31');r(432,222,176*Math.max(0,b.hp/b.max),5,b.hp/b.max<.25?'#d26458':'#b35353');b.log.slice(-3).forEach((l,i)=>wrap(l,32,238+i*17,382,15,C.paper,10));['殴る','食レポ','逃げる'].forEach((o,i)=>{if(i===b.sel)r(456,239+i*23,145,20,'#3a3442');tx(`${i===b.sel?'▶':' '} ${o}`,470,242+i*23,i===b.sel?C.gold:C.paper,12)});
};
