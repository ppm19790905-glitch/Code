function act(id){
 if(id==='mom'){
  if(state.stage===0)return dialog([say('めぐみん','ユータアーン。お父さん、昨日から帰ってこないの。'),say('ユータアーン','……どこ行ったの。'),say('めぐみん','ダイモーン通り。食べ歩き。'),say('ユータアーン','……。'),say('めぐみん','ついでに牛乳。低脂肪じゃないやつ。')],()=>{state.stage=1;state.area=1;px=320;py=220;toast('父を探せ！')});
  if(state.stage===3)return dialog([say('めぐみん','おかえり。お父さんは？'),say('ユータアーン','……飯。'),say('テレビ','速報です。川がぬるい。ベンチが1cmずれる。列車が1分遅れる。'),say('ユータアーン','……速報の基準。')],()=>{state.stage=4;state.area=3;px=320;py=220;toast('第2章：町のノイズ')});
  if(state.stage===8)return dialog([say('のびーろ','三つとも同じ低音の残滓だ。'),say('めぐみん','コーフダイ、ギョートク、ナカヤーマね。'),say('ユータアーン','……地元スタンプラリー。')],()=>{state.stage=9;state.area=6;px=320;py=220});
  return dialog([say('めぐみん','牛乳、忘れないでね。')]);
 }
 if(id==='daimonGate'){state.area=2;px=320;py=220;toast('ダイモーン通り');return}
 if(id==='wine')return dialog([say('SYSTEM','ワインセラーが3台。'),say('ユータアーン','……多い。')]);
 if(id==='speaker')return dialog([say('SYSTEM','音量3でも町内会が来る。'),say('ユータアーン','……2まで。')]);
 if(id==='chair')return dialog([say('町内会長','鳩が強い！ 福引が3等しか出ん！'),say('ユータアーン','……寝たほうがいい。')]);
 if(id==='milk'){if(!state.done.milk){state.done.milk=true;state.gold=Math.max(0,state.gold-90);toast('牛乳を入手')}return dialog([say('牛乳屋','低脂肪じゃないやつ。90G。')])}
 if(id==='crow'){if(!state.done.crow)return battle(id,'コロッケトル',34,9,()=>state.done.crow=true);return}
 if(id==='golem'){if(!state.done.golem)return battle(id,'行列ゴーレム',58,12,()=>state.done.golem=true);return}
 if(id==='father'){
  if(!state.done.golem)return dialog([say('のびーろ','あの店、あと7分で開く。'),say('ユータアーン','……帰ろう。'),say('のびーろ','行列ゴーレムで二席足りない。'),say('ユータアーン','……何しに来たの。'),say('のびーろ','飯。')]);
  if(state.stage<3)return dialog([say('店主','店の前で戦うな！ 二人とも出禁！'),say('ユータアーン','……何しに来たの。'),say('のびーろ','飯。')],()=>{state.stage=3;state.area=0;px=320;py=220});
 }
 if(id==='shop')return dialog([say('店主','限定20食。お前らは出禁。')]);
 if(id==='warm'){if(!state.done.warm)return battle(id,'ヌルミズキング',66,13,()=>{state.done.warm=true;state.stage=5;state.area=4;px=320;py=220});return}
 if(id==='shift'){if(!state.done.shift)return battle(id,'ズレオニ',72,14,()=>{state.done.shift=true;state.stage=6;state.area=5;px=320;py=220});return}
 if(id==='delay'){if(!state.done.delay)return battle(id,'イップンチコク',62,12,()=>{state.done.delay=true;state.stage=8;state.area=0;px=320;py=220});return}
 if(id==='fisher')return dialog([say('釣りおじ','魚がゆで上がりそうだ。'),say('ユータアーン','……釣る前に料理。')]);
 if(id==='bench')return dialog([say('SYSTEM','昨日より1cm左。'),say('ユータアーン','……誰が測ってるの。')]);
 if(id==='staff')return dialog([say('駅員','全部の列車が必ず1分遅れる。'),say('ユータアーン','……絶妙に怒りにくい。')]);
 if(id==='step'){if(!state.done.step)return battle(id,'イチダンオオイ',82,15,()=>{state.done.step=true;state.stage=10;state.area=7;px=320;py=220});return}
 if(id==='swamp'){if(!state.done.swamp)return battle(id,'ニセンチヌマ',88,16,()=>{state.done.swamp=true;state.stage=11;state.area=8;px=320;py=220});return}
 if(id==='clap'){if(!state.done.clap)return battle(id,'ハクシュオクレ',86,16,()=>{state.done.clap=true;state.stage=12;state.area=9;px=320;py=220});return}
 if(id==='research')return dialog([say('ノイズ研究員','三方向の波形が銀河ライブ塔へ向いている！'),say('ユータアーン','……名前からしてライブ。'),say('ノイズ研究員','世界滅亡かもしれん！'),say('ユータアーン','……ライブ塔って言ったよね。')],()=>{state.stage=13;state.area=10;px=320;py=220});
 if(id==='receiver')return dialog([say('SYSTEM','表示：OPEN 17:00'),say('ユータアーン','……開演時間。')]);
 if(id==='count')return dialog([say('カウントダウン係','あと5分！ 急げ！'),say('ユータアーン','……何が。'),say('カウントダウン係','本番だよ！'),say('ユータアーン','……やっぱりライブ。')],()=>{state.area=11;state.stage=14;px=320;py=220});
 if(id==='machine')return dialog([say('SYSTEM','南本八幡発・全宇宙同時中継'),say('ユータアーン','……町内放送の規模じゃない。')]);
 if(id==='boss'){
  if(state.done.boss)return dialog([say('ユータアーン','……何のカウントダウンだったの。'),say('ジャガール','ライブだヨォ〜！'),say('ユータアーン','先に言って。'),say('ジャガール','お前が殴ってきたんだヨォ〜！'),say('SYSTEM','世界は救われた。最初から滅びる予定はなかった。')],()=>state.mode='ending');
  return dialog([say('ジャガール','開演直前だヨォ〜！'),say('ユータアーン','町のノイズ、止めて。'),say('ジャガール','それは演出だヨォ〜！'),say('ユータアーン','……迷惑。')],()=>battle(id,'銀河魔王ジャガール',118,18,()=>battle('boss2','超銀河ジャガール・ザ・ホンヤワターン',154,20,()=>{state.done.boss=true;save(false)})));
 }
}
function nearest(){let best=null,bd=52;for(const n of areas[state.area].npcs){if(state.done[n[3]]&&['crow','golem','warm','shift','delay','step','swamp','clap'].includes(n[3]))continue;const d=Math.hypot(n[1]-px,n[2]-py);if(d<bd){bd=d;best=n}}return best}
function move(dt){let dx=0,dy=0;if(K.has('arrowleft')||K.has('a'))dx--;if(K.has('arrowright')||K.has('d'))dx++;if(K.has('arrowup')||K.has('w'))dy--;if(K.has('arrowdown')||K.has('s'))dy++;if(dx||dy){const l=Math.hypot(dx,dy);if(Math.abs(dx)>Math.abs(dy))dir=dx<0?'left':'right';else dir=dy<0?'up':'down';px=Math.max(35,Math.min(605,px+dx/l*118*dt));py=Math.max(72,Math.min(315,py+dy/l*118*dt))}}
function update(dt){state.tt=Math.max(0,state.tt-dt);if(state.mode==='title'){if(hit('z','enter',' '))reset();if(hit('l'))load()}else if(state.mode==='world'){move(dt);if(hit('z','enter',' ')){const n=nearest();if(n)act(n[3])}if(hit('p'))save();if(hit('l'))load()}else if(state.mode==='dialog'){if(hit('z','enter',' ')){state.dlg.i++;if(state.dlg.i>=state.dlg.lines.length){const d=state.dlg.done;state.dlg=null;state.mode='world';d?.()}}}else if(state.mode==='battle'){const b=state.battle;if(hit('arrowup','w'))b.sel=(b.sel+2)%3;if(hit('arrowdown','s'))b.sel=(b.sel+1)%3;if(hit('z','enter',' ')){if(b.sel===2){state.mode='world';state.battle=null}else{const dmg=b.sel===0?Math.max(4,18+Math.floor(Math.random()*8)-4):8+Math.floor(Math.random()*9);b.hp=Math.max(0,b.hp-dmg);b.log.push((b.sel===0?'物理':'食レポ')+' '+dmg+'ダメージ');beep(b.sel===0?150:740);if(b.hp<=0){const after=b.after;state.mode='world';state.battle=null;state.gold+=20;after?.();save(false)}else{const hurt=Math.max(1,b.atk-7+Math.floor(Math.random()*5));state.hp=Math.max(1,state.hp-hurt);b.log.push(b.name+'の攻撃 '+hurt+'ダメージ')}}}}else if(state.mode==='ending'&&hit('z','enter',' '))state.mode='title';P.clear()}
