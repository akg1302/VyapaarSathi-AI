import type { AgentExecution, AgentName, AgentRecommendation } from "@/types/agent";
export const elapsed = (start: number) => Math.max(0, Date.now() - start);
export function result<T>(agentName: AgentName, start: number, data: T, reasoning: string[], recommendations: AgentRecommendation[], confidence = 0.92): AgentExecution<T> { return { agentName, status: "success", confidence, executionTime: elapsed(start), reasoning, recommendations, data }; }
