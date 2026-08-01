import { z } from "zod";
export const ceoBriefSchema = z.object({ ceoBrief:z.string().min(1).max(1000), businessHealthExplanation:z.string().min(1).max(1500), topPriorities:z.array(z.string().min(1).max(300)).min(1).max(5), businessRisks:z.array(z.string().min(1).max(300)).max(5), growthOpportunities:z.array(z.string().min(1).max(300)).max(5), suggestedNextActions:z.array(z.string().min(1).max(300)).min(1).max(5) });
export type CEOBriefPayload = z.infer<typeof ceoBriefSchema>;
