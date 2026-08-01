import type { SupabaseClient } from "@supabase/supabase-js";
import type { BaseEntity, ID } from "@/types/domain";
import type { ListOptions, Repository } from "./base.repository";

export class SupabaseRepository<
  TEntity extends BaseEntity,
  TCreate,
  TUpdate
> implements Repository<TEntity, TCreate, TUpdate> {
  constructor(
    private client: SupabaseClient,
    private table: string
  ) {}

  async list(
    userId: ID,
    options: ListOptions = {}
  ) {
    const {
      limit = 100,
      offset = 0,
      orderBy = "created_at",
      ascending = false,
    } = options;

    const { data, error } = await this.client
      .from(this.table)
      .select("*")
      .eq("user_id", userId)
      .order(orderBy, { ascending })
      .range(offset, offset + limit - 1);

    if (error) throw error;

    return data as TEntity[];
  }

  async findById(id: ID, userId: ID) {
    const { data, error } = await this.client
      .from(this.table)
      .select("*")
      .eq("id", id)
      .eq("user_id", userId)
      .maybeSingle();

    if (error) throw error;

    return data as TEntity | null;
  }

  async create(userId: ID, input: TCreate) {
    const { data, error } = await this.client
      .from(this.table)
      .insert({
        ...(input as object),
        user_id: userId,
      } as Record<string, unknown>)
      .select()
      .single();

    if (error) throw error;

    return data as TEntity;
  }

  async update(
    id: ID,
    userId: ID,
    input: TUpdate
  ) {
    const { data, error } = await this.client
      .from(this.table)
      .update(input as Record<string, unknown>)
      .eq("id", id)
      .eq("user_id", userId)
      .select()
      .maybeSingle();

    if (error) throw error;

    return data as TEntity | null;
  }

  async delete(id: ID, userId: ID) {
    const { error, count } = await this.client
      .from(this.table)
      .delete({ count: "exact" })
      .eq("id", id)
      .eq("user_id", userId);

    if (error) throw error;

    return Boolean(count);
  }
}