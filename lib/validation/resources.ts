import { z } from "zod";
import { dateSchema, idSchema, moneySchema } from "./common";

const optionalText = z.string().trim().max(500).nullable().optional();

export const productCreateSchema = z.object({
  name: z.string().trim().min(1).max(160),
  sku: optionalText,
  category: optionalText,
  unit: z.string().trim().min(1).max(30).default("unit"),
  quantity: z.number().int().nonnegative().default(0),
  reorder_level: z.number().int().nonnegative().default(0),
  cost_price: moneySchema,
  selling_price: moneySchema,
  status: z
    .enum(["in_stock", "low_stock", "out_of_stock"])
    .default("in_stock"),
});

export const customerCreateSchema = z.object({
  name: z.string().trim().min(1).max(160),
  email: z.string().email().nullable().optional(),
  phone: z.string().trim().max(20).nullable().optional(),
  address: optionalText,
  gstin: z.string().trim().max(15).nullable().optional(),
});

export const invoiceCreateSchema = z.object({
  invoice_number: z.string().trim().min(1).max(50),
  customer_id: idSchema.nullable().optional(),
  issue_date: dateSchema,
  due_date: dateSchema.nullable().optional(),
  subtotal: moneySchema,
  tax_amount: moneySchema.default(0),
  total_amount: moneySchema,
  status: z
    .enum(["draft", "sent", "paid", "overdue", "cancelled"])
    .default("draft"),
  notes: optionalText,
});

export const saleCreateSchema = z.object({
  invoice_id: idSchema.nullable().optional(),
  product_id: idSchema.nullable().optional(),
  customer_id: idSchema.nullable().optional(),
  quantity: z.number().positive(),
  unit_price: moneySchema,
  total_amount: moneySchema,
  sale_date: dateSchema,
});

export const expenseCreateSchema = z.object({
  title: z.string().trim().min(1).max(160),
  category: z.string().trim().min(1).max(80),
  amount: moneySchema,
  expense_date: dateSchema,
  payment_method: optionalText,
  notes: optionalText,
});

export const reminderCreateSchema = z.object({
  title: z.string().trim().min(1).max(160),
  description: optionalText,
  due_at: dateSchema,
  status: z
    .enum(["pending", "completed", "dismissed"])
    .default("pending"),
  priority: z.enum(["low", "medium", "high"]).default("medium"),
});

export const agentLogCreateSchema = z.object({
  action: z.string().trim().min(1).max(100),
  input: z.record(z.unknown()).nullable().optional(),
  output: z.record(z.unknown()).nullable().optional(),
  status: z.enum(["pending", "success", "failed"]).default("pending"),
  metadata: z.record(z.unknown()).nullable().optional(),
});

export const growthRecommendationCreateSchema = z.object({
  kind: z.enum([
    "revenue_opportunity",
    "cross_sell",
    "upsell",
    "bundle",
    "seasonal",
    "slow_moving",
    "fast_moving",
  ]),
  title: z.string().trim().min(1).max(180),
  description: z.string().trim().min(1).max(1000),
  estimated_revenue_increase: moneySchema,
  confidence: z.number().min(0).max(1),
  priority: z.enum(["low", "medium", "high"]),
  related_product_ids: z.array(idSchema).default([]),
  status: z.enum(["active", "dismissed", "acted"]).default("active"),
});

export const actionTaskCreateSchema = z.object({
  recommendation_id: idSchema.nullable().optional(),
  action: z.enum([
    "generate_supplier_purchase_order",
    "generate_whatsapp_reminder",
    "generate_customer_follow_up",
    "generate_inventory_restock_plan",
    "generate_weekly_sales_report",
    "generate_gst_checklist",
  ]),
  title: z.string().trim().min(1).max(180),
  impact: z.string().trim().min(1).max(500),
  confidence: z.number().min(0).max(1),
  estimated_revenue: moneySchema,
  priority: z.enum(["low", "medium", "high"]),
  status: z.enum(["ready", "running", "completed", "failed"]).default("ready"),
  result: z.record(z.unknown()).nullable().optional(),
});

export const ceoBriefCreateSchema = z.object({
  brief: z.string().min(1).max(1000),
  business_health_explanation: z.string().min(1).max(1500),
  top_priorities: z.array(z.string()).max(5),
  business_risks: z.array(z.string()).max(5),
  growth_opportunities: z.array(z.string()).max(5),
  suggested_next_actions: z.array(z.string()).max(5),
  source: z.enum(["openai", "deterministic"]),
  model: z.string().nullable().optional(),
});

export const schemas = {
  products: productCreateSchema,
  customers: customerCreateSchema,
  invoices: invoiceCreateSchema,
  sales: saleCreateSchema,
  expenses: expenseCreateSchema,
  reminders: reminderCreateSchema,
  agent_logs: agentLogCreateSchema,
  growth_recommendations: growthRecommendationCreateSchema,
  action_tasks: actionTaskCreateSchema,
  ceo_briefs: ceoBriefCreateSchema,
};

export type ResourceInputMap = {
  [K in keyof typeof schemas]: z.infer<(typeof schemas)[K]>;
};

export const partialSchemas = {
  products: productCreateSchema.partial().refine(
    (input) => Object.keys(input).length > 0,
    "At least one field is required"
  ),

  customers: customerCreateSchema.partial().refine(
    (input) => Object.keys(input).length > 0,
    "At least one field is required"
  ),

  invoices: invoiceCreateSchema.partial().refine(
    (input) => Object.keys(input).length > 0,
    "At least one field is required"
  ),

  sales: saleCreateSchema.partial().refine(
    (input) => Object.keys(input).length > 0,
    "At least one field is required"
  ),

  expenses: expenseCreateSchema.partial().refine(
    (input) => Object.keys(input).length > 0,
    "At least one field is required"
  ),

  reminders: reminderCreateSchema.partial().refine(
    (input) => Object.keys(input).length > 0,
    "At least one field is required"
  ),

  agent_logs: agentLogCreateSchema.partial().refine(
    (input) => Object.keys(input).length > 0,
    "At least one field is required"
  ),

  growth_recommendations: growthRecommendationCreateSchema.partial().refine(
    (input) => Object.keys(input).length > 0,
    "At least one field is required"
  ),

  action_tasks: actionTaskCreateSchema.partial().refine(
    (input) => Object.keys(input).length > 0,
    "At least one field is required"
  ),

  ceo_briefs: ceoBriefCreateSchema.partial().refine(
    (input) => Object.keys(input).length > 0,
    "At least one field is required"
  ),
};