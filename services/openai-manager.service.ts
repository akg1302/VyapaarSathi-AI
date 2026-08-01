import { ceoBriefSchema, type CEOBriefPayload } from "@/lib/validation/ceo-brief";
import type { AgentExecution, CEOBrief } from "@/types/agent";

const responseSchema = { type:"object", additionalProperties:false, required:["ceoBrief","businessHealthExplanation","topPriorities","businessRisks","growthOpportunities","suggestedNextActions"], properties:{ceoBrief:{type:"string"},businessHealthExplanation:{type:"string"},topPriorities:{type:"array",items:{type:"string"}},businessRisks:{type:"array",items:{type:"string"}},growthOpportunities:{type:"array",items:{type:"string"}},suggestedNextActions:{type:"array",items:{type:"string"}}} };
const delay=(ms:number)=>new Promise(resolve=>setTimeout(resolve,ms));
function extractText(payload:unknown){const response=payload as {output_text?:string;output?:{content?:{type?:string;text?:string}[]}[]};return response.output_text ?? response.output?.flatMap(item=>item.content??[]).find(item=>item.type==="output_text")?.text;}
export class OpenAIManagerService {
  async synthesize(input:{metrics:Record<string,number>;agents:AgentExecution[];recommendations:unknown}, fallback:CEOBrief):Promise<CEOBrief>{
    if(!process.env.OPENAI_API_KEY) return fallback;
    try { const output=await this.request(input); return {...output,source:"openai",model:process.env.OPENAI_MANAGER_MODEL??"gpt-5.6"}; } catch(error) { console.warn("OpenAI manager synthesis failed; using deterministic fallback",error); return fallback; }
  }
  private async request(input:{metrics:Record<string,number>;agents:AgentExecution[];recommendations:unknown}):Promise<CEOBriefPayload>{
    const timeoutMs=Number(process.env.OPENAI_MANAGER_TIMEOUT_MS??15000); const maxAttempts=3;
    for(let attempt=0;attempt<maxAttempts;attempt++) { const controller=new AbortController(); const timeout=setTimeout(()=>controller.abort(),timeoutMs); try { const response=await fetch("https://api.openai.com/v1/responses",{method:"POST",headers:{"Content-Type":"application/json","Authorization":`Bearer ${process.env.OPENAI_API_KEY}`},signal:controller.signal,body:JSON.stringify({model:process.env.OPENAI_MANAGER_MODEL??"gpt-5.6",reasoning:{effort:"low"},input:[{role:"developer",content:[{type:"input_text",text:"You are the CEO synthesis layer for an Indian MSME. Use only the provided specialist-agent outputs and metrics. Never invent facts, financial figures, customers, or product details. Be direct, concrete and concise. Return only JSON that conforms exactly to the requested schema."}]},{role:"user",content:[{type:"input_text",text:`Business context:\n${JSON.stringify(input)}`}]}],text:{format:{type:"json_schema",name:"ceo_business_brief",strict:true,schema:responseSchema}}})}); if(!response.ok){const body=await response.text();if((response.status===429||response.status>=500)&&attempt<maxAttempts-1){await delay(400*2**attempt);continue;}throw new Error(`OpenAI Responses API failed (${response.status}): ${body.slice(0,300)}`);} const text=extractText(await response.json()); if(!text) throw new Error("OpenAI Responses API returned no text output"); return ceoBriefSchema.parse(JSON.parse(text)); } catch(error){if(attempt<maxAttempts-1){await delay(400*2**attempt);continue;}throw error;} finally {clearTimeout(timeout);} }
    throw new Error("OpenAI Responses API exhausted retries");
  }
}
