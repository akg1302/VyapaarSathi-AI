import type { BaseEntity, ID } from "@/types/domain";
import type { ListOptions, Repository } from "./base.repository";

const id = () => crypto.randomUUID();
const now = () => new Date().toISOString();

export class MockRepository<
  TEntity extends BaseEntity,
  TCreate,
  TUpdate
> implements Repository<TEntity, TCreate, TUpdate> {
  constructor(private records: TEntity[]) {}

  async list(
    userId: ID,
    { limit = 100, offset = 0 }: ListOptions = {}
  ) {
    return this.records
      .filter((x) => x.user_id === userId)
      .slice(offset, offset + limit);
  }

  async findById(recordId: ID, userId: ID) {
    return (
      this.records.find(
        (x) => x.id === recordId && x.user_id === userId
      ) ?? null
    );
  }

  async create(userId: ID, input: TCreate) {
    const entity = {
      ...(input as object),
      id: id(),
      user_id: userId,
      created_at: now(),
      updated_at: now(),
    } as unknown as TEntity;

    this.records.push(entity);

    return entity;
  }

  async update(
    recordId: ID,
    userId: ID,
    input: TUpdate
  ) {
    const index = this.records.findIndex(
      (x) => x.id === recordId && x.user_id === userId
    );

    if (index < 0) return null;

    this.records[index] = {
      ...this.records[index],
      ...(input as object),
      updated_at: now(),
    };

    return this.records[index];
  }

  async delete(recordId: ID, userId: ID) {
    const index = this.records.findIndex(
      (x) => x.id === recordId && x.user_id === userId
    );

    if (index < 0) return false;

    this.records.splice(index, 1);

    return true;
  }
}