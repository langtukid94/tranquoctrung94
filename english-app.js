import {pipeline,env} from "https://cdn.jsdelivr.net/npm/@huggingface/transformers@3.5.1/+esm";
env.allowLocalModels=false;
const host=document.getElementById("engHost"),root=host.attachShadow({mode:"open"});
const sync=()=>host.setAttribute("data-t",document.documentElement.getAttribute("data-theme")||"dark");
sync();new MutationObserver(sync).observe(document.documentElement,{attributes:true,attributeFilter:["data-theme"]});
root.innerHTML=`<style>
:host{display:block;--card:rgba(255,255,255,.05);--tx:rgba(255,255,255,.92);--mu:rgba(255,255,255,.62);--ac:#ff3b3b;--ac2:rgba(255,59,59,.16);--bd:rgba(255,255,255,.14);--in:rgba(255,255,255,.05);--ok:#5fd39a;--wr:#ffb15a;color:var(--tx);font:15px/1.55 Inter,system-ui,sans-serif}
:host([data-t="light"]){--card:rgba(0,0,0,.04);--tx:rgba(0,0,0,.88);--mu:rgba(0,0,0,.6);--ac:#e02f2f;--ac2:rgba(224,47,47,.12);--bd:rgba(0,0,0,.14);--in:rgba(0,0,0,.04);--ok:#157a4a;--wr:#b25a00}
*{box-sizing:border-box}
nav{display:flex;gap:4px;border:1px solid var(--bd);border-radius:12px;padding:4px;margin:10px 0 14px;flex-wrap:wrap}
nav button{flex:1;min-width:62px;border:0;background:none;color:var(--mu);padding:9px 4px;font-size:13.5px;border-radius:9px;font:inherit;font-weight:800;cursor:pointer}
nav button.on{background:var(--ac);color:#fff}
.card{background:var(--card);border:1px solid var(--bd);border-radius:14px;padding:14px;margin-bottom:12px}
textarea,input[type=text],select{width:100%;font:inherit;color:var(--tx);background:var(--in);border:1px solid var(--bd);border-radius:10px;padding:9px;margin:4px 0}
textarea{min-height:110px;resize:vertical}select{width:auto}
.row{display:flex;gap:8px;align-items:center;flex-wrap:wrap;margin:4px 0}
.btn{border:0;background:var(--ac);color:#fff;padding:10px 14px;border-radius:10px;font:inherit;font-weight:800;cursor:pointer}
.btn.sec{background:var(--ac2);color:var(--tx)}.btn:disabled{opacity:.6}
.ok2{background:var(--ok)!important;color:#fff!important}.no2{background:var(--wr)!important;color:#fff!important}
.ib{border:1px solid var(--bd);background:var(--in);color:var(--tx);border-radius:8px;padding:4px 9px;cursor:pointer;font:inherit}
.ib.on{background:var(--ac2)}
.en{font-size:17px;font-weight:700}.cw{cursor:pointer;border-bottom:1px dotted var(--mu)}
.ipa{color:#ffd54a;font-size:14px}:host([data-t="light"]) .ipa{color:#b25a00}
.vi{color:var(--mu)}.ok{color:var(--ok)}.no{color:var(--wr)}.err{color:var(--wr)}
.item{border-top:1px solid var(--bd);padding:10px 0}.item:first-child{border-top:0}
.wb{background:var(--ac2);border-radius:10px;padding:10px;margin-top:8px}
.chip{display:inline-block;border:1px solid var(--bd);border-radius:999px;padding:1px 9px;margin:2px;cursor:pointer;font-size:13px;background:var(--in)}
.lk{color:var(--ac);margin-right:10px;font-size:13px}
.flash{min-height:170px;display:flex;flex-direction:column;align-items:center;justify-content:center;text-align:center;gap:6px}
.big{font-size:24px;font-weight:800}.note{color:var(--mu);font-size:13px}
.hide{display:none}progress{width:100%}
</style>
<div class="row"><span id="stat" class="chip"></span><span style="flex:1"></span><select id="voice" title="Giọng đọc"></select><input type="range" id="rate" min="0.5" max="1.2" step="0.1" value="0.9" title="Tốc độ"></div>
<nav id="tabs"><button data-t="tr" class="on">Dịch</button><button data-t="ch">Hội thoại</button><button data-t="gm">Game</button><button data-t="fc">Thẻ</button><button data-t="gc">Sửa lỗi</button><button data-t="ex">IELTS/TOEIC</button><button data-t="sv">Đã lưu <span id="cnt"></span></button><button data-t="rf">Tài liệu</button></nav>
<section id="tr"><div class="card">
 <div class="row"><b id="l1">Việt</b><button class="ib" id="swap">⇄</button><b id="l2">Anh</b><span style="flex:1"></span><button class="ib" id="clr">Xóa</button></div>
 <textarea id="src" placeholder="Nhập từ, câu hoặc cả đoạn văn dài…"></textarea>
 <div class="row"><button class="btn" id="go">Dịch</button><span id="st" class="note"></span></div><progress id="pg" class="hide" max="100" value="0"></progress></div>
 <p class="note">Mô hình dịch nguồn mở chạy ngay trên máy bạn (lần đầu tải ~100 MB). Chạm vào từ tiếng Anh hoặc “Từ khó” để xem từ loại, đồng/trái nghĩa, cụm hay đi cùng.</p><div id="out"></div></section>
<section id="ch" class="hide">
 <div class="card"><input type="text" id="dq" placeholder="🔎 Tìm câu/chủ đề (tiếng Anh hoặc Việt)…">
 <details><summary class="note" style="cursor:pointer">➕ Thêm hội thoại / lời bài hát của bạn (tự dịch, không giới hạn)</summary>
 <input type="text" id="dt" placeholder="Tên hội thoại"><textarea id="dtx" placeholder="Mỗi dòng một câu tiếng Anh (có thể bắt đầu bằng A: hoặc B:)"></textarea>
 <div class="row"><button class="btn" id="dadd">Dịch & thêm</button><span id="dst" class="note"></span></div></details></div>
 <p class="note">Mỗi câu: 🔊 nghe, 🐢 nghe chậm, 🎤 nhại giọng (chấm điểm), ☆ lưu. “Nghe cả đoạn” đọc xen kẽ 2 giọng A/B.</p><div id="dl"></div></section>
<section id="gm" class="hide"><div class="row"><button class="btn sec" data-g="quiz">🎯 Trắc nghiệm</button><button class="btn sec" data-g="dict">🎧 Nghe & gõ</button><button class="btn sec" data-g="scr">🔀 Xếp chữ</button><button class="btn sec" data-g="ord">🧩 Xếp câu</button></div>
 <p class="note">Dùng từ/câu bạn đã lưu và bộ từ có sẵn. Mỗi lượt 8 câu, đúng +10 XP.</p><div id="gbox" class="card hide"></div></section>
<section id="fc" class="hide"><div class="row"><select id="fm"><option value="en">Mặt trước: Anh</option><option value="vi">Mặt trước: Việt</option><option value="ctx">Mặt trước: Ngữ cảnh</option></select><select id="ft"></select><span id="fi" class="note"></span></div><div id="fcbox"></div></section>
<section id="sv" class="hide"><div class="row"><input type="text" id="sq" placeholder="🔎 Tìm trong mục đã lưu…" style="flex:1"><button class="ib on" data-f="all">Tất cả</button><button class="ib" data-f="word">Từ</button><button class="ib" data-f="sentence">Câu</button></div>
 <div class="card" id="sl"></div><div class="row"><button class="ib" id="ecsv">⬇ CSV</button><button class="ib" id="ejs">⬇ Sao lưu JSON</button><button class="ib" id="ijs">⬆ Khôi phục JSON</button><input type="file" id="ifile" accept=".json" class="hide"></div></section>
<section id="gc" class="hide"><div class="card"><b>Sửa lỗi ngữ pháp & chính tả (không giới hạn độ dài)</b><textarea id="gt" style="min-height:180px" placeholder="Dán bài viết tiếng Anh của bạn vào đây (email, essay, đoạn văn…)"></textarea><div class="row"><button class="btn" id="gcb">Kiểm tra & sửa lỗi</button></div><div id="gr"></div></div>
<details class="card"><summary class="note" style="cursor:pointer">📖 Lỗi người Việt hay mắc</summary><ul class="note"><li>Quên mạo từ a/an/the: “I have dog” → “I have a dog”.</li><li>Thiếu “s” số nhiều và ngôi thứ 3: “he go” → “he goes”.</li><li>Sai thì: “Yesterday I go” → “Yesterday I went”.</li><li>Sai giới từ: “depend of” → “depend on”; “interested about” → “interested in”.</li><li>Thiếu chủ ngữ/động từ to be: “Is very good” → “It is very good”.</li></ul></details></section>
<section id="ex" class="hide"><div class="row"><button class="btn sec" data-x="w">✍️ IELTS Writing</button><button class="btn sec" data-x="s">🎤 IELTS Speaking</button><button class="btn sec" data-x="t">📝 TOEIC Part 5</button><button class="btn sec" data-x="v">📚 Từ vựng</button></div><div id="xbox"></div></section>
<section id="rf" class="hide"><div class="card"><div class="row"><input type="text" id="rq" placeholder="Nhập một từ để tra ở nhiều nguồn…" style="flex:1"><button class="btn" id="rgo">Tra</button></div><div id="rres"></div></div><div class="card" id="rlist"></div></section>`;
const $=s=>root.querySelector(s),$$=s=>root.querySelectorAll(s);
const el=(t,c,x,...k)=>{const e=document.createElement(t);if(c)e.className=c;if(x!=null)e.textContent=x;e.append(...k);return e};
const LS=(k,d)=>{try{const v=JSON.parse(localStorage.getItem(k));return v==null?d:v}catch(e){return d}},SV=(k,v)=>{try{localStorage.setItem(k,JSON.stringify(v))}catch(e){}};
let saved=LS("eng_saved",[]),custom=LS("eng_dlg",[]),stats=LS("eng_stats",{xp:0,days:{},last:"",streak:0}),dir="vi-en",filt="all";
const persist=()=>{SV("eng_saved",saved);$("#cnt").textContent=saved.length?"("+saved.length+")":""};
const today=()=>new Date().toISOString().slice(0,10);
function showStat(){$("#stat").textContent="🔥 "+stats.streak+" ngày · ⭐ "+stats.xp+" XP · hôm nay "+(stats.days[today()]||0)+"/50"}
function addXP(n){const t=today();if(stats.last!==t){stats.streak=stats.last===new Date(Date.now()-864e5).toISOString().slice(0,10)?stats.streak+1:1;stats.last=t}stats.xp+=n;stats.days[t]=(stats.days[t]||0)+n;SV("eng_stats",stats);showStat()}
const POS={noun:"danh từ",verb:"động từ",adjective:"tính từ",adverb:"trạng từ",preposition:"giới từ",conjunction:"liên từ",pronoun:"đại từ",interjection:"thán từ",determiner:"hạn định từ"};
const rnd=a=>a[Math.floor(Math.random()*a.length)],shuf=a=>a.slice().sort(()=>Math.random()-.5);

/* ---- Dịch (OPUS-MT, nguồn mở, chạy trong trình duyệt) ---- */
const MODELS={"vi-en":"onnx-community/opus-mt-vi-en","en-vi":"Xenova/opus-mt-en-vi"},pipes={};
async function getPipe(d){if(pipes[d])return pipes[d];const pg=$("#pg");pg.classList.remove("hide");
 const cb=p=>{if(p.status==="progress"){pg.value=p.progress;$("#st").textContent="Đang tải mô hình… "+Math.round(p.progress)+"%"}};
 try{pipes[d]=await pipeline("translation",MODELS[d],{dtype:"q8",progress_callback:cb})}catch(e){pipes[d]=await pipeline("translation",MODELS[d],{progress_callback:cb})}
 pg.classList.add("hide");return pipes[d]}
const tr=async(d,t)=>(await(await getPipe(d))(t,{max_new_tokens:256}))[0].translation_text;
const split=t=>t.split(/(?<=[.!?…。])\s+|\n+/).map(s=>s.trim()).filter(Boolean).flatMap(s=>{if(s.length<=260)return[s];const o=[];let c="";s.split(/(?<=[,;:])\s+/).forEach(p=>{if(c&&(c+" "+p).length>260){o.push(c);c=p}else c=c?c+" "+p:p});if(c)o.push(c);return o.flatMap(x=>x.length>400?x.match(/[\s\S]{1,300}(\s|$)/g).map(y=>y.trim()):[x])});

