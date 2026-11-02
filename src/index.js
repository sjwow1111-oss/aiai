const json=(body,status=200)=>Response.json(body,{status,headers:{'Cache-Control':'no-store','X-Content-Type-Options':'nosniff'}});
export default {async fetch(request,env){
 const url=new URL(request.url); if(url.pathname!='/api/search') return env.ASSETS.fetch(request);
 if(request.method!=='POST') return json({error:'Method not allowed'},405);
 if(request.headers.get('Origin') && request.headers.get('Origin')!==url.origin) return json({error:'Invalid origin'},403);
 if(!env.OPENROUTER_API_KEY) return json({error:'서버에 OpenRouter API 키가 설정되지 않았습니다.'},503);
 if(!request.headers.get('content-type')?.includes('application/json')) return json({error:'JSON 요청이 필요합니다.'},415);
 let data; try {data=await request.json()} catch{return json({error:'잘못된 요청입니다.'},400)}
 if(!Array.isArray(data.messages)||data.messages.length<1||data.messages.length>12||data.messages.some(m=>!['user','assistant'].includes(m.role)||typeof m.content!=='string'||m.content.length>6000)||data.messages.at(-1).role!=='user') return json({error:'질문을 확인해 주세요.'},400);
 try {const response=await fetch('https://openrouter.ai/api/v1/chat/completions',{method:'POST',headers:{'Authorization':`Bearer ${env.OPENROUTER_API_KEY}`,'Content-Type':'application/json'},body:JSON.stringify({model:env.OPENROUTER_MODEL||'openai/gpt-4.1-mini',messages:[{role:'system',content:'Answer in the language of the user. Use supplied web search results; cite sources with markdown links. Distinguish uncertainty from verified facts. If sources do not support a claim, say so.'},...data.messages],plugins:[{id:'web',max_results:5}],max_tokens:1800})});
 if(!response.ok) return json({error:`검색 서비스 오류 (${response.status}). API 키, 크레딧, 모델 설정을 확인하세요.`},502);
 const result=await response.json(); const msg=result.choices?.[0]?.message; if(typeof msg?.content!=='string') return json({error:'검색 서비스에서 답변을 받지 못했습니다.'},502);
 const sources=[]; for(const a of msg.annotations||[]){const c=a.url_citation; try {let u=new URL(c.url); if(['https:','http:'].includes(u.protocol)&&!sources.some(x=>x.url===u.href)) sources.push({url:u.href,title:String(c.title||u.hostname).slice(0,250),content:String(c.content||'').slice(0,350)});}catch{}}
 return json({answer:msg.content,sources,model:result.model||env.OPENROUTER_MODEL||'openai/gpt-4.1-mini'});
 }catch{return json({error:'검색 서비스에 연결하지 못했습니다. 다시 시도해 주세요.'},502)}
}};
