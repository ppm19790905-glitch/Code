const c=document.getElementById('game'),x=c.getContext('2d');x.imageSmoothingEnabled=false;
const W=640,H=360,SAVE='yutaaarn-public-v1';
const K=new Set(),P=new Set();let sound=false,audio=null;
function beep(f=440,d=.06){if(!sound)return;audio??=new AudioContext();const o=audio.createOscillator(),g=audio.createGain();o.type='square';o.frequency.value=f;g.gain.value=.025;o.connect(g);g.connect(audio.destination);o.start();g.gain.exponentialRampToValueAtTime(.0001,audio.currentTime+d);o.stop(audio.currentTime+d)}
document.getElementById('sound').onclick=()=>{sound=!sound;document.getElementById('sound').textContent=sound?'SOUND ON':'SOUND OFF';beep(660)};document.getElementById('full').onclick=async()=>{try{if(!document.fullscreenElement)await document.documentElement.requestFullscreen();else await document.exitFullscreen()}catch{}};
addEventListener('keydown',e=>{const k=e.key.toLowerCase();K.add(k);P.add(k);if(['arrowup','arrowdown','arrowleft','arrowright',' ','enter'].includes(k))e.preventDefault()});addEventListener('keyup',e=>K.delete(e.key.toLowerCase()));
for(const b of document.querySelectorAll('[data-k]')){const k=b.dataset.k.toLowerCase();b.onpointerdown=e=>{e.preventDefault();b.setPointerCapture?.(e.pointerId);K.add(k);P.add(k)};const up=()=>K.delete(k);b.onpointerup=up;b.onpointercancel=up;b.onlostpointercapture=up}
const hit=(...a)=>a.some(k=>P.has(k));
const state={mode:'title',area:0,stage:0,hp:72,max:72,gold:120,done:{},dlg:null,battle:null,toast:'',tt:0};
const areas=[
{name:'止まるす、もとやわた。609号室',bg:'#b8a98a',npcs:[['めぐみん',490,145,'mom'],['ワインセラー3台',430,238,'wine'],['バカでかいスピーカー',300,105,'speaker']]},
{name:'南本八幡',bg:'#6f985e',npcs:[['町内会長',380,245,'chair'],['牛乳屋',355,118,'milk'],['コロッケトル',500,190,'crow']]},
{name:'ダイモーン通り',bg:'#897b65',npcs:[['行列ゴーレム',220,190,'golem'],['のびーろ',490,190,'father'],['限定20食',565,190,'shop']]},
{name:'エドガーワ河川敷',bg:'#719e63',npcs:[['ヌルミズキング',250,210,'warm'],['釣りおじ',410,120,'fisher']]},
{name:'ホケキョー寺前',bg:'#788565',npcs:[['ズレオニ',190,215,'shift'],['1cmずれるベンチ',330,200,'bench']]},
{name:'モトヤワター駅前',bg:'#817e78',npcs:[['イップンチコク',220,200,'delay'],['駅員',340,185,'staff']]},
{name:'コーフダイ砦',bg:'#78856c',npcs:[['イチダンオオイ',320,200,'step']]},
{name:'ギョートク沼地',bg:'#627b61',npcs:[['ニセンチヌマ',230,205,'swamp']]},
{name:'ナカヤーマ丘陵',bg:'#7d8d67',npcs:[['ハクシュオクレ',320,200,'clap']]},
{name:'イチカワーナ中央街',bg:'#77746f',npcs:[['ノイズ研究員',330,190,'research'],['巨大受信機',500,190,'receiver']]},
{name:'銀河ライブ塔',bg:'#302b39',npcs:[['カウントダウン係',320,190,'count']]},
{name:'超銀河ライブ会場',bg:'#18131f',npcs:[['銀河魔王ジャガール',490,190,'boss'],['宇宙送信装置',320,100,'machine']]}
];
const order=[0,1,2,0,1,3,4,5,0,6,7,8,9,10,11];
let px=320,py=220;
function say(name,text){return{name,text}}
function dialog(lines,done=null){state.mode='dialog';state.dlg={lines,i:0,done}}
function toast(t){state.toast=t;state.tt=2}
function save(show=true){localStorage.setItem(SAVE,JSON.stringify({area:state.area,stage:state.stage,hp:state.hp,gold:state.gold,done:state.done,px,py}));if(show)toast('セーブしました');beep(900)}
function load(){try{const d=JSON.parse(localStorage.getItem(SAVE));if(!d)return toast('セーブなし');Object.assign(state,{area:d.area??0,stage:d.stage??0,hp:d.hp??72,gold:d.gold??120,done:d.done??{},mode:'world'});px=d.px??320;py=d.py??220;toast('ロードしました')}catch{toast('ロード失敗')}}
function reset(){Object.assign(state,{mode:'world',area:0,stage:0,hp:72,gold:120,done:{},dlg:null,battle:null});px=320;py=220}
function battle(id,name,hp,atk,after){state.mode='battle';state.battle={id,name,hp,max:hp,atk,sel:0,log:[name+' が現れた！'],after}}
function act(id){
if(id==='mom'){
 if(state.stage===0)return dialog([say('めぐみん','ユータアーン。お父さん、昨日から帰ってこないの。'),say('ユータアーン','……どこ行ったの。'),say('めぐみん','ダイモーン通り。食べ歩き。'),say('ユータアーン','……。'),say('めぐみん','ついでに牛乳。低脂肪じゃないやつ。')],()=>{state.stage=1;state.area=1;toast('父を探せ！')});
 if(state.stage===3)return dialog([say('めぐみん','おかえり。お父さんは？'),say('ユータアーン','……飯。'),say('テレビ','速報です。川がぬるい。ベンチが1cmずれる。列車が1分遅れる。'),say('ユータアーン','……速報の基準。')],()=>{state.stage=4;state.area=1});
 if(state.stage===8)return dialog([say('のびーろ','三つとも同じ低音の残滓だ。'),say('めぐみん','コーフダイ、ギョートク、ナカヤーマね。'),say('ユータアーン','……地元スタンプラリー。')],()=>{state.stage=9;state.area=6});
 return dialog([say('めぐみん','牛乳、忘れないでね。')]);
}
if(id==='wine')return dialog([say('SYSTEM','ワインセラーが3台。'),say('ユータアーン','……多い。')]);
if(id==='speaker')return dialog([say('SYSTEM','音量3でも町内会が来る。'),say('ユータアーン','……2まで。')]);
if(id==='chair')return dialog([say('町内会長','鳩が強い！福引が3等しか出ん！'),say('ユータアーン','……寝たほうがいい。')]);
if(id==='milk'){if(!state.done.milk){state.done.milk=true;state.gold=Math.max(0,state.gold-90);toast('牛乳を入手')}return dialog([say('牛乳屋','低脂肪じゃないやつ。90G。')])}
if(id==='crow'){if(state.done.crow)return;return battle(id,'コロッケトル',34,9,()=>state.done.crow=true)}
if(id==='golem'){if(state.done.golem)return;return battle(id,'行列ゴーレム',58,12,()=>state.done.golem=true)}
if(id==='father'){
 if(!state.done.golem)return dialog([say('のびーろ','あの店、あと7分で開く。'),say('ユータアーン','……帰ろう。'),say('のびーろ','行列ゴーレムで二席足りない。'),say('ユータアーン','……何しに来たの。'),say('のびーろ','飯。')]);
 if(state.stage<3)return dialog([say('店主','店の前で戦うな！二人とも出禁！'),say('ユータアーン','……何しに来たの。'),say('のびーろ','飯。')],()=>{state.stage=3;state.area=0;px=320;py=220});
}
if(id==='shop')return dialog([say('店主','限定20食。お前らは出禁。')]);
if(id==='warm'){if(state.done.warm)return;return battle(id,'ヌルミズキング',66,13,()=>{state.done.warm=true;state.stage=Math.max(state.stage,5)})}
if(id==='shift'){if(state.done.shift)return;return battle(id,'ズレオニ',72,14,()=>{state.done.shift=true;state.stage=Math.max(state.stage,6)})}
if(id==='delay'){if(state.done.delay)return;return battle(id,'イップンチコク',62,12,()=>{state.done.delay=true;state.stage=8;state.area=0})}
if(id==='fisher')return dialog([say('釣りおじ','魚がゆで上がりそうだ。'),say('ユータアーン','……釣る前に料理。')]);
if(id==='bench')return dialog([say('SYSTEM','昨日より1cm左。'),say('ユータアーン','……誰が測ってるの。')]);
if(id==='staff')return dialog([say('駅員','全部の列車が必ず1分遅れる。'),say('ユータアーン','……絶妙に怒りにくい。')]);
if(id==='step'){if(state.done.step)return;return battle(id,'イチダンオオイ',82,15,()=>{state.done.step=true;state.area=7})}
if(id==='swamp'){if(state.done.swamp)return;return battle(id,'ニセンチヌマ',88,16,()=>{state.done.swamp=true;state.area=8})}
if(id==='clap'){if(state.done.clap)return;return battle(id,'ハクシュオクレ',86,16,()=>{state.done.clap=true;state.area=9;state.stage=12})}
if(id==='research')return dialog([say('ノイズ研究員','三方向の波形が銀河ライブ塔へ向いている！'),say('ユータアーン','……名前からしてライブ。'),say('ノイズ研究員','世界滅亡かもしれん！'),say('ユータアーン','……ライブ塔って言ったよね。')],()=>{state.stage=13;state.area=10});
if(id==='receiver')return dialog([say('SYSTEM','表示：OPEN 17:00'),say('ユータアーン','……開演時間。')]);
if(id==='count')return dialog([say('カウントダウン係','あと5分！急げ！'),say('ユータアーン','……何が。'),say('カウントダウン係','本番だよ！'),say('ユータアーン','……やっぱりライブ。')],()=>{state.area=11;state.stage=14});
if(id==='machine')return dialog([say('SYSTEM','南本八幡発・全宇宙同時中継'),say('ユータアーン','……町内放送の規模じゃない。')]);
if(id==='boss'){
 if(state.done.boss)return dialog([say('ユータアーン','……何のカウントダウンだったの。'),say('ジャガール','ライブだヨォ〜！'),say('ユータアーン','先に言って。'),say('ジャガール','お前が殴ってきたんだヨォ〜！'),say('SYSTEM','世界は救われた。最初から滅びる予定はなかった。')],()=>state.mode='ending');
 return dialog([say('ジャガール','開演直前だヨォ〜！'),say('ユータアーン','町のノイズ、止めて。'),say('ジャガール','それは演出だヨォ〜！'),say('ユータアーン','……迷惑。')],()=>battle(id,'銀河魔王ジャガール',118,18,()=>battle('boss2','超銀河ジャガール・ザ・ホンヤワターン',154,20,()=>{state.done.boss=true;save(false)})));
}
}
function nearest(){let best=null,bd=50;for(const n of areas[state.area].npcs){if(state.done[n[3]]&&['crow','golem','warm','shift','delay','step','swamp','clap'].includes(n[3]))continue;const d=Math.hypot(n[1]-px,n[2]-py);if(d<bd){bd=d;best=n}}return best}
function move(dt){let dx=0,dy=0;if(K.has('arrowleft')||K.has('a'))dx--;if(K.has('arrowright')||K.has('d'))dx++;if(K.has('arrowup')||K.has('w'))dy--;if(K.has('arrowdown')||K.has('s'))dy++;if(dx||dy){const l=Math.hypot(dx,dy);px=Math.max(35,Math.min(605,px+dx/l*120*dt));py=Math.max(70,Math.min(315,py+dy/l*120*dt))}}
function advanceArea(){if(state.mode!=='world')return;const target=order[Math.min(state.stage,order.length-1)];if(state.area!==target&&state.stage<9)state.area=target}
function update(dt){state.tt=Math.max(0,state.tt-dt);if(state.mode==='title'){if(hit('z','enter',' '))reset();if(hit('l'))load()}else if(state.mode==='world'){move(dt);if(hit('z','enter',' ')){const n=nearest();if(n)act(n[3])}if(hit('p'))save();if(hit('l'))load();if(state.stage===4&&!state.done.warm)state.area=3;if(state.stage===5&&!state.done.shift)state.area=4;if(state.stage===6&&!state.done.delay)state.area=5;advanceArea()}else if(state.mode==='dialog'){if(hit('z','enter',' ')){state.dlg.i++;if(state.dlg.i>=state.dlg.lines.length){const d=state.dlg.done;state.dlg=null;state.mode='world';d?.()}}}else if(state.mode==='battle'){const b=state.battle;if(hit('arrowup','w'))b.sel=(b.sel+2)%3;if(hit('arrowdown','s'))b.sel=(b.sel+1)%3;if(hit('z','enter',' ')){if(b.sel===2){state.mode='world';state.battle=null}else{const dmg=b.sel===0?Math.max(4,18+Math.floor(Math.random()*7)):10+Math.floor(Math.random()*9);b.hp-=dmg;b.log.push((b.sel===0?'物理':'食レポ')+' '+dmg+'ダメージ');beep(b.sel===0?150:700);if(b.hp<=0){const a=b.after;state.mode='world';state.battle=null;state.gold+=30;a?.();save(false)}else{const ed=Math.max(1,b.atk-7+Math.floor(Math.random()*5));state.hp-=ed;b.log.push(b.name+' '+ed+'ダメージ');if(state.hp<=0){state.hp=state.max;b.log.push('めぐみんの遠隔回復で復活。')}}}}}else if(state.mode==='ending'&&hit('z','enter',' '))state.mode='title';P.clear()}
const rect=(a,b,w,h,col)=>{x.fillStyle=col;x.fillRect(a,b,w,h)},txt=(t,a,b,col='#fff',s=12,al='left')=>{x.fillStyle=col;x.font=`${s}px monospace`;x.textAlign=al;x.textBaseline='top';x.fillText(t,a,b)};
function panel(a,b,w,h){rect(a,b,w,h,'#15151d');x.strokeStyle='#f5eccf';x.strokeRect(a+1,b+1,w-2,h-2)}
function drawWorld(){const A=areas[state.area];rect(0,0,W,H,A.bg);rect(0,150,W,80,'#69655f');for(let i=0;i<8;i++){rect(30+i*78,70+(i%2)*12,58,48,'#a28e72');rect(25+i*78,62+(i%2)*12,68,10,'#332d31')}for(const n of A.npcs){if(state.done[n[3]]&&['crow','golem','warm','shift','delay','step','swamp','clap'].includes(n[3]))continue;const enemy=['crow','golem','warm','shift','delay','step','swamp','clap','boss'].includes(n[3]);rect(n[1]-10,n[2]-15,20,30,enemy?'#5b485d':'#405e69');txt(n[0],n[1],n[2]+18,'#211',9,'center')}rect(px-8,py-12,16,24,'#355c79');rect(px-7,py-20,14,10,'#d9ae83');panel(8,8,624,34);txt(A.name,20,18,'#f5eccf',11);txt(`HP ${state.hp}/${state.max}  ${state.gold}G`,620,18,'#f5eccf',11,'right');const n=nearest();if(n){panel(448,312,182,36);txt('決定: '+n[0],458,323,'#f5eccf',10)}if(state.tt){panel(190,48,260,34);txt(state.toast,320,58,'#d2a84f',11,'center')}}
function drawDialog(){drawWorld();const l=state.dlg.lines[state.dlg.i];panel(20,246,600,102);txt(l.name,38,260,'#d2a84f',12);let line='',yy=284;for(const ch of l.text){if(line.length>=32){txt(line,38,yy,'#f5eccf',12);yy+=18;line=''}line+=ch}txt(line,38,yy,'#f5eccf',12)}
function drawBattle(){rect(0,0,W,H,'#292630');rect(0,0,W,185,'#5c7252');const b=state.battle;txt('南本八幡式・だいたい物理戦',16,12,'#fff',11);rect(120,105,50,70,'#355c79');rect(440,85,70,90,'#685b68');panel(18,196,604,146);txt(`ユータアーン HP ${state.hp}/${state.max}`,32,210);txt(`${b.name} HP ${Math.max(0,b.hp)}/${b.max}`,608,210,'#fff',12,'right');b.log.slice(-3).forEach((l,i)=>txt(l,32,236+i*18,'#fff',10));['殴る','食レポ','逃げる'].forEach((o,i)=>txt((i===b.sel?'▶ ':'  ')+o,470,242+i*24,i===b.sel?'#d2a84f':'#fff',12))}
function drawTitle(){rect(0,0,W,H,'#12121a');for(let i=0;i<70;i++)rect((i*83)%W,(i*47)%180,2,2,'#d6cfb6');txt('止まるす、もとやわた。',320,92,'#918395',11,'center');txt('ユータアーンRPG',320,194,'#d2a84f',28,'center');txt('南本八幡編',320,234,'#f5eccf',14,'center');txt('Z / Enter  はじめる',320,286,'#f5eccf',12,'center');txt('L  ロード',320,310,'#aaa58f',11,'center')}
function drawEnd(){rect(0,0,W,H,'#111119');txt('THE END',320,72,'#d2a84f',30,'center');txt('世界は救われた。',320,132,'#f5eccf',14,'center');txt('最初から滅びる予定はなかった。',320,158,'#f5eccf',13,'center');txt('南本八幡のライブは予定どおり開催された。',320,200,'#bbb39a',11,'center');txt('ユータアーンは帰りに牛乳を買った。',320,224,'#bbb39a',11,'center');txt('Z / Enter  タイトルへ',320,294,'#f5eccf',12,'center')}
let last=performance.now();function loop(t){const dt=Math.min(.033,(t-last)/1000);last=t;update(dt);if(state.mode==='title')drawTitle();else if(state.mode==='world')drawWorld();else if(state.mode==='dialog')drawDialog();else if(state.mode==='battle')drawBattle();else drawEnd();requestAnimationFrame(loop)}requestAnimationFrame(loop);