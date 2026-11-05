(() => {
  'use strict';
  const data = window.CONTEST_DATA;
  const all = data.contests;
  const $ = s => document.querySelector(s);
  const esc = v => String(v ?? '').replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  const grades = v => v.map(n => ['','大一','大二','大三','大四'][n]).join(' / ');
  const ext = '<img src="assets/icons/external.svg" width="14" height="14" alt="">';
  const categories = [...new Set(all.map(c => c.category))];
  const byId = id => all.find(c => c.id === id);
  const safeUrl = value => /^https?:\/\//.test(value || '') ? esc(value) : '#sources';
  let saved = new Set();
  try { saved = new Set(JSON.parse(localStorage.getItem('jingtu.saved.v1') || '[]').filter(id => byId(id))); } catch {}
  const state = {course:'', search:'', category:'', grade:'', format:'', saved:false, selected:all[0]?.id, compare:[], month:null, year:null};
  let filtered = all;
  let toastTimer;
  const toast = message => { $('#toast').textContent = message; $('#toast').classList.add('visible'); clearTimeout(toastTimer); toastTimer = setTimeout(() => $('#toast').classList.remove('visible'), 2400); };
  const count = (list, field) => list.reduce((result,c) => { for (const value of [].concat(c[field] || [])) result[value] = (result[value] || 0) + 1; return result; }, {});
  function match(c) {
    const text = [c.name,c.catalogName,c.category,c.summary,...c.courses,...(c.tags || [])].join(' ').toLowerCase();
    return (!state.course || c.courses.includes(state.course)) && (!state.search || text.includes(state.search.toLowerCase())) && (!state.category || c.category === state.category) && (!state.grade || c.grades.includes(Number(state.grade))) && (!state.format || c.teamFormat.includes(state.format)) && (!state.saved || saved.has(c.id));
  }
  function syncControls() { for (const key of ['search','category','grade','format']) $('#' + key).value = state[key]; $('#savedOnly').checked = state.saved; }
  function clearFilters() { Object.assign(state,{course:'',search:'',category:'',grade:'',format:'',saved:false}); syncControls(); }
  function navigate(id, reset = false) {
    if (!byId(id)) return;
    if (reset) clearFilters();
    state.selected = id;
    render({syncRoute:false});
    const hash = '#contest/' + encodeURIComponent(id);
    if (location.hash !== hash) history.pushState(null, '', hash);
    const target = window.matchMedia('(max-width: 700px)').matches ? $('#detail') : $('#explore');
    target.scrollIntoView({behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'instant' : 'smooth'});
    if (target.id === 'detail') target.focus({preventScroll:true});
  }
  function renderList() {
    $('#activeCourse').hidden=!state.course;$('#clearCourse').textContent=state.course+' ×';
    $('#listCount').textContent = filtered.length;
    $('#resultStatus').textContent = `找到 ${filtered.length} 项赛事，共收录 ${all.length} 项 ${state.course ? ' · 课程精确匹配「'+state.course+'」' : ' · 点击赛事查看规则、报名窗口与课程关联'}`;
    $('#contestList').innerHTML = filtered.length ? filtered.map(c => `<button type="button" class="contest-item ${c.id === state.selected ? 'active':''}" data-select="${esc(c.id)}" aria-pressed="${c.id === state.selected}"><span class="category-label">${esc(c.category)} <span>${saved.has(c.id)?'已收藏':''}</span></span><strong class="item-title">${esc(c.name)}</strong><span class="item-meta">${esc(c.teamFormat)} · ${esc(c.teamSize)}</span><span class="item-arrow" aria-hidden="true">↗</span></button>`).join('') : '<div class="empty-state"><h3>没有匹配的赛事</h3><p>试试减少筛选条件，或换个课程关键词。</p><button class="textbutton" data-reset>重置筛选</button></div>';
  }
  function renderDetail() {
    const c = filtered.find(c => c.id === state.selected);
    if (!c) { $('#detail').innerHTML = '<div class="empty-state"><span class="empty-icon">⌕</span><h3>等待一个新的方向</h3><p>调整筛选条件，继续寻找适合你的竞赛。</p></div>'; return; }
    const r = c.registration;
    $('#detail').innerHTML = `<div class="detail-heading"><div><p class="detail-category">${esc(c.category)} <span>CATALOG / ${String(c.catalogNumber).padStart(2,'0')}</span></p><h2>${esc(c.name)}</h2></div><button class="savebutton ${saved.has(c.id)?'is-saved':''}" data-save="${esc(c.id)}" aria-pressed="${saved.has(c.id)}">${saved.has(c.id)?'★ 已收藏':'☆ 收藏'}</button></div>
      <div class="badges"><span class="badge red">2023 榜单内</span><span class="badge">${esc(c.teamFormat)}</span><span class="badge">${esc(c.deliveryMode)}</span></div><p class="detail-summary">${esc(c.summary)}</p>
      <div class="detail-actions"><a class="primary" href="${safeUrl(c.officialUrl)}" target="_blank" rel="noopener">前往赛事官网 ${ext}</a><button class="secondary" data-compare="${esc(c.id)}" aria-pressed="${state.compare.includes(c.id)}">${state.compare.includes(c.id)?'已加入对比 ✓':'＋ 加入对比'}</button></div>
      <div class="info-grid"><div class="info-card"><span>报名时间窗口</span><strong>${esc(r.windowText)}</strong>${(r.additionalWindows || []).map(w=>`<small class="window-extra">${esc(w.label)}：${esc(w.start || '开始日待核实')} — ${esc(w.end || '截止日待核实')}</small>`).join('')}<small>${esc(r.edition || r.year || '届次待核验')}${r.status === 'complete'?' · 已核实完整区间':r.status === 'partial'?' · 仅核实部分日期':' · 完整日期待核验'}</small></div><div class="info-card"><span>适合年级 · 学习建议</span><strong>${grades(c.grades)}</strong><small>${esc(c.gradeReason || '结合课程基础与备赛任务整理')}</small></div><div class="info-card"><span>组队与赛制</span><strong>${esc(c.teamSize)}</strong><small>${esc(c.deliveryMode)}</small></div><div class="info-card"><span>参赛资格</span><strong>${esc(c.eligibility)}</strong><small>详细资格以所链接届次章程为准</small></div></div>
      <section class="detail-section"><div class="detail-section-head"><h3>这些课程，可以成为你的起点</h3><span>项目整理的课程关联</span></div><div class="course-tags">${c.courseRelation.map(x => `<div class="course-item"><strong>${esc(x.course)}</strong><p>${esc(x.use)}</p></div>`).join('')}</div></section>
      <section class="detail-section evidence-section"><h3>赛事资料</h3><p class="detail-note">${esc(r.note)} ${esc(c.levelNote || 'A类认定请查询所在学校的竞赛目录。')}</p><div class="evidence-list">${c.evidence.map(e => `<a href="${safeUrl(e.url)}" target="_blank" rel="noopener"><span>${esc(e.title)}<small>${esc((e.supports || []).join('、'))} · ${esc(e.accessed)}${e.accessNote?' · '+esc(e.accessNote):''}</small></span>${ext}</a>`).join('')}</div></section>`;
  }
  function validRange(c) { const r=c.registration; return r.status==='complete' && /^\d{4}-\d{2}-\d{2}$/.test(r.start || '') && /^\d{4}-\d{2}-\d{2}$/.test(r.end || '') && r.start<=r.end; }
  // Date strings use calendar-year boundaries, even when the competition season spans years.
  function overlaps(c,year,month) { if(!validRange(c))return false; const from=`${year}-${String(month).padStart(2,'0')}-01`; const next=month===12?`${year+1}-01-01`:`${year}-${String(month+1).padStart(2,'0')}-01`;return c.registration.start<next&&c.registration.end>=from; }
  function calendarRecords(c) {
    return [c, ...(c.registration.additionalWindows || []).map(r => ({...c, registration:{...c.registration,...r,edition:c.registration.edition + ' · ' + (r.label || '其他报名阶段')}}))];
  }
  function renderCalendar() {
    const records = filtered.flatMap(calendarRecords);
    const years = [...new Set(all.flatMap(calendarRecords).flatMap(c => [c.registration.start,c.registration.end].filter(Boolean).map(d => Number(d.slice(0,4)))))].sort((a,b)=>b-a);
    if(!years.length)years.push(Number(data.meta.referenceYear || 2023));
    if(!state.year)state.year=years[0];
    $('#calendarYear').innerHTML=years.map(y=>`<option value="${y}" ${y===state.year?'selected':''}>${y} 年日期记录</option>`).join('');
    const yearEntries=records.filter(c=>validRange(c)&&Array.from({length:12},(_,i)=>i+1).some(m=>overlaps(c,state.year,m)));
    $('#monthGrid').innerHTML=Array.from({length:12},(_,i)=>{const n=new Set(yearEntries.filter(c=>overlaps(c,state.year,i+1)).map(c=>c.id)).size;return `<button class="month-cell ${state.month===i+1?'active':''} ${n?'has-records':''}" data-month="${i+1}" aria-pressed="${state.month===i+1}"><span>${String(i+1).padStart(2,'0')} 月</span><strong>${n}</strong><small>${n?'项报名窗口':'暂无完整记录'}</small></button>`;}).join('');
    const entries=yearEntries.filter(c=>!state.month||overlaps(c,state.year,state.month)).sort((a,b)=>a.registration.start.localeCompare(b.registration.start));
    const partial=records.filter(c=>!validRange(c)&&[c.registration.start,c.registration.end].some(d=>d?.startsWith(String(state.year)) && (!state.month||Number(d.slice(5,7))===state.month)));
    const unknown=filtered.filter(c=>!calendarRecords(c).some(validRange)).length;
    $('#clearMonth').textContent=state.month?'查看全年':'全年';
    $('#calendarList').innerHTML=`<div class="calendar-caption">${state.year} 年${state.month?' '+state.month+' 月':''} · ${new Set(entries.map(c=>c.id)).size} 项赛事的完整窗口${partial.length?' · '+partial.length+' 项单端日期':''}<span>${unknown} 项未核实完整区间，不计入月度统计</span></div>`+(entries.length||partial.length ? [...entries,...partial].map(c=>`<a class="calendar-entry" href="#contest/${encodeURIComponent(c.id)}" data-calendar-contest="${esc(c.id)}"><div class="calendar-name"><strong>${esc(c.name)}</strong><small>${esc(c.registration.edition)}</small></div><div class="calendar-date">${esc(c.registration.start || '开始日待核验')} <span>—</span> ${esc(c.registration.end || '截止日待核验')}</div><span class="calendar-note">${validRange(c)?'查看赛事 ↗':'仅部分日期 ↗'}</span></a>`).join('') : '<div class="empty-state compact"><p>此范围暂无已核实的报名日期，试试其他年份或月份。</p></div>');
  }
  function renderAnalysis() {
    const total=filtered.length, counts=count(filtered,'category'), courseCounts=count(filtered,'courses');
    $('#statTotal').textContent=total;$('#statCategories').textContent=Object.keys(counts).length;$('#statCourses').textContent=Object.keys(courseCounts).length;
    const teams=filtered.filter(c=>c.teamFormat.includes('团队')).length; $('#statTeam').textContent=teams;
    $('#categoryChart').innerHTML=categories.map(k=>`<button class="bar-row" data-category="${esc(k)}" aria-label="筛选${esc(k)}，${counts[k]||0}项赛事"><span class="bar-label">${esc(k)}</span><span class="bar-track"><span class="bar-fill" style="width:${total?(counts[k]||0)/total*100:0}%"></span></span><strong class="bar-value">${counts[k]||0}</strong></button>`).join('');
    const top=Object.entries(courseCounts).sort((a,b)=>b[1]-a[1]||a[0].localeCompare(b[0],'zh-CN'))[0];
    const individuals=filtered.filter(c=>c.teamFormat.includes('个人')).length;
    $('#insights').innerHTML=total?`<article><span class="insight-number">${Math.round(teams/total*100)}<small>%</small></span><div><h3>团队协作，是一种备赛能力</h3><p>当前 ${total} 项赛事中，${teams} 项支持团队参赛；${individuals} 项支持个人参赛。部分赛事同时设置两种赛道。</p></div></article><article><span class="insight-number">${top[1]}<small> 项</small></span><div><h3>从「${esc(top[0])}」延伸出去</h3><p>当前筛选中关联赛事最多的课程之一，占 ${Math.round(top[1]/total*100)}%。课程关联按项目整理统计，每项赛事可对应多门课程。</p></div></article>`:'<article class="empty-state"><h3>暂无可分析数据</h3><p>调整筛选条件后，图表和观察会同步更新。</p></article>';
    $('#courseCloud').innerHTML=Object.entries(courseCounts).sort((a,b)=>b[1]-a[1]).map(([name,n])=>`<button class="course-chip" data-course="${esc(name)}">${esc(name)} <span>${n}</span></button>`).join('') || '<p class="muted">暂无课程关联</p>';
  }
  function renderCompare() {
    $('#compareTray').hidden=!state.compare.length;
    $('#compareCount').textContent=`${state.compare.length} / 3 项`;
    $('#compareNames').innerHTML=state.compare.map(id=>`<button data-compare="${esc(id)}" title="移除${esc(byId(id).name)}">${esc(byId(id).name)} <span aria-hidden="true">×</span></button>`).join('');
    if(!$('#compareDialog').open)return;
    const cs=state.compare.map(byId);
    if(!cs.length){$('#compareDialog').close();return;}
    const rows=[['方向',c=>esc(c.category)],['赛事级别',c=>`2023 榜单内 · 序号 ${c.catalogNumber}`],['建议年级',c=>grades(c.grades)],['报名窗口',c=>esc(c.registration.windowText)],['参赛形式',c=>`${esc(c.teamFormat)}<br>${esc(c.teamSize)}<br>${esc(c.deliveryMode)}`],['参赛资格',c=>esc(c.eligibility)],['课程关联',c=>c.courses.map(esc).join('、')],['官方入口',c=>`<a href="${safeUrl(c.officialUrl)}" target="_blank" rel="noopener">赛事官网 ${ext}</a>`]];
    $('#compareTable').innerHTML=`<table><caption class="sr-only">已选赛事的级别、年级、窗口、形式与课程对比</caption><thead><tr><th scope="col">对比维度</th>${cs.map(c=>`<th scope="col">${esc(c.name)}</th>`).join('')}</tr></thead><tbody>${rows.map(([label,fn])=>`<tr><th scope="row">${label}</th>${cs.map(c=>`<td>${fn(c)}</td>`).join('')}</tr>`).join('')}</tbody></table>`;
  }
  function render({syncRoute=true} = {}) {
    document.querySelectorAll('[data-orbit-category]').forEach(button => {
      button.setAttribute('aria-pressed', String(button.dataset.orbitCategory === state.category));
    });
    filtered=all.filter(match);
    if(!filtered.some(c=>c.id===state.selected))state.selected=filtered[0]?.id;
    if(syncRoute && location.hash.startsWith('#contest/')) {
      const next=state.selected ? '#contest/'+encodeURIComponent(state.selected) : '#explore';
      if(location.hash!==next)history.replaceState(null,'',next);
    }
    renderList();renderDetail();renderCalendar();renderAnalysis();renderCompare();
  }
  function toggleCompare(id) {
    if(state.compare.includes(id))state.compare=state.compare.filter(x=>x!==id);
    else if(state.compare.length<3)state.compare.push(id);
    else {toast('最多同时对比 3 项赛事，请先移除一项。');return;}
    renderDetail();renderCompare();
  }
  $('#category').innerHTML+=categories.map(c=>`<option value="${esc(c)}">${esc(c)}</option>`).join('');
  $('#orbitNodes').innerHTML=categories.map((c,i)=>`<button class="orbit-node n${i+1}" data-orbit-category="${esc(c)}"><strong>${esc(c)}</strong><small>${all.filter(x=>x.category===c).length} 项赛事</small></button>`).join('');
  $('#sourceSummary').innerHTML=`<a class="source-link" href="${safeUrl(data.meta.catalogUrl)}" target="_blank" rel="noopener">2023 竞赛目录 · ${data.meta.catalogCount || 84} 项基准 ${ext}</a><p>收录其中 ${all.length} 个目录条目，系列赛事按一个条目计数。标记“榜单内”；A 类认定由各校规定。</p><p>报名窗口和赛制采用 2023 届资料，缺失项标记待核实；适合年级、方向分类和课程关联由本项目整理。收藏保存在当前浏览器。</p><div class="source-date">2023 历史资料核对日期 <strong>${esc(data.meta.accessed)}</strong></div>`;
  ['search','category','grade','format'].forEach(key=>$('#'+key).addEventListener(key==='search'?'input':'change',()=>{state[key]=$('#'+key).value.trim();render();}));
  $('#savedOnly').addEventListener('change',()=>{state.saved=$('#savedOnly').checked;render();});
  $('#clearCourse').addEventListener('click',()=>{state.course='';render();});
  $('#reset').addEventListener('click',()=>{clearFilters();render();});
  $('#calendarYear').addEventListener('change',()=>{state.year=Number($('#calendarYear').value);state.month=null;renderCalendar();});
  $('#clearMonth').addEventListener('click',()=>{state.month=null;renderCalendar();});
  $('#clearCompare').addEventListener('click',()=>{state.compare=[];renderDetail();renderCompare();});
  $('#openCompare').addEventListener('click',()=>{$('#compareDialog').showModal();renderCompare();});
  $('#closeCompare').addEventListener('click',()=>$('#compareDialog').close());
  document.addEventListener('click',e=>{
    const b=e.target.closest('[data-select],[data-save],[data-compare],[data-category],[data-orbit-category],[data-orbit-all],[data-course],[data-month],[data-reset],[data-calendar-contest]');
    if(!b)return;
    if(b.dataset.select)navigate(b.dataset.select);
    else if(b.dataset.save){const id=b.dataset.save;saved.has(id)?saved.delete(id):saved.add(id);try{localStorage.setItem('jingtu.saved.v1',JSON.stringify([...saved]));}catch{toast('此浏览器无法保存收藏，当前页面仍可使用。');}render();}
    else if(b.dataset.compare)toggleCompare(b.dataset.compare);
    else if(b.hasAttribute('data-reset')){clearFilters();render();}
    else if(b.hasAttribute('data-orbit-all')){
      if(state.category){state.category='';syncControls();render({syncRoute:false});}
      $('#explore').scrollIntoView({behavior:window.matchMedia('(prefers-reduced-motion: reduce)').matches?'instant':'smooth',block:'start'});
    }
    else if(b.dataset.category||b.dataset.orbitCategory){clearFilters();state.category=b.dataset.category||b.dataset.orbitCategory;syncControls();render();$('#explore').scrollIntoView({behavior:'smooth'});}
    else if(b.dataset.course){state.course=b.dataset.course;render();$('#explore').scrollIntoView({behavior:'smooth'});}
    else if(b.dataset.month){state.month=state.month===Number(b.dataset.month)?null:Number(b.dataset.month);renderCalendar();}
    else if(b.dataset.calendarContest && !e.metaKey&&!e.ctrlKey&&!e.shiftKey&&!e.altKey){e.preventDefault();navigate(b.dataset.calendarContest,true);}
  });
  function fromHash() { const m=location.hash.match(/^#contest\/(.+)$/);if(m){let id;try{id=decodeURIComponent(m[1]);}catch{return;}if(byId(id)){state.selected=id;clearFilters();render({syncRoute:false});$('#explore').scrollIntoView();}} }
  window.addEventListener('hashchange',fromHash);
  window.addEventListener('popstate',fromHash);
  $('#export').addEventListener('click',()=>{
    const cols=['赛事','榜单序号','方向','级别','建议年级','报名届次','报名窗口','报名补充说明','附加报名记录','开始日期','截止日期','日期核验','个人/团队','人数','线上/线下','课程关联','官网','证据链接','访问日期'];
    const rows=filtered.map(c=>[c.name,c.catalogNumber,c.category,c.level,grades(c.grades),c.registration.edition,c.registration.windowText,c.registration.note,(c.registration.additionalWindows || []).map(w=>`${w.label}: ${w.start || '开始日待核实'} — ${w.end || '截止日待核实'}`).join('；'),c.registration.start,c.registration.end,c.registration.status,c.teamFormat,c.teamSize,c.deliveryMode,c.courses.join('、'),c.officialUrl,c.evidence.map(e=>e.url).join(' | '),data.meta.accessed]);
    const cell=v=>'"'+String(v??'').replace(/^[=+@-]/,"'$&").replace(/"/g,'""')+'"';
    const blob=new Blob(['\ufeff'+[cols,...rows].map(row=>row.map(cell).join(',')).join('\r\n')],{type:'text/csv;charset=utf-8;'});const url=URL.createObjectURL(blob);const a=document.createElement('a');a.href=url;a.download='竞途-赛事筛选.csv';a.click();setTimeout(()=>URL.revokeObjectURL(url),1000);toast(`已导出 ${filtered.length} 项赛事`);
  });
  render();fromHash();
})();
