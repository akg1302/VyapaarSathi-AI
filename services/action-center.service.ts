import type { AIAction, ActionTask } from "@/types/domain";
import type { ResourceInputMap } from "@/lib/validation/resources";
import { getResourceService } from "./service-factory";

const resultCopy: Record<AIAction, string> = {
  generate_supplier_purchase_order:"Supplier purchase order draft generated and ready for review.", generate_whatsapp_reminder:"WhatsApp payment reminder draft generated and queued for approval.", generate_customer_follow_up:"Customer follow-up message generated and ready to send.", generate_inventory_restock_plan:"Inventory restock plan generated with suggested reorder quantities.", generate_weekly_sales_report:"Weekly sales report generated with performance highlights.", generate_gst_checklist:"GST compliance checklist generated for this reporting period."
};
export class ActionCenterService {
  list(userId:string){ return getResourceService("action_tasks").list(userId); }
  create(userId:string, task: ResourceInputMap["action_tasks"]){ return getResourceService("action_tasks").create(userId,task); }
  async execute(userId:string,id:string){ const tasks=getResourceService("action_tasks"); const task=await tasks.get(id,userId); if(task.status === "completed") return task; const result={message:resultCopy[task.action],completedAt:new Date().toISOString(),simulated:true}; const completed=await tasks.update(id,userId,{status:"completed",result}); await getResourceService("agent_logs").create(userId,{action:`action_task:${task.action}`,input:{taskId:id,title:task.title},output:result,status:"success",metadata:{taskId:id,simulated:true}}); return completed; }
}