/* ---- Tra từ: dictionaryapi.dev + Datamuse (miễn phí) ---- */
const J=async u=>{try{return await(await fetch(u)).json()}catch(e){return null}},ic={},wi={};
async function wIpa(w){const k=w.toLowerCase();if(k in ic)return ic[k];const j=await J("https://api.dictionaryapi.dev/api/v2/entries/en/"+encodeURIComponent(k));
 const p=Array.isArray(j)&&(j[0].phonetics||[]).find(x=>x.text);ic[k]=p?p.text.replace(/\//g,""):"";return ic[k]}
async function sIpa(s){const ws=(s.match(/[A-Za-z']+/g)||[]).slice(0,40);await Promise.all(ws.map(wIpa));return ws.some(w=>ic[w.toLowerCase()])?"/"+ws.map(w=>ic[w.toLowerCase()]||w).join(" ")+"/":""}
async function info(w){if(wi[w])return wi[w];const D="https://api.datamuse.com/words?max=8&";
 const [d,sy,an,nx,pv]=await Promise.all([J("https://api.dictionaryapi.dev/api/v2/entries/en/"+encodeURIComponent(w)),J(D+"rel_syn="+w),J(D+"rel_ant="+w),J(D+"rel_bga="+w),J(D+"rel_bgb="+w)]);
 const ms=Array.isArray(d)?d.flatMap(e=>e.meanings||[]):[],ph=Array.isArray(d)?d.flatMap(e=>e.phonetics||[]):[],df=ms.flatMap(m=>m.definitions||[]);
 const u=(a,b)=>[...new Set(a.concat((b||[]).map(x=>x.word)))].slice(0,8);
 return wi[w]={ipa:(ph.find(p=>p.text)||{}).text||"",audio:(ph.find(p=>p.audio)||{}).audio||"",pos:[...new Set(ms.map(m=>m.partOfSpeech))],def:(df[0]||{}).definition||"",ex:(df.find(x=>x.example)||{}).example||"",
  syn:u(ms.flatMap(m=>(m.synonyms||[]).concat(...(m.definitions||[]).map(x=>x.synonyms||[]))),sy),ant:u(ms.flatMap(m=>(m.antonyms||[]).concat(...(m.definitions||[]).map(x=>x.antonyms||[]))),an),
  col:(nx||[]).slice(0,4).map(x=>w+" "+x.word).concat((pv||[]).slice(0,4).map(x=>x.word+" "+w))}}
async function hard(ws){const u=[...new Set(ws.map(x=>x.toLowerCase()))].filter(x=>x.length>4).slice(0,24);
 return(await Promise.all(u.map(async x=>{const j=await J("https://api.datamuse.com/words?max=1&md=f&sp="+x),f=j&&j[0]&&j[0].word===x&&(j[0].tags||[]).find(t=>t[0]==="f");return f?(parseFloat(f.slice(2))<25?x:null):(x.length>=8?x:null)}))).filter(Boolean)}
const links=w=>{const e=encodeURIComponent(w),d=el("div","note","Tra thêm: ");[["Cambridge","https://dictionary.cambridge.org/dictionary/english/"+e],["Oxford","https://www.oxfordlearnersdictionaries.com/definition/english/"+e],["YouGlish","https://youglish.com/pronounce/"+e+"/english"],["Tatoeba","https://tatoeba.org/en/sentences/search?from=eng&to=vie&query="+e],["Wiktionary","https://en.wiktionary.org/wiki/"+e],["Forvo","https://forvo.com/word/"+e+"/#en"]].forEach(([n,u])=>{const a=el("a","lk",n);a.href=u;a.target="_blank";a.rel="noopener";d.append(a)});return d};

/* ---- Giọng đọc & micro ---- */
let voices=[];
function loadV(){voices=speechSynthesis.getVoices().filter(v=>/^en/i.test(v.lang));const s=$("#voice");s.textContent="";voices.forEach(v=>{const o=el("option","",v.name+" ("+v.lang+")");o.value=v.name;s.append(o)});s.value=LS("eng_voice","")||(voices[0]?voices[0].name:"")}
if(window.speechSynthesis){loadV();speechSynthesis.onvoiceschanged=loadV}
$("#voice").onchange=e=>SV("eng_voice",e.target.value);
function speak(t,slow,alt){return new Promise(res=>{if(!window.speechSynthesis)return res();speechSynthesis.cancel();const u=new SpeechSynthesisUtterance(t);u.lang="en-US";let v=voices.find(x=>x.name===$("#voice").value);
 if(alt){const o=voices.find(x=>x!==v&&x.lang===(v?v.lang:"en-US"))||voices.find(x=>x!==v);if(o)v=o;else u.pitch=1.4}if(v)u.voice=v;u.rate=(+$("#rate").value||.9)*(slow?.7:1);u.onend=u.onerror=()=>res();speechSynthesis.speak(u)})}
function mic(btn,onT,onD,cont){const SR=window.SpeechRecognition||window.webkitSpeechRecognition;if(!SR){onT("Cần Chrome hoặc Edge để nhận giọng nói.");return}
 if(btn._r){btn._r.stop();return}const r=new SR();r.lang="en-US";r.interimResults=true;r.continuous=!!cont;btn._r=r;btn._l=btn._l||btn.textContent;let f="";
 r.onresult=e=>{let t="";for(const x of e.results)t+=x[0].transcript;f=t;onT(t)};r.onend=()=>{btn._r=null;btn.textContent=btn._l;onD&&onD(f.trim())};btn.textContent="⏹";r.start()}
const norm=s=>s.toLowerCase().replace(/[\u2019\u2018]/g,"'").replace(/[^a-z0-9'\s]/g," ").split(/\s+/).filter(Boolean);
function cmp(tgt,said,res,lb){const tw=norm(tgt),pool=norm(said),ln=el("div","en");let h=0;res.textContent="";
 tw.forEach(w=>{const i=pool.indexOf(w),s=el("span",i>=0?"ok":"no",w+" ");if(i>=0){pool.splice(i,1);h++}ln.append(s)});
 const p=Math.round(h/Math.max(tw.length,1)*100);res.append(el("div","note",(lb||"Bạn nói")+": "+said),ln,el("div","note",p+"% chính xác (xanh đúng, cam thiếu/sai)"+(p>=80?" 👏":"")));return p}

/* ---- Lưu từ/câu ---- */
const idx=en=>saved.findIndex(s=>s.en.toLowerCase()===en.toLowerCase());
function toggleSave(o,b){const i=idx(o.en);if(i>=0)saved.splice(i,1);else saved.unshift(Object.assign({type:/\s/.test(o.en.trim())?"sentence":"word",box:0,due:0,tags:[],note:""},o));
 persist();b.textContent=i>=0?"☆":"★";b.classList.toggle("on",i<0);renderSaved()}
function actions(o,res){const r=el("span","row");r.style.gap="6px";
 const a=el("button","ib","🔊");a.onclick=()=>speak(o.en);const s=el("button","ib","🐢");s.onclick=()=>speak(o.en,1);
 const c=el("button","ib"+(idx(o.en)>=0?" on":""),idx(o.en)>=0?"★":"☆");c.onclick=()=>toggleSave(o,c);r.append(a,s);
 if(res){const m=el("button","ib","🎤");m.title="Nhại giọng";m.onclick=()=>mic(m,t=>{res.textContent="… "+t},t=>{if(t)addXP(cmp(o.en,t,res)>=80?5:1)});r.append(m)}r.append(c);return r}
async function wordPanel(w,ctx,bx){w=w.toLowerCase();bx.textContent="";const p=el("div","wb","Đang tra “"+w+"”…");bx.append(p);
 const [i,vi]=await Promise.all([info(w),tr("en-vi",w).catch(()=>"")]);p.textContent="";
 const o={en:w,vi,ipa:i.ipa,type:"word",pos:i.pos.map(x=>POS[x]||x),syn:i.syn,ant:i.ant,def:i.def,ex:i.ex,ctx:ctx&&ctx!==w?ctx:""};
 const ch=(a,l)=>{if(!a.length)return;const r=el("div","",null,el("span","note",l+": "));a.forEach(x=>{const c=el("span","chip",x);c.onclick=()=>wordPanel(x,"",bx);r.append(c)});p.append(r)};
 p.append(el("b","",w+" "),el("span","ipa",(i.ipa||"")+" "),el("span","vi","— "+(vi||"?")));
 if(o.pos.length)p.append(el("div","note","Từ loại: "+o.pos.join(", ")));
 if(i.def)p.append(el("div","","• "+i.def));if(i.ex)p.append(el("div","note","“"+i.ex+"”"));
 ch(i.syn,"Đồng nghĩa");ch(i.ant,"Trái nghĩa");ch(i.col,"Hay đi cùng");if(!i.def&&!i.syn.length)p.append(el("div","note","Chưa có dữ liệu từ điển cho từ này."));
 const r=actions(o);if(i.audio){const a=el("button","ib","🔊 giọng thật");a.onclick=()=>new Audio(i.audio).play();r.prepend(a)}p.append(r,links(w))}
function entry(o,tag,hd){const d=el("div","item"),en=el("div","en"),ip=el("div","ipa",o.ipa||""),bx=el("div"),hc=el("div"),res=el("div");
 if(tag)en.append(el("span","chip",tag));
 o.en.split(/(\s+)/).forEach(w=>{if(!/[A-Za-z]/.test(w)){en.append(w);return}const s=el("span","cw",w);s.onclick=()=>wordPanel(w.replace(/[^A-Za-z'-]/g,""),o.en,bx);en.append(s)});
 d.append(en,ip,hc,el("div","vi",o.vi),actions(o,res),res,bx);
 if(!o.ipa)new IntersectionObserver((e,ob)=>{if(e[0].isIntersecting){ob.disconnect();sIpa(o.en).then(x=>{ip.textContent=x;o.ipa=x})}}).observe(d);
 if(hd)hard(o.en.match(/[A-Za-z']+/g)||[]).then(hs=>{if(hs.length)hc.append(el("span","note","Từ khó: "));hs.forEach(w=>{const c=el("span","chip",w);c.onclick=()=>wordPanel(w,o.en,bx);hc.append(c)})});return d}

/* ---- Tabs ---- */
$$("#tabs button").forEach(b=>b.onclick=()=>{$$("#tabs button").forEach(x=>x.classList.toggle("on",x===b));
 ["tr","ch","gm","fc","gc","ex","sv","rf"].forEach(id=>$("#"+id).classList.toggle("hide",id!==b.dataset.t));
 ({ch:renderDlg,fc:fcInit,sv:renderSaved,ex:exInit})[b.dataset.t]?.()});
$("#swap").onclick=()=>{dir=dir==="vi-en"?"en-vi":"vi-en";$("#l1").textContent=dir==="vi-en"?"Việt":"Anh";$("#l2").textContent=dir==="vi-en"?"Anh":"Việt"};
$("#clr").onclick=()=>{$("#src").value="";$("#out").textContent=""};
$("#go").onclick=async()=>{const t=$("#src").value.trim();if(!t)return;$("#go").disabled=true;$("#out").textContent="";const card=el("div","card");$("#out").append(card);
 try{const ps=split(t);let i=0;for(const s of ps){i++;$("#st").textContent="Đang dịch "+i+"/"+ps.length+"…";const o=await tr(dir,s);card.append(entry(dir==="vi-en"?{en:o,vi:s}:{en:s,vi:o},"",1))}$("#st").textContent="";addXP(2)}
 catch(e){$("#st").textContent="";card.append(el("p","err","Không dịch được: "+(e.message||e)))}$("#go").disabled=false};

/* ---- Hội thoại ---- */
const P=(t,s)=>({t,l:s.trim().split("\n").map(x=>x.split(" | "))});
const DLG=[P("Làm quen",`Hi, I’m Linh. Nice to meet you. | Chào, tôi là Linh. Rất vui được gặp bạn.
Nice to meet you too. Where are you from? | Tôi cũng vậy. Bạn đến từ đâu?
I’m from Vietnam. I live in Can Tho. | Tôi đến từ Việt Nam. Tôi sống ở Cần Thơ.
What do you do for a living? | Bạn làm nghề gì?
I’m a veterinarian. I love working with animals. | Tôi là bác sĩ thú y. Tôi thích làm việc với động vật.
That sounds great. Could you speak more slowly, please? | Nghe tuyệt quá. Bạn nói chậm lại được không?`),
P("Nhà hàng",`Good evening. Do you have a table for two? | Chào buổi tối. Bạn còn bàn cho hai người không?
Yes, please follow me. Here is the menu. | Còn, mời đi theo tôi. Đây là thực đơn.
I’d like the grilled chicken and a glass of water. | Tôi muốn món gà nướng và một ly nước.
Would you like anything for dessert? | Bạn có muốn dùng tráng miệng không?
No, thank you. Could we have the bill, please? | Không, cảm ơn. Cho chúng tôi tính tiền nhé.
Of course. I’ll bring it right away. | Tất nhiên. Tôi sẽ mang đến ngay.`),
P("Sân bay",`Where is the check-in counter? | Quầy làm thủ tục ở đâu?
May I see your passport, please? | Cho tôi xem hộ chiếu của bạn.
Do you want a window seat or an aisle seat? | Bạn muốn ghế cạnh cửa sổ hay lối đi?
A window seat, please. I have one bag to check in. | Ghế cạnh cửa sổ nhé. Tôi có một hành lý ký gửi.
What time does boarding start? | Mấy giờ bắt đầu lên máy bay?
Boarding starts at six at gate twelve. | Lên máy bay lúc sáu giờ ở cổng mười hai.`),
P("Phòng khám thú y",`Hello, how can I help you today? | Xin chào, hôm nay tôi giúp gì được cho bạn?
My dog has been vomiting since yesterday. | Con chó của tôi bị nôn từ hôm qua.
Has he eaten anything unusual? | Nó có ăn thứ gì lạ không?
I think he ate something from the trash. | Tôi nghĩ nó đã ăn gì đó trong thùng rác.
Let me examine him and run some tests. | Để tôi khám và làm vài xét nghiệm cho nó.
Please give him this medicine twice a day. | Hãy cho nó uống thuốc này hai lần mỗi ngày.`),
P("Mua sắm",`Excuse me, how much is this jacket? | Xin lỗi, cái áo khoác này giá bao nhiêu?
It’s fifty dollars, but it’s on sale today. | Nó giá năm mươi đô, nhưng hôm nay đang giảm giá.
Do you have it in a larger size? | Bạn có cỡ lớn hơn không?
Let me check. Yes, we have a large in blue. | Để tôi kiểm tra. Có, chúng tôi có cỡ lớn màu xanh.
Can I try it on? | Tôi mặc thử được không?
Sure, the fitting room is over there. | Được, phòng thử đồ ở đằng kia.`),
P("Phỏng vấn xin việc",`Thank you for coming. Please tell me about yourself. | Cảm ơn bạn đã đến. Hãy giới thiệu về bản thân.
I have three years of experience in this field. | Tôi có ba năm kinh nghiệm trong lĩnh vực này.
What are your greatest strengths? | Điểm mạnh lớn nhất của bạn là gì?
I’m responsible, and I learn new things quickly. | Tôi có trách nhiệm và học hỏi nhanh.
Why do you want to work for our company? | Vì sao bạn muốn làm việc cho công ty chúng tôi?
I admire your work, and I want to grow with your team. | Tôi ngưỡng mộ công việc của công ty và muốn phát triển cùng đội ngũ.`)];
const allLines=()=>DLG.concat(custom).flatMap(d=>d.l);
const lineEl=(x,sp,t)=>entry({en:x[0],vi:x[1]},(t?t+" · ":"")+"AB"[sp]);
function renderDlg(){const q=$("#dq").value.trim().toLowerCase(),box=$("#dl");box.textContent="";const all=DLG.concat(custom);
 if(q){const c=el("div","card");let n=0;all.forEach(d=>d.l.forEach((x,i)=>{if((x[0]+x[1]).toLowerCase().includes(q)&&n<40){n++;c.append(lineEl(x,i%2,d.t))}}));if(!n)c.append(el("p","note","Không thấy kết quả."));box.append(c);return}
 all.forEach(d=>{const c=el("div","card"),hd=el("div","row",null,el("b","",d.t)),pa=el("button","ib","▶ Nghe cả đoạn");pa.onclick=async()=>{for(let i=0;i<d.l.length;i++)await speak(d.l[i][0],0,i%2)};hd.append(pa);
 if(d.c){const x=el("button","ib","🗑");x.onclick=()=>{custom.splice(custom.indexOf(d),1);SV("eng_dlg",custom);renderDlg()};hd.append(x)}
 c.append(hd);d.l.forEach((x,i)=>c.append(lineEl(x,i%2)));box.append(c)})}
$("#dq").oninput=renderDlg;
$("#dadd").onclick=async()=>{const ls=$("#dtx").value.split(/\n+/).map(s=>s.trim().replace(/^[AB]\s*[:\-]\s*/i,"")).filter(Boolean);if(!ls.length)return;$("#dadd").disabled=true;const l=[];
 try{for(const s of ls){$("#dst").textContent="Đang dịch "+(l.length+1)+"/"+ls.length+"…";l.push([s,await tr("en-vi",s)])}custom.push({t:$("#dt").value.trim()||"Hội thoại của tôi",l,c:1});SV("eng_dlg",custom);$("#dtx").value="";$("#dst").textContent="Đã thêm ✅";renderDlg()}catch(e){$("#dst").textContent="Lỗi dịch"}$("#dadd").disabled=false};

/* ---- Game ---- */
const VOCAB=("diagnosis=chẩn đoán;symptom=triệu chứng;vaccine=vắc-xin;appointment=cuộc hẹn;improve=cải thiện;achieve=đạt được;challenge=thử thách;opportunity=cơ hội;experience=kinh nghiệm;responsible=chịu trách nhiệm;comfortable=thoải mái;necessary=cần thiết;environment=môi trường;knowledge=kiến thức;decision=quyết định;benefit=lợi ích;development=sự phát triển;suggest=đề xuất;require=yêu cầu;prepare=chuẩn bị;describe=mô tả;recommend=giới thiệu;confident=tự tin;careful=cẩn thận;available=có sẵn;expensive=đắt đỏ;dangerous=nguy hiểm;familiar=quen thuộc;temporary=tạm thời;punctual=đúng giờ;reluctant=miễn cưỡng;fluent=trôi chảy;vocabulary=từ vựng;pronounce=phát âm;habit=thói quen;schedule=lịch trình;deadline=hạn chót;negotiate=thương lượng;complain=phàn nàn;apologize=xin lỗi;invite=mời;borrow=mượn;achievement=thành tựu;treatment=điều trị;prescription=đơn thuốc;improve=cải thiện").split(";").map(x=>x.split("="));
const pool=()=>{const w=saved.filter(s=>s.type==="word").map(s=>[s.en,s.vi]);return w.concat(VOCAB.filter(v=>!w.some(x=>x[0]===v[0])))};
const spool=()=>saved.filter(s=>s.type==="sentence").map(s=>[s.en,s.vi]).concat(allLines());
const G={
quiz(b,cb,lab){const A=pool(),q=rnd(A),rev=Math.random()<.5,ops=shuf([q,...shuf(A.filter(x=>x!==q)).slice(0,3)]),bx=el("div","row");b.textContent="";b.append(el("div","note",lab+" · Chọn nghĩa đúng"),el("div","big",rev?q[1]:q[0]));if(!rev)speak(q[0]);
 ops.forEach(o=>{const t=el("button","btn sec",rev?o[0]:o[1]);t.onclick=()=>{bx.querySelectorAll("button").forEach(x=>x.disabled=true);const ok=o===q;t.className="btn "+(ok?"ok2":"no2");if(!ok)b.append(el("div","note","Đáp án: "+(rev?q[0]:q[1])));cb(ok)};bx.append(t)});b.append(bx)},
dict(b,cb,lab){const q=rnd(Math.random()<.5?spool():pool()),t=q[0],i=el("input"),r=el("div"),go=el("button","btn","Kiểm tra"),pl=el("button","ib","🔊 Nghe lại"),sl=el("button","ib","🐢");i.type="text";i.placeholder="Gõ lại những gì bạn nghe…";
 pl.onclick=()=>speak(t);sl.onclick=()=>speak(t,1);go.onclick=()=>{go.disabled=true;const p=cmp(t,i.value,r,"Bạn gõ");r.append(el("div","vi",q[1]));cb(p>=90)};
 b.textContent="";b.append(el("div","note",lab+" · Nghe và gõ lại"),el("div","row","",pl,sl),i,el("div","row","",go),r);speak(t)},
scr(b,cb,lab){const q=rnd(pool().filter(x=>x[0].length>=4&&!/\s/.test(x[0]))),w=q[0];let s;do s=shuf(w.split("")).join("");while(s===w);
 const i=el("input"),r=el("div"),go=el("button","btn","Kiểm tra");i.type="text";go.onclick=()=>{go.disabled=true;const ok=i.value.trim().toLowerCase()===w.toLowerCase();r.textContent=(ok?"✅ ":"❌ ")+w;cb(ok)};
 b.textContent="";b.append(el("div","note",lab+" · Sắp xếp lại chữ cái"),el("div","big",s.toUpperCase()),el("div","vi","Gợi ý: "+q[1]),i,el("div","row","",go),r)},
ord(b,cb,lab){const q=rnd(spool().filter(x=>{const n=x[0].split(" ").length;return n>=4&&n<=10})),ws=q[0].split(" ");let got=[];
 const out=el("div","en"),bx=el("div","row"),r=el("div"),draw=()=>out.textContent=got.join(" ")||"…";
 shuf(ws).forEach(w=>{const t=el("button","btn sec",w);t.onclick=()=>{got.push(w);t.disabled=true;draw()};bx.append(t)});
 const ck=el("button","btn","Kiểm tra"),rs=el("button","ib","↺ Làm lại");rs.onclick=()=>{got=[];bx.querySelectorAll("button").forEach(x=>x.disabled=false);draw()};
 ck.onclick=()=>{const ok=got.join(" ")===q[0];r.textContent=(ok?"✅ ":"❌ ")+q[0];ck.disabled=true;cb(ok)};
 draw();b.textContent="";b.append(el("div","note",lab+" · Xếp thành câu đúng"),el("div","vi",q[1]),out,bx,el("div","row","",ck,rs),r)}};
function play(kind){let n=0,score=0;const N=8,b=$("#gbox");b.classList.remove("hide");
 const nx=()=>{if(n>=N){b.textContent="";const a=el("button","btn","Chơi lại");a.onclick=()=>play(kind);b.append(el("div","big","Điểm "+score+"/"+N+" 🎉"),el("div","note","+"+score*10+" XP"),a);return}n++;let d=0;G[kind](b,ok=>{if(d++)return;if(ok){score++;addXP(10)}setTimeout(nx,ok?800:1800)},n+"/"+N)};nx()}
$$("[data-g]").forEach(b=>b.onclick=()=>play(b.dataset.g));

/* ---- Thẻ nhớ (lặp lại ngắt quãng) ---- */
let fq=[];const INT=[0,1,3,7,14,30,60];
function fcInit(){const t=$("#ft"),cur=t.value,tags=[...new Set(saved.flatMap(s=>s.tags||[]))];t.textContent="";t.append(Object.assign(el("option","","Tất cả bộ thẻ"),{value:""}));tags.forEach(x=>t.append(Object.assign(el("option","","#"+x),{value:x})));t.value=cur;
 fq=shuf(saved.filter(s=>(!t.value||(s.tags||[]).includes(t.value))&&(s.due||0)<=Date.now()));fcShow(0)}
$("#fm").onchange=$("#ft").onchange=()=>fcInit();
function fcShow(flip){const b=$("#fcbox");b.textContent="";$("#fi").textContent="Cần ôn: "+fq.length+" · Tổng: "+saved.length;
 if(!saved.length){b.append(el("p","note","Hãy lưu từ/câu (nhấn ☆) để học bằng thẻ."));return}
 if(!fq.length){b.append(el("div","card flash","",el("div","big","Hết thẻ cần ôn hôm nay 🎉"),el("div","note","Quay lại sau để ôn theo lịch.")));return}
 const o=fq[0],m=$("#fm").value,sent=o.ctx||o.ex||"",cl=sent&&o.type==="word"?sent.replace(new RegExp(o.en,"i"),"_____"):"";
 const front=m==="vi"?o.vi:m==="ctx"&&cl!==sent&&cl?cl:o.en,c=el("div","card flash");c.style.cursor="pointer";
 if(!flip)c.append(el("div","big",front),el("div","note","Chạm để lật thẻ"));
 else{c.append(el("div","big",o.en),el("div","ipa",o.ipa||""),el("div","vi",o.vi));if((o.pos||[]).length)c.append(el("div","note",o.pos.join(", ")));if(o.def)c.append(el("div","",o.def));if(sent)c.append(el("div","note","“"+sent+"”"));
  if((o.syn||[]).length)c.append(el("div","note","≈ "+o.syn.join(", ")));if((o.ant||[]).length)c.append(el("div","note","≠ "+o.ant.join(", ")));if(o.note)c.append(el("div","note","📝 "+o.note));if(o.type==="word")c.append(links(o.en))}
 c.onclick=e=>{if(e.target.tagName==="A")return;fcShow(!flip);if(!flip)speak(o.en)};b.append(c);
 const rate=g=>{o.box=g?Math.min(6,(o.box||0)+g):0;o.due=g?Date.now()+INT[o.box]*864e5:Date.now()+6e5;persist();fq.shift();if(g){addXP(g*3)}else fq.push(o);fcShow(0)};
 const s=el("button","ib","🔊");s.onclick=()=>speak(o.en);
 const r=el("div","row","",s);[["Chưa nhớ",0,"btn sec"],["Nhớ",1,"btn"],["Rất dễ",2,"btn sec"]].forEach(([l,g,c])=>{const x=el("button",c,l);x.onclick=()=>rate(g);r.append(x)});b.append(r)}

/* ---- Đã lưu ---- */
$$("[data-f]").forEach(b=>b.onclick=()=>{filt=b.dataset.f;$$("[data-f]").forEach(x=>x.classList.toggle("on",x===b));renderSaved()});
$("#sq").oninput=()=>renderSaved();
function renderSaved(){const box=$("#sl"),q=$("#sq").value.toLowerCase();box.textContent="";
 const L=saved.filter(s=>(filt==="all"||s.type===filt)&&(!q||JSON.stringify(s).toLowerCase().includes(q)));if(!L.length){box.append(el("p","note","Chưa có mục nào. Nhấn ☆ ở kết quả dịch, hội thoại hoặc bảng tra từ."));return}
 L.forEach(o=>{const d=el("div","item"),res=el("div");d.append(el("div","en",o.en),el("div","ipa",o.ipa||""),el("div","vi",o.vi));
  if((o.pos||[]).length)d.append(el("div","note","Từ loại: "+o.pos.join(", ")));if(o.def)d.append(el("div","note","• "+o.def));if(o.ctx||o.ex)d.append(el("div","note","“"+(o.ctx||o.ex)+"”"));
  if((o.syn||[]).length)d.append(el("div","note","≈ "+o.syn.join(", ")));if((o.ant||[]).length)d.append(el("div","note","≠ "+o.ant.join(", ")));
  if((o.tags||[]).length)d.append(el("div","note","🏷 "+o.tags.map(x=>"#"+x).join(" ")));if(o.note)d.append(el("div","note","📝 "+o.note));
  const r=el("span","row"),a=el("button","ib","🔊");a.onclick=()=>speak(o.en);const m=el("button","ib","🎤");m.onclick=()=>mic(m,t=>{res.textContent="… "+t},t=>{if(t)cmp(o.en,t,res)});
  const n=el("button","ib","📝");n.onclick=()=>{const v=prompt("Ghi chú / ngữ cảnh:",o.note||"");if(v!==null){o.note=v;persist();renderSaved()}};
  const t=el("button","ib","🏷");t.onclick=()=>{const v=prompt("Bộ thẻ (cách nhau bằng dấu phẩy):",(o.tags||[]).join(", "));if(v!==null){o.tags=v.split(",").map(x=>x.trim()).filter(Boolean);persist();renderSaved()}};
  const x=el("button","ib","🗑");x.onclick=()=>{saved=saved.filter(s=>s!==o);persist();renderSaved()};r.append(a,m,n,t,x);d.append(r,res);if(o.type==="word")d.append(links(o.en));box.append(d)})}
const dl=(n,t,ty)=>{const a=document.createElement("a");a.href=URL.createObjectURL(new Blob([t],{type:ty}));a.download=n;a.click()};
$("#ecsv").onclick=()=>{const q=s=>'"'+String(s||"").replace(/"/g,'""')+'"';dl("tu-vung.csv","\ufeff"+["English,IPA,Tiếng Việt,Loại,Từ loại,Đồng nghĩa,Trái nghĩa,Ví dụ/ngữ cảnh,Ghi chú,Bộ thẻ",...saved.map(s=>[s.en,s.ipa,s.vi,s.type,(s.pos||[]).join("; "),(s.syn||[]).join("; "),(s.ant||[]).join("; "),s.ctx||s.ex,s.note,(s.tags||[]).join("; ")].map(q).join(","))].join("\n"),"text/csv")};
$("#ejs").onclick=()=>dl("english-backup.json",JSON.stringify({saved,custom,stats}),"application/json");
$("#ijs").onclick=()=>$("#ifile").click();
$("#ifile").onchange=async e=>{try{const j=JSON.parse(await e.target.files[0].text());(j.saved||[]).forEach(s=>{if(idx(s.en)<0)saved.push(s)});(j.custom||[]).forEach(d=>{if(!custom.some(c=>c.t===d.t))custom.push(d)});if(j.stats&&j.stats.xp>stats.xp)stats=j.stats;SV("eng_dlg",custom);SV("eng_stats",stats);persist();showStat();renderSaved()}catch(err){alert("File không hợp lệ")}};

/* ---- Tài liệu ---- */
[["Cambridge Dictionary","https://dictionary.cambridge.org","Nghĩa, ví dụ, phát âm Anh/Mỹ"],["Oxford Learner’s Dictionaries","https://www.oxfordlearnersdictionaries.com","Từ điển học thuật, có Oxford 3000/5000"],["YouGlish","https://youglish.com","Nghe từ/cụm trong video YouTube thật"],["Forvo","https://forvo.com","Phát âm bởi người bản xứ"],["Tatoeba","https://tatoeba.org","Câu ví dụ có bản dịch tiếng Việt"],["BBC Learning English","https://www.bbc.co.uk/learningenglish","Bài nghe, từ vựng, ngữ pháp (giọng Anh)"],["VOA Learning English","https://learningenglish.voanews.com","Tin tức tốc độ chậm, có transcript (giọng Mỹ)"],["British Council LearnEnglish","https://learnenglish.britishcouncil.org","Bài học theo cấp độ A1–C2"],["TED Talks","https://www.ted.com/talks","Luyện nghe có phụ đề song ngữ"]].forEach(([n,u,d])=>{const a=el("a","lk",n);a.href=u;a.target="_blank";a.rel="noopener";$("#rlist").append(el("div","item","",a,el("span","note",d)))});
$("#rgo").onclick=()=>{const w=$("#rq").value.trim().split(/\s+/)[0];$("#rres").textContent="";if(w){const b=el("div");$("#rres").append(b);wordPanel(w,"",b)}};

/* ---- Sửa lỗi (LanguageTool, miễn phí) ---- */
let Q=Promise.resolve();const qtr=t=>{const p=Q.then(()=>tr("en-vi",t));Q=p.catch(()=>{});return p};
const sleep=ms=>new Promise(r=>setTimeout(r,ms));
async function lt(text){const iss=[];let i=0,first=1;while(i<text.length){let j=Math.min(i+8000,text.length);if(j<text.length){const k=text.lastIndexOf(" ",j);if(k>i)j=k+1}
 if(!first)await sleep(3200);first=0;const r=await fetch("https://api.languagetool.org/v2/check",{method:"POST",body:new URLSearchParams({language:"en-US",text:text.slice(i,j)})});if(!r.ok)throw new Error(r.status);
 (await r.json()).matches.forEach(m=>iss.push({off:i+m.offset,len:m.length,msg:m.message,rep:m.replacements.map(x=>x.value),bad:text.substr(i+m.offset,m.length)}));i=j}
 let f=text,end=1e9;iss.slice().sort((a,b)=>b.off-a.off).forEach(m=>{if(m.rep[0]&&m.off+m.len<=end){f=f.slice(0,m.off)+m.rep[0]+f.slice(m.off+m.len);end=m.off}});return{issues:iss,fixed:f}}
async function checkInto(text,box){box.textContent="";const st=el("p","note","Đang kiểm tra ngữ pháp & chính tả…");box.append(st);let r;
 try{r=await lt(text)}catch(e){st.textContent="Không kết nối được dịch vụ sửa lỗi (LanguageTool). Thử lại sau ít phút.";return null}
 st.remove();const f=el("div","wb");f.append(el("b","","Bản đã sửa ("+r.issues.length+" lỗi/gợi ý):"),el("div","",r.fixed));
 const cp=el("button","ib","📋 Sao chép"),sp=el("button","ib","🔊 Nghe");cp.onclick=()=>navigator.clipboard.writeText(r.fixed);sp.onclick=()=>speak(r.fixed);f.append(el("div","row","",cp,sp));box.append(f);
 r.issues.slice(0,60).forEach((i,n)=>{const v=el("div","note"),d=el("div","item","",el("div","","",el("span","no",i.bad||"(thiếu)"),"  →  ",el("b","ok",i.rep.slice(0,3).join(" / ")||"?")),el("div","note",i.msg),v);box.append(d);if(n<20)qtr(i.msg).then(x=>v.textContent="🇻🇳 "+x).catch(()=>{})});
 if(!r.issues.length)box.append(el("p","ok","✅ Không phát hiện lỗi."));return r}
$("#gcb").onclick=async()=>{const t=$("#gt").value.trim();if(!t)return;$("#gcb").disabled=true;if(await checkInto(t,$("#gr")))addXP(5);$("#gcb").disabled=false};

/* ---- IELTS / TOEIC ---- */
const WP=["Some people think students learn better from teachers, while others believe self-study is more effective. Discuss both views and give your opinion.","Many cities are growing quickly. What problems does this cause, and what solutions can you suggest?","Some people believe technology makes life easier, while others think it makes life more complicated. Discuss both views and give your opinion.","Should governments spend more money on public transport than on building new roads? Give your opinion.","Fast food is becoming more popular worldwide. Is this a positive or negative development?"];
const SQ=[["Part 1","Do you work or are you a student?"],["Part 1","What do you usually do in your free time?"],["Part 1","Tell me about your hometown."],["Part 1","Do you prefer to stay at home or go out?"],["Part 2","Describe a person who has influenced you. You should say: who this person is, how you know them, what they did, and explain why they influenced you."],["Part 2","Describe a place you would like to visit. You should say: where it is, how you would get there, what you would do there, and explain why you want to go."],["Part 2","Describe a useful skill you have learned. You should say: what it is, how you learned it, how often you use it, and explain why it is useful."],["Part 3","How has technology changed the way people learn?"],["Part 3","Why do some people find it hard to learn a foreign language?"],["Part 3","Do you think travelling makes people more open-minded?"]];
const TP=[["The manager asked all employees to submit their reports ____ Friday.",["by","at","since","during"],"“by + mốc thời gian” = chậm nhất vào lúc đó (hạn chót)."],["Ms. Lee is ____ for organizing the annual conference.",["responsible","responsibly","responsibility","respond"],"Sau to be cần tính từ: responsible for = chịu trách nhiệm về."],["The new software has made our work much ____.",["efficient","efficiently","efficiency","efficients"],"make + tân ngữ + tính từ → efficient."],["Please ____ the attached invoice before the meeting.",["review","reviewing","reviewed","reviews"],"Câu mệnh lệnh dùng động từ nguyên mẫu."],["We will refund your money ____ you return the item within 30 days.",["if","unless","despite","because of"],"if + mệnh đề = nếu; unless = trừ khi; despite/because of + danh từ."],["The conference room is ____ from 9 a.m. to 5 p.m.",["available","avail","availability","availably"],"Sau to be cần tính từ: available."],["Mr. Tan has worked here ____ 2015.",["since","for","during","while"],"since + mốc thời gian dùng với hiện tại hoàn thành; for + khoảng thời gian."],["The company is planning to ____ a new branch next year.",["open","opens","opened","opening"],"Sau to + động từ nguyên mẫu."],["Neither the manager ____ the staff was informed about the change.",["nor","or","and","but"],"Cặp liên từ neither … nor …"],["The shipment was delayed ____ bad weather.",["because of","because","although","so"],"because of + danh từ; because + mệnh đề."],["All applicants must submit ____ résumés online.",["their","them","they","theirs"],"Tính từ sở hữu their + danh từ."],["The report was written ____ and is easy to understand.",["clearly","clear","clearness","clarify"],"Trạng từ bổ nghĩa cho động từ (written clearly)."]];
const LINK="however|moreover|furthermore|therefore|in addition|for example|for instance|on the other hand|in contrast|as a result|consequently|nevertheless|although|whereas|in conclusion|to sum up|firstly|secondly|finally".split("|");
const IV="significant=đáng kể;analyse=phân tích;approach=cách tiếp cận;assume=cho rằng;consequence=hậu quả;contribute=đóng góp;demonstrate=chứng minh;evidence=bằng chứng;factor=yếu tố;impact=tác động;indicate=chỉ ra;issue=vấn đề;maintain=duy trì;range=phạm vi;reduce=giảm;sufficient=đủ;theory=lý thuyết;tend=có xu hướng;vary=thay đổi;sustainable=bền vững;urbanisation=đô thị hóa;diverse=đa dạng;advocate=ủng hộ;crucial=cực kỳ quan trọng".split(";").map(x=>x.split("="));
const TV="invoice=hóa đơn;merchandise=hàng hóa;reimburse=hoàn tiền;itinerary=lịch trình chuyến đi;agenda=chương trình họp;shipment=lô hàng;vendor=nhà cung cấp;warranty=bảo hành;inventory=hàng tồn kho;applicant=ứng viên;supervisor=người giám sát;quarterly=hằng quý;colleague=đồng nghiệp;premises=cơ sở, trụ sở;subsidiary=công ty con;reservation=đặt chỗ;attendee=người tham dự;expire=hết hạn;commute=đi làm hằng ngày;revenue=doanh thu;budget=ngân sách;contract=hợp đồng;promotion=thăng chức, khuyến mãi;confirm=xác nhận".split(";").map(x=>x.split("="));
const guide=(t,a)=>el("details","card","",el("summary","note","📖 "+t),el("ul","note","",...a.map(x=>el("li","",x))));
const X={
w(b){b.textContent="";const sel=el("select"),pr=el("div","en"),ta=el("textarea"),wc=el("span","note"),out=el("div"),go=el("button","btn","Chấm sơ bộ & sửa lỗi");ta.style.minHeight="230px";
 WP.forEach((p,i)=>{const o=el("option","","Đề "+(i+1));o.value=i;sel.append(o)});sel.onchange=()=>pr.textContent=WP[sel.value];sel.onchange();
 ta.oninput=()=>{wc.textContent=(ta.value.match(/[A-Za-z']+/g)||[]).length+" / 250 từ"};ta.oninput();
 go.onclick=async()=>{const t=ta.value.trim();if(!t)return;go.disabled=true;const w=t.match(/[A-Za-z']+/g)||[],n=Math.max(w.length,1),np=t.split(/\n\s*\n/).filter(x=>x.trim()).length,ns=split(t).length,u=new Set(w.map(x=>x.toLowerCase())).size,lk=LINK.filter(x=>new RegExp("\\b"+x+"\\b","i").test(t)),lg=w.filter(x=>x.length>=8).length;
  const ck=[[w.length>=250,"Độ dài "+w.length+" từ (cần ≥ 250)"],[np>=4,np+" đoạn (nên 4: mở bài, 2 thân bài, kết luận)"],[lk.length>=4,"Từ nối: "+(lk.join(", ")||"chưa có")+" (nên ≥ 4 loại)"],[u/n>=.5,"Đa dạng từ vựng: "+Math.round(u/n*100)+"% từ khác nhau (nên ≥ 50%)"],[lg/n>=.08,"Từ dài/học thuật (≥ 8 chữ): "+lg],[w.length/Math.max(ns,1)<=28,"Độ dài câu TB: "+Math.round(w.length/Math.max(ns,1))+" từ (nên 15–25, trộn câu đơn và câu phức)"]];
  out.textContent="";const c=el("div","wb",null,el("b","","Kiểm tra theo tiêu chí (ước lượng, không phải band chính thức)"));ck.forEach(([o,s])=>c.append(el("div",o?"ok":"no",(o?"✅ ":"⚠️ ")+s)));const lo=el("div");out.append(c,lo);await checkInto(t,lo);addXP(10);go.disabled=false};
 b.append(el("div","card","",el("div","row","",el("b","","IELTS Writing Task 2"),sel),pr,ta,el("div","row","",go,wc),out),guide("Hướng dẫn viết Task 2 (40 phút, ≥ 250 từ)",["Đoạn 1 – Mở bài: diễn đạt lại đề + nêu quan điểm (thesis).","Đoạn 2–3 – Thân bài: mỗi đoạn 1 ý chính + giải thích + ví dụ cụ thể.","Đoạn 4 – Kết luận: tóm lại quan điểm, không thêm ý mới.","4 tiêu chí chấm: Task Response, Coherence & Cohesion, Lexical Resource, Grammatical Range & Accuracy.","Dùng từ nối đa dạng, tránh lặp từ; trộn câu đơn và câu phức; dành 3–5 phút cuối để soát lỗi."]))},
s(b){b.textContent="";let q=rnd(SQ),tm=0,iv=null;const qe=el("div","en"),tx=el("textarea"),mb=el("button","btn","🎤 Bắt đầu nói"),nq=el("button","ib","🔀 Câu khác"),rd=el("button","ib","🔊 Đọc câu hỏi"),pp=el("button","ib","⏱ Chuẩn bị 60s"),ti=el("span","chip","0:00"),out=el("div");
 const sq=()=>qe.textContent="["+q[0]+"] "+q[1],fmt=s=>Math.floor(s/60)+":"+String(s%60).padStart(2,"0");sq();nq.onclick=()=>{q=rnd(SQ);sq()};rd.onclick=()=>speak(q[1]);
 pp.onclick=()=>{clearInterval(iv);let s=60;ti.textContent="Chuẩn bị "+fmt(s);iv=setInterval(()=>{s--;ti.textContent="Chuẩn bị "+fmt(s);if(s<=0){clearInterval(iv);ti.textContent="Hết giờ chuẩn bị – hãy nói!"}},1000)};
 mb.onclick=()=>{if(!mb._r){clearInterval(iv);tm=Date.now();tx._b=tx.value;ti.textContent="Đang thu…"}
  mic(mb,t=>{tx.value=((tx._b||"")+" "+t).trim()},async()=>{const sec=Math.max((Date.now()-tm)/1000,1),t=tx.value.trim();if(!t)return;const w=(t.match(/[A-Za-z']+/g)||[]).length,fl=(t.match(/\b(um+|uh+|erm?|you know|like)\b/gi)||[]).length,wpm=Math.round(w/sec*60);
   ti.textContent="Thời gian "+fmt(Math.round(sec));out.textContent="";const c=el("div","wb",null,el("b","","Phân tích bài nói"));
   [[wpm>=100&&wpm<=170,"Tốc độ "+wpm+" từ/phút (lý tưởng 110–160)"],[fl<=Math.max(2,w*.04),"Từ đệm (um, uh, like, you know): "+fl],[q[0]!=="Part 2"||sec>=90,"Thời lượng "+Math.round(sec)+" giây"+(q[0]==="Part 2"?" (Part 2 nên 1–2 phút)":"")]].forEach(([o,s])=>c.append(el("div",o?"ok":"no",(o?"✅ ":"⚠️ ")+s)));
   c.append(el("div","note","Lưu ý: văn bản nhận giọng nói không có dấu câu/viết hoa nên có thể bị báo lỗi thừa."));const lo=el("div");out.append(c,lo);addXP(10);await checkInto(t,lo)},true)};
 b.append(el("div","card","",qe,el("div","row","",rd,nq,pp,ti),el("div","row","",mb),tx,out),guide("Hướng dẫn IELTS Speaking",["Part 1 (4–5 phút): trả lời 2–3 câu, có lý do và ví dụ ngắn.","Part 2: 1 phút chuẩn bị, nói 1–2 phút theo gợi ý trên thẻ (who/what/when/why).","Part 3: thảo luận trừu tượng – nêu quan điểm, so sánh, dự đoán.","Tiêu chí: Fluency, Vocabulary, Grammar, Pronunciation. Đừng học thuộc lòng, hãy nói tự nhiên và sửa ý khi cần.","Cách luyện: ghi âm → đọc bản chép → sửa lỗi → nói lại (shadowing các câu mẫu ở tab Hội thoại)."]))},
t(b){const L=shuf(TP);let i=0,sc=0;const run=()=>{b.textContent="";if(i>=L.length){addXP(sc*5);b.append(el("div","card flash","",el("div","big","Điểm "+sc+"/"+L.length),el("div","note","Mục tiêu Part 5: ≥ 80% và mỗi câu ≤ 20 giây.")));const a=el("button","btn","Làm lại");a.onclick=()=>X.t(b);b.append(a);return}
 const q=L[i],ops=shuf(q[1].map((o,k)=>[o,k===0])),bx=el("div","row"),fb=el("div","wb hide");
 ops.forEach(([o,ok])=>{const t=el("button","btn sec",o);t.onclick=()=>{bx.querySelectorAll("button").forEach(x=>x.disabled=true);t.className="btn "+(ok?"ok2":"no2");if(ok)sc++;fb.classList.remove("hide");fb.textContent=(ok?"✅ Đúng. ":"❌ Đáp án: "+q[1][0]+". ")+q[2];const n=el("button","btn","Câu tiếp →");n.onclick=()=>{i++;run()};fb.append(el("div","row","",n))};bx.append(t)});
 b.append(el("div","card","",el("div","note","TOEIC Part 5 · Câu "+(i+1)+"/"+L.length),el("div","en",q[0]),bx,fb),guide("Mẹo làm Part 5",["Nhìn các đáp án trước: cùng gốc từ → đây là câu từ loại; khác nghĩa → câu từ vựng.","Xác định vị trí trống cần danh từ, động từ, tính từ hay trạng từ.","Học các cặp hay gặp: between…and, either…or, neither…nor, since/for, because/because of.","Không dịch cả câu; ưu tiên loại đáp án sai ngữ pháp trước."]))};run()},
v(b){b.textContent="";[["IELTS",IV],["TOEIC",TV]].forEach(([n,L])=>{const c=el("div","card"),sv=el("button","btn sec","⭐ Lưu cả bộ "+n+" vào Thẻ nhớ");sv.onclick=()=>{let k=0;L.forEach(([e,v])=>{if(idx(e)<0){saved.push({en:e,vi:v,type:"word",box:0,due:0,tags:[n],note:""});k++}});persist();sv.textContent="Đã thêm "+k+" từ ✅ (xem ở tab Thẻ/Game)"};
  c.append(el("div","row","",el("b","","Từ vựng "+n),sv));L.forEach(([e,v])=>{const s=el("span","chip",e+" – "+v);s.onclick=()=>speak(e);c.append(s)});b.append(c)})}};
const exInit=()=>{if(!$("#xbox").textContent)X.w($("#xbox"))};
$$("[data-x]").forEach(x=>x.onclick=()=>X[x.dataset.x]($("#xbox")));

persist();showStat();
