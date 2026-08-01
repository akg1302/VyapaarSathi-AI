import { createResourceHandlers } from "@/lib/api/resource-handlers"; const h=createResourceHandlers("agent_logs"); export const GET=h.list; export const POST=h.create;
