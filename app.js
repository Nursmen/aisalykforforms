const $ = s => document.querySelector(s);
let step=0, mode=false, busy=false, generation=0, saved='', chosen=[0,3], incomeAmounts=[1250000,350000], awaitingApproval=false;
const activities = [
  'Торговая деятельность',
  'Переработка сельскохозяйственной продукции, производство товаров, туроператорская деятельность, разработка программного обеспечения и деятельность в сфере транспорта',
  'Остальные виды деятельности',
  'Общественное питание',
  'Швейное и/или текстильное производство',
  'Производство и/или реализация ювелирных изделий',
  'Сауна',
  'Бильярд',
  'Баня',
  'Резидент парка креативных индустрий',
  'Субъект, применяющий режим, установленный статьёй 324 Налогового кодекса Кыргызской Республики',
  'Сельскохозяйственные заготовители',
  'Сельскохозяйственные заготовители молока',
  'Субъект, уплачивающий налог по ставке, предусмотренной частями 1, 2-1, 3, 8 статьи 423 Налогового кодекса Кыргызской Республики, реализующий товары в адрес обезличенного субъекта',
  'Субъект СЭЗ, в отношении деятельности, указанной в части 5-1 статьи 430 Налогового кодекса Кыргызской Республики, при вывозе товаров',
  'Индивидуальный предприниматель, осуществляющий операции и услуги по организации питания учащихся общеобразовательных школ КР',
  'Субъект, осуществляющий обмен и/или передачу недвижимого имущества для государственных нужд в соответствии с решением Кабинета Министров',
  'Субъект, осуществляющий деятельность по реализации виртуального актива',
  'Субъект, осуществляющий деятельность вне территории Кыргызской Республики'
];

const money=n=>new Intl.NumberFormat('ru-RU').format(n);
function activityPicker(second=false){return `<p>${second?'Выберите вид деятельности.':'Теперь выберите вид деятельности.'}</p><label class="activity-label" for="activity-${second?1:0}">Вид деятельности</label><select class="activity-select" id="activity-${second?1:0}"><option value="" disabled selected>Выберите из списка…</option>${activities.map((name,i)=>`<option value="${i}"${second&&i===chosen[0]?' disabled':''}>${name}</option>`).join('')}</select>`;}
function greeting(){return `<div class="welcome short-welcome"><span class="welcome-icon">✦</span><h1>Здравствуйте,<br>Кыдыралиев Азамат Кыдыралиевич</h1><p>Я — ИИ-ассистент для помощи в заполнении отчётов.<br>Какой отчёт вы хотите заполнить?</p><div class="welcome-taxes"><p>Отчёты из вашей формы 025:</p><ul><li>Налог с продаж</li><li>Сбор за вывоз мусора</li><li>НДС</li><li>Налог на прибыль</li><li>Подоходный налог</li></ul><p class="tax-other">Можно выбрать и другой налог.</p></div></div>`;}
function scroll(){requestAnimationFrame(()=>{const c=$('#conversation');c.scrollTo({top:c.scrollHeight,behavior:'smooth'});});}
function add(text,user=false){const el=document.createElement('article');el.className='message'+(user?' user':'');el.innerHTML=`${user?'':'<span class="avatar">✦</span>'}<div class="message-body"><div class="message-name">${user?'Вы':'АйСалык'}</div><div class="bubble">${text}</div></div>`;$('#conversation').append(el);scroll();return el;}
function update(){ $('#modeButton').classList.toggle('enabled',mode);$('#modeButton').setAttribute('aria-pressed',String(mode));$('#modeButton').disabled=busy;$('#chatTitle').textContent=mode?'Заполнение отчёта':'Суперчат';$('#messageInput').placeholder=busy?'Можно уже написать ответ…':awaitingApproval?'Сохранить отчёт?':'Напишите что-нибудь…';$('.send').disabled=busy;}
function welcome(){$('#conversation').innerHTML=greeting();}
function start(){mode=true;if(saved){$('#conversation').innerHTML=saved;saved='';}update();}
function reset(){generation++;step=0;mode=false;busy=false;saved='';chosen=[0,3];incomeAmounts=[1250000,350000];awaitingApproval=false;sessionStorage.removeItem('aisalyk-chat');$('#messageInput').value='';welcome();update();}
function toggle(){if(busy)return;if(!mode){start();return;}document.querySelectorAll('.activity-select').forEach(x=>[...x.options].forEach(o=>o.toggleAttribute('selected',o.selected)));saved=$('#conversation').innerHTML;mode=false;welcome();update();}
function draftData(){return {id:'aisalyk-091-2026-q1',status:'Черновик',entries:chosen.map((index,i)=>({index,name:activities[index],income:incomeAmounts[i]}))};}
function openReport(edit=false){sessionStorage.setItem('aisalyk-draft',JSON.stringify(draftData()));$('#reportFrame').src='report.html'+(edit?'?edit=1':'');if(!$('#pdfDialog').open)$('#pdfDialog').showModal();}
function totals(){return `<ul><li>${activities[chosen[0]]} — ${money(incomeAmounts[0])} сом;</li><li>${activities[chosen[1]]} — ${money(incomeAmounts[1])} сом.</li></ul><p>Общая выручка — <strong>${money(incomeAmounts.reduce((a,b)=>a+b,0))} сом.</strong></p>`;}
function finalAnswer(){return `<p><strong>Отчёт сформирован.</strong></p><div id="finalTotals">${totals()}</div><a href="report.html" class="file-card" data-report><span class="file-icon">PDF</span><span>Отчёт по Единому налогу<small>I квартал 2026 · первоначальный</small></span></a><p style="margin-top:16px">Сохранить отчёт в журнале?</p>`;}
function prefilled(){return `<p>Заполняем первоначальный отчёт для малого предпринимательства за I квартал 2026 года. Использую последнюю действующую редакцию для этого периода.</p><p><strong>Эти данные уже заполнил:</strong></p><div class="data-grid"><div><span>ИНН</span><b>02501201810018</b></div><div><span>Плательщик</span><b>ОсОО «ТРАНС КАРГО КЕЙ ДЖИ»</b></div><div><span>Налоговый орган</span><b>003 — Свердловский р-н</b></div><div><span>Телефон</span><b>0442162, 0550 320588</b></div><div><span>Период</span><b>I квартал 2026</b><small>01.01.2026 — 31.03.2026</small></div><div><span>Тип отчёта</span><b>Первоначальный</b></div></div><div class="activity-next">${activityPicker()}</div>`;}
async function approveReport(raw){if(/(?:^|\s)(?:нет|не|неа)(?=\s|[,.!?]|$)|исправ|поправ|ошиб/i.test(raw)){add('пока не сохраняй, хочу проверить суммы',true);add('<p>Хорошо, пока не сохраняю. Можно проверить и исправить суммы в форме, затем написать «сохраняй».</p><a class="file-card" href="report.html?edit=1" data-report data-edit>Открыть отчёт для проверки</a>');return;}
add('да, сохраняй',true);busy=true;update();const token=generation;const pending=add('<span class="scan"><span class="spinner"></span>Сохраняю отчёт…</span>');await new Promise(r=>setTimeout(r,900));if(token!==generation)return;const report=draftData();report.status='Ожидает отправки';report.time=new Date().toLocaleTimeString('ru-RU',{hour:'2-digit',minute:'2-digit'});sessionStorage.setItem('aisalyk-saved-report',JSON.stringify(report));pending.querySelector('.bubble').innerHTML='Отчёт сохранён. Открываю журнал.';busy=false;awaitingApproval=false;update();sessionStorage.setItem('aisalyk-chat',JSON.stringify({version:3,html:$('#conversation').innerHTML,step,chosen,incomeAmounts,mode}));location.href='journal.html';}
async function advance(instant=false,raw=''){
 if(busy)return;if(!mode)start();if(awaitingApproval){await approveReport(raw);return;}if(step>=8){awaitingApproval=true;await approveReport(raw);return;}
 $('.welcome')?.remove();const current=step++,token=generation;let reply,answer;
 if(current===0){reply='давай единый налог заполним';answer='<p>Нашёл ваш предыдущий отчёт. Теперь можем использовать этот отчёт, чтобы помочь вам заполнить новый.</p><p>За какой период хотите сдать отчёт? Сразу уточните вариант: <strong>для малого предпринимательства</strong> или <strong>для субъектов лотерейной деятельности</strong>.</p>';}
 if(current===1){reply='ну давай за 1 квартал 2026, для малого бизнеса, новый первоначальный';answer=prefilled();}
 if(current===2||current===5){const n=current===2?0:1;if(n===1&&chosen[0]===chosen[1])chosen[1]=chosen[0]===0?3:0;const picker=$(`#activity-${n}`);if(picker){if(picker.value!=='')chosen[n]=Number(picker.value);picker.value=String(chosen[n]);[...picker.options].forEach(o=>o.toggleAttribute('selected',o.selected));picker.disabled=true;}const name=activities[chosen[n]];reply=chosen[n]===0?'у меня торговля':chosen[n]===3?'ещё выберу общественное питание':`выберем ${name.charAt(0).toLowerCase()+name.slice(1)}`;answer=`Какая была выручка за квартал по деятельности «${name}»? Напишите сумму в сомах — остальное заполню.`;}
 if(current===3){reply='за квартал где-то 1 250 000 сом';answer='<p>Записал: 1 250 000 сом.</p><p>Есть ли у вас ещё деятельность?</p>';}
 if(current===4){reply='да, ещё есть';answer=activityPicker(true);}
 if(current===6){reply='тут ещё 350 тысяч сом вышло';answer='<p>Записал: 350 000 сом.</p><p>Есть ли у вас ещё деятельность?</p>';}
 if(current===7){reply='нет, это всё';answer=finalAnswer();}
 add(reply,true);busy=true;update();const pending=add(current===0?'<div class="report-scanning"><div class="scanning-heading"><span class="scan-document">▤</span><div><strong>Проверяю последний отчёт</strong><small>Единый налог</small></div><span class="spinner"></span></div><div class="scan-progress"><i></i></div><div class="scan-stages"><span>Нахожу отчёт</span><span>Проверяю реквизиты</span><span>Подготавливаю данные</span></div></div>':'<span class="scan"><span class="spinner"></span>Думаю…</span>');
 if(!instant)await new Promise(r=>setTimeout(r,current===0?5700:1200));if(token!==generation)return;pending.querySelector('.bubble').innerHTML=answer;if(current===7)awaitingApproval=true;busy=false;update();scroll();
}
async function demo(){reset();start();for(let i=0;i<8;i++)await advance(true);requestAnimationFrame(()=>$('#conversation').scrollTo({top:0,behavior:'instant'}));}
$('#modeButton').onclick=toggle;$('#newChat').onclick=reset;$('#demoHistory').onclick=demo;
$('#messageForm').onsubmit=e=>{e.preventDefault();if(busy||!$('#messageInput').value.trim())return;const raw=$('#messageInput').value.trim();$('#messageInput').value='';advance(false,raw);};
document.addEventListener('change',e=>{if(e.target.matches('.activity-select')&&!busy)advance();});
$('#closePdf').onclick=()=>$('#pdfDialog').close();
document.addEventListener('click',e=>{const link=e.target.closest('[data-report]');if(link){e.preventDefault();openReport(link.hasAttribute('data-edit'));}});
$('#pdfDialog').addEventListener('click',e=>{if(e.target===$('#pdfDialog'))$('#pdfDialog').close();});
$('#pdfDialog').addEventListener('close',()=>{try{const draft=JSON.parse(sessionStorage.getItem('aisalyk-draft'));if(draft?.entries?.length===2){incomeAmounts=draft.entries.map(e=>e.income);if($('#finalTotals'))$('#finalTotals').innerHTML=totals();}}catch{}update();});
let restored=false;try{const previous=JSON.parse(sessionStorage.getItem('aisalyk-chat'));if(previous?.version===3){step=previous.step;chosen=previous.chosen;incomeAmounts=previous.incomeAmounts;mode=previous.mode;$('#conversation').innerHTML=previous.html;update();scroll();restored=true;}}catch{}if(!restored)reset();
