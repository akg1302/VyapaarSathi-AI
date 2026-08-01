import { getRequestUserId } from "@/lib/api/auth";
import { errorResponse } from "@/lib/api/errors";
import { ok } from "@/lib/api/response";
import { GrowthAdvisorService } from "@/services/growth-advisor.service";
const service = new GrowthAdvisorService();
export async function GET(request:Request){try{return ok(await service.list(getRequestUserId(request)))}catch(error){return errorResponse(error)}}
export async function POST(request:Request){try{return ok(await service.run(getRequestUserId(request)),201)}catch(error){return errorResponse(error)}}
