/* Persistent course choices between requirements and the semester plan. */
let fourRequirementKey=null;
function fourActiveRequirements(){const nav=triNavigation(),selected=nav.find(n=>n.id===triSelectedSection)||nav[0];return triGroups().filter(g=>selected?.sections.includes(g.section))}
function fourSelectedRequirement(){const groups=fourActiveRequirements();if(!groups.some(g=>g.key===fourRequirementKey))fourRequirementKey=null;return groups.find(g=>g.key===fourRequirementKey)||(groups[0]?.key===totalCreditsRequirement.key?groups[0]:undefined)}
function fourSelectRequirement(key){const value=decodeURIComponent(key);fourRequirementKey=fourRequirementKey===value?null:value;renderAdvising()}
function fourSeasonCourses(g,courses,season){return courses.map(c=>{const done=s.completed.includes(c.code),ip=(s.inProgress||[]).includes(c.code),planned=s.courses.find(x=>x.code===c.code&&index(x.term)>=0);return `<div class="tri-option ${done||ip?'unavailable':''}" draggable="${!(done||ip)}" data-tri-code="${esc(c.code)}" data-tri-key="${triToken(g.key)}" data-tri-season="${season}"><div><b>${esc(c.title)}</b><span>${esc(c.code)} · ${c.cr} cr.${!season&&typicalSeasons(c.code).length?' · '+typicalSeasons(c.code).join(' / '):''}${done?' · ✔ Completed':ip?' · In progress':planned?' · '+esc(s.terms.find(t=>t.id===planned.term)?.name):''}</span></div></div>`}).join('')||'<p class="tri-no-options">No courses listed for this season.</p>'}
const fourDivisionSubjects=[
 ['Business & Communication','ACC BAN BUS CMM ECO ENT FIN HCM MGT MKT SCM SPM'],
 ['Health & Science','BIO CHM CIS CSC DSC EXS HSC MTH NUR PHY PSY SPT'],
 ['Humanities & Social Sciences','AFS ARH ART EDU ENG FRE HIS ITA PHL POL SOC SPA THL THR WRI'],
 ['Interdisciplinary & other','']
];
function fourDivisionChoices(g,courses){
 const ordered=[...courses].sort((a,b)=>a.code.localeCompare(b.code,undefined,{numeric:true}));
 return fourDivisionSubjects.map(([division,subjects],i)=>{
  const list=ordered.filter(c=>{
   const subject=c.code.split(' ')[0];
   const match=fourDivisionSubjects.findIndex(([,prefixes])=>prefixes.split(' ').includes(subject));
   return (match<0?fourDivisionSubjects.length-1:match)===i;
  });
  return list.length?`<details class="four-season"><summary>${esc(division)} · ${list.length}</summary>${['Fall','Spring','Summer'].map(season=>{
   const offered=list.filter(c=>typicalSeasons(c.code).includes(season));
   if(season==='Summer'&&!offered.length)return '';
   return `<section class="four-season"><h3>${season}</h3>${fourSeasonCourses(g,offered,season)}</section>`;
  }).join('')}</details>`:'';
 }).join('')||'<p class="tri-no-options">No offered courses found.</p>';
}
function fourChoicesHTML(){const g=fourSelectedRequirement();if(!g)return '<section class="four-choices"><div class="tri-panel-head"><h2>Course choices</h2></div><p class="four-choices-empty">Select a requirement to see offered courses.</p></section>';const courses=triPopoverCourses(g),total=g.key===totalCreditsRequirement.key,grouped=total||triIsExploration(g),credits=total?triDegreeCredits():null,seasons=['Fall','Spring','Summer'],unknown=courses.filter(c=>!typicalSeasons(c.code).some(v=>seasons.includes(v)));return `<section class="four-choices" aria-label="Courses for selected requirement"><div class="tri-panel-head"><div><h2>Course choices</h2><p>${esc(triRequirementTitle(g))}</p>${credits?`<p>${credits.earned} earned · ${credits.projected} with plan<br>${credits.projected>=120?'120 covered by the current plan':(120-credits.projected)+' credits still needed'}</p>`:''}</div></div><div class="four-choices-scroll">${grouped?fourDivisionChoices(g,courses):seasons.map(season=>`<section class="four-season"><h3>${season}</h3>${fourSeasonCourses(g,courses.filter(c=>typicalSeasons(c.code).includes(season)),season)}</section>`).join('')}${!grouped&&unknown.length?`<details class="tri-unconfirmed"><summary>Offering to confirm</summary>${fourSeasonCourses(g,unknown,'')}</details>`:''}${!grouped&&!courses.length?'<p class="tri-no-options">Advisor course selection is needed for this requirement.</p>':''}</div><div class="tri-req-foot">Drag a course into a semester or the Completed column.</div></section>`}
triMarks=state=>({met:'✔',unmet:'✕',conditional:'✔'}[state]);
triQueuePopover=function(){};triScheduleClose=function(){};
triOpenPopover=function(anchor,key){fourSelectRequirement(key)};
const fourBaseRender=renderAdvising;renderAdvising=function(){fourBaseRender();if(!['path','next'].includes(workflowTab))return;const layout=document.querySelector('.tri-layout'),plan=document.querySelector('.tri-plan');if(!layout||!plan)return;plan.insertAdjacentHTML('beforebegin',fourChoicesHTML());const panel=document.querySelector('.four-choices');if(panel)triBindCourseDrags(panel);document.querySelectorAll('[data-tri-req]').forEach(el=>{const key=decodeURIComponent(el.dataset.triReq);const selected=key===fourSelectedRequirement()?.key;el.removeAttribute('onmouseenter');el.removeAttribute('onmouseleave');el.removeAttribute('aria-haspopup');el.setAttribute('aria-pressed',String(selected));el.classList.toggle('four-selected',selected)});const footer=document.querySelector('.tri-requirements .tri-req-foot');if(footer)footer.textContent='Select a requirement to see course choices.';const legend=document.querySelector('.tri-legend');if(legend)legend.innerHTML='<span class="met">✔ Met</span><span class="unmet">✕ Not met</span><span class="conditional">✔ Conditional</span>'};
