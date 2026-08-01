import { GrowthAdvisorAgent } from "@/agents/growth-advisor-agent";
import type { AgentContext, GrowthAdvisorReport } from "@/types/agent";
import { getResourceService } from "./service-factory";

export class GrowthAdvisorService {
  async run(userId: string): Promise<GrowthAdvisorReport> {
    const [products, customers, invoices, sales, expenses, reminders] = await Promise.all([
      getResourceService("products").list(userId), getResourceService("customers").list(userId), getResourceService("invoices").list(userId),
      getResourceService("sales").list(userId), getResourceService("expenses").list(userId), getResourceService("reminders").list(userId)
    ]);
    const context: AgentContext = { userId, products, customers, invoices, sales, expenses, reminders, now: new Date() };
    const execution = await new GrowthAdvisorAgent().execute(context);
    const report = execution.data;
    await Promise.all(report.recommendations.map(recommendation => getResourceService("growth_recommendations").create(userId, recommendation)));
    await getResourceService("agent_logs").create(userId, { action:"growth_advisor_analysis",input:{ runAt:report.generatedAt },output:report as unknown as Record<string, unknown>,status:"success",metadata:{ confidence:execution.confidence,executionTime:execution.executionTime } });
    return report;
  }
  list(userId: string) { return getResourceService("growth_recommendations").list(userId); }
}
