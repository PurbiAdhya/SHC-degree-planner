/* Completed work is a course list; undated audit credit never invents semesters. */
function nextPlanningTerm(){return s.terms.find(t=>t.name===s.startTerm)||s.terms[0]}
function nextOnlyTarget(term){return workflowTab!=='next'||term===nextPlanningTerm()?.id}
function nextOnlyNotice(){triFeedback('Use Full path to add or move courses in other semesters.');return false}
function completedRecordList(){const audit=s.auditParse?.courses||[],codes=new Set([...s.completed,...audit.filter(r=>r.status==='completed').map(r=>r.code)]);return [...codes].filter(Boolean).sort((a,b)=>a.localeCompare(b,undefined,{numeric:true})).map(code=>{const record=audit.find(r=>r.code===code),course=s.courses.find(c=>c.code===code),ref=CATALOG[code];return {code,title:record?.title||course?.title||ref?.title||code,cr:record?.credits??course?.cr??ref?.cr??null}})}
function completedCoursesHTML(){if(!s.showPreviousSemesters)return '';const courses=completedRecordList(),progress=[...new Set([...(s.inProgress||[]),...(s.auditParse?.courses||[]).filter(r=>r.status==='progress').map(r=>r.code)])].filter(c=>!courses.some(r=>r.code===c));return `<section class="completed-work"><div class="completed-work-head"><h3>Completed courses <small>${courses.length}</small></h3><button onclick="openCompletedRecord()">+ Add completed course</button></div><div class="completed-work-list">${courses.map(c=>`<button onclick="openCompletedRecord('${esc(c.code)}')" title="${esc(c.title)}"><span class="completed-tick">✔</span><b>${esc(c.code)}</b><span>${esc(c.title)}</span>${c.cr!==null?`<small>${esc(c.cr)} cr.</small>`:''}</button>`).join('')||'<p>No completed courses recorded.</p>'}</div>${progress.length?`<details class="completed-progress"><summary>In progress · ${progress.length}</summary><p>${progress.map(esc).join(' · ')}</p></details>`:''}</section>`}
workflowSeasonBoard=function(){const terms=s.terms.filter(t=>termValue(t.name)>=termValue(s.startTerm)),years=[...new Set(terms.map(t=>Number(t.name.match(/\d{4}/)?.[0])-(t.name.startsWith('Fall')?0:1)).filter(Boolean))].sort(),seasons=['Fall','Spring',...(s.showSummerColumn?['Summer']:[])];return completedCoursesHTML()+`<div class="academic-grid" style="--academic-years:${Math.max(1,years.length)}"><div class="academic-corner"></div>${years.map(y=>`<div class="academic-year">${y}–${String(y+1).slice(2)}</div>`).join('')}${seasons.map(season=>`<div class="academic-season">${season}</div>${years.map(y=>{const name=season+' '+(season==='Fall'?y:y+1),t=terms.find(t=>t.name===name);if(!t)return '<div class="flow-term-blank" aria-hidden="true"></div>';return workflowSemesterBox(t).replace('class="tri-semester"',`class="tri-semester ${name===planCurrentSemester()?'current-semester':''}"`).replace(esc(name)+'</b>',esc(name)+(name===planCurrentSemester()?'<i class="current-label">Current</i>':'')+'</b>')}).join('')}`).join('')}</div>`};
const completedPathBase=workflowPathPanelHTML;workflowPathPanelHTML=function(){return completedPathBase().replace('Previous semesters','Completed courses')};
let completedRecordMode=false;
const completedOpenHistoryBase=openHistoryCourse;openHistoryCourse=function(code='',semester=''){completedRecordMode=false;$('history-semester').hidden=false;const label=document.querySelector('label[for="history-semester"]');if(label)label.hidden=false;completedOpenHistoryBase(code,semester)};
function openCompletedRecord(code=''){openHistoryCourse(code);completedRecordMode=true;const record=completedRecordList().find(r=>r.code===code);if(record){$('history-title').value=record.title;$('history-credits').value=record.cr??0}$('history-semester').hidden=true;const label=document.querySelector('label[for="history-semester"]');if(label)label.hidden=true;$('history-state').value='completed'}
const completedSaveHistoryBase=saveHistoryCourse;saveHistoryCourse=function(){if(!completedRecordMode)return completedSaveHistoryBase();const code=$('history-code').value.trim().toUpperCase().replace(/^([A-Z]{2,4})\s*(\d{3}[A-Z]?)$/,'$1 $2'),title=$('history-title').value.trim(),cr=Number($('history-credits').value),state=$('history-state').value;if(!/^[A-Z]{2,4} \d{3}[A-Z]?$/.test(code)||!title||!Number.isFinite(cr)||cr<0||cr>30||historyEditingCode&&historyEditingCode!==code){$('history-error').textContent='Check the course code, name, and credit hours.';return}let c=s.courses.find(c=>c.code===code);if(!c){c=mk(code,title,cr,'pool');s.courses.push(c)}Object.assign(c,{title,cr,term:'pool',days:'',start:'',end:''});s.completed=s.completed.filter(x=>x!==code);s.inProgress=(s.inProgress||[]).filter(x=>x!==code);(state==='completed'?s.completed:s.inProgress).push(code);const r=s.auditParse?.courses.find(r=>r.code===code);if(r)Object.assign(r,{status:state,title,credits:cr});s.showPreviousSemesters=true;$('history-dialog').close();persist()};
const nextChooseBase=triChooseTerm;triChooseTerm=function(code,key,season){if(workflowTab!=='next')return nextChooseBase(code,key,season);const t=nextPlanningTerm();if(!t)return;return triPlace({code,key:decodeURIComponent(key)},t.id)};
const nextPlaceBase=triPlace;triPlace=function(payload,term){if(payload.completedCode)return moveCompletedToSemester(payload.completedCode,term);if(term==='completed'&&workflowTab==='path'){triDragging=false;return dropCompletedCourse(payload)}if(!nextOnlyTarget(term))return nextOnlyNotice();if(workflowTab==='next'){const existing=payload.id?s.courses.find(c=>c.id===payload.id):s.courses.find(c=>c.code===payload.code&&index(c.term)>=0);if(existing&&existing.term!==nextPlanningTerm()?.id)return nextOnlyNotice()}return nextPlaceBase(payload,term)};
function dropCompletedCourse(payload){
 const planned=payload.id?s.courses.find(c=>c.id===payload.id):null;
 const choice=payload.code?triCourseCatalog().find(c=>c.code===payload.code):null;
 const requirement=choice&&triGroups().find(g=>g.key===payload.key);
 if(!planned&&(!requirement||!(triIsExploration(requirement)?triExplorationChoices()(choice):triEligible(requirement,choice))))return false;
 const code=(planned||choice).code;
 if(s.completed.includes(code))return false;
 let course=planned||s.courses.find(c=>c.code===code);
 if(!course){
  course={...mk(code,choice.title,choice.cr,'pool',choice.pre),co:choice.co,note:choice.note};
  s.courses.push(course);
 }
 Object.assign(course,{term:'pool',days:'',start:'',end:'',section:'',confirmed:false});
 s.completed.push(code);
 s.inProgress=(s.inProgress||[]).filter(value=>value!==code);
 const record=s.auditParse?.courses.find(row=>row.code===code);
 if(record)record.status='completed';
 if(requirement){
  s.triRequirementCourses=s.triRequirementCourses||{};
  s.triRequirementCourses[requirement.key]=[...new Set([...(s.triRequirementCourses[requirement.key]||[]),code])];
 }
 persist();
 triFeedback(code+' marked completed.');
 return true;
}
const nextFourBase=fourChoicesHTML;fourChoicesHTML=function(){const html=nextFourBase();return workflowTab==='next'?html.replace('Drag a course into a semester or the Completed column.','Drag a course into '+esc(nextPlanningTerm()?.name||'next semester')+'.'):html};

