const $=s=>document.querySelector(s);
let saved;try{saved=JSON.parse(sessionStorage.getItem('aisalyk-saved-report'));}catch{}
const historyRows=[
 ['Ожидает отправки','Ленинский р-н','62_7','01.08.2026','31.08.2026','Первоначальный','25.09.2026','18:03','-','-'],
 ['Принят','Первомайский р-н','091_10','01.01.2026','31.03.2026','Уточнённый','25.09.2026','17:26','28.09.2026 15:45','28.09.2026 15:45'],
 ['Принят','Первомайский р-н','091_9','01.01.2026','31.03.2026','Уточнённый','22.09.2026','09:43','23.09.2026 16:39','23.09.2026 16:40'],
 ['Принят','УККН по городу Бишкек и Северному региону','091_8','01.01.2026','31.03.2026','Первоначальный','16.09.2026','09:54','23.09.2026 17:09','23.09.2026 17:09'],
 ['Ожидает отправки','УККН по городу Бишкек и Северному региону','091_7','01.01.2025','31.03.2025','Первоначальный','16.09.2026','09:47','-','-'],
 ['Принят','Первомайский р-н','091_9_1','01.08.2026','31.08.2026','Первоначальный','16.09.2026','08:43','16.09.2026 08:44','16.09.2026 08:43'],
 ['Принят','Октябрьский р-н','168','01.07.2026','30.09.2026','Ликвидационный','14.09.2026','16:45','14.09.2026 16:45','14.09.2026 16:45'],
 ['Принят','Первомайский р-н','168','01.07.2026','30.09.2026','Ликвидационный','14.09.2026','16:28','14.09.2026 16:28','14.09.2026 16:28'],
 ['Принят','Первомайский р-н','129_7_2','01.05.2026','31.05.2026','Первоначальный','08.09.2026','16:54','08.09.2026 16:55','08.09.2026 16:55']
];
const rows=historyRows.map((r,i)=>({id:'history-'+i,status:r[0],district:r[1],code:r[2],from:r[3],to:r[4],type:r[5],date:r[6],time:r[7],sent:r[8],accepted:r[9],auto:'Нет'}));
if(saved)rows.unshift({id:saved.id,status:saved.status,district:'Свердловский р-н',code:'091_10',from:'01.01.2026',to:'31.03.2026',type:'Первоначальный',date:'29.09.2026',time:saved.time||'12:00',sent:saved.sent||'-',accepted:'-',auto:'Да',fresh:true});
function render(){const filtered=rows.filter(r=>(!$('#statusFilter').value||r.status===$('#statusFilter').value)&&r.code.includes($('#codeFilter').value.trim()));$('#reports').innerHTML=filtered.map(r=>`<tr class="${r.fresh?'new-report':''}"><td>${rows.indexOf(r)+1}</td><td><span class="badge ${r.status==='Принят'?'accepted':r.status==='В обработке'?'pending':''}">${r.status}</span></td><td>${r.district}</td><td>${r.code}</td><td>${r.from} -<br>${r.to}</td><td>${r.type}</td><td>${r.auto}</td><td>${r.date}<br>${r.time}</td><td>${r.sent.replace(' ','<br>')}</td><td>${r.accepted.replace(' ','<br>')}</td><td>${r.status==='Ожидает отправки'?`<button data-send="${r.id}">Отправить в ГНС</button>`:''}</td><td><button data-action="${r.id}">Действия</button></td></tr>`).join('')||'<tr><td colspan="12" class="empty">Отчёты не найдены</td></tr>';}
let pendingId=null;
function info(title,text,send=false){$('#infoTitle').textContent=title;$('#infoText').textContent=text;$('#confirmSend').hidden=!send;$('#info').showModal();}
$('#filterToggle').onclick=()=>{const open=$('#filters').hidden;$('#filters').hidden=!open;$('#filterToggle').setAttribute('aria-expanded',String(open));};
$('#filters').onsubmit=e=>e.preventDefault();$('#filters').onreset=()=>setTimeout(render,0);$('#statusFilter').onchange=render;$('#codeFilter').oninput=render;
$('#instructions').onclick=()=>info('Порядок заполнения отчёта','Выберите период и форму, проверьте реквизиты, добавьте деятельность и выручку. После проверки сохраните отчёт в журнале. Сохранение не означает отправку в ГНС.');
$('#cancelInfo').onclick=()=>$('#info').close();
document.addEventListener('click',e=>{const send=e.target.closest('[data-send]');if(send){pendingId=send.dataset.send;info('Отправка отчёта','Это демонстрация: отчёт получит статус «В обработке» только в макете. Данные в ГНС не передаются.',true);}const action=e.target.closest('[data-action]');if(action){if(saved&&action.dataset.action===saved.id)location.href='report.html?id='+encodeURIComponent(saved.id);else info('Архивный отчёт','Эта строка перенесена из примера журнала. Заполненная форма доступна для нового отчёта, созданного в диалоге.');}});
$('#confirmSend').onclick=()=>{const row=rows.find(r=>r.id===pendingId);if(row){row.status='В обработке';row.sent='29.09.2026 '+new Date().toLocaleTimeString('ru-RU',{hour:'2-digit',minute:'2-digit'});if(row.fresh){saved.status=row.status;saved.sent=row.sent;sessionStorage.setItem('aisalyk-saved-report',JSON.stringify(saved));}render();$('#notice').textContent='Статус обновлён в макете. Реальной отправки в ГНС не было.';}$('#info').close();};
if(saved)$('#notice').textContent=saved.status==='Ожидает отправки'?'Отчёт по Единому налогу сохранён. Он ожидает отправки.':'Отчёт по Единому налогу сохранён. Статус: '+saved.status+'.';
render();
