import { getRequestUserId } from "@/lib/api/auth";
import { errorResponse } from "@/lib/api/errors";
import { ok } from "@/lib/api/response";
import { AgentOrchestrator } from "@/services/agent-orchestrator";
export async function POST(request:Request){try{return ok(await new AgentOrchestrator().runBusiness(getRequestUserId(request)))}catch(error){return errorResponse(error)}}
