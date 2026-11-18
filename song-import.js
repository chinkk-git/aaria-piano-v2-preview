(()=>{
'use strict';
const KEY='aaria-piano-custom-songs-v1';
const $=id=>document.getElementById(id);
$('songWizard')?.remove();
const style=document.createElement('style');
style.textContent=`.local-omr-dialog{width:min(94vw,460px);max-height:92dvh;overflow:auto;border:1px solid #dcb4ff88;border-radius:22px;background:#211638;color:#fff;padding:0;box-shadow:0 20px 70px #000a}.local-omr-dialog::backdrop{background:#060411d9;backdrop-filter:blur(3px)}.local-omr-shell{padding:20px;display:grid;gap:13px}.local-omr-top{display:flex;align-items:center;justify-content:space-between;gap:12px}.local-omr-top h2{margin:0;color:#ffe8ff;font-size:22px}.local-omr-close{min-width:42px;min-height:42px}.local-omr-shell>p{margin:0;line-height:1.45}.local-omr-shell>label{display:grid;gap:6px;font-size:15px;font-weight:700}.local-omr-shell input[type=text]{width:100%;background:#17112b;color:#fff;border:1px solid #ad8bd0;border-radius:12px;padding:12px;font-size:17px}.local-omr-photos{display:grid;grid-template-columns:1fr 1fr;gap:10px}.local-omr-photo{position:relative;display:flex!important;align-items:center;justify-content:center;text-align:center;min-height:82px;padding:12px;border-radius:15px;background:#ffffff12;border:1px solid #cba6f377;cursor:pointer;font-size:16px!important}.local-omr-photo input{position:absolute;width:1px;height:1px;opacity:0;overflow:hidden}.local-omr-photo:focus-within{outline:3px solid #ffda8b}.local-omr-count{font-size:13px;color:#e2d4f8}.local-omr-status{padding:12px;margin:0;background:#ffffff10;border-radius:12px;font-size:14px;line-height:1.4;min-height:46px}.local-omr-status[aria-busy=true]::before{content:'✨ '}.local-omr-progress{width:100%;height:8px;accent-color:#d78af5}.local-omr-progress[hidden]{display:none}.local-omr-info{font-size:12px;color:#d7c9ed}.local-omr-info summary{cursor:pointer;font-weight:700}.local-omr-info p{line-height:1.4}.local-omr-info a{color:#e5c0ff;font-weight:700}.local-omr-actions{display:flex;gap:8px}.local-omr-actions button{min-height:48px;font-size:16px;font-weight:800}.local-omr-actions #makeSong{flex:1}.local-omr-minimize{background:#ffffff18}.magic-song-bubble{position:fixed;z-index:60;left:50%;bottom:max(14px,env(safe-area-inset-bottom));transform:translateX(-50%);min-height:50px;max-width:calc(100vw - 24px);padding:10px 16px;border:1px solid #ffdc8f;border-radius:26px;background:linear-gradient(130deg,#623d9a,#31215f);box-shadow:0 8px 30px #0009;color:#fff;font-weight:800;font-size:14px}.magic-song-bubble[hidden]{display:none}@media(max-width:360px){.local-omr-shell{padding:14px}.local-omr-photos{grid-template-columns:1fr}.local-omr-photo{min-height:58px}}`;
document.head.append(style);
const dialog=document.createElement('dialog');dialog.id='localSongWizard';dialog.className='local-omr-dialog';dialog.setAttribute('aria-labelledby','localSongWizardTitle');
dialog.innerHTML=`<div class="local-omr-shell"><div class="local-omr-top"><h2 id="localSongWizardTitle">🎹 Add a song!</h2><button class="alt local-omr-close" id="closeSongWizard" type="button" aria-label="Close">✕</button></div><p>Take a clear picture of the piano music. I’ll make it into a song for you!</p><label>Song name <input id="scoreSongTitle" type="text" maxlength="60" placeholder="My new song" autocomplete="off"></label><div class="local-omr-photos"><label class="local-omr-photo">📷 Take a photo<input id="scoreCamera" type="file" accept="image/*" capture="environment"></label><label class="local-omr-photo">🖼 Choose photo(s)<input id="scorePhotos" type="file" accept="image/*" multiple></label></div><div class="local-omr-count" id="scorePhotoCount">No pictures yet</div><progress class="local-omr-progress" id="scoreProgress" max="100" value="0" hidden></progress><div class="local-omr-status" id="scoreImportStatus" role="status" aria-live="polite">Choose a picture to begin.</div><p class="local-omr-info">First time needs Wi-Fi for setup. After that, songs are made on this device and work offline. Your pictures are never sent away.</p><details class="local-omr-info"><summary>Grown-up info</summary><p>First-time music reader setup uses about 158 MB of storage. Clear, printed music photographed flat works best. Automatic music reading can make mistakes; play the new song to check it.</p><a href="https://github.com/chinkk-git/aaria-magical-piano-kingdom/blob/main/OMR-THIRD-PARTY-NOTICES.md" target="_blank" rel="noopener noreferrer">App source and engine notices</a></details><div class="local-omr-actions"><button class="local-omr-minimize" id="keepPlaying" type="button" hidden>🎹 Keep playing</button><button id="makeSong" type="button" disabled>✨ Make my song</button></div><div class="local-omr-actions" id="readyActions" hidden><button id="playMySong" type="button">▶ Play my song</button><button class="alt" id="practiceMySong" type="button">✨ Practice</button></div></div>`;
document.body.append(dialog);const bubble=document.createElement('button');bubble.className='magic-song-bubble';bubble.hidden=true;bubble.textContent='✨ Making your song… tap to open';document.body.append(bubble);
const camera=$('scoreCamera'),gallery=$('scorePhotos'),titleInput=$('scoreSongTitle'),status=$('scoreImportStatus'),count=$('scorePhotoCount'),progress=$('scoreProgress'),make=$('makeSong'),close=$('closeSongWizard');
let photos=[],worker=null,workerReady=null,requestId=0,jobRunning=false,lastCreatedSong=null;const minimize=$('keepPlaying'),readyActions=$('readyActions');minimize.hidden=true;minimize.addEventListener('click',()=>{dialog.close();bubble.hidden=false});bubble.addEventListener('click',()=>{bubble.hidden=true;dialog.showModal()});$('playMySong').addEventListener('click',()=>{if(lastCreatedSong){window.PianoKingdomLibrary.selectSong(lastCreatedSong.id);window.PianoKingdomLibrary.playMode('listen');dialog.close()}});$('practiceMySong').addEventListener('click',()=>{if(lastCreatedSong){window.PianoKingdomLibrary.selectSong(lastCreatedSong.id);window.PianoKingdomLibrary.playMode('practice');dialog.close()}});dialog.addEventListener('close',()=>{if(jobRunning)bubble.hidden=false});
const pending=new Map(),downloadedModels=new Map();
$('addSongOpen').addEventListener('click',()=>dialog.showModal());
close.addEventListener('click',()=>dialog.close());
function addPhotos(input){
 const picked=Array.from(input.files||[]).filter(f=>f.type.startsWith('image/'));
 input.value='';
 if(!picked.length)return;
 const seen=new Set(photos.map(f=>`${f.name}:${f.size}:${f.lastModified}`));
 for(const f of picked){const key=`${f.name}:${f.size}:${f.lastModified}`;if(!seen.has(key)){photos.push(f);seen.add(key)}}
 count.textContent=photos.length===1?'1 picture ready':`${photos.length} pictures ready • in page order`;
 make.disabled=!photos.length;
 if(photos.length&&status.textContent==='Choose a picture to begin.')status.textContent='Great! Add a name, then tap Make my song.';
}
camera.addEventListener('change',()=>addPhotos(camera));gallery.addEventListener('change',()=>addPhotos(gallery));

const children=(el,name)=>Array.from(el?.children||[]).filter(x=>x.localName===name);
const child=(el,name)=>children(el,name)[0]||null;
const text=(el,name)=>child(el,name)?.textContent?.trim()||'';
const descendants=(el,name)=>Array.from(el?.getElementsByTagName(name)||[]);
function parseMusicXML(source){
 const doc=new DOMParser().parseFromString(source,'application/xml');
 if(doc.querySelector('parsererror'))throw Error('The music reader made an unreadable score.');
 const root=doc.documentElement;if(root.localName!=='score-partwise')throw Error('This page does not have a readable music score.');
 const partNames=new Map(children(child(root,'part-list'),'score-part').map(p=>[p.getAttribute('id'),text(p,'part-name')]));
 const parts=children(root,'part');if(!parts.length)throw Error('No music was found on this page.');
 const byBar=[];let bpm=0,notesSeen=0;
 for(let pi=0;pi<parts.length;pi++){
  const part=parts[pi],id=part.getAttribute('id')||`part-${pi+1}`,partName=partNames.get(id)||'';let divisions=1,beats=4,beatType=4;
  const nameHand=/left|bass|lower|accomp|piano\s*2/i.test(partName)?'left':'right';
  for(const [mi,measure] of children(part,'measure').entries()){
   let attrs=child(measure,'attributes');if(attrs){const d=Number(text(attrs,'divisions'));if(d>0)divisions=d;const time=child(attrs,'time');if(time){const b=text(time,'beats'),bt=Number(text(time,'beat-type'));const n=b.split('+').map(Number).reduce((a,x)=>a+(Number.isFinite(x)?x:0),0);if(n>0)beats=n;if(bt>0)beatType=bt}}
   for(const sound of descendants(measure,'sound')){const t=Number(sound.getAttribute('tempo'));if(!bpm&&t>0)bpm=t}for(const per of descendants(measure,'per-minute')){const t=Number(per.textContent);if(!bpm&&t>0)bpm=t}
   let cursor=0,lastOnset=0,measureEnd=0;const pendingNotes=[];
   for(const node of Array.from(measure.children)){
    if(node.localName==='attributes'){const d=Number(text(node,'divisions'));if(d>0)divisions=d;const time=child(node,'time');if(time){const b=text(time,'beats'),bt=Number(text(time,'beat-type'));const n=b.split('+').map(Number).reduce((a,x)=>a+(Number.isFinite(x)?x:0),0);if(n>0)beats=n;if(bt>0)beatType=bt}}
    else if(node.localName==='backup'){cursor=Math.max(0,cursor-(Number(text(node,'duration'))||0))}
    else if(node.localName==='forward'){cursor+=Number(text(node,'duration'))||0;measureEnd=Math.max(measureEnd,cursor)}
    else if(node.localName==='note'){
     const duration=Number(text(node,'duration'))||0,chord=!!child(node,'chord'),grace=!!child(node,'grace'),rest=!!child(node,'rest'),onset=chord?lastOnset:cursor,pitch=child(node,'pitch');
     if(pitch&&!rest&&duration>0){const step=text(pitch,'step').toUpperCase(),oct=Number(text(pitch,'octave')),alter=Number(text(pitch,'alter'))||0;const pcs={C:0,D:2,E:4,F:5,G:7,A:9,B:11};if(!(step in pcs)||!Number.isFinite(oct))throw Error('A piano note could not be read.');const midi=12*(oct+1)+pcs[step]+alter;const staff=Number(text(node,'staff'))||1;const hand=staff>=2?'left':nameHand;const tieNodes=[...children(node,'tie'),...descendants(child(node,'notations'),'tied')];pendingNotes.push({bar:mi+1,at:onset*2/divisions,dur:duration*2/divisions,midi,hand,part:`piano-${hand==='left'?'lh':'rh'}`,partKey:`${id}:${staff}`,tieStart:tieNodes.some(x=>x.getAttribute('type')==='start'),tieStop:tieNodes.some(x=>x.getAttribute('type')==='stop')});notesSeen++}
     if(!chord&&!grace){lastOnset=cursor;cursor+=duration;measureEnd=Math.max(measureEnd,cursor)}
    }
   }
   const expected=beats*8/beatType;const length=measure.getAttribute('implicit')==='yes'?Math.max(measureEnd*2/divisions,.25):Math.max(expected,measureEnd*2/divisions);byBar[mi]=Math.max(byBar[mi]||0,length);byBar[`${mi+1}_events`]=[...(byBar[`${mi+1}_events`]||[]),...pendingNotes];
  }
 }
 const barLengths=byBar.filter((_,i)=>typeof i==='number');if(!barLengths.length)throw Error('No measures were found.');
 const events=barLengths.flatMap((_,i)=>byBar[`${i+1}_events`]||[]).sort((a,b)=>a.bar-b.bar||a.at-b.at||a.midi-b.midi);
 const starts=[0];for(const len of barLengths)starts.push(starts.at(-1)+len);for(const e of events)e.absoluteStart=starts[e.bar-1]+e.at;
 const pendingTies=new Map(),merged=[];for(const e of events){const k=`${e.partKey}:${e.midi}`,previous=pendingTies.get(k);if(e.tieStop&&previous){previous.dur=e.absoluteStart+e.dur-previous.absoluteStart;if(e.tieStart)pendingTies.set(k,previous);else pendingTies.delete(k);continue}merged.push(e);if(e.tieStart)pendingTies.set(k,e)}
 const playable=merged.filter(e=>e.midi>=21&&e.midi<=108);if(playable.length!==merged.length)throw Error('Some notes are beyond a full piano’s playable range. Try a different page.');
 if(playable.length>3000)throw Error('That page has too many notes. Try one page at a time.');
 const finalEvents=playable.map(({absoluteStart,partKey,tieStart,tieStop,...e})=>e);if(!finalEvents.length)throw Error('No piano notes were found. Try a clear photo of printed music.');
 return{events:finalEvents,barLengths,bpm:Math.max(30,Math.min(240,Math.round(bpm||72))),rawCount:notesSeen};
}
function setStatus(message,busy=false){status.textContent=message;status.setAttribute('aria-busy',String(busy));if(busy)bubble.textContent='✨ Making your song… tap to open';}
function handleWorkerMessage(data){
 if(data.type==='progress'&&data.stage==='download'){
  downloadedModels.set(data.name,data.loaded||0);
  const total=data.total||157528486,loaded=[...downloadedModels.values()].reduce((a,b)=>a+b,0),mb=(loaded/1e6).toFixed(0),all=(total/1e6).toFixed(0);
  progress.hidden=false;progress.max=total;progress.value=loaded;
  setStatus(`Getting the music reader ready… ${mb} of ${all} MB`,true);return;
 }
 if(data.type==='progress'&&data.stage==='retry'){setStatus('Getting ready again… Your pictures are safe on this device.',true);return}
 if(data.type==='ready'){progress.hidden=true;workerReady?.resolve();return}
 if(data.type==='error'&&data.id==null){workerReady?.reject(new Error(data.msg||'The music reader could not start.'));worker?.terminate();worker=null;workerReady=null;return}
 if(data.type==='result'||data.type==='error'){
  const task=pending.get(data.id);if(!task)return;pending.delete(data.id);
  if(data.type==='result')task.resolve(data);else task.reject(new Error(data.msg||'The music reader could not read that picture.'));return;
 }
}
function ensureWorker(){
 if(workerReady)return workerReady.promise;
 if(!('Worker'in window)||!('OffscreenCanvas'in window)&&!document.createElement('canvas').getContext){return Promise.reject(new Error('This browser cannot read music pictures. Open Piano Kingdom in Safari or Chrome.'))}
 workerReady={};workerReady.promise=new Promise((resolve,reject)=>{workerReady.resolve=resolve;workerReady.reject=reject});
 try{worker=new Worker('./omr-worker.js',{type:'module'});worker.onmessage=e=>handleWorkerMessage(e.data);worker.onerror=e=>{const err=new Error(e.message||'The music reader stopped.');pending.forEach(p=>p.reject(err));pending.clear();workerReady?.reject(err);worker=null;workerReady=null}}
 catch(e){workerReady.reject(e);workerReady=null;return Promise.reject(e)}
 worker.postMessage({type:'init',noGpu:true,ios:/iPhone|iPad|iPod/.test(navigator.userAgent)});
 return workerReady.promise;
}
function ask(data,transfer=[]){return new Promise((resolve,reject)=>{const id=++requestId;pending.set(id,{resolve,reject});worker.postMessage({...data,id},transfer)})}
async function imageBytes(file){
 let bitmap;try{bitmap=await createImageBitmap(file,{imageOrientation:'from-image'})}catch{bitmap=await createImageBitmap(file)}
 const scale=Math.min(1,4200/Math.max(bitmap.width,bitmap.height)),w=Math.max(1,Math.round(bitmap.width*scale)),h=Math.max(1,Math.round(bitmap.height*scale));let blob;
 if('OffscreenCanvas'in window){const canvas=new OffscreenCanvas(w,h);canvas.getContext('2d').drawImage(bitmap,0,0,w,h);blob=await canvas.convertToBlob({type:'image/png'});canvas.width=canvas.height=0}
 else{const canvas=document.createElement('canvas');canvas.width=w;canvas.height=h;canvas.getContext('2d').drawImage(bitmap,0,0,w,h);blob=await new Promise(resolve=>canvas.toBlob(resolve,'image/png'));canvas.width=canvas.height=0}
 bitmap.close?.();if(!blob)throw new Error('That picture could not be opened. Try another one.');return blob.arrayBuffer();
}
async function readPhoto(file,index,total){
 setStatus(`Reading picture ${index} of ${total}…`,true);progress.hidden=false;progress.max=100;progress.value=0;
 const img=await imageBytes(file);progress.value=5;
 const layoutImage=img.slice(0);const layout=await ask({type:'layout',image:layoutImage},[layoutImage]);progress.value=25;
 const result=await ask({type:'recognise',image:img,classes:layout.classes},[img]);progress.value=60;
 return parseMusicXML(result.xml);
}
async function estimateStorage(){
 try{await navigator.storage?.persist?.();const q=await navigator.storage?.estimate?.();if(q?.quota&&q.quota-q.usage<190*1024*1024)throw new Error('space')}catch(e){if(e.message==='space')throw new Error('This device needs more free space for the music reader. Ask a grown-up to free some space, then try again.')}
}
function friendlyError(err){
 const m=String(err?.message||err);
 if(/space|quota|QuotaExceeded/i.test(m))return 'This device needs more free space for the music reader. Ask a grown-up to free some space, then try again.';
 if(/failed to fetch|network|download|ERR_INTERNET|unexpected response/i.test(m))return 'I need Wi-Fi to get the music reader ready the first time. Connect and try again.';
 if(/outside this piano|playable range/i.test(m))return 'Some notes are too high or low for this piano. Try a different page.';
 if(/No music|No measures|No piano notes|staffs|noteheads|clefs/i.test(m))return 'I couldn’t read that picture. Try again with the page flat, bright, and fully in view.';
 return 'I couldn’t make that song yet. Try a clearer picture with all the music in view.';
}
async function fingerprint(value){if(globalThis.crypto?.subtle){const bytes=await crypto.subtle.digest('SHA-256',new TextEncoder().encode(value));return Array.from(new Uint8Array(bytes),b=>b.toString(16).padStart(2,'0')).join('')}let h=2166136261;for(let i=0;i<value.length;i++){h^=value.charCodeAt(i);h=Math.imul(h,16777619)}return (h>>>0).toString(16)}
async function createSong(){
 if(!photos.length||jobRunning)return;jobRunning=true;minimize.hidden=false;readyActions.hidden=true;make.textContent='✨ Making your song…';make.disabled=true;camera.disabled=true;gallery.disabled=true;titleInput.disabled=true;close.disabled=true;progress.hidden=false;progress.value=0;downloadedModels.clear();
 try{
  await estimateStorage();setStatus('Getting the music reader ready… This happens once.',true);await ensureWorker();
  const pages=[];for(let i=0;i<photos.length;i++)pages.push(await readPhoto(photos[i],i+1,photos.length));
  const barLengths=[],events=[];let offset=0;for(const page of pages){events.push(...page.events.map(e=>({...e,bar:e.bar+offset})));barLengths.push(...page.barLengths);offset+=page.barLengths.length}
  const title=titleInput.value.trim()||'My song',bpm=pages.find(p=>p.bpm)?.bpm||72;const songData={title,events,total:barLengths.length,barLengths,bpm,imported:true,omr:'local'};const signature=JSON.stringify({events:events.map(({bar,at,midi,dur,hand,part})=>[bar,at,midi,dur,hand,part]),barLengths,bpm});let id='custom-'+await fingerprint(signature);let song=Object.values(window.PianoKingdomLibrary.songs).find(s=>s.imported&&JSON.stringify({events:s.events?.map(({bar,at,midi,dur,hand,part})=>[bar,at,midi,dur,hand,part]),barLengths:s.barLengths,bpm:s.bpm})===signature);if(song){id=song.id;setStatus('This song is already in My Songs. Opening it now!')}else song={id,...songData};
  try{await window.PianoKingdomLibrary.saveSong(song);window.PianoKingdomLibrary.addSong(song);lastCreatedSong=song}catch{throw new Error('This device is out of song storage. Ask a grown-up to free some space, then try again.')}
  jobRunning=false;setStatus('Your song is ready! ✨');progress.hidden=true;readyActions.hidden=false;make.textContent='✅ Saved in My Songs';make.disabled=true;photos=[];count.textContent='Your song is saved on this device.';titleInput.value='';titleInput.disabled=false;camera.disabled=false;gallery.disabled=false;close.disabled=false;bubble.textContent='🎉 Your song is ready! Tap to open';bubble.hidden=false;
 }catch(err){jobRunning=false;setStatus(friendlyError(err));progress.hidden=true;make.textContent='🔁 Try again';make.disabled=!photos.length;camera.disabled=false;gallery.disabled=false;titleInput.disabled=false;close.disabled=false;bubble.textContent='⚠️ Your song needs another try. Tap here';bubble.hidden=false}
}
make.addEventListener('click',createSong);
})();
