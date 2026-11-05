const CONTACT_URL = ''; // Set your brand's actual social profile URL before launch.
const key='startup-grid-real-rounds-v2';
let state={answers:Array(9).fill(null),guesses:9,ended:false};
try {const saved=JSON.parse(localStorage.getItem(key));if(saved && Array.isArray(saved.answers)&&saved.answers.length===9&&saved.answers.every((x,i)=>x===null||Number.isInteger(x)&&x>=0&&x<companies.length&&matches(i,x))&&new Set(saved.answers.filter(x=>x!==null)).size===saved.answers.filter(x=>x!==null).length&&Number.isInteger(saved.guesses)&&saved.guesses>=0&&saved.guesses<=9&&typeof saved.ended==='boolean')state=saved;}catch{}
const $=s=>document.querySelector(s);
const modal=$('#modal');
function persist(){try{localStorage.setItem(key,JSON.stringify(state));}catch{}}
function solved(){return state.answers.filter(x=>x!==null).length;}
function over(){return state.ended||state.guesses===0||solved()===9;}
function render(){
 const board=$('#board');board.replaceChildren();
 const completed=over()?solution(state.answers):null;
 const axis=(title,cls)=>{const d=document.createElement('div');d.className='axis '+cls;d.textContent=title;board.append(d);};
 axis('✳','corner');columns.forEach(x=>axis(x,''));
 rows.forEach((r,ri)=>{axis(r,'row-axis');columns.forEach((c,ci)=>{
  const i=ri*3+ci,b=document.createElement('button'),answer=state.answers[i];b.className='cell';b.setAttribute('aria-label',`${r} and ${c}${answer!==null?': '+companies[answer].name:''}`);
  if(answer!==null){b.classList.add('filled');b.textContent=companies[answer].name;const s=document.createElement('small');s.textContent='✓ CONNECTED';b.append(s);b.disabled=true;}
  else if(over()){b.classList.add('revealed');const example=completed?completed[i]:companies.findIndex((_,id)=>!state.answers.includes(id)&&matches(i,id));b.textContent=example<0?'No unused match':companies[example].name;const s=document.createElement('small');s.textContent=example<0?'TRY A NEW ROUND':'EXAMPLE ANSWER';b.append(s);b.disabled=true;}
  else {b.textContent='·';b.disabled=true;}
  board.append(b);
 });});
 $('#guesses').textContent=state.guesses;$('#score').textContent=`${solved()} / 9`;
 $('#status').textContent=over()?`Round complete. ${solved()} of 9 connections made. ${completed?'Share your grid or start again.':'These picks have no full unique completion; individual unused matches are shown.'}`:'Name a startup below. We’ll place it in a matching square.';
 $('#startup-answer').disabled=over();$('#submit-answer').disabled=over();
 $('#reveal').disabled=over();persist();
}
function open(content){$('#modal-content').innerHTML=content;if(!modal.open)modal.showModal();}
$('.close').onclick=()=>modal.close();
function submitAnswer(event){
 event.preventDefault();if(over())return;
 const input=$('#startup-answer'),normalize=value=>value.toLowerCase().replace(/[^a-z0-9]/g,'');
 const value=normalize(input.value);
 if(!value){$('#feedback').textContent='Enter a startup name first.';input.focus();return;}
 const id=companies.findIndex(c=>normalize(c.name)===value||(c.name==='Cursor'&&value==='anysphere'));
 if(id<0){$('#feedback').textContent='That name isn’t in this starter set. Check the spelling or explore Startups. No guess lost.';input.focus();return;}
 if(state.answers.includes(id)){$('#feedback').textContent='You already used this startup. Try another — no guess lost.';input.select();return;}
 const available=state.answers.map((answer,cell)=>answer===null&&matches(cell,id)?cell:null).filter(cell=>cell!==null);
 // Prefer a placement that keeps a full board solvable, then the tightest clue.
 available.sort((a,b)=>{
  const count=cell=>companies.filter((_,candidate)=>!state.answers.includes(candidate)&&matches(cell,candidate)).length;
  return count(a)-count(b)||a-b;
 });
 const cell=available.find(cell=>{const trial=[...state.answers];trial[cell]=id;return solution(trial)!==null;})??available[0];
 if(cell===undefined){state.guesses--;render();$('#feedback').textContent=`No open square matches ${companies[id].name}. One guess used.`;return;}
 guess(cell,id);input.value='';
 $('#feedback').textContent=`${companies[id].name} connected: ${rows[Math.floor(cell/3)]} × ${columns[cell%3]}.`;
 if(!over())input.focus();
}
$('#answer-form').onsubmit=submitAnswer;
function guess(cell,id){
 if(over()||state.answers[cell]!==null)return;
 if(state.answers.includes(id)){$('#feedback').textContent='You already used this startup. Pick another — no guess lost.';return;}
 const c=companies[id];state.guesses--;
 const correct=matches(cell,id);
 if(correct)state.answers[cell]=id;
 render();
 if(!correct)$('#feedback').textContent=`Not a match for both clues. ${state.guesses} guesses left. Try another startup.`;
}
$('#how').onclick=()=>open('<span class="eyebrow">THE RULES</span><h2>Name it. Connect it.</h2><p>Type a startup in the name box below the grid and press Enter. We’ll fill an open square whose row and column both match. If several squares fit, we prefer a placement that keeps the full board solvable.</p><p>You get nine guesses. Each recognized, unused startup submission uses one guess, even if no open square fits. Unrecognized names and duplicates do not cost a guess. Each startup can appear once. Fill all nine squares to win.</p><p>This board uses nine real companies and specific historical funding announcements. Investor clues refer to the cited round, not every investor in company history. Amounts are per-round USD, not lifetime totals. Stripe announced agreements; Mercury includes secondary funding. Explore Startups for dated sources. Categories are curated for this board; only listed companies are accepted. Daily rotation is not enabled.</p>');
$('#reset').onclick=()=>{open('<h2>Start a fresh round?</h2><p>This will clear your progress on this grid.</p><button id="confirm-reset" class="dark">Start over</button>');$('#confirm-reset').onclick=()=>{state={answers:Array(9).fill(null),guesses:9,ended:false};$('#startup-answer').value='';$('#feedback').textContent='';render();modal.close();$('#startup-answer').focus();};};
$('#reveal').onclick=()=>{open('<h2>Ready to see the answers?</h2><p>This ends the round and reveals the unfilled squares. Only your correct guesses count toward your score.</p><button id="confirm-reveal" class="dark">End round & reveal</button>');$('#confirm-reveal').onclick=()=>{state.ended=true;render();modal.close();};};
async function copy(value,button){try{await navigator.clipboard.writeText(value);button.textContent='Copied ✓';}catch{button.textContent='Select and copy the text above';}}
$('#share').onclick=()=>{const lines=[0,1,2].map(r=>state.answers.slice(r*3,r*3+3).map(x=>x===null?'⬜':'🟩').join(''));const result=`Startup Grid · Real Rounds 001\n${solved()}/9 · ${9-state.guesses} guesses used${over()?'':' · In progress'}\n${lines.join('\n')}\nHistorical funding rounds edition`;open('<h2>Send it to the group chat.</h2><p>Your results, without the answers.</p><label for="share-text">Share text</label><textarea id="share-text" readonly></textarea><div class="dialogactions"><button class="dark" id="copy-result">Copy results ↗</button></div>');$('#share-text').value=result;$('#copy-result').onclick=e=>copy(result,e.currentTarget);};
document.querySelectorAll('[data-tab]').forEach(b=>b.onclick=()=>{document.querySelectorAll('.view').forEach(v=>v.hidden=v.id!==b.dataset.tab);document.querySelectorAll('[data-tab]').forEach(n=>n.classList.toggle('active',n===b));});
function directory(){
 const query=$('#directory-search').value.toLowerCase(),list=$('#companies');list.replaceChildren();
 companies.filter(c=>[c.name,c.product,c.description,c.round,...c.investors].join(' ').toLowerCase().includes(query)).forEach(c=>{
  const a=document.createElement('article');a.className='company';
  a.innerHTML=`<span class="icon">${c.name[0]}</span><h3>${c.name}</h3><small>${c.product}</small><p>${c.description}</p><div class="roundamount">${c.amount}</div><small>${c.round} · ${c.date}</small><p>Named investors: ${c.investors.join(', ')}</p><p class="factnote">${c.note}</p><a class="sourcelink" href="${c.source}" target="_blank" rel="noopener noreferrer">Read official announcement ↗</a>`;
  list.append(a);
 });if(!list.childElementCount)list.textContent='No startups match your search.';
}
$('#directory-search').oninput=directory;
function contact(sponsor=false){open(`<span class="eyebrow">${sponsor?'LET’S TALK SPONSORSHIP':'GET YOUR STARTUP ADDED'}</span><h2>${sponsor?'Your startup. This space.':'Built something worth guessing?'}</h2><p>Prepare your message below. ${CONTACT_URL?'Then open our profile and send it as a DM.':'Our DM profile is not configured yet. Copy the draft for now; nothing is submitted.'}</p><label for="startup-name">Startup name</label><input id="startup-name" placeholder="Your startup"><label for="startup-url">Website</label><input id="startup-url" placeholder="https://yourstartup.com"><label for="pitch">${sponsor?'Sponsorship goal':'One-line pitch and fact source links'}</label><textarea id="pitch" placeholder="Tell us what you are building…"></textarea><div class="dialogactions"><button class="dark" id="prepare">Prepare DM →</button></div><p>Listing requests receive editorial review. Sponsorship does not guarantee a puzzle answer.</p>`);$('#prepare').onclick=()=>{const name=$('#startup-name').value.trim(),url=$('#startup-url').value.trim(),pitch=$('#pitch').value.trim();if(!name||!url||!pitch){$('#prepare').textContent='Fill in all three fields';return;}const draft=`Hi Startup Grid! I'd like to ${sponsor?'discuss a sponsorship':'request an editorial startup listing'}.\n\nStartup: ${name}\nWebsite: ${url}\n${pitch}\n\nWhat are the next steps?`;open('<h2>Your DM draft is ready.</h2><p>Copy this message. Nothing has been sent.</p><label for="dm-draft">Message</label><textarea id="dm-draft" readonly></textarea><div class="dialogactions"><button id="copy-dm" class="dark">Copy message</button><span id="profile-link"></span></div>');$('#dm-draft').value=draft;$('#copy-dm').onclick=e=>copy(draft,e.currentTarget);if(CONTACT_URL){const a=document.createElement('a');a.href=CONTACT_URL;a.target='_blank';a.rel='noopener noreferrer';a.className='outline';a.textContent='Open our DM profile ↗';$('#profile-link').append(a);}};}
document.querySelectorAll('.contact').forEach(b=>b.onclick=()=>contact());document.querySelectorAll('.sponsor-inquiry').forEach(b=>b.onclick=()=>contact(true));
render();directory();
