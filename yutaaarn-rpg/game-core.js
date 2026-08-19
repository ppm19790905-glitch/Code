const c=document.getElementById('game'),x=c.getContext('2d');
x.imageSmoothingEnabled=false;
const W=640,H=360,SAVE='yutaaarn-public-v1';
const K=new Set(),P=new Set();let sound=false,audio=null,dir='down',lastArea=0;
const C={ink:'#17161c',paper:'#f3ead2',gold:'#d0ad58',road:'#67635d',grass:'#667f58',grass2:'#758e63',stone:'#756d61',roof:'#39353a',wood:'#76513d',water:'#537889',red:'#94504a',blue:'#405d72',ui:'#202129'};
function r(a,b,w,h,col){x.fillStyle=col;x.fillRect(Math.round(a),Math.round(b),Math.round(w),Math.round(h))}
function tx(t,a,b,col=C.paper,s=11,al='left'){x.fillStyle=col;x.font=`${s}px ui-monospace,"MS Gothic",monospace`;x.textAlign=al;x.textBaseline='top';x.fillText(t,a,b)}
function panel(a,b,w,h){r(a,b,w,h,C.ink);r(a+3,b+3,w-6,h-6,C.ui);x.strokeStyle=C.paper;x.lineWidth=2;x.strokeRect(a+1,b+1,w-2,h-2)}
function shadow(a,b,w=24,s=1){r(a-w*s/2,b+17*s,w*s,4*s,'#11121888');r(a-(w-6)*s/2,b+20*s,(w-6)*s,2*s,'#11121855')}
function beep(f=440,d=.06){if(!sound)return;audio??=new(window.AudioContext||window.webkitAudioContext)();if(audio.state==='suspended')audio.resume();const o=audio.createOscillator(),g=audio.createGain();o.type='square';o.frequency.value=f;g.gain.value=.025;o.connect(g);g.connect(audio.destination);o.start();g.gain.exponentialRampToValueAtTime(.0001,audio.currentTime+d);o.stop(audio.currentTime+d)}
document.getElementById('sound').onclick=()=>{sound=!sound;document.getElementById('sound').textContent=sound?'SOUND ON':'SOUND OFF';beep(660)};
document.getElementById('full').onclick=async()=>{try{if(!document.fullscreenElement)await document.documentElement.requestFullscreen();else await document.exitFullscreen()}catch{}};
addEventListener('keydown',e=>{const k=e.key.toLowerCase();K.add(k);P.add(k);if(['arrowup','arrowdown','arrowleft','arrowright',' ','enter'].includes(k))e.preventDefault()});addEventListener('keyup',e=>K.delete(e.key.toLowerCase()));
for(const b of document.querySelectorAll('[data-k]')){const k=b.dataset.k.toLowerCase();const up=()=>{K.delete(k);b.classList.remove('is-pressed')};b.onpointerdown=e=>{e.preventDefault();b.setPointerCapture?.(e.pointerId);K.add(k);P.add(k);b.classList.add('is-pressed')};b.onpointerup=up;b.onpointercancel=up;b.onlostpointercapture=up}
const hit=(...a)=>a.some(k=>P.has(k));
const state={mode:'title',area:0,stage:0,hp:72,max:72,gold:120,done:{},dlg:null,battle:null,toast:'',tt:0,fx:{shake:0,enemyFlash:0,playerFlash:0,fade:0,particles:[],floaters:[]}};
const areas=[
{name:'止まるす、もとやわた。609号室',type:'home',npcs:[['めぐみん',490,145,'mom'],['ワインセラー3台',430,238,'wine'],['バカでかいスピーカー',300,105,'speaker']]},
{name:'南本八幡',type:'south',npcs:[['町内会長',380,245,'chair'],['牛乳屋',355,118,'milk'],['コロッケトル',500,190,'crow'],['→ ダイモーン通り',575,190,'daimonGate']]},
{name:'ダイモーン通り',type:'daimon',npcs:[['行列ゴーレム',220,190,'golem'],['のびーろ',490,190,'father'],['限定20食',565,190,'shop']]},
{name:'エドガーワ河川敷',type:'river',npcs:[['ヌルミズキング',250,210,'warm'],['釣りおじ',410,120,'fisher']]},
{name:'ホケキョー寺前',type:'temple',npcs:[['ズレオニ',190,215,'shift'],['1cmずれるベンチ',330,200,'bench']]},
{name:'モトヤワター駅前',type:'station',npcs:[['イップンチコク',220,200,'delay'],['駅員',340,185,'staff']]},
{name:'コーフダイ砦',type:'fort',npcs:[['イチダンオオイ',320,200,'step']]},
{name:'ギョートク沼地',type:'swamp',npcs:[['ニセンチヌマ',230,205,'swamp']]},
{name:'ナカヤーマ丘陵',type:'hill',npcs:[['ハクシュオクレ',320,200,'clap']]},
{name:'イチカワーナ中央街',type:'central',npcs:[['ノイズ研究員',330,190,'research'],['巨大受信機',500,190,'receiver']]},
{name:'銀河ライブ塔',type:'tower',npcs:[['カウントダウン係',320,190,'count']]},
{name:'超銀河ライブ会場',type:'live',npcs:[['銀河魔王ジャガール',490,190,'boss'],['宇宙送信装置',320,100,'machine']]}
];
let px=320,py=220;
function say(name,text){return{name,text}}
function dialog(lines,done=null){state.mode='dialog';state.dlg={lines,i:0,done}}
function toast(t){state.toast=t;state.tt=2}
function resetFx(){state.fx={shake:0,enemyFlash:0,playerFlash:0,fade:0,particles:[],floaters:[]}}
function impact(side,dmg,color){const f=state.fx;f.shake=.18;if(side==='enemy')f.enemyFlash=.16;else f.playerFlash=.16;const ox=side==='enemy'?480:140,oy=side==='enemy'?124:138;f.floaters.push({x:ox,y:oy-42,text:`-${dmg}`,color,t:.85});for(let i=0;i<10&&f.particles.length<24;i++){const a=Math.PI*2*i/10+(Math.random()-.5)*.3,s=26+Math.random()*40;f.particles.push({x:ox,y:oy-10,vx:Math.cos(a)*s,vy:Math.sin(a)*s-18,t:.42+Math.random()*.16,color})}}
function updateFx(dt){const f=state.fx;f.shake=Math.max(0,f.shake-dt);f.enemyFlash=Math.max(0,f.enemyFlash-dt);f.playerFlash=Math.max(0,f.playerFlash-dt);f.fade=Math.max(0,f.fade-dt);for(const p of f.particles){p.x+=p.vx*dt;p.y+=p.vy*dt;p.vy+=90*dt;p.t-=dt}f.particles=f.particles.filter(p=>p.t>0);for(const n of f.floaters){n.y-=22*dt;n.t-=dt}f.floaters=f.floaters.filter(n=>n.t>0);if(state.area!==lastArea){lastArea=state.area;f.fade=.36}}
function save(show=true){localStorage.setItem(SAVE,JSON.stringify({area:state.area,stage:state.stage,hp:state.hp,gold:state.gold,done:state.done,px,py,dir}));if(show)toast('セーブしました');beep(900)}
function load(){try{const d=JSON.parse(localStorage.getItem(SAVE));if(!d)return toast('セーブなし');Object.assign(state,{area:d.area??0,stage:d.stage??0,hp:d.hp??72,gold:d.gold??120,done:d.done??{},mode:'world'});px=d.px??320;py=d.py??220;dir=d.dir??'down';lastArea=state.area;resetFx();toast('ロードしました')}catch{toast('ロード失敗')}}
function reset(){Object.assign(state,{mode:'world',area:0,stage:0,hp:72,gold:120,done:{},dlg:null,battle:null});px=320;py=220;dir='down';lastArea=0;resetFx()}
function battle(id,name,hp,atk,after){state.mode='battle';state.battle={id,name,hp,max:hp,atk,sel:0,log:[name+' が現れた！'],after};resetFx()}
