import { createSupabaseServerClient } from "@/lib/supabase/server";
import { mockData } from "@/lib/mock-data";
import type { EntityMap, ResourceName } from "@/types/domain";
import type { ResourceInputMap } from "@/lib/validation/resources";
import { MockRepository } from "@/repositories/mock.repository";
import { SupabaseRepository } from "@/repositories/supabase.repository";
import { ResourceService } from "./resource.service";
export function getResourceService<K extends ResourceName>(resource: K) { const useMocks = process.env.USE_MOCK_DATA === "true" || !process.env.NEXT_PUBLIC_SUPABASE_URL; const repository = useMocks ? new MockRepository<EntityMap[K], ResourceInputMap[K], Partial<ResourceInputMap[K]>>(mockData[resource]) : new SupabaseRepository<EntityMap[K], ResourceInputMap[K], Partial<ResourceInputMap[K]>>(createSupabaseServerClient(), resource); return new ResourceService(repository, resource.slice(0, -1)); }
