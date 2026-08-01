import { z } from "zod";
import { getRequestUserId } from "./auth";
import { errorResponse } from "./errors";
import { noContent, ok } from "./response";
import { idSchema, listQuerySchema } from "@/lib/validation/common";
import { partialSchemas, schemas, type ResourceInputMap } from "@/lib/validation/resources";
import type { ResourceName } from "@/types/domain";
import { getResourceService } from "@/services/service-factory";

const parseBody = async (request: Request) => { try { return await request.json(); } catch { throw new z.ZodError([{ code:"custom", path:[], message:"Request body must be valid JSON" }]); } };
export function createResourceHandlers<K extends ResourceName>(resource: K) { const service = () => getResourceService(resource); return { async list(request: Request) { try { const query = listQuerySchema.parse(Object.fromEntries(new URL(request.url).searchParams)); return ok(await service().list(getRequestUserId(request), query)); } catch (error) { return errorResponse(error); } }, async create(request: Request) { try { const input = schemas[resource].parse(await parseBody(request)) as ResourceInputMap[K]; return ok(await service().create(getRequestUserId(request), input), 201); } catch (error) { return errorResponse(error); } }, async get(request: Request, id: string) { try { return ok(await service().get(idSchema.parse(id), getRequestUserId(request))); } catch (error) { return errorResponse(error); } }, async update(request: Request, id: string) { try { const input = partialSchemas[resource].parse(await parseBody(request)) as Partial<ResourceInputMap[K]>; return ok(await service().update(idSchema.parse(id), getRequestUserId(request), input)); } catch (error) { return errorResponse(error); } }, async remove(request: Request, id: string) { try { await service().delete(idSchema.parse(id), getRequestUserId(request)); return noContent(); } catch (error) { return errorResponse(error); } } }; }
