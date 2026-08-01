import type { AgentContext, GrowthAdvisorReport, GrowthRecommendationInput } from "@/types/agent";
import type { BusinessAgent } from "@/types/agent";
import { result } from "./agent-utils";

export class GrowthAdvisorAgent implements BusinessAgent<GrowthAdvisorReport> {
  readonly agentName = "growth_advisor" as const;
  async execute(context: AgentContext) {
    const start = Date.now();
    const revenue = context.sales.reduce((total, sale) => total + sale.total_amount, 0);
    const expenses = context.expenses.reduce((total, expense) => total + expense.amount, 0);
    const unitsByProduct = new Map<string, number>();
    for (const sale of context.sales) if (sale.product_id) unitsByProduct.set(sale.product_id, (unitsByProduct.get(sale.product_id) ?? 0) + sale.quantity);
    const ranked = [...unitsByProduct.entries()].sort((a, b) => b[1] - a[1]);
    const fastMovingProducts = ranked.slice(0, 3).map(([id, unitsSold]) => ({ id, name: context.products.find(product => product.id === id)?.name ?? "Unknown product", unitsSold }));
    const slowMovingProducts = context.products.filter(product => !unitsByProduct.has(product.id) && product.quantity > 0).map(product => ({ id: product.id, name: product.name, quantity: product.quantity }));
    const recommendations: GrowthRecommendationInput[] = [];
    const fast = fastMovingProducts[0];
    const slow = slowMovingProducts[0];
    const fastProduct = fast ? context.products.find(product => product.id === fast.id) : undefined;
    if (fast && fastProduct) recommendations.push({ kind:"fast_moving",title:`Scale ${fast.name}`,description:`${fast.unitsSold} units have sold in the tracked period. Keep availability high and feature it prominently.`,estimated_revenue_increase:Math.round(fastProduct.selling_price * Math.max(2, fast.unitsSold * .15)),confidence:.91,priority:"high",related_product_ids:[fast.id],status:"active" });
    if (fastProduct) recommendations.push({ kind:"upsell",title:`Upsell premium quantities of ${fastProduct.name}`,description:"Offer a larger pack or quantity discount at checkout to lift average order value.",estimated_revenue_increase:Math.round(fastProduct.selling_price * Math.max(2, fast?.unitsSold ?? 1) * .1),confidence:.82,priority:"medium",related_product_ids:[fastProduct.id],status:"active" });
    if (fastProduct && slow) recommendations.push({ kind:"bundle",title:`Bundle ${fastProduct.name} with ${slow.name}`,description:`Pair your fast mover with the slow-moving item to improve turnover without a standalone discount.`,estimated_revenue_increase:Math.round((fastProduct.selling_price + context.products.find(product => product.id === slow.id)!.selling_price) * 3),confidence:.84,priority:"medium",related_product_ids:[fastProduct.id,slow.id],status:"active" });
    if (slow) recommendations.push({ kind:"slow_moving",title:`Move ${slow.name} with a limited offer`,description:`No tracked sales were found while ${slow.quantity} units remain in stock. Create a time-bound offer or include it in a bundle.`,estimated_revenue_increase:Math.round(context.products.find(product => product.id === slow.id)!.selling_price * Math.min(slow.quantity, 5)),confidence:.89,priority:"high",related_product_ids:[slow.id],status:"active" });
    const month = context.now.getMonth();
    const season = month >= 5 && month <= 8 ? "monsoon" : month >= 9 && month <= 10 ? "festive" : "seasonal";
    recommendations.push({ kind:"seasonal",title:`Launch a ${season} customer offer`,description:`Use a simple multi-buy or returning-customer offer to create demand during the current seasonal window.`,estimated_revenue_increase:Math.round(Math.max(revenue, context.products.reduce((sum, product) => sum + product.selling_price, 0)) * .08),confidence:.74,priority:"low",related_product_ids:fastProduct?[fastProduct.id]:[],status:"active" });
    if (context.customers.length) recommendations.push({ kind:"cross_sell",title:"Cross-sell to your active customers",description:`Build a targeted follow-up for ${context.customers.length} customer record(s), recommending complementary products after their next purchase.`,estimated_revenue_increase:Math.round(Math.max(revenue, 1000) * .06),confidence:.79,priority:"medium",related_product_ids:fastProduct?[fastProduct.id]:[],status:"active" });
    const report: GrowthAdvisorReport = { generatedAt:context.now.toISOString(),userId:context.userId,salesRevenue:revenue,profit:revenue-expenses,customerCount:context.customers.length,fastMovingProducts,slowMovingProducts,recommendations };
    return result("growth_advisor",start,report,[`Analyzed ₹${revenue.toLocaleString("en-IN")} in tracked sales, ${context.customers.length} customers, and ${context.products.length} products.`,`${fastMovingProducts.length} fast-moving and ${slowMovingProducts.length} slow-moving products were identified.`],recommendations.map(recommendation => ({priority:recommendation.priority,title:recommendation.title,detail:recommendation.description,action:"View recommendation"})),.87);
  }
}
