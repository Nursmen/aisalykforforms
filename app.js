const $ = s => document.querySelector(s);
let step = 0, mode = false, busy = false, generation = 0, saved = '';
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
let chosen = [0, 3];
function activityPicker(second=false){return `<p>${second?'Какую ещё деятельность добавим?':'Выберите вид деятельности за этот квартал.'}</p><label class="activity-label" for="activity-${second?1:0}">Вид деятельности</label><select class="activity-select" id="activity-${second?1:0}" data-activity="${second?1:0}"><option value="" disabled selected>Выберите из списка…</option>${activities.map((name,i)=>`<option value="${i}"${second&&i===chosen[0]?' disabled':''}>${name}</option>`).join('')}</select>`;}
const replies = [
  'привет, помоги мне заполнить налоговый отчёт',
  'давай лучше единый налог заполним',
  'ну давай за 1 квартал сделаем',
  'для малого бизнеса',
  'давай лучше новый первоначальный сделаем',
  'ага, всё верно',
  'не, давай в этот раз заново выберем',
  'у меня торговля',
  'за квартал получилось где-то 1 250 000 сом',
  'да, у меня ещё небольшое кафе есть',
  'да, ещё общественное питание',
  'по кафе ещё 350 тысяч сом вышло',
  'теперь всё, больше ничего',
  'да, покажи отчёт'
];
const answers = [
  '<p>Помогу. По вашей форме 025 зарегистрированы:</p><ul><li>налог с продаж;</li><li>НДС;</li><li>налог на прибыль;</li><li>подоходный налог.</li></ul><p>По какому налогу заполним отчёт? Можно выбрать и другой.</p>',
  'Нашёл последний отчёт по Единому налогу. Перенесу из него данные плательщика.<br><br>За какой квартал и год заполним отчёт? Можно выбрать и прошлый период.',
  'За I квартал 2026 года есть несколько вариантов отчёта. Какой вам нужен: для малого предпринимательства или для субъектов лотерейной деятельности?',
  'Выбрана форма для малого предпринимательства. Использую последнюю действующую редакцию для I квартала 2026 года.<br><br>За этот период уже есть отчёт. Уточним его или создадим первоначальный?',
  `<p>Создам новый первоначальный отчёт. Данные плательщика перенёс, период заполнил. Проверьте, всё верно?</p><div class="data-grid"><div><span>ИНН</span><b>02501201810018</b></div><div><span>Плательщик</span><b>ОсОО «ТРАНС КАРГО КЕЙ ДЖИ»</b></div><div><span>Налоговый орган</span><b>003 — Свердловский р-н</b></div><div><span>Телефон</span><b>0442162, 0550 320588</b></div><div><span>Период</span><b>I квартал 2026</b><small>01.01.2026 — 31.03.2026</small></div><div><span>Тип отчёта</span><b>Первоначальный</b></div></div>`,
  '<p>Вижу, в прошлом сданном отчёте были:</p><ul><li>торговая деятельность;</li><li>швейное и/или текстильное производство.</li></ul><p>Повторим эти виды деятельности в новом отчёте?</p>',
  '<p>Хорошо, выберем заново.</p>' + activityPicker(),
  'Какая была выручка от торговли за квартал? Укажите сумму в сомах — остальные поля заполню.',
  'Указал выручку: 1 250 000 сом. Была ли ещё какая-нибудь деятельность в этом квартале?',
  '',
  '',
  'Добавил ещё 350 000 сом. Есть другие виды деятельности?',
  'Готово, в отчёте две деятельности. Общая выручка — 1 600 000 сом. Посмотрим отчёт?',
  '<p>Вот ваш отчёт.</p><a href="report.pdf" class="file-card" data-report><span class="file-icon">PDF</span><span>Единый налог<small>I квартал 2026 · образец</small></span></a>'
];
function scroll(){requestAnimationFrame(()=>{const c=$('#conversation');c.scrollTo({top:c.scrollHeight,behavior:'smooth'});});}
function add(text,user=false){const el=document.createElement('article');el.className='message'+(user?' user':'');el.innerHTML=`${user?'':'<span class="avatar">✦</span>'}<div class="message-body"><div class="message-name">${user?'Вы':'АйСалык'}</div><div class="bubble">${text}</div></div>`;$('#conversation').append(el);scroll();return el;}
function update(){ $('#modeButton').classList.toggle('enabled',mode);$('#modeButton').setAttribute('aria-pressed',String(mode));$('#modeButton').disabled=busy;$('#chatTitle').textContent=mode?'Заполнение отчёта':'Суперчат';$('#messageInput').placeholder=busy?'Можно уже написать ответ…':'Напишите что-нибудь…';$('.send').disabled=busy;}
function welcome(){ $('#conversation').innerHTML='<div class="welcome"><span class="welcome-icon">✦</span><h1>Новый диалог</h1><p>Напишите сообщение, чтобы начать</p></div>'; }
function start(){mode=true;if(saved){$('#conversation').innerHTML=saved;saved='';}else{welcome();}update();scroll();}
function reset(){generation++;chosen=[0,3];step=0;busy=false;mode=false;saved='';$('#messageInput').value='';welcome();update();}
function toggle(){if(busy)return;if(!mode){start();return;}document.querySelectorAll('.activity-select').forEach(x=>[...x.options].forEach(o=>o.toggleAttribute('selected',o.selected)));saved=$('#conversation').innerHTML;mode=false;welcome();update();}
function openReport(){if(!$('#pdfDialog').open)$('#pdfDialog').showModal();}
async function advance(instant=false){
  if(busy)return;
  if(!mode)start();
  if(step>=replies.length){add('давай ещё раз посмотрим',true);openReport();return;}
  $('.welcome')?.remove();
  const current=step++, token=generation;
  let reply = replies[current];
  let answer = answers[current];
  if(current===7||current===10){
    const n=current===7?0:1;
    if(n===1&&chosen[1]===chosen[0])chosen[1]=chosen[0]===0?3:0;
    const picker=$(`#activity-${n}`);
    if(picker){if(picker.value!=='')chosen[n]=Number(picker.value);picker.value=String(chosen[n]);picker.disabled=true;}
    const name=activities[chosen[n]];
    reply=chosen[n]===0?'у меня торговля':chosen[n]===3?'да, ещё общественное питание':`давай ${name.charAt(0).toLowerCase()+name.slice(1)}`;
    answer=`Какая была выручка за квартал по деятельности «${name}»? Напишите сумму в сомах — остальные поля заполню.`;
  }
  if(current===9)answer=activityPicker(true);
  if(current===12)answer=`<p>Готово, добавил обе деятельности:</p><ul><li>${activities[chosen[0]]} — 1 250 000 сом;</li><li>${activities[chosen[1]]} — 350 000 сом.</li></ul><p>Общая выручка — 1 600 000 сом. Посмотрим отчёт?</p>`;
  add(reply,true);
  busy=true;update();
  const pending=add(`<span class="scan"><span class="spinner"></span>${current===1?'Проверяю последний отчёт…':'Думаю…'}</span>`);
  if(!instant)await new Promise(r=>setTimeout(r,current===1?3800:2400));
  if(token!==generation)return;
  pending.querySelector('.bubble').innerHTML=answer;
  busy=false;update();scroll();
  if(current===replies.length-1&&!instant)openReport();
}

async function demo(){reset();start();for(let i=0;i<replies.length;i++)await advance(true);requestAnimationFrame(()=>$('#conversation').scrollTo({top:0,behavior:'instant'}));}
$('#modeButton').onclick=toggle;
$('#newChat').onclick=reset;
$('#demoHistory').onclick=demo;
$('#messageForm').onsubmit=e=>{e.preventDefault();if(busy||!$('#messageInput').value.trim())return;$('#messageInput').value='';advance();};
document.addEventListener('change',e=>{if(e.target.matches('.activity-select')&&!busy){advance();}});
$('#closePdf').onclick=()=>$('#pdfDialog').close();
document.addEventListener('click',e=>{if(e.target.closest('[data-report]')){e.preventDefault();openReport();}});
$('#pdfDialog').addEventListener('click',e=>{if(e.target===$('#pdfDialog'))$('#pdfDialog').close();});
reset();
