import { AnalyticsAgent } from "@/agents/analytics-agent";
import { CustomerAgent } from "@/agents/customer-agent";
import { FinanceAgent } from "@/agents/finance-agent";
import { InventoryAgent } from "@/agents/inventory-agent";
import { ManagerAgent } from "@/agents/manager-agent";
import { ReminderAgent } from "@/agents/reminder-agent";
import type { AgentContext, BusinessReport } from "@/types/agent";
import { getResourceService } from "./service-factory";

export class AgentOrchestrator {
  async runBusiness(userId:string):Promise<BusinessReport>{
    const [products,customers,invoices,sales,expenses,reminders]=await Promise.all([getResourceService("products").list(userId),getResourceService("customers").list(userId),getResourceService("invoices").list(userId),getResourceService("sales").list(userId),getResourceService("expenses").list(userId),getResourceService("reminders").list(userId)]);
    const context:AgentContext={userId,products,customers,invoices,sales,expenses,reminders,now:new Date()};
    const execution=await new ManagerAgent([new InventoryAgent(),new FinanceAgent(),new CustomerAgent(),new ReminderAgent(),new AnalyticsAgent()]).execute(context);
    const report=execution.data;
    await Promise.all(report.agents.map(output=>getResourceService("agent_logs").create(userId,{action:`${output.agentName}_analysis`,input:{runAt:report.generatedAt},output:output as unknown as Record<string,unknown>,status:output.status==="failed"?"failed":"success",metadata:{confidence:output.confidence,executionTime:output.executionTime}})));
    await Promise.all([getResourceService("agent_logs").create(userId,{action:"business_report",input:{runAt:report.generatedAt},output:report as unknown as Record<string,unknown>,status:execution.status==="failed"?"failed":"success",metadata:{confidence:execution.confidence,executionTime:execution.executionTime,source:report.ceo.source}}),getResourceService("ceo_briefs").create(userId,{brief:report.ceo.ceoBrief,business_health_explanation:report.ceo.businessHealthExplanation,top_priorities:report.ceo.topPriorities,business_risks:report.ceo.businessRisks,growth_opportunities:report.ceo.growthOpportunities,suggested_next_actions:report.ceo.suggestedNextActions,source:report.ceo.source,model:report.ceo.model})]);
    return report;
  }
}
