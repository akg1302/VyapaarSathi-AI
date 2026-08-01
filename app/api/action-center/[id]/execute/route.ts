import { getRequestUserId } from "@/lib/api/auth";
import { errorResponse } from "@/lib/api/errors";
import { ok } from "@/lib/api/response";
import { idSchema } from "@/lib/validation/common";
import { ActionCenterService } from "@/services/action-center.service";
export async function POST(request:Request,{params}:{params:Promise<{id:string}>}){try{return ok(await new ActionCenterService().execute(getRequestUserId(request),idSchema.parse((await params).id)))}catch(error){return errorResponse(error)}}
