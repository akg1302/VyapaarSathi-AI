import { z } from "zod";
export const idSchema = z.string().uuid();
export const dateSchema = z.string().datetime();
export const moneySchema = z.number().finite().nonnegative();
export const listQuerySchema = z.object({ limit: z.coerce.number().int().min(1).max(100).default(50), offset: z.coerce.number().int().min(0).default(0) });
