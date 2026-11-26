'use strict';
const KEY='groundwork-v3';
const DAYS=['Monday','Tuesday','Wednesday','Thursday','Friday','Saturday','Sunday'];
const defaults={profile:{nickname:'',birthYear:'',club:'Helensvale Hornets',team:'U17 Girls',position:'',experience:'Basic'},schedule:{trainingDays:['Monday','Wednesday'],gameDay:'Saturday'},workouts:[],fixtures:[]};
let data=loadData(),programType='gym',deferredInstall=null;
function loadData(){try{return {...structuredClone(defaults),...JSON.parse(localStorage.getItem(KEY)||'{}')};}catch{return structuredClone(defaults)}}
function save(){localStorage.setItem(KEY,JSON.stringify(data));}
function dateOnly(d){return new Date(d.getFullYear(),d.getMonth(),d.getDate())}
function dayIndex(name){return DAYS.indexOf(name)}
function weekdayName(date){return DAYS[(date.getDay()+6)%7]}
function phaseFor(date=new Date()){let m=date.getMonth();if(m>=9||m===0)return {title:'Off-season foundation',text:'Build movement quality, strength and confidence before team training.',chip:'OCT–JAN',phase:'off'};if(m===1||m===2)return {title:'Pre-season preparation',text:'Blend gym work with team training and gradually prepare for match demands.',chip:'FEB–MAR',phase:'pre'};return {title:'In-season performance',text:'Maintain strength and power while protecting energy for training and games.',chip:'APR–SEP',phase:'season'}}
function esc(s=''){return String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]))}
function toast(msg){let t=document.getElementById('toast');t.textContent=msg;t.classList.add('show');setTimeout(()=>t.classList.remove('show'),2200)}
function showScreen(id){document.querySelectorAll('.screen').forEach(s=>s.classList.toggle('active',s.id===id));document.querySelectorAll('.nav-item').forEach(b=>b.classList.toggle('active',b.dataset.screen===id));if(id==='home')renderHome();if(id==='train')renderWorkouts();if(id==='progress')renderProgress();if(id==='history')renderHistory();if(id==='profile')renderProfile();window.scrollTo(0,0)}
document.querySelectorAll('[data-screen]').forEach(b=>b.addEventListener('click',()=>showScreen(b.dataset.screen)));document.querySelectorAll('[data-go]').forEach(b=>b.addEventListener('click',()=>showScreen(b.dataset.go)));
function mondayOf(d){let x=dateOnly(d);x.setDate(x.getDate()-((x.getDay()+6)%7));return x}
function fmt(d,opts={day:'numeric',month:'short'}){return new Intl.DateTimeFormat('en-AU',opts).format(d)}
function fixtureDate(f){return new Date(f.date+'T12:00:00')}
function nextFixture(){let today=dateOnly(new Date());return data.fixtures.filter(f=>dateOnly(fixtureDate(f))>=today).sort((a,b)=>a.date.localeCompare(b.date))[0]}
function makeWeek(){
  const start=mondayOf(new Date()),p=phaseFor(),fixture=nextFixture();
  const fixtureIsThisWeek=fixture&&mondayOf(fixtureDate(fixture)).getTime()===start.getTime();
  const actualGameDay=fixtureIsThisWeek?weekdayName(fixtureDate(fixture)):data.schedule.gameDay;
  const items=[];
  for(let i=0;i<7;i++){
    const day=DAYS[i];let title='Recovery / rest',sub='Easy movement if desired',tag='RECOVERY';
    if(p.phase!=='off'&&data.schedule.trainingDays.includes(day)){title='Team training';sub='Follow the coach’s session';tag='TEAM'}
    if(p.phase==='off'){
      if(day==='Tuesday'){title='Gym · Strength A';sub='Full-body foundation';tag='GYM'}
      if(day==='Thursday'){title='Gym · Strength B';sub='Controlled strength and stability';tag='GYM'}
      if(day==='Saturday'){title='Gym · Strength C';sub='Full-body technique and capacity';tag='GYM'}
      if(day==='Sunday'){title='Optional recovery';sub='Mobility or easy walk only';tag='OPTIONAL'}
    } else {
      if(day==='Tuesday'){title='Gym · Main strength';sub='Moderate, supervised full-body session';tag='GYM'}
      if(day==='Thursday'){title='Optional gym · light primer';sub='20–25 min, only if fresh and coach-approved';tag='OPTIONAL'}
    }
    if(day===actualGameDay){title='GAME DAY';sub=fixtureIsThisWeek?`vs ${fixture.opponent}`:'Usual match day — confirm fixture';tag='MATCH'}
    const dayNum=DAYS.indexOf(day);
    if((actualGameDay==='Friday'||actualGameDay==='Saturday')&&day==='Thursday'){title=actualGameDay==='Friday'?'Pre-game recovery':'Optional light primer';sub=actualGameDay==='Friday'?'No gym; easy mobility, food and sleep':'Only a short, easy primer if fresh; no heavy lower-body work';tag=actualGameDay==='Friday'?'RECOVERY':'OPTIONAL'}
    if(actualGameDay==='Friday'&&day==='Saturday'){title='Post-game recovery';sub='Rest or gentle walk; check how the body feels';tag='RECOVERY'}
    if(actualGameDay==='Saturday'&&day==='Friday'){title='Pre-game rest';sub='No gym; prioritise sleep, food and hydration';tag='RECOVERY'}
    if(actualGameDay==='Sunday'&&day==='Saturday'){title='Pre-game rest';sub='Keep the day easy before tomorrow’s match';tag='RECOVERY'}
    if(actualGameDay==='Friday'&&day==='Tuesday'&&p.phase!=='off'){sub='Main strength session — finish comfortably';}
    if(actualGameDay==='Saturday'&&day==='Thursday'&&p.phase!=='off'){title='Optional gym · light primer';sub='20–25 min, only if fresh and coach-approved';tag='OPTIONAL'}
    items.push({day,title,sub,tag});
  }
  return {start,items,fixture:fixtureIsThisWeek?fixture:null};
}
function renderHome(){let now=new Date(),p=phaseFor(),week=makeWeek();document.getElementById('todayLabel').textContent=fmt(now,{weekday:'long',day:'numeric',month:'long'}).toUpperCase();document.getElementById('greeting').textContent=(data.profile.nickname?`Let's get after it, ${data.profile.nickname}.`:'Small steps. Strong foundations. Better footy.');document.getElementById('phaseTitle').textContent=p.title;document.getElementById('phaseText').textContent=p.text;let phaseStart=new Date(now.getFullYear(),p.phase==='off'?(now.getMonth()>=9?9:0):p.phase==='pre'?1:3,1);if(p.phase==='off'&&now.getMonth()===0)phaseStart=new Date(now.getFullYear()-1,9,1);let blockWeek=(Math.floor((dateOnly(now)-dateOnly(phaseStart))/604800000)%12)+1;document.getElementById('phaseWeeks').textContent=`${p.chip} · WK ${blockWeek}/12`;let end=new Date(week.start);end.setDate(end.getDate()+6);document.getElementById('weekRange').textContent=`${fmt(week.start)} – ${fmt(end)}`;document.getElementById('weekPlan').innerHTML=week.items.map(x=>`<div class="day-row"><div class="day-name">${x.day.slice(0,3).toUpperCase()}</div><div><div class="day-title">${esc(x.title)}</div><div class="day-sub">${esc(x.sub)}</div></div><span class="day-tag">${x.tag}</span></div>`).join('');let f=nextFixture();document.getElementById('nextGame').innerHTML=f?`<div><strong>${esc(f.opponent)}</strong><p>${fmt(fixtureDate(f),{weekday:'long',day:'numeric',month:'long'})}${f.time?' · '+f.time:''}${f.venue?' · '+esc(f.venue):''}</p></div><span class="day-tag">UP NEXT</span>`:'<div><strong>No upcoming game added</strong><p>Add a fixture when the 2027 draw is released.</p></div><a class="text-link" href="#fixtures" data-open-fixtures>Add →</a>';let a=document.querySelector('[data-open-fixtures]');if(a)a.addEventListener('click',e=>{e.preventDefault();showScreen('fixtures')});}
const workouts={off:[{id:'off-a',name:'Strength A · Full body',focus:'Build basic movement patterns with controlled tempo.',duration:'40–50 min',ex:[['Goblet squat','2–3 × 8'],['Dumbbell bench press','2–3 × 8'],['Seated cable row','2–3 × 10'],['Hip hinge / light Romanian deadlift','2 × 8'],['Dead bug','2 × 8 each side']]},{id:'off-b',name:'Strength B · Lower & upper',focus:'Develop balanced strength and trunk control.',duration:'40–50 min',ex:[['Split squat (supported if needed)','2 × 8 each side'],['Lat pulldown','2–3 × 10'],['Dumbbell shoulder press','2 × 8'],['Glute bridge','2–3 × 10'],['Side plank','2 × 20 sec each side']]},{id:'off-c',name:'Strength C · Athletic foundation',focus:'Practice quality movement and single-leg stability.',duration:'35–45 min',ex:[['Step-up (low box)','2 × 8 each side'],['Incline push-up','2 × 8–10'],['Chest-supported row','2 × 10'],['Calf raise','2 × 12'],['Bird dog','2 × 8 each side']]}],in:[{id:'in-a',name:'Main strength · Full body',focus:'Maintain strength with moderate effort; leave reps in reserve.',duration:'35–45 min',ex:[['Goblet squat or coached squat','2–3 × 6–8'],['Dumbbell bench press','2–3 × 8'],['Cable row','2–3 × 8–10'],['Romanian deadlift (light/moderate)','2 × 8'],['Pallof press','2 × 8 each side']]},{id:'in-b',name:'Short strength & movement',focus:'Keep the session crisp. Avoid fatigue close to match day.',duration:'25–35 min',ex:[['Low step-up','2 × 6 each side'],['Incline push-up','2 × 8'],['Lat pulldown','2 × 8'],['Glute bridge','2 × 10'],['Balance + calf raise','2 rounds']]}]};
const recovery=[{id:'rec-a',name:'Mobility & reset',focus:'Easy recovery session. Keep intensity low.',duration:'15–20 min',ex:[['Easy walk or bike','5 min'],['Ankle rocks','8 each side'],['Hip flexor mobility','20 sec each side'],['Thoracic rotations','8 each side'],['Single-leg balance','2 × 20 sec']]},{id:'rec-b',name:'Movement & aerobic base',focus:'Optional easy aerobic work; conversational pace only.',duration:'15–25 min',ex:[['Easy cycle, walk or swim','10–15 min'],['Bodyweight squat to box','2 × 8'],['Band pull-apart','2 × 12'],['Dead bug','2 × 6 each side']]}];
function exerciseVideoUrl(name){return 'https://www.youtube.com/results?search_query='+encodeURIComponent(name+' exercise technique demonstration proper form');}
function exerciseVideoLink(name){return `<a class="video-link" href="${exerciseVideoUrl(name)}" target="_blank" rel="noopener noreferrer" aria-label="Watch ${esc(name)} demonstration on YouTube">▶ Watch demo</a>`;}
function exerciseCue(name){const cues={
'Goblet squat':'Keep feet planted, brace gently and squat only as deep as you can control.',
'Goblet squat or coached squat':'Use the version coached in the gym; keep the movement smooth and controlled.',
'Dumbbell bench press':'Keep wrists stacked, shoulder blades comfortable and lower with control.',
'Seated cable row':'Sit tall, pull elbows back without shrugging or leaning.',
'Cable row':'Stay tall and avoid swinging the torso.',
'Hip hinge / light Romanian deadlift':'Push hips back with a neutral spine; use a light load and stop at a comfortable range.',
'Romanian deadlift (light/moderate)':'Hinge from the hips with a neutral spine; only use a coached, comfortable load.',
'Dead bug':'Keep ribs down and move slowly without arching the lower back.',
'Split squat (supported if needed)':'Use support if balance is uncertain; keep the front foot flat.',
'Lat pulldown':'Pull toward upper chest without leaning far back.',
'Dumbbell shoulder press':'Use a light load and avoid arching the back.',
'Glute bridge':'Press through feet and lift hips without over-arching.',
'Side plank':'Keep body in a straight line; shorten the hold if form changes.',
'Step-up (low box)':'Choose a low stable step and control the lowering phase.',
'Low step-up':'Use a low step; drive through the whole foot and lower slowly.',
'Incline push-up':'Keep body straight and choose a height that allows smooth reps.',
'Chest-supported row':'Keep chest supported and avoid shrugging.',
'Calf raise':'Rise smoothly, pause briefly and lower with control.',
'Bird dog':'Reach opposite arm and leg without rotating the hips.',
'Pallof press':'Stand tall and resist rotation as you press the band or cable away.',
'Balance + calf raise':'Use support nearby and keep each repetition controlled.',
'Easy walk or bike':'Easy pace; you should be able to talk comfortably.',
'Ankle rocks':'Keep heel down and gently move knee forward over toes.',
'Hip flexor mobility':'Use a gentle range; do not force a stretch.',
'Thoracic rotations':'Rotate through upper back without forcing the lower back.',
'Single-leg balance':'Stand tall near support; focus on steady control.',
'Easy cycle, walk or swim':'Conversational pace only.',
'Bodyweight squat to box':'Touch the box lightly and stand with control.',
'Band pull-apart':'Keep shoulders relaxed and move band apart smoothly.'};return cues[name]||'Use a comfortable range, move with control and follow the coach’s technique cues.'}
function phaseStartDate(date=new Date()){
  const p=phaseFor(date),y=date.getFullYear(),m=date.getMonth();
  if(p.phase==='off')return new Date(m>=9?y:y-1,9,1);
  if(p.phase==='pre')return new Date(y,1,1);
  return new Date(y,3,1);
}
function programBlock(date=new Date()){
  const p=phaseFor(date),start=phaseStartDate(date),elapsed=Math.max(0,Math.floor((dateOnly(date)-dateOnly(start))/604800000));
  const blockIndex=Math.floor(elapsed/4),weekInBlock=(elapsed%4)+1;
  const targetPerWeek=p.phase==='off'?3:p.phase==='pre'?2:1;
  let successfulBlocks=0,blockReviews=[];
  for(let b=0;b<blockIndex;b++){
    const from=new Date(start);from.setDate(from.getDate()+b*28);
    const to=new Date(from);to.setDate(to.getDate()+28);
    const completed=data.workouts.filter(w=>w.type==='gym'&&new Date(w.date)>=from&&new Date(w.date)<to).length;
    const target=targetPerWeek*4,ratio=completed/target;
    const passed=ratio>=0.7;
    if(passed)successfulBlocks++;else successfulBlocks=0;
    blockReviews.push({completed,target,passed});
  }
  const stage=Math.min(3,1+successfulBlocks),currentFrom=new Date(start);currentFrom.setDate(currentFrom.getDate()+blockIndex*28);
  const currentTo=new Date(currentFrom);currentTo.setDate(currentTo.getDate()+28);
  const completedCurrent=data.workouts.filter(w=>w.type==='gym'&&new Date(w.date)>=currentFrom&&new Date(w.date)<currentTo).length;
  const targetCurrent=targetPerWeek*4;
  const previous=blockReviews[blockReviews.length-1];
  return {phase:p.phase,block:blockIndex+1,week:weekInBlock,stage,completedCurrent,targetCurrent,previous,from:currentFrom,to:currentTo};
}
function progressedWorkout(w,stage){
  if(stage===1)return {...w,ex:w.ex.map(e=>[...e])};
  const ex=w.ex.map((e,i)=>[e[0],e[1]]);
  // Small, technique-led volume progressions only. No automatic load increases.
  ex.forEach((e,i)=>{
    if(i>1)return;
    const match=e[1].match(/^(\d+)(?:–(\d+))?\s×\s(.+)$/);
    if(!match)return;
    let low=Number(match[1]),high=Number(match[2]||match[1]),rep=match[3];
    if(stage>=2){low=Math.min(3,low+1);high=Math.min(3,high+1)}
    if(stage>=3){const r=rep.match(/^(\d+)(?:–(\d+))?$/);if(r){const a=Math.min(12,Number(r[1])+1),b=Math.min(12,Number(r[2]||r[1])+1);rep=a===b?String(a):`${a}–${b}`}}
    e[1]=`${low===high?low:`${low}–${high}`} × ${rep}`;
  });
  return {...w,ex};
}
function renderWorkouts(){let p=phaseFor(),block=programBlock(),list=programType==='recovery'?recovery:(p.phase==='off'?workouts.off:workouts.in);
  const info=document.getElementById('programBlockInfo');
  if(info){const focus=block.stage===1?'Technique and movement quality':block.stage===2?'Build a little more training volume':'Develop repeatable strength and control';const review=block.previous?(block.previous.passed?`Previous block: ${block.previous.completed}/${block.previous.target} gym sessions completed — progression unlocked.`:`Previous block: ${block.previous.completed}/${block.previous.target} sessions. This block consolidates the current level.`):'Starting block: establish a comfortable baseline before progressing.';info.innerHTML=`<div class="eyebrow">AUTOMATIC 4-WEEK PROGRAM</div><h2>Block ${block.block} · Week ${block.week} of 4</h2><p><b>${focus}</b></p><p class="muted small">${review}</p><div class="block-progress"><span style="width:${Math.min(100,Math.round(block.completedCurrent/block.targetCurrent*100))}%"></span></div><p class="muted small">${block.completedCurrent} of ${block.targetCurrent} planned gym sessions logged this block. The next block is reviewed automatically.</p>`;}
  list=list.map(w=>progressedWorkout(w,block.stage));document.getElementById('workoutCards').innerHTML=list.map(w=>`<article class="workout-card"><div class="workout-top"><div><h3>${w.name}</h3><p>${w.focus}</p></div><span class="tag">${w.duration}</span></div><div class="exercise-list">${w.ex.map(e=>`<div class="exercise"><div><b>${esc(e[0])}</b><small>${esc(exerciseCue(e[0]))}</small>${exerciseVideoLink(e[0])}</div><span>${esc(e[1])}</span></div>`).join('')}</div><button class="primary full" data-log="${w.id}">Log this session</button></article>`).join('')+`<p class="muted small">These are starter templates, not a personalised prescription. A qualified youth strength and conditioning coach should check exercise selection, technique, load and volume. Start with easy resistance and stop well before failure.</p>`;document.querySelectorAll('[data-log]').forEach(b=>b.addEventListener('click',()=>logWorkout(b.dataset.log)));}
