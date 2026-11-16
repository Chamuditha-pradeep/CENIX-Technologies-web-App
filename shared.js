const $=s=>document.querySelector(s);
const esc=s=>String(s??'').replace(/[&<>"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));
const safe=u=>/^(https?:|mailto:|tel:|\/|#)/i.test(u||'')?u:'#';
const LS={get(k,d){try{const v=localStorage.getItem(k);return v?JSON.parse(v):d}catch(e){return d}},set(k,v){try{localStorage.setItem(k,JSON.stringify(v))}catch(e){}}};
const LC=['si','en','ta','ja','de','zh','ko','it','pt','fr'];
const LN=['සිංහල','English','தமிழ்','日本語','Deutsch','中文','한국어','Italiano','Português (BR)','Français'];
const TR={
home:['මුල් පිටුව','Home','முகப்பு','ホーム','Start','首页','홈','Home','Início','Accueil'],
learn:['ඉගෙනුම','Learn','கற்க','学習','Lernen','学习','학습','Impara','Aprender','Apprendre'],
media:['මාධ්‍ය','Media','மீடியா','メディア','Medien','媒体库','미디어','Media','Mídia','Médias'],
apps:['ඇප්','Apps','செயலிகள்','アプリ','Apps','应用','앱','App','Apps','Applis'],
social:['සම්බන්ධ වන්න','Connect','இணைக','つながる','Verbinden','联系我们','연결','Connettiti','Conectar','Se connecter'],
games:['ගේම්ස්','Games','விளையாட்டுகள்','ゲーム','Spiele','游戏','게임','Giochi','Jogos','Jeux'],
tuts:['ටියුටෝරියල්','Tutorials','பயிற்சிகள்','チュートリアル','Anleitungen','教程','튜토리얼','Tutorial','Tutoriais','Tutoriels'],
all:['සියල්ල','All','அனைத்தும்','すべて','Alle','全部','전체','Tutti','Todos','Tous'],
search:['සොයන්න…','Search…','தேடு…','検索…','Suchen…','搜索…','검색…','Cerca…','Buscar…','Rechercher…'],
download:['බාගන්න','Download','பதிவிறக்கு','ダウンロード','Herunterladen','下载','다운로드','Scarica','Baixar','Télécharger'],
open:['විවෘත කරන්න','Open','திற','開く','Öffnen','打开','열기','Apri','Abrir','Ouvrir'],
play:['සෙල්ලම් කරන්න','Play now','விளையாடு','プレイ','Jetzt spielen','开始游戏','플레이','Gioca','Jogar','Jouer'],
run:['ධාවනය කරන්න','Run','இயக்கு','実行','Ausführen','运行','실행','Esegui','Executar','Exécuter'],
empty:['තවම කිසිවක් නැත','Nothing here yet','இன்னும் எதுவும் இல்லை','まだ何もありません','Noch nichts vorhanden','暂无内容','아직 없습니다','Ancora niente','Nada por aqui ainda','Rien pour l’instant'],
explore:['ඉගෙනීම අරඹන්න','Start learning','கற்கத் தொடங்கு','学習を始める','Jetzt lernen','开始学习','학습 시작','Inizia a imparare','Começar a aprender','Commencer à apprendre'],
hero:['ඉගෙනීම, මාධ්‍ය, ඇප්, ගේම් සහ තවත් බොහෝ දේ එක තැනකින්.','Learning, media, apps, games and more, all in one place.','கற்றல், மீடியா, செயலிகள், விளையாட்டுகள் எல்லாம் ஒரே இடத்தில்.','学習、メディア、アプリ、ゲームをひとつの場所で。','Lernen, Medien, Apps, Spiele und mehr an einem Ort.','学习、媒体、应用、游戏，尽在一处。','학습, 미디어, 앱, 게임을 한곳에서.','Apprendimento, media, app, giochi e altro in un unico posto.','Aprendizado, mídia, apps, jogos e muito mais em um só lugar.','Apprentissage, médias, applis, jeux et plus, au même endroit.']};
let lang=LS.get('lang',1);
const t=k=>(TR[k]&&TR[k][lang])||(TR[k]&&TR[k][1])||k;
const L=o=>typeof o==='string'?o:(o&&(o[LC[lang]]||o.en||Object.values(o).find(Boolean)))||'';
function theme(){const th=Object.assign({m:'dark',c:'#0e8f4f'},LS.get('theme',{}));document.documentElement.dataset.m=th.m;document.documentElement.style.setProperty('--a',th.c)}theme();
function toast(m){const e=$('#toast');e.textContent=m;e.classList.add('on');setTimeout(()=>e.classList.remove('on'),2600)}
const sz=b=>b>1e6?(b/1e6).toFixed(1)+' MB':Math.ceil(b/1e3)+' KB';
/* ---- code runner ---- */
const RUNNABLE=['html','css','javascript','python'],canRun=b=>b.run!==0&&b.run!==false&&RUNNABLE.includes(b.lang);
function runDoc(lg,c){if(lg==='javascript')return `<body style="font:14px monospace;white-space:pre-wrap;margin:8px"><script>const o=document.body;console.log=(...a)=>{o.append(a.join(' ')+'\\n')};try{${c}}catch(e){o.append(String(e))}</script>`;
 if(lg==='css')return `<style>${c}</style><h1>Heading</h1><p>Paragraph text.</p><button>Button</button><ul><li>One</li><li>Two</li></ul>`;return c}
let py=null;
async function runPy(code,out){out.textContent='Loading Python (first time only)…';try{if(!py){await new Promise((ok,no)=>{const s=document.createElement('script');s.src='https://cdn.jsdelivr.net/pyodide/v0.26.4/full/pyodide.js';s.onload=ok;s.onerror=no;document.head.append(s)});py=await loadPyodide()}
 let o='';py.setStdout({batched:s=>o+=s+'\n'});py.setStderr({batched:s=>o+=s+'\n'});try{await py.runPythonAsync(code)}catch(e){o+=String(e)}out.textContent=o||'(no output)'}catch(e){out.textContent='Could not load Python. Check your internet.'}}
/* ---- Supabase (plain fetch, no library) ---- */
const SB=window.CFG||{},cfgOK=()=>!!(SB.url&&SB.key);
let tok=LS.get('sbtok',null);
const setTok=j=>{tok={at:j.access_token,rt:j.refresh_token,exp:Date.now()+j.expires_in*1000};LS.set('sbtok',tok)};
const hdr=(x={})=>{const h={apikey:SB.key,...x};if(tok&&tok.at)h.Authorization='Bearer '+tok.at;else if(/^eyJ/.test(SB.key))h.Authorization='Bearer '+SB.key;return h};
async function ensure(){if(tok&&tok.exp-60000<Date.now()){const r=await fetch(SB.url+'/auth/v1/token?grant_type=refresh_token',{method:'POST',headers:{apikey:SB.key,'Content-Type':'application/json'},body:JSON.stringify({refresh_token:tok.rt})});if(r.ok)setTok(await r.json());else{tok=null;LS.set('sbtok',null)}}}
async function signIn(email,pw){const r=await fetch(SB.url+'/auth/v1/token?grant_type=password',{method:'POST',headers:{apikey:SB.key,'Content-Type':'application/json'},body:JSON.stringify({email,password:pw})});if(!r.ok)throw new Error('Login failed');setTok(await r.json())}
const signOut=()=>{tok=null;LS.set('sbtok',null)};
async function rest(path,o={}){await ensure();const r=await fetch(SB.url+'/rest/v1/'+path,{...o,headers:hdr({'Content-Type':'application/json',...(o.headers||{})})});if(!r.ok)throw new Error((await r.text())||r.status);const x=await r.text();return x?JSON.parse(x):null}
async function upload(id,f){await ensure();const path=id+'/'+Date.now()+'-'+f.name.replace(/[^\w.-]/g,'_');const r=await fetch(SB.url+'/storage/v1/object/media/'+path,{method:'POST',headers:hdr({'x-upsert':'true','Content-Type':f.type||'application/octet-stream'}),body:f});if(!r.ok)throw new Error(await r.text());return path}
const pubUrl=p=>p?SB.url+'/storage/v1/object/public/media/'+p:'';
const saveItem=p=>{const{id,sec,pub,t,...data}=p;return rest('items?on_conflict=id',{method:'POST',headers:{Prefer:'resolution=merge-duplicates,return=minimal'},body:JSON.stringify({id,sec,pub:pub!==false,t,data})})};
const delItem=id=>rest('items?id=eq.'+encodeURIComponent(id),{method:'DELETE'});
const saveSite=(key,value)=>rest('site?on_conflict=key',{method:'POST',headers:{Prefer:'resolution=merge-duplicates,return=minimal'},body:JSON.stringify({key,value})});
const C=a=>a.map(n=>({id:n.toLowerCase().replace(/\W+/g,'-'),name:n}));
const DEFSECS=[{id:'learn',type:'learn',icon:'📚',cats:C(['HTML','CSS','JavaScript','Python','Java','C','SQL'])},{id:'media',type:'media',icon:'🎞️',cats:C(['Videos','Music','Alarm sounds','Photos','PNG'])},{id:'apps',type:'cards',icon:'🧩',cats:C(['Websites','Web apps'])},{id:'social',type:'links',icon:'🔗',cats:C(['Social','Freelance'])},{id:'games',type:'cards',icon:'🎮',cats:C(['Games'])},{id:'tuts',type:'cards',icon:'🛠️',cats:C(['Setup guides'])}];
const LES=(id,cat,t0,title,text,lg,code)=>({id,sec:'learn',cat,pub:true,t:t0,title:{en:title},blocks:[{t:'text',v:{en:text}},{t:'code',lang:lg,run:1,v:code}]});
const SEED=[LES('s1','html',4,'Hello, HTML','HTML describes the structure of a web page. Edit the code and press Run.','html','<h1>Hello CENIX!</h1>\n<p>My first web page.</p>'),
LES('s2','css',3,'CSS colours','CSS styles a page. Change the colour or size and press Run.','css','h1 { color: green; }\np { font-size: 20px; }'),
LES('s3','javascript',2,'Your first JavaScript','console.log prints a message. Try changing the numbers.','javascript','let a = 5;\nlet b = 7;\nconsole.log("Sum:", a + b);'),
LES('s4','python',1,'Python: print()','print() shows text on the screen. Press Run to try it.','python','name = "CENIX"\nprint("Hello", name)')];
async function loadData(real){let sections=DEFSECS,items=SEED,home=[],name='CENIX Technologies';
 if(cfgOK())try{const s=await rest('site?select=*'),m=Object.fromEntries((s||[]).map(r=>[r.key,r.value]));
  if(m.sections)sections=m.sections;home=m.home||[];if(m.cfg&&m.cfg.name)name=m.cfg.name;
  const it=await rest('items?select=*&order=t.desc');if(it&&it.length)items=it.map(r=>({...r.data,id:r.id,sec:r.sec,pub:r.pub,t:r.t}));else if(real||(s&&s.length))items=[]}catch(e){console.warn(e)}
 return{sections,items,home,name}}
