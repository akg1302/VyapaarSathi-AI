import { getRequestUserId } from "@/lib/api/auth";
import { errorResponse } from "@/lib/api/errors";
import { ok, noContent } from "@/lib/api/response";
import { userCreateSchema, userUpdateSchema } from "@/lib/validation/user";
import { UserService } from "@/services/user.service";
const service=new UserService();
export async function GET(request:Request){try{return ok(await service.get(getRequestUserId(request)))}catch(e){return errorResponse(e)}}
export async function POST(request:Request){try{return ok(await service.create(getRequestUserId(request),userCreateSchema.parse(await request.json())),201)}catch(e){return errorResponse(e)}}
export async function PATCH(request:Request){try{return ok(await service.update(getRequestUserId(request),userUpdateSchema.parse(await request.json())))}catch(e){return errorResponse(e)}}
export async function DELETE(request:Request){try{await service.delete(getRequestUserId(request));return noContent()}catch(e){return errorResponse(e)}}