document.querySelectorAll('[data-program]').forEach(b=>b.addEventListener('click',()=>{programType=b.dataset.program;document.querySelectorAll('[data-program]').forEach(x=>x.classList.toggle('selected',x===b));renderWorkouts()}));
function logWorkout(id){
  const all=[...workouts.off,...workouts.in,...recovery],base=all.find(x=>x.id===id);if(!base)return;const p=phaseFor(),w=progressedWorkout(base,programBlock().stage);
  const modal=document.getElementById('sessionModal'),form=document.getElementById('sessionForm');
  document.getElementById('sessionTitle').textContent=w.name;
  document.getElementById('sessionIntro').textContent='Record what was completed. Load is optional — technique and comfortable effort come first.';
  form.dataset.workoutId=id;
  document.getElementById('sessionExercises').innerHTML=w.ex.map((e,i)=>`<div class="session-exercise"><b>${esc(e[0])}</b><span class="muted">Plan: ${esc(e[1])}</span>${exerciseVideoLink(e[0])}<div class="session-fields"><label>Sets<input type="number" min="0" max="10" name="sets-${i}" value="${(e[1].match(/^(\d+)/)||[,'2'])[1]}" inputmode="numeric"></label><label>Reps / time<input name="reps-${i}" maxlength="20" placeholder="e.g. 8" value="${esc((e[1].match(/×\s*([^ ]+(?: [^ ]+)?)/)||[])[1]||'')}"></label><label>Load (kg)<input type="number" min="0" max="300" step="0.5" name="load-${i}" placeholder="Optional" inputmode="decimal"></label></div></div>`).join('');
  modal.classList.remove('hidden');
  form.onsubmit=e=>{e.preventDefault();const fd=new FormData(form),entries=w.ex.map((ex,i)=>({exercise:ex[0],sets:Number(fd.get(`sets-${i}`)||0),reps:String(fd.get(`reps-${i}`)||''),load:fd.get(`load-${i}`)===''?null:Number(fd.get(`load-${i}`))}));
    data.workouts.unshift({id:crypto.randomUUID?crypto.randomUUID():String(Date.now()),name:w.name,date:new Date().toISOString(),type:id.startsWith('rec')?'recovery':'gym',exerciseEntries:entries,notes:String(fd.get('notes')||'')});save();modal.classList.add('hidden');toast('Session saved to your training history');renderWorkouts();renderProgress();renderHistory();};
}
function renderProgress(){let n=data.workouts.length,weeks=new Set(data.workouts.map(w=>mondayOf(new Date(w.date)).toISOString().slice(0,10)));document.getElementById('workoutCount').textContent=n;document.getElementById('streakCount').textContent=weeks.size;document.getElementById('fixtureCount').textContent=data.fixtures.filter(f=>f.result).length;let now=mondayOf(new Date()),dots=[];for(let i=7;i>=0;i--){let d=new Date(now);d.setDate(d.getDate()-i*7);dots.push(weeks.has(d.toISOString().slice(0,10)))}document.getElementById('consistency').innerHTML=dots.map((v,i)=>`<div class="week-dot ${v?'done':''}" title="${8-i} weeks ago"></div>`).join('');document.getElementById('recentWorkouts').innerHTML=n?data.workouts.slice(0,5).map(w=>`<div class="history-item"><span>${esc(w.name)}</span><span class="muted">${fmt(new Date(w.date))}</span></div>`).join(''):'<p class="empty">No workouts logged yet. Your first session starts the record.</p>';
  const loaded=data.workouts.flatMap(w=>(w.exerciseEntries||[]).filter(e=>e.load!==null&&e.load!==undefined&&e.load>0).map(e=>({...e,date:w.date})));document.getElementById('exerciseProgress').innerHTML=loaded.length?loaded.slice(0,8).map(e=>`<div class="history-item"><span><b>${esc(e.exercise)}</b><small>${e.sets} sets × ${esc(e.reps||'—')}</small></span><span class="muted">${e.load} kg</span></div>`).join(''):'<p class="empty">Add optional loads when logging sessions to build an exercise-by-exercise record.</p>'; }
