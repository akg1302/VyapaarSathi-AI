import { createResourceHandlers } from "@/lib/api/resource-handlers"; const h=createResourceHandlers("sales"); export const GET=h.list; export const POST=h.create;
