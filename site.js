/* Layout and interactions. Editable portfolio content lives in site-content.js. */
'use strict';
const data = window.SITE_CONTENT;
const $ = id => document.getElementById(id);
const escapeHTML = value => String(value ?? '').replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const external = url => /^https?:/.test(url) ? ' target="_blank" rel="noopener noreferrer"' : '';
const link = (url, label) => `<a href="${escapeHTML(url)}"${external(url)}>${escapeHTML(label)} <span aria-hidden="true">↗</span></a>`;
const icons = {
  linkedin:'<path d="M5 3a2 2 0 1 1 0 4 2 2 0 0 1 0-4ZM3 9h4v12H3zm6 0h4v1.6c.8-1.2 2-1.9 3.5-1.9 3.3 0 4.5 2.1 4.5 5.6V21h-4v-6c0-1.6-.2-3-2-3s-2 1.5-2 3v6H9z"/>',
  mail:'<g fill="none" stroke="currentColor" stroke-width="1.7"><rect x="2" y="4" width="20" height="16" rx="3"/><path d="m3 6 9 7 9-7"/></g>',
  github:'<path d="M12 2a10 10 0 0 0-3.16 19.49c.5.09.68-.22.68-.48v-1.86c-2.78.6-3.37-1.18-3.37-1.18-.45-1.16-1.11-1.47-1.11-1.47-.91-.62.07-.61.07-.61 1 .07 1.53 1.03 1.53 1.03.9 1.53 2.35 1.09 2.92.83.09-.65.35-1.09.64-1.34-2.22-.25-4.56-1.11-4.56-4.94 0-1.09.39-1.99 1.03-2.69-.1-.25-.45-1.27.1-2.65 0 0 .84-.27 2.75 1.03A9.58 9.58 0 0 1 12 6.82c.85 0 1.71.11 2.51.34 1.91-1.3 2.75-1.03 2.75-1.03.55 1.38.2 2.4.1 2.65.64.7 1.03 1.6 1.03 2.69 0 3.84-2.34 4.69-4.57 4.94.36.31.68.92.68 1.85v2.75c0 .27.18.58.69.48A10 10 0 0 0 12 2Z"/>',
  scholar:'<path d="m12 2 12 8-12 8L0 10z"/><path d="M5 15v5c4 3 10 3 14 0v-5l-7 5z"/>',
  orcid:'<circle cx="12" cy="12" r="10" fill="none" stroke="currentColor" stroke-width="1.5"/><circle cx="7" cy="7" r="1"/><path d="M7 10v7m4-10h2a5 5 0 0 1 0 10h-2z" fill="none" stroke="currentColor" stroke-width="1.7"/>',
  athletics:'<circle cx="15" cy="4" r="2"/><path d="m8 8 4-2 3 4 5 1m-8-4-3 6 5 3-2 6M9 13l-3 5H2" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>'
};
$('profile-name').textContent = data.profile.name;
$('profile-intro').textContent = data.profile.intro;
$('profile-role').textContent = `${data.profile.role} · ${data.profile.affiliation}`;
$('about-text').textContent = data.profile.about;
$('headshot').src = data.profile.headshot;
$('banner').src = data.profile.banner;
$('resume').href = data.profile.resume;
$('socials').innerHTML = data.socials.map(s => `<a href="${escapeHTML(s.url)}" aria-label="${escapeHTML(s.name)}" title="${escapeHTML(s.name)}"${external(s.url)}><svg viewBox="0 0 24 24" aria-hidden="true">${icons[s.icon] || icons.mail}</svg></a>`).join('');
$('publication-list').innerHTML = data.publications.map(p => `<article class="publication"><div class="pub-year">${escapeHTML(p.year)}</div><div><p class="eyebrow">${escapeHTML(p.type)}</p><h3>${escapeHTML(p.title)}</h3>${p.authors ? `<p>${escapeHTML(p.authors)}</p>` : ''}<p>${escapeHTML(p.venue)}</p><div class="links">${p.links.map(l => link(l.url,l.label)).join('')}</div></div></article>`).join('');
// Experience bullets support trusted author-written HTML for inline links.
$('experience-list').innerHTML = data.experience.map(e => `<article class="experience-item"><p class="date">${escapeHTML(e.date)}</p><h3>${escapeHTML(e.title)}</h3><ul><li>${e.bullets[0]}</li></ul>${e.bullets.length>1?`<details><summary>More about this role</summary><ul>${e.bullets.slice(1).map(b=>`<li>${b}</li>`).join('')}</ul></details>`:''}</article>`).join('');
$('teaching-list').innerHTML = data.teaching.map(t => `<div class="teaching-item"><p class="date">${escapeHTML(t.date)}</p><h4>${escapeHTML(t.title)}</h4></div>`).join('');
$('education-list').innerHTML = data.education.map(e => `<article class="education-card"><p class="date">${escapeHTML(e.date)}</p><h3>${escapeHTML(e.degree)}</h3><p>${escapeHTML(e.institution)}</p><p>${escapeHTML(e.description)}</p></article>`).join('');
$('award-list').innerHTML = data.awards.map(a => `<details class="award"><summary><span class="date">${escapeHTML(a.date)}</span><br>${escapeHTML(a.title)}</summary><p>${escapeHTML(a.description)}</p></details>`).join('');
const courseProjects = code => data.projects.filter(p => p.course === code);
const courseResources = code => data.resources.filter(r => r.courses.includes(code));
const slug = code => `course-${code.toLowerCase().replace(/\s+/g,'-')}`;
const disciplineFor = code => {
  if (!code) return {theme:'research', label:'Independent work'};
  if (/GEOS|EOSC|FRST/.test(code)) return {theme:'earth', label:'Earth & environment'};
  if (/CPEN|ELEC|INFR/.test(code)) return {theme:'systems', label:'Software & systems'};
  if (/ENPH|MECH|CIVL|APSC/.test(code)) return {theme:'design', label:'Engineering & design'};
  if (/MATH/.test(code)) return {theme:'math', label:'Mathematics & modelling'};
  if (/PHYS/.test(code)) return {theme:'physics', label:'Physics & measurement'};
  return {theme:'research', label:'Science & research'};
};
const visualPaths = theme => ({
  earth:'<path d="M-20 80Q50 0 120 60T260 55T380 50M-20 95Q50 15 120 75T260 70T380 65M-20 110Q50 30 120 90T260 85T380 80M-20 125Q50 45 120 105T260 100T380 95"/>',
  design:'<circle cx="160" cy="60" r="38"/><circle cx="160" cy="60" r="25"/><path d="M40 60h80m80 0h80M160 0v22m0 76v22M50 20l65 25m90 30 65 25M70 100l50-25m80-30 50-25"/>',
  systems:'<path d="m110 32-30 28 30 28m100-56 30 28-30 28m-37-67-26 78M20 25h25m-25 15h40m215 40h25m-40 15h40"/>',
  math:'<path d="M25 95Q80 5 135 95T245 95M35 35h60M195 35h90"/><circle cx="135" cy="95" r="4"/>',
  physics:'<ellipse cx="160" cy="60" rx="110" ry="30"/><ellipse cx="160" cy="60" rx="40" ry="110"/><circle cx="160" cy="60" r="7"/>',
  research:'<circle cx="160" cy="60" r="35"/><path d="M160 25v70M125 60h70M55 25h35m-35 15h55m160 25h35m-50 15h50"/>'
}[theme]);
const artwork = (code, kind='course') => {
  const {theme,label} = disciplineFor(code);
  return `<div class="course-art ${kind==='project'?'project-art':''}" data-theme="${theme}" aria-hidden="true"><svg viewBox="0 0 320 120" fill="none" stroke="currentColor" stroke-width="1">${visualPaths(theme)}</svg>${kind==='project'?'':`<span class="art-label">${label}</span>`}</div>`;
};
const photoPrompt = title => ({
  'Geophysical Electromagnetic Detector':'Add a field photo of the scanner or a coil close-up.',
  'Herring Spawn Classification via Satellite Imagery':'Add a satellite image or annotated coastline map.',
  'Potential Campsite Locations on Vancouver Island':'Add a map excerpt or a campsite landscape photo.',
  'Streamflow Prediction in BC Using Deep Learning':'Add a streamflow chart, gauge photo, or watershed image.',
  'Continuum Tube Robot':'Add a prototype photo or workspace diagram.',
  'Simulated License Plate Detecting Robot':'Add a robot-in-simulation screenshot or competition photo.',
  'Autonomous Treasure-Finding Robot':'Add a robot prototype or course photo.'
}[title] || 'Add a representative project image, diagram, or screenshot.');
const projectCard = (p,index,featured=false) => {
  const discipline = disciplineFor(p.course);
  const visual = p.image ? `<img src="${escapeHTML(p.image)}" alt="${escapeHTML(p.imageAlt || p.title)}" loading="lazy">${p.imageCaption ? `<span class="image-caption">${escapeHTML(p.imageCaption)}</span>` : ''}` : artwork(p.course || '', 'project');
  return `<article class="project-feature ${featured?'is-featured':''}"><div class="project-visual">${visual}<span class="project-discipline">${discipline.label}</span></div><div class="project-feature-body"><p class="project-course">${p.course ? escapeHTML(p.course) : 'Independent project'}</p><h3>${escapeHTML(p.title)}</h3><p>${escapeHTML(p.summary)}</p><div class="project-feature-meta"><span>${escapeHTML((p.technologies || []).slice(0,3).join(' · '))}</span><button type="button" class="project-button" data-project="${index}">View project <span aria-hidden="true">↗</span></button></div>${!p.image?`<p class="photo-prompt"><strong>Suggested visual:</strong> ${escapeHTML(photoPrompt(p.title))}</p>`:''}</div></article>`;
};
const renderProjectShowcase = () => {
  const query = $('course-search').value.trim().toLowerCase();
  const projects = data.projects.map((p,index)=>({p,index})).filter(({p})=>p.highlight === true && [p.title,p.summary,p.course || '',...(p.technologies||[])].join(' ').toLowerCase().includes(query));
  $('project-showcase').innerHTML = projects.map(({p,index},i)=>projectCard(p,index,i<3)).join('') || '<p class="empty">No projects match this search.</p>';
};
let courseFilter = 'projects';
function renderCourses(){
  const query = $('course-search').value.trim().toLowerCase();
  const courses = data.courses.filter(c => {
    const projects = courseProjects(c.code), resources = courseResources(c.code);
    return (courseFilter==='all' || (courseFilter==='projects' ? projects.length : resources.length)) && [c.code,c.title,c.description,c.year,...projects.map(p=>p.title+' '+p.summary),...resources.map(r=>r.title)].join(' ').toLowerCase().includes(query);
  });
  $('course-count').textContent = `${courses.length} ${courses.length===1?'course':'courses'} · ${courseFilter==='all'?'Full course history':courseFilter==='projects'?'Projects from coursework':'Notes & study materials'}`;
  $('course-list').innerHTML = courses.map(c=>{
    const projects=courseProjects(c.code), resources=courseResources(c.code);
    const discipline = disciplineFor(c.code);
    return `<article id="${slug(c.code)}" class="course-card">${c.image?`<div class="course-image-wrap"><img class="course-image" src="${escapeHTML(c.image)}" alt="${escapeHTML(c.imageAlt || c.title)}" loading="lazy">${c.imageCaption ? `<span class="image-caption">${escapeHTML(c.imageCaption)}</span>` : ''}</div>`:artwork(c.code)}<div class="course-body"><span class="course-code">${escapeHTML(c.code)}</span><p class="date">${escapeHTML(c.year)}</p><h3>${escapeHTML(c.title)}</h3><p>${escapeHTML(c.description)}</p>${projects.map(p=>`<button type="button" class="project-button" data-project="${data.projects.indexOf(p)}"><span>${escapeHTML(p.title)}</span><span aria-hidden="true">↗</span></button>`).join('')}${resources.length?`<details class="course-resources"><summary>${resources.length} study ${resources.length===1?'resource':'resources'}</summary>${resources.map(r=>link(r.url,r.title)).join('')}</details>`:''}</div></article>`;
  }).join('') || '<p class="empty">No courses match. Try another search or select All courses.</p>';
  renderProjectShowcase();
}
function renderResources(){
  const query=$('resource-search').value.trim().toLowerCase();
  const resources=data.resources.filter(r=>(r.title+' '+r.description).toLowerCase().includes(query));
  $('resource-count').textContent=`${resources.length} resources · PDF notes & study guides`;
  $('resource-list').innerHTML=resources.map(r=>`<article class="resource-item"><div><h3>${escapeHTML(r.title)}</h3><p>${escapeHTML(r.description)}</p></div><a href="${escapeHTML(r.url)}" aria-label="${escapeHTML('Open '+r.title+' PDF')}">PDF <span aria-hidden="true">↗</span></a></article>`).join('') || '<p class="empty">No resources match. Try a course code or topic.</p>';
}
const dialog=$('project-dialog');
function openProject(index){
  const p=data.projects[index];
  const labels={githubUrl:'GitHub',reportUrl:'Report / poster',slidesUrl:'Presentation slides',videoUrl:'Watch demonstration',storyMapUrl:'Explore StoryMap'};
  $('project-details').innerHTML=`<p class="eyebrow">${p.course ? escapeHTML(p.course)+' / Course project' : 'Independent project'}</p><h2 id="dialog-title">${escapeHTML(p.title)}</h2><p class="date">${escapeHTML(p.date)}</p><p>${escapeHTML(p.summary)}</p><div class="links">${Object.entries(labels).filter(([key])=>p[key]).map(([key,label])=>link(p[key],label)).join('')}</div><h3>Technical work</h3><ul>${p.bullets.map(b=>`<li>${escapeHTML(b)}</li>`).join('')}</ul><h3>Tools & methods</h3><div class="tags">${(p.technologies||[]).map(t=>`<span>${escapeHTML(t)}</span>`).join('')}</div><h3>Collaborators</h3><p>${escapeHTML((p.contributors||[]).join(' · ') || 'Tyler Wilson')}</p>`;
  dialog.showModal();
}
document.querySelectorAll('[data-filter]').forEach(button=>button.addEventListener('click',()=>{
  courseFilter=button.dataset.filter;
  document.querySelectorAll('[data-filter]').forEach(b=>b.setAttribute('aria-pressed',String(b===button)));
  renderCourses();
}));
$('course-search').addEventListener('input',renderCourses);
$('resource-search').addEventListener('input',renderResources);
$('course-list').addEventListener('click',e=>{const button=e.target.closest('[data-project]');if(button)openProject(Number(button.dataset.project));});
$('project-showcase').addEventListener('click',e=>{const button=e.target.closest('[data-project]');if(button)openProject(Number(button.dataset.project));});
document.querySelector('.dialog-close').addEventListener('click',()=>dialog.close());
// Explicit handling also supports embedded browsers that suppress native dialog Escape behavior.
dialog.addEventListener('keydown',event=>{
  if(event.key==='Escape'){
    event.preventDefault();
    dialog.close();
  }
});
dialog.addEventListener('click',e=>{if(e.target===dialog){const r=dialog.getBoundingClientRect();if(e.clientX<r.left||e.clientX>r.right||e.clientY<r.top||e.clientY>r.bottom)dialog.close();}});
renderCourses();
renderResources();
