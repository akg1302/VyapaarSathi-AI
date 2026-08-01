import type { BaseEntity, ID } from "@/types/domain";
export interface ListOptions { limit?: number; offset?: number; orderBy?: string; ascending?: boolean; }
export interface Repository<TEntity extends BaseEntity, TCreate, TUpdate> { list(userId: ID, options?: ListOptions): Promise<TEntity[]>; findById(id: ID, userId: ID): Promise<TEntity | null>; create(userId: ID, input: TCreate): Promise<TEntity>; update(id: ID, userId: ID, input: TUpdate): Promise<TEntity | null>; delete(id: ID, userId: ID): Promise<boolean>; }