function renderHistory(){let fs=[...data.fixtures].sort((a,b)=>a.date.localeCompare(b.date));document.getElementById('fixtureList').innerHTML=fs.length?fs.map(f=>`<div class="fixture-item"><div><b>${fmt(fixtureDate(f),{weekday:'short',day:'numeric',month:'short'})} · ${esc(f.opponent)}</b><div class="muted">${esc(f.venue||'Venue TBC')} ${f.time?'· '+f.time:''}</div></div><div class="fixture-actions"><span>${esc(f.result||'Upcoming')}</span><button class="text-button" data-edit-fixture="${esc(f.id)}">Edit</button></div></div>`).join(''):'<p class="empty">No fixtures recorded.</p>';document.getElementById('fixturePageList').innerHTML=document.getElementById('fixtureList').innerHTML;document.getElementById('historyList').innerHTML=data.workouts.length?data.workouts.map(w=>`<div class="history-item"><span>${esc(w.name)}</span><span class="muted">${fmt(new Date(w.date),{day:'numeric',month:'short',year:'numeric'})}</span></div>`).join(''):'<p class="empty">No workouts logged yet.</p>';}
function renderProfile(){let f=document.getElementById('profileForm');Object.entries(data.profile).forEach(([k,v])=>{let el=f.elements[k];if(el)el.value=v});document.getElementById('usualGameDay').value=data.schedule.gameDay||'Saturday';document.getElementById('trainingDayChoices').innerHTML=DAYS.map(d=>`<label class="check-option"><input type="checkbox" value="${d}" ${data.schedule.trainingDays.includes(d)?'checked':''}>${d.slice(0,3)}</label>`).join('');}
document.getElementById('profileForm').addEventListener('submit',e=>{e.preventDefault();let fd=new FormData(e.currentTarget);for(let k of Object.keys(data.profile))data.profile[k]=fd.get(k)||'';save();document.getElementById('profileSaved').textContent='Profile saved.';renderHome()});
document.getElementById('saveSchedule').addEventListener('click',()=>{data.schedule.trainingDays=[...document.querySelectorAll('#trainingDayChoices input:checked')].map(x=>x.value);data.schedule.gameDay=document.getElementById('usualGameDay').value;save();toast('Weekly schedule saved');renderHome()});
document.getElementById('closeSessionModal').addEventListener('click',()=>document.getElementById('sessionModal').classList.add('hidden'));document.getElementById('sessionModal').addEventListener('click',e=>{if(e.target.id==='sessionModal')e.currentTarget.classList.add('hidden')});
function localDateValue(d=new Date()){const y=d.getFullYear(),m=String(d.getMonth()+1).padStart(2,'0'),day=String(d.getDate()).padStart(2,'0');return `${y}-${m}-${day}`}
function openModal(fixture=null){const form=document.getElementById('fixtureForm');form.reset();form.elements.fixtureId.value=fixture?.id||'';document.getElementById('modalTitle').textContent=fixture?'Edit game':'Add game';form.elements.opponent.value=fixture?.opponent||'';form.elements.date.value=fixture?.date||localDateValue();form.elements.time.value=fixture?.time||'';form.elements.venue.value=fixture?.venue||'';form.elements.result.value=fixture?.result||'';document.getElementById('modal').classList.remove('hidden')}
function closeModal(){document.getElementById('modal').classList.add('hidden')}
function editFixture(id){const fixture=data.fixtures.find(f=>String(f.id)===String(id));if(fixture)openModal(fixture)}
for(const listId of ['fixtureList','fixturePageList'])document.getElementById(listId).addEventListener('click',e=>{const b=e.target.closest('[data-edit-fixture]');if(b)editFixture(b.dataset.editFixture)});
document.getElementById('addFixtureBtn').addEventListener('click',openModal);document.getElementById('addFixtureBtn2').addEventListener('click',openModal);document.getElementById('closeModal').addEventListener('click',closeModal);document.getElementById('modal').addEventListener('click',e=>{if(e.target.id==='modal')closeModal()});document.getElementById('fixtureForm').addEventListener('submit',e=>{e.preventDefault();let fd=new FormData(e.currentTarget),id=fd.get('fixtureId'),fixture={id:id||String(Date.now()),opponent:fd.get('opponent'),date:fd.get('date'),time:fd.get('time'),venue:fd.get('venue'),result:fd.get('result')};if(id){const index=data.fixtures.findIndex(f=>String(f.id)===String(id));if(index>=0)data.fixtures[index]=fixture}else data.fixtures.push(fixture);save();e.currentTarget.reset();closeModal();renderHistory();renderHome();toast(id?'Fixture updated':'Fixture saved')});
document.getElementById('exportData').addEventListener('click',()=>{let blob=new Blob([JSON.stringify(data,null,2)],{type:'application/json'}),url=URL.createObjectURL(blob),a=document.createElement('a');a.href=url;a.download='groundwork-backup.json';a.click();URL.revokeObjectURL(url);toast('Backup exported')});
document.getElementById('importData').addEventListener('change',async e=>{let file=e.target.files[0];if(!file)return;try{let obj=JSON.parse(await file.text());if(!obj.profile||!obj.schedule||!Array.isArray(obj.workouts)||!Array.isArray(obj.fixtures))throw Error('Invalid backup');data={...structuredClone(defaults),...obj};save();renderProfile();renderHome();toast('Backup imported')}catch{toast('Could not import that backup')}e.target.value=''});
document.getElementById('clearData').addEventListener('click',()=>{if(confirm('Delete all Groundwork profile, workout and fixture data from this device?')){data=structuredClone(defaults);save();renderProfile();renderHome();renderProgress();renderHistory();toast('All app data cleared')}});
window.addEventListener('beforeinstallprompt',e=>{e.preventDefault();deferredInstall=e;document.getElementById('installBtn').classList.remove('hidden')});document.getElementById('installBtn').addEventListener('click',async()=>{if(!deferredInstall)return;deferredInstall.prompt();deferredInstall=null;document.getElementById('installBtn').classList.add('hidden')});
if('serviceWorker'in navigator&&location.protocol!=='file:')window.addEventListener('load',()=>navigator.serviceWorker.register('./sw.js').catch(()=>{}));
renderHome();
