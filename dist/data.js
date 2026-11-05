// Curated historical announcements, checked online 2026-11-04.
// Amounts are USD, per cited round, not lifetime totals or latest valuations.
const rows = ['AI models & audio', 'Coding tools & search', 'Fintech'];
const columns = ['$100M+ round', 'a16z in the round', 'Sequoia in the round'];
const companies = [
 {name:'Anthropic',product:rows[0],raised:3500,amount:'$3.5B',round:'Series E',date:'2025-03-03',investors:['Lightspeed Venture Partners','Bessemer Venture Partners','Cisco Investments','D1 Capital Partners','Fidelity','General Catalyst','Jane Street','Menlo Ventures','Salesforce Ventures'],description:'Claude AI models and assistants.',source:'https://www.anthropic.com/news/anthropic-raises-series-e-at-usd61-5b-post-money-valuation',note:'Selected participants named in the announcement.'},
 {name:'ElevenLabs',product:rows[0],raised:180,amount:'$180M',round:'Series C',date:'2025-01-30',investors:['a16z','ICONIQ Growth','Sequoia Capital','NEA','World Innovation Lab'],description:'AI speech generation, voice agents, and audio tools.',source:'https://elevenlabs.io/blog/series-c',note:'a16z and ICONIQ Growth co-led; Sequoia increased its support.'},
 {name:'Hugging Face',product:rows[0],raised:100,amount:'$100M',round:'Series C',date:'2022-05-09',investors:['Lux Capital','Sequoia Capital','Coatue','Addition','SV Angel'],description:'A platform for sharing models, datasets, and machine learning applications.',source:'https://huggingface.co/blog/series-c',note:'Lux led; Sequoia and Coatue participated.'},
 {name:'Cursor',product:rows[1],raised:900,amount:'$900M',round:'Series C',date:'2025-06-06',investors:['Thrive Capital','Accel','a16z','DST'],description:'AI-assisted coding editor by Anysphere.',source:'https://cursor.com/blog/series-c',note:'Andreessen Horowitz is normalized to a16z.'},
 {name:'Replit',product:rows[1],raised:250,amount:'$250M',round:'Series C',date:'2025-09-10',investors:['Prysm Capital','Amex Ventures','Google AI Futures Fund','Y Combinator','Craft','a16z','Coatue'],description:'A software creation platform for building and deploying applications.',source:'https://replit.com/news/funding-announcement-series-c',note:'Prysm led; a16z deepened its investment.'},
 {name:'Sourcegraph',product:rows[1],raised:50,amount:'$50M',round:'Series C',date:'2020-12-03',investors:['Sequoia Capital','Goldcrest','Craft','Redpoint','Felicis'],description:'Universal code search for developers and teams.',source:'https://sourcegraph.com/blog/series-c-with-sequoia',note:'Sequoia led this historical round.'},
 {name:'Ramp',product:rows[2],raised:200,amount:'$200M',round:'Series E',date:'2025-06-17',investors:['Founders Fund','Thrive Capital','D1 Capital Partners','General Catalyst','GIC','ICONIQ Growth','Khosla Ventures'],description:'Corporate cards, expense management, bill pay, and financial operations.',source:'https://www.prnewswire.com/news-releases/ramp-raises-200m-series-e-at-16b-valuation-as-companies-of-all-sizes-choose-ai-powered-finance-platform-302483377.html',note:'Ramp-issued press release. Founders Fund led; selected participants shown.'},
 {name:'Stripe',product:rows[2],raised:6500,amount:'More than $6.5B',round:'Series I agreements',date:'2023-03-15',investors:['a16z','Baillie Gifford','Founders Fund','General Catalyst','MSD Partners','Thrive Capital','GIC','Goldman Sachs','Temasek'],description:'Internet payments and financial infrastructure.',source:'https://stripe.com/en-mx/newsroom/news/stripe-series-i-employee-liquidity',note:'Announced signed agreements, not a closing statement. Intended for employee liquidity and equity-award tax obligations.'},
 {name:'Mercury',product:rows[2],raised:300,amount:'$300M',round:'Series C',date:'2025-03-25',investors:['Sequoia Capital','Spark Capital','Marathon','Coatue','CRV','a16z'],description:'Financial software with business accounts provided through partner banks.',source:'https://mercury.com/blog/series-c-announcement',note:'Mix of primary and secondary funding; not $300M of new company capital. Sequoia led; a16z returned.'}
];
function matches(cell,id){
 const c=companies[id];
 if(!c||c.product!==rows[Math.floor(cell/3)])return false;
 return cell%3===0?c.raised>=100:cell%3===1?c.investors.includes('a16z'):c.investors.includes('Sequoia Capital');
}
// Find a complete assignment with distinct companies, preserving player answers.
function solution(locked=Array(9).fill(null)){
 const result=[...locked],used=new Set(locked.filter(x=>x!==null));
 function visit(){
  const remaining=result.map((v,i)=>v===null?i:null).filter(i=>i!==null);
  if(!remaining.length)return [...result];
  const candidates=i=>companies.map((_,id)=>id).filter(id=>!used.has(id)&&matches(i,id));
  remaining.sort((a,b)=>candidates(a).length-candidates(b).length);
  const cell=remaining[0];
  for(const id of candidates(cell)){result[cell]=id;used.add(id);const answer=visit();if(answer)return answer;used.delete(id);result[cell]=null;}
  return null;
 }
 return visit();
}
