const $ = id => document.getElementById(id);
const icons = {
  branch:'<circle cx="7" cy="5" r="2.3"/><circle cx="7" cy="19" r="2.3"/><circle cx="17" cy="6" r="2.3"/><path d="M7 7.5v9M7 14c6 0 10-2 10-5.5"/>',
  folder:'<path d="M3 7V5h7l2 3h9v11H3z"/>',
  bulb:'<path d="M9 17c0-3-3-3-3-7a6 6 0 0 1 12 0c0 4-3 4-3 7zM10 20h4"/>',
  flag:'<path d="M5 21V4q4-3 8 0t7 0v9q-4 3-7 0t-8 0"/>',
  check:'<path d="m5 12 4 4L19 6"/>'
};
function icon(name){return '<svg class="ico" viewBox="0 0 24 24" aria-hidden="true">'+icons[name]+'</svg>'}
document.querySelectorAll('[data-icon]').forEach(el=>el.innerHTML=icon(el.dataset.icon));

// Each exercise starts from its own stated preconditions, so learners can revisit any station.
const moves = {
  add:['暂存文件','git add','git add 清单.md','把当前文件的内容选入下一次提交。'],
  commit:['保存版本','git commit','git commit -m "补充雨伞"','把暂存区的内容记录为一个本地版本。'],
  push:['推送版本','git push','git push','把本地分支的新提交发送到对应的远端分支。'],
  pull:['拉取更新','git pull','git pull','取回远端的新提交，并整合到当前分支。'],
  branch:['新建分支','git switch -c','git switch -c picnic','从当前位置创建 picnic 分支，并切换过去。'],
  pr:['请求合并','Pull Request','Pull Request','在 GitHub 上提出合并请求，让同伴比较两个分支的改动。']
};
const lessons = [
  {key:'add',name:'暂存文件',group:'本地版本',title:'只选清单，准备提交',prompt:'你在清单里加了雨伞。怎样选中这次修改，准备提交？',options:['commit','add','push'],hint:'暂存区像一个托盘，先挑出这次要一起保存的改动。',result:'清单已暂存。工作区里还有这份文件，现在可以提交了。',left:'file',right:'tray',labels:['工作区','暂存区'],before:['清单.md · 已修改','空'],after:['清单.md · 已修改','清单.md · 已暂存']},
  {key:'commit',name:'提交版本',group:'本地版本',title:'给今天的清单存个版本',prompt:'雨伞已经暂存。怎样留下一个以后能找回的版本？',options:['pull','push','commit'],hint:'提交会给暂存的内容拍一张快照，顺手写明这次改了什么。',result:'本地历史多了一次提交「补充雨伞」。GitHub 上的清单还是旧版。',left:'trayFull',right:'history',labels:['暂存区','本地历史'],before:['清单.md · 已暂存','1 次提交'],after:['已与新提交一致','2 次提交 · 补充雨伞']},
  {key:'push',name:'推送到云端',group:'远端同步',title:'把新版送给同伴',prompt:'本地已经提交，分支也已关联 GitHub。怎样把新版送过去？',options:['push','add','pull'],hint:'看箭头的起点。新版在你的电脑上，要送到 GitHub。',result:'GitHub 上的分支也有了「补充雨伞」这次提交。',left:'laptop',right:'cloud',labels:['你的电脑','GitHub'],before:['版本 2','版本 1'],after:['版本 2','版本 2']},
  {key:'pull',name:'拉取新版本',group:'远端同步',title:'把同伴的更新带回电脑',prompt:'同伴在 GitHub 加了水壶，你本地没有新改动。怎样跟上？',options:['commit','pull','push'],hint:'新版在 GitHub，目标是更新你电脑上的当前分支。',result:'本地也到了版本 3。打开清单，就能看到同伴加的水壶。',left:'cloud',right:'laptop',labels:['GitHub','你的电脑'],before:['版本 3 · 新增水壶','版本 2'],after:['版本 3 · 新增水壶','版本 3 · 新增水壶']},
  {key:'branch',name:'新建分支',group:'分支协作',title:'单独试写野餐方案',prompt:'你正在 main 分支上。怎样开一条叫 picnic 的支线来试写？',options:['push','commit','branch'],hint:'新分支从当前提交出发。切换后，下一次提交会记在新分支上。',result:'picnic 和 main 现在指向同一提交，你已切到 picnic，可以开始试写。',left:'history',right:'fork',labels:['主分支','试写分支'],before:['当前位置 · main','picnic 尚未创建'],after:['main · 原提交','当前位置 · picnic']},
  {key:'pr',name:'发起合并请求',group:'分支协作',title:'请同伴看看野餐方案',prompt:'picnic 的改动已推到 GitHub。怎样请同伴先审阅，再决定是否合进 main？',options:['pr','pull','add'],hint:'在 GitHub 上选 main 为目标分支、picnic 为改动来源，再发起审阅。',result:'合并请求已打开，目标是 main。两个分支仍然分开，等待审阅。',left:'fork',right:'review',labels:['方案分支','GitHub 审阅'],before:['picnic · 已推送','尚无合并请求'],after:['picnic · 已推送','等待审阅 → main']}
];
const ink='#293631', cream='#fff9e9', orange='#f28c65', green='#91c5a5';
const art={
  file:'<path d="m-45-39 58-9 26 21 2 62-79 11z" fill="#e2ad77"/><path d="m-53-46 57-8 26 21 3 62-78 11z" fill="'+cream+'"/><path d="m4-54 2 24 24-3" fill="#f4cf9d"/><path d="m-35-21 26-4m-25 15 42-6m-41 17 33-5" fill="none"/><g transform="translate(12 14) rotate(-6)"><rect width="32" height="29" rx="6" fill="'+orange+'"/><path d="M9 14h14m-7-7v14"/></g>',
  tray:'<path d="m-59 4 25-39 75-1 23 38-7 28-98 8z" fill="#add2b8"/><path d="m-49 3 22-29 62-1 15 28-83 13z" fill="#749c82"/><path d="m-57 2 33 1 6 12 28-2 7-13 44-2-4 33-102 8z" fill="#aedabd"/><path d="m-32 29 66-4" fill="none"/>',
  history:'<g fill="'+cream+'"><path d="m-56 18 69-19 45 16-68 22z"/><path d="m-56 6 69-20 45 16-68 22z"/><path d="m-56-7 69-19 45 16-68 22z" fill="'+orange+'"/></g><path d="m-24-8 29-8m-19 13 29-8" fill="none"/>',
  laptop:'<path d="m-49-34 79-7 5 61-79 7z" fill="#536960"/><path d="m-43-28 67-6 4 47-67 6z" fill="#c1dbc9"/><path d="m-44 27 79-7 22 13-81 9-23-12z" fill="#eff0da"/><path d="m-25-3 7 5-6 7m13 0 15-2" fill="none"/>',
  cloud:'<path d="M-36 23c-25-1-26-34-4-40 1-16 20-25 34-17 16-22 46-12 47 9 24-1 31 34 6 39z" fill="#8bb49b"/><path d="M-39 16c-25-1-26-34-4-40 1-16 20-25 34-17 16-22 46-12 47 9 24-1 31 34 6 39z" fill="#e8f1dc"/><path d="m-17-8 11 10 20-23" fill="none"/>',
  fork:'<path d="M-48 24h98M-39 24c31 0 20-52 53-52h26" fill="none" stroke-width="5"/><g fill="'+cream+'"><circle cx="-40" cy="24" r="9"/><circle cx="42" cy="24" r="9"/></g><circle cx="39" cy="-28" r="10" fill="'+orange+'"/>',
  review:'<rect x="-45" y="-36" width="90" height="65" rx="7" fill="#d1e6cf"/><path d="M-45-18h90"/><circle cx="-35" cy="-27" r="2" fill="'+ink+'"/><path d="M-29-27h7m-7 24 5 5 9-11m10 6h23m-47 15h44" fill="none"/>'
};
art.trayFull=art.tray.replace('<path d="m-57','<path d="m-27 7 4-38 44-6 9 40z" fill="'+cream+'"/><path d="m-14-20 25-4m-25 12 23-3" fill="none"/><path d="m-57');
art.pointer='<path d="M-44 2h88" fill="none"/><circle r="14" fill="'+orange+'"/><circle r="4" fill="'+ink+'"/>';
art.emptyBranch='<circle r="14" fill="none" stroke-dasharray="4 5" stroke="#7c9384"/>';
art.emptyReview='<rect x="-43" y="-29" width="86" height="58" rx="7" fill="none" stroke="#7c9384" stroke-dasharray="5 5"/>';
art.oneVersion='<path d="m-56 6 69-20 45 16-68 22z" fill="'+cream+'"/>';
function diagram(l,done){
  let right=l.right,left=l.left;
  if(l.key==='branch'){
    left='pointer';
    right=done?'pointer':'emptyBranch';
  }
  if(l.key==='pr' && !done)right='emptyReview';
  if(l.key==='commit' && !done)right='oneVersion';
  if(done && l.key==='add')right='trayFull';
  const labels=done?l.after:l.before;
  const side=(x,type,i)=>'<g transform="translate('+x+' 70)" stroke="'+ink+'" stroke-width="2.7" stroke-linejoin="round" stroke-linecap="round"><ellipse cy="38" rx="63" ry="7" fill="#d2dfd2" stroke="none"/>'+art[type]+'</g><text x="'+x+'" y="138" font-size="18" font-weight="700">'+l.labels[i]+'</text><text x="'+x+'" y="161" font-size="14" fill="#4b5e53">'+labels[i]+'</text>';
  return '<svg class="diagram" viewBox="0 0 580 176" role="img" aria-label="'+l.labels[0]+'，'+labels[0]+'。'+l.labels[1]+'，'+labels[1]+'。" fill="'+ink+'" text-anchor="middle">'+side(152,left,0)+'<path d="M230 71h117m-9-8 9 8-9 8" stroke="'+(done?'#457853':'#718679')+'" fill="none" stroke-width="2.4" stroke-dasharray="5 5"/><rect x="270" y="52" width="38" height="37" rx="18" fill="'+(done?'#d6ecd9':'#f7faf4')+'" stroke="#8fa798"/>'+ (done?'<path d="m280 70 6 6 11-13" fill="none" stroke="#345d41" stroke-width="3"/>':'<text x="289" y="78" font-size="22" font-weight="680">?</text>')+'<g class="'+(done?'after':'')+'">'+side(428,right,1)+'</g></svg>'
}
const storageKey='branch-lab.practice.v1';
let progress={current:0,completed:[]};
try{
  const saved=JSON.parse(localStorage.getItem(storageKey));
  if(saved && Number.isInteger(saved.current) && lessons[saved.current] && Array.isArray(saved.completed)){
    progress={current:saved.current,completed:[...new Set(saved.completed.filter(k=>lessons.some(l=>l.key===k)))]};
  }
}catch{}
let solved=false,view='lab';
function save(){try{localStorage.setItem(storageKey,JSON.stringify(progress))}catch{}}
function showView(next){
  view=next;
  $('workspace').hidden=view!=='lab';$('cards').hidden=view!=='cards';$('finish').hidden=view!=='finish';
  [['labTab',view!=='cards'],['cardsTab',view==='cards']].forEach(([id,active])=>{
    if(active)$(id).setAttribute('aria-current','page');else $(id).removeAttribute('aria-current')
  });
}
function route(){
  $('count').textContent=progress.completed.length+' / '+lessons.length;
  $('segments').innerHTML=lessons.map(l=>'<i class="'+(progress.completed.includes(l.key)?'on':'')+'"></i>').join('');
  $('route').replaceChildren();
  lessons.forEach((l,i)=>{
    const item=document.createElement('li'),btn=document.createElement('button');
    const active=progress.current===i,done=progress.completed.includes(l.key);
    btn.className='routebtn'+(active?' active':'')+(done?' done':'');
    if(active)btn.setAttribute('aria-current','step');
    btn.setAttribute('aria-label','第 '+(i+1)+' 站，'+l.name+(done?'，已完成':''));
    btn.innerHTML='<span class="num">'+(done?icon('check'):String(i+1).padStart(2,'0'))+'</span><b>'+l.name+'</b>'+(active?'<small>当前</small>':'');
    btn.onclick=()=>openLesson(i,true);item.append(btn);$('route').append(item)
  })
}
function openLesson(index,focus=false){
  progress.current=index;save();solved=false;showView('lab');route();
  const l=lessons[index];
  $('step').textContent='练习 '+String(index+1).padStart(2,'0')+' / 06';
  $('topic').textContent=l.group;$('title').textContent=l.title;$('prompt').textContent=l.prompt;
  $('sceneMode').textContent='操作前';$('drawing').innerHTML=diagram(l,false);
  $('hint').textContent=l.hint;$('hint').hidden=true;$('hintBtn').setAttribute('aria-expanded','false');
  $('hintBtn').lastChild.textContent='看提示';$('feedback').textContent='';$('feedback').className='';$('next').hidden=true;
  $('choices').replaceChildren();
  const visualChoices={
    push:['电脑 → GitHub','文件 → 暂存区','GitHub → 电脑'],
    pull:['暂存区 → 本地历史','GitHub → 电脑','电脑 → GitHub']
  };
  l.options.forEach((key,i)=>{
    const b=document.createElement('button');b.className='choice';
    b.innerHTML='<span class="letter" aria-hidden="true">'+'ABC'[i]+'</span><span><strong>'+(visualChoices[l.key]?.[i] || moves[key][0])+'</strong><code>'+moves[key][1]+'</code></span>';
    b.onclick=()=>attempt(key,b);$('choices').append(b)
  });
  if(focus)$('title').focus()
}
function attempt(key,btn){
  if(solved)return;
  const l=lessons[progress.current];
  if(key!==l.key){
    btn.classList.add('wrong');$('feedback').className='retry';
    $('feedback').textContent=moves[key][3]+' 再试一次。';return
  }
  solved=true;
  if(!progress.completed.includes(key))progress.completed.push(key);
  save();route();
  btn.className='choice right';
  for(const b of $('choices').children){b.disabled=true;b.classList.remove('wrong')}
  $('feedback').className='success';$('feedback').textContent=l.result;
  $('sceneMode').textContent='操作后';$('drawing').innerHTML=diagram(l,true);
  $('next').hidden=false;
  $('next').textContent=progress.completed.length===lessons.length?'查看练习结果 →':'继续下一站 →';
  $('next').focus({preventScroll:true})
}
$('next').onclick=()=>{
  if(progress.completed.length===lessons.length){
    showView('finish');$('finish').querySelector('h2').focus();return
  }
  let i=progress.current;
  do{i=(i+1)%lessons.length}while(progress.completed.includes(lessons[i].key));
  openLesson(i,true)
};
$('hintBtn').onclick=()=>{
  $('hint').hidden=!$('hint').hidden;
  $('hintBtn').setAttribute('aria-expanded',String(!$('hint').hidden));
  $('hintBtn').lastChild.textContent=$('hint').hidden?'看提示':'收起提示'
};
function openCards(){showView('cards');$('cards').querySelector('h2').focus()}
$('cardsTab').onclick=openCards;$('review').onclick=openCards;
function back(){showView('lab');$('title').focus()}
$('labTab').onclick=back;$('return').onclick=back;
// A fresh run is explicit. Visiting a station to practise it preserves earned completions.
$('again').onclick=()=>{progress={current:0,completed:[]};openLesson(0,true)};
$('deck').innerHTML=lessons.map(l=>'<details><summary>'+l.name+' · <code>'+moves[l.key][1]+'</code></summary><p>'+moves[l.key][3]+'</p><p><code>'+moves[l.key][2]+'</code></p></details>').join('');
$('summary').innerHTML=lessons.map(l=>'<span>'+l.name+'</span>').join('');
openLesson(progress.current);
