// Lightweight rule checks. DOM stubs do not replace visual/browser QA.
const fs=require('node:fs'),vm=require('node:vm'),assert=require('node:assert/strict');
function element(){return {value:'',textContent:'',innerHTML:'',children:[],classList:{add(){},toggle(){}},append(x){this.children.push(x)},replaceChildren(){this.children=[]},setAttribute(){},focus(){},select(){},showModal(){this.open=true},close(){this.open=false},get childElementCount(){return this.children.length}};}
const elements=new Map();const document={querySelector(s){if(!elements.has(s))elements.set(s,element());return elements.get(s)},querySelectorAll(){return []},createElement:element};
const context=vm.createContext({document,localStorage:{getItem(){return null},setItem(){}},navigator:{},console});
vm.runInContext(fs.readFileSync('dist/data.js','utf8'),context);
vm.runInContext(fs.readFileSync('dist/app.js','utf8'),context);
vm.runInContext(`
 if(companies.length!==9)throw Error('dataset');
 const full=solution();if(!full||new Set(full).size!==9||!full.every((id,i)=>matches(i,id)))throw Error('unsolvable board');
 for(const c of companies)if(!c.source.startsWith('https://')||!/^\\d{4}-\\d{2}-\\d{2}$/.test(c.date))throw Error('missing evidence');
 if(!matches(0,2))throw Error('100M boundary rejected');
 if(!matches(1,1)||!matches(2,1)||!matches(0,1))throw Error('multiple valid clues rejected');
 if(matches(0,5)||matches(1,0)||matches(4,0))throw Error('invalid clue accepted');
 guess(0,0);if(solved()!==1||state.guesses!==8)throw Error('correct guess');
 guess(1,0);if(state.guesses!==8)throw Error('duplicate charged');
 guess(1,4);if(state.guesses!==7||state.answers[1]!==null)throw Error('wrong guess');
 const before=state.guesses;guess(0,1);if(state.guesses!==before)throw Error('filled cell overwritten');
 state={answers:Array(9).fill(null),guesses:9,ended:false};
 for(let i=0;i<9;i++)guess(i,full[i]);
 if(solved()!==9||!over()||state.guesses!==0)throw Error('win');
 guess(0,1);if(solved()!==9||state.guesses!==0)throw Error('post-game mutation');
 state={answers:Array(9).fill(null),guesses:1,ended:false};guess(0,8);if(!over()||solved()!==0)throw Error('loss');
 state={answers:Array(9).fill(null),guesses:9,ended:true};if(!over()||solved()!==0)throw Error('reveal scored as correct');
 state={answers:[1,null,2,null,null,null,null,null,null],guesses:7,ended:true};
 if(solution(state.answers)!==null)throw Error('impossible partial board accepted');render();
 if(!document.querySelector('#status').textContent.includes('no full unique completion'))throw Error('dead end not explained');
 for(const order of [[0,1,2,3,4,5,6,7,8],[8,7,6,5,4,3,2,1,0],[1,8,4,3,2,7,6,0,5]]){
  state={answers:Array(9).fill(null),guesses:9,ended:false};
  for(const id of order){document.querySelector('#startup-answer').value=companies[id].name;submitAnswer({preventDefault(){}});}
  if(solved()!==9||state.guesses!==0)throw Error('name-first order failed');
 }
 state={answers:Array(9).fill(null),guesses:9,ended:false};
 document.querySelector('#startup-answer').value='unknown typo';submitAnswer({preventDefault(){}});
 if(state.guesses!==9||solved()!==0)throw Error('unrecognized name charged');
 document.querySelector('#startup-answer').value='  ANYSPHERE ';submitAnswer({preventDefault(){}});
 if(solved()!==1||state.guesses!==8||!state.answers.includes(3))throw Error('alias failed');
 document.querySelector('#startup-answer').value='cursor';submitAnswer({preventDefault(){}});
 if(state.guesses!==8||solved()!==1)throw Error('name-first duplicate charged');
 state.ended=true;document.querySelector('#startup-answer').value='Mercury';submitAnswer({preventDefault(){}});
 if(state.guesses!==8||solved()!==1)throw Error('ended form accepted answer');
`,context);
assert.ok(fs.existsSync('dist/style.css'));
console.log('PASS: solvability, correct/wrong guesses, duplicate blocking, filled-cell protection, win, loss, reveal, post-game protection. Browser appearance not tested.');
