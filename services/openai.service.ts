/**
 * Deliberate boundary for future AI features. This module does not import or call
 * OpenAI until an explicit product feature enables it.
 */
export interface BusinessInsightRequest { userId: string; prompt: string; context?: Record<string, unknown>; }
export interface BusinessInsightResult { message: string; provider: "disabled"; }
export class OpenAIService { async generateBusinessInsight(_request: BusinessInsightRequest): Promise<BusinessInsightResult> { return { provider: "disabled", message: "AI insights are not enabled yet." }; } }
