import { getRequestUserId } from "@/lib/api/auth";
import { errorResponse } from "@/lib/api/errors";
import { ok } from "@/lib/api/response";
import { actionTaskCreateSchema } from "@/lib/validation/resources";
import { ActionCenterService } from "@/services/action-center.service";
const service=new ActionCenterService();
export async function GET(request:Request){try{return ok(await service.list(getRequestUserId(request)))}catch(error){return errorResponse(error)}}
export async function POST(request:Request){try{return ok(await service.create(getRequestUserId(request),actionTaskCreateSchema.parse(await request.json())),201)}catch(error){return errorResponse(error)}}
