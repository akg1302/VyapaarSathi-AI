import type { AgentContext, AgentExecution, AgentRecommendation, BusinessAgent, BusinessReport, CEOBrief } from "@/types/agent";
import { OpenAIManagerService } from "@/services/openai-manager.service";

const priorityOrder={high:0,medium:1,low:2};
export class ManagerAgent implements BusinessAgent<BusinessReport> {
  readonly agentName="manager" as const;
  constructor(private agents: BusinessAgent[], private narrator=new OpenAIManagerService()) {}
  async execute(context:AgentContext):Promise<AgentExecution<BusinessReport>> {
    const start=Date.now(); const outputs:AgentExecution[]=[];
    for(const agent of this.agents){try{outputs.push(await agent.execute(context));}catch(error){outputs.push({agentName:agent.agentName,status:"failed",confidence:0,executionTime:0,reasoning:[error instanceof Error?error.message:"Agent execution failed"],recommendations:[],data:{}});}}
    const pick=(name:string)=>outputs.find(output=>output.agentName===name)?.data as Record<string,number>|undefined;
    const inventory=pick("inventory"),finance=pick("finance"),customer=pick("customer"),reminder=pick("reminder");
    const recommendations:AgentRecommendation[]=outputs.flatMap(output=>output.recommendations).sort((a,b)=>priorityOrder[a.priority]-priorityOrder[b.priority]).slice(0,10);
    const status=outputs.some(output=>output.status==="failed")?"partial" as const:"success" as const;
    const confidence=outputs.length?Number((outputs.reduce((sum,output)=>sum+output.confidence,0)/outputs.length).toFixed(2)):0;
    const metrics={totalProducts:inventory?.totalProducts??0,lowStockProducts:inventory?.lowStockCount??0,salesRevenue:finance?.salesRevenue??0,expenseTotal:finance?.expenseTotal??0,pendingInvoiceAmount:finance?.pendingInvoiceAmount??0,overdueInvoiceAmount:finance?.overdueInvoiceAmount??0,activeCustomers:customer?.activeCustomers??0,pendingReminders:reminder?.pendingCount??0};
    const deterministic:CEOBrief={ceoBrief:`Business scan complete: ${metrics.lowStockProducts} low-stock item(s), ₹${metrics.pendingInvoiceAmount.toLocaleString("en-IN")} pending payments, and ${metrics.pendingReminders} pending reminder(s).`,businessHealthExplanation:`Revenue is ₹${metrics.salesRevenue.toLocaleString("en-IN")} against ₹${metrics.expenseTotal.toLocaleString("en-IN")} tracked expenses. Inventory and collection signals require attention.`,topPriorities:recommendations.filter(item=>item.priority==="high").slice(0,5).map(item=>item.title),businessRisks:[...(metrics.lowStockProducts?[`${metrics.lowStockProducts} product(s) are low on stock`]:[]),...(metrics.overdueInvoiceAmount?[`₹${metrics.overdueInvoiceAmount.toLocaleString("en-IN")} is overdue`]:[])].slice(0,5),growthOpportunities:recommendations.filter(item=>item.priority!=="high").slice(0,5).map(item=>item.title),suggestedNextActions:recommendations.slice(0,5).map(item=>item.action??item.title),source:"deterministic",model:null};
    const ceo=await this.narrator.synthesize({metrics,agents:outputs,recommendations},deterministic);
    const report:BusinessReport={generatedAt:context.now.toISOString(),userId:context.userId,status,confidence,summary:ceo.ceoBrief,ceo,recommendations,agents:outputs,metrics};
    return {agentName:"manager",status,confidence,executionTime:Math.max(0,Date.now()-start),reasoning:["Ran inventory, finance, customer, reminder, and analytics agents sequentially.",`Synthesized their output with ${ceo.source==="openai"?"OpenAI Responses API":"deterministic fallback"}.`],recommendations,data:report};
  }
}
