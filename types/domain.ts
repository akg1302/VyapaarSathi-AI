export type ID = string;
export type ISODate = string;

export interface BaseEntity { id: ID; user_id: ID; created_at: ISODate; updated_at: ISODate; }
export interface User extends Omit<BaseEntity, "user_id"> { email: string; full_name: string | null; business_name: string | null; phone: string | null; }
export interface Product extends BaseEntity { name: string; sku: string | null; category: string | null; unit: string; quantity: number; reorder_level: number; cost_price: number; selling_price: number; status: "in_stock" | "low_stock" | "out_of_stock"; }
export interface Customer extends BaseEntity { name: string; email: string | null; phone: string | null; address: string | null; gstin: string | null; }
export interface Invoice extends BaseEntity { invoice_number: string; customer_id: ID | null; issue_date: ISODate; due_date: ISODate | null; subtotal: number; tax_amount: number; total_amount: number; status: "draft" | "sent" | "paid" | "overdue" | "cancelled"; notes: string | null; }
export interface Sale extends BaseEntity { invoice_id: ID | null; product_id: ID | null; customer_id: ID | null; quantity: number; unit_price: number; total_amount: number; sale_date: ISODate; }
export interface Expense extends BaseEntity { title: string; category: string; amount: number; expense_date: ISODate; payment_method: string | null; notes: string | null; }
export interface Reminder extends BaseEntity { title: string; description: string | null; due_at: ISODate; status: "pending" | "completed" | "dismissed"; priority: "low" | "medium" | "high"; }
export interface AgentLog extends BaseEntity { action: string; input: Record<string, unknown> | null; output: Record<string, unknown> | null; status: "pending" | "success" | "failed"; metadata: Record<string, unknown> | null; }
export interface GrowthRecommendation extends BaseEntity { kind: "revenue_opportunity" | "cross_sell" | "upsell" | "bundle" | "seasonal" | "slow_moving" | "fast_moving"; title: string; description: string; estimated_revenue_increase: number; confidence: number; priority: "low" | "medium" | "high"; related_product_ids: ID[]; status: "active" | "dismissed" | "acted"; }
export type AIAction = "generate_supplier_purchase_order" | "generate_whatsapp_reminder" | "generate_customer_follow_up" | "generate_inventory_restock_plan" | "generate_weekly_sales_report" | "generate_gst_checklist";
export interface ActionTask extends BaseEntity { recommendation_id: ID | null; action: AIAction; title: string; impact: string; confidence: number; estimated_revenue: number; priority: "low" | "medium" | "high"; status: "ready" | "running" | "completed" | "failed"; result: Record<string, unknown> | null; }
export interface CEOBriefRecord extends BaseEntity { brief: string; business_health_explanation: string; top_priorities: string[]; business_risks: string[]; growth_opportunities: string[]; suggested_next_actions: string[]; source: "openai" | "deterministic"; model: string | null; }

export type ResourceName = "products" | "customers" | "invoices" | "sales" | "expenses" | "reminders" | "agent_logs" | "growth_recommendations" | "action_tasks" | "ceo_briefs";
export type EntityMap = { products: Product; customers: Customer; invoices: Invoice; sales: Sale; expenses: Expense; reminders: Reminder; agent_logs: AgentLog; growth_recommendations: GrowthRecommendation; action_tasks: ActionTask; ceo_briefs: CEOBriefRecord; };
