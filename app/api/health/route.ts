import { ok } from "@/lib/api/response";
export const GET = () => ok({ status: "ok", timestamp: new Date().toISOString(), mockData: process.env.USE_MOCK_DATA === "true" || !process.env.NEXT_PUBLIC_SUPABASE_URL });
