/* Transcribed from the eight requirement screenshots supplied by the advisor. */
const CORE_REQUIREMENTS=[
{label:'Pathways: Community and Well-Being',codes:['PTH 101'],credits:1},
{label:'Pathways: Engagement and Outreach',codes:['PTH 102'],credits:1},
{label:'Composition I',codes:['ENG 121','ENG 190'],credits:3},
{label:'Composition II',codes:['ENG 123','ENG 290'],credits:3},
{label:'Logic',codes:['PHL 101','PHL 190'],credits:3},
{label:'Theology I',codes:['THL 101','THL 190'],credits:3},
{label:'Mathematics',subjects:['MTH'],minLevel:103,credits:3},
{label:'Language and Culture',subjects:['SPA','FRE','ITA','LAN'],credits:3},
{label:'National and global communities',credits:6,historyOptions:[[['HIS 120','HIS 213','HIS 214','POL 112'],['HIS 110','HIS 211','HIS 212','HIS 290']],[['HIS 120','HIS 213','HIS 214'],['HIS 110','HIS 211','HIS 212','HIS 290','POL 151','POL 161']]]},
{label:'Natural Science',subjects:['BIO','CHM','CSC','PHY'],credits:3},
{label:'Social Science',subjects:['PSY','POL','ECO','SOC'],credits:3},
{label:'Visual and Performing Arts',subjects:['ARH','ART','MUS','THR'],credits:3},
{label:'Literature',subjects:['ENG'],minLevel:200,maxLevel:299,credits:3},
{label:'Philosophy',subjects:['PHL'],minLevel:200,maxLevel:399,credits:3},
{label:'Theology',subjects:['THL'],minLevel:200,maxLevel:399,credits:3},
{label:'Explorations: outside the major knowledge area',credits:3,manual:true,subjects:[]}
];
PROGRAMS.core={name:'Core curriculum',page:'Advisor-provided screenshots',required:['PTH 101','PTH 102'],choices:CORE_REQUIREMENTS.filter(g=>g.codes&&g.credits===3).map(g=>({label:g.label,codes:g.codes,count:1})),electives:CORE_REQUIREMENTS.filter(g=>!g.codes).map(g=>({label:g.label,credits:g.credits,manual:true})),notes:'47 total core credits. Review completion and approved substitutions against the student’s audit. Non-nursing students must use History for at least one of the two community courses. Language placement is required. Explorations must be outside the major knowledge area. Major-specific Nursing and Elementary Education substitutions are retained in the reference below.',categories:CORE_REQUIREMENTS,exceptions:['Nursing: MTH 163; SOC 101 for national community; any HIS/POL for global community; HSC 136/138 for natural science; PSY 101 for social science; PHL 318 for philosophy; PSY 204 for Explorations.','Elementary Education: EDU 275 for visual/performing arts; EDU 201 for philosophy.','Composition: credit in ENG 121 before ENG 123; both before sophomore-level English. Apply the grade and transfer provisions in the student’s audit.']};
for(const [code,title,cr] of [['PTH 101','Community and Well-Being',1],['PTH 102','Engagement and Outreach',1],['ENG 190','Honors Composition I',3],['ENG 290','Honors Composition II',3],['PHL 190','Honors Logic',3],['THL 190','Honors Theology',3]])if(!CATALOG[code])cat(code,title,cr);
PROGRAMS.dsmajor.notes='61 credits using the supplied requirement tables. DSC 240 is 3 credits. CSC 100 or an approved equivalent. Statistics: choose MTH 163, BUS 263, or PSY 263. Upper-division electives are additional to fixed requirements. Audit substitutions remain subject to advisor review.';
PROGRAMS.dsminor.notes='27 credits using the supplied requirement table. DSC 240 is 3 credits. CSC 100 or an approved equivalent. Statistics: choose MTH 163, BUS 263, or PSY 263.';
function builtInRequirementAudit(){const requirements=[];for(const key of s.programs||[]){if(key==='core')continue;const p=PROGRAMS[key];if(!p)continue;for(const code of p.required)requirements.push({kind:'course',section:p.name,label:code,codes:[code],records:[],status:'needed'});for(const g of p.choices||[])requirements.push({kind:'choice',section:p.name,label:g.label,codes:g.codes,count:g.count,records:[],status:'needed'});for(const g of p.electives||[])requirements.push({kind:g.manual?'category':'elective',section:p.name,label:g.label,credits:g.credits,codes:[],records:[],subjects:g.prefix||[],minLevel:300,maxLevel:499,manual:!!g.manual,status:'needed'})}for(const g of CORE_REQUIREMENTS)requirements.push({kind:'category',section:'Core',codes:[],records:[],subjects:[],status:'needed',...g});return {requirements,courses:[]}}
function planningRequirements(){return s.auditParse||checklistPlanningAudit()}
function requirementDifferences(audit){const warnings=[];for(const key of audit.programs||[]){const p=PROGRAMS[key];if(!p||key==='core')continue;if(key==='dsmajor'&&audit.requirements.some(g=>g.codes?.includes('CSC 313')))warnings.push('Built-in AI/DS requirements list CSC 312; this audit lists CSC 313. Confirm the applicable catalog or substitution.');if(key==='mathminor'&&audit.requirements.some(g=>/minor/i.test(g.section)&&g.kind==='elective'&&g.subjects?.length===1&&g.subjects[0]==='MTH'))warnings.push('Built-in Math minor permits upper-division MTH/CSC/DSC electives; this audit restricts the group to MTH. Confirm catalog applicability.')}return warnings}