const completedBindBoardBase=triBindBoard;
triBindBoard=function(){
 completedBindBoardBase();
 document.querySelectorAll('[data-tri-completed]').forEach(el=>{
  el.onpointerdown=ev=>ev.stopPropagation();
  el.ondragstart=ev=>{
   ev.dataTransfer.setData('text/plain','tri:'+JSON.stringify({completedCode:el.dataset.triCompleted}));
   ev.dataTransfer.effectAllowed='move';
  };
  el.ondragend=()=>document.querySelectorAll('.tri-over').forEach(node=>node.classList.remove('tri-over'));
 });
};
function moveCompletedToSemester(code,term){
 if(workflowTab!=='path'||!s.terms.some(t=>t.id===term))return false;
 const record=completedRecordList().find(row=>row.code===code);
 if(!record)return false;
 let course=s.courses.find(row=>row.code===code);
 if(!course){
  const ref=CATALOG[code];
  course={...mk(code,record.title,record.cr??ref?.cr??0,'pool',ref?.pre||''),co:ref?.co||'',note:ref?.note||''};
  s.courses.push(course);
 }
 s.completed=s.completed.filter(value=>value!==code);
 for(const row of s.auditParse?.courses||[]){
  if(row.code===code&&row.status==='completed')row.status='needed';
 }
 move(course.id,term);
 triFeedback(code+' moved from Completed to the plan.');
 return true;
}

function removeCompletedCourse(code){
 s.completed=s.completed.filter(value=>value!==code);
 for(const row of s.auditParse?.courses||[]){
  if(row.code===code&&row.status==='completed')row.status='needed';
 }
 for(const group of s.auditParse?.requirements||[]){
  if(group.status!=='completed'||group.advisorReviewed||![...(group.records||[]),...(group.codes||[])].includes(code))continue;
  const evidence=new Set([...(group.records||[]),...(group.codes||[])]);
  const stillCompleted=s.completed.filter(value=>evidence.has(value)).length;
  if(stillCompleted<(group.count||1))group.status='needed';
 }
 persist();
 triFeedback(code+' removed from Completed.');
}
