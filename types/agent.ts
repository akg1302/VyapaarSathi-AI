import type { AgentLog, Customer, Expense, GrowthRecommendation, Invoice, Product, Reminder, Sale } from "./domain";

export type AgentName = "inventory" | "finance" | "customer" | "reminder" | "analytics" | "growth_advisor" | "manager";
export type AgentStatus = "success" | "partial" | "failed";
export interface AgentRecommendation { priority: "low" | "medium" | "high"; title: string; detail: string; action?: string; }
export interface AgentExecution<TData = unknown> { agentName: AgentName; status: AgentStatus; confidence: number; executionTime: number; reasoning: string[]; recommendations: AgentRecommendation[]; data: TData; }
export interface AgentContext { userId: string; products: Product[]; customers: Customer[]; invoices: Invoice[]; sales: Sale[]; expenses: Expense[]; reminders: Reminder[]; now: Date; }
export interface CEOBrief { ceoBrief: string; businessHealthExplanation: string; topPriorities: string[]; businessRisks: string[]; growthOpportunities: string[]; suggestedNextActions: string[]; source: "openai" | "deterministic"; model: string | null; }
export interface BusinessReport { generatedAt: string; userId: string; status: AgentStatus; confidence: number; summary: string; ceo: CEOBrief; recommendations: AgentRecommendation[]; agents: AgentExecution[]; metrics: { totalProducts: number; lowStockProducts: number; salesRevenue: number; expenseTotal: number; pendingInvoiceAmount: number; overdueInvoiceAmount: number; activeCustomers: number; pendingReminders: number; }; }
export type AgentLogInput = Pick<AgentLog, "action" | "input" | "output" | "status" | "metadata">;
export interface BusinessAgent<TData = unknown> { readonly agentName: AgentName; execute(context: AgentContext): Promise<AgentExecution<TData>>; }
export type GrowthRecommendationInput = Omit<GrowthRecommendation, "id" | "user_id" | "created_at" | "updated_at">;
export interface GrowthAdvisorReport { generatedAt: string; userId: string; salesRevenue: number; profit: number; customerCount: number; fastMovingProducts: { id: string; name: string; unitsSold: number }[]; slowMovingProducts: { id: string; name: string; quantity: number }[]; recommendations: GrowthRecommendationInput[]; }
