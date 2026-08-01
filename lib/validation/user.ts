import { z } from "zod";
export const userCreateSchema = z.object({ email:z.string().email(), full_name:z.string().trim().min(2).max(120).nullable().optional(), business_name:z.string().trim().max(160).nullable().optional(), phone:z.string().trim().max(20).nullable().optional() });
export const userUpdateSchema = userCreateSchema.omit({ email:true }).partial().refine(value => Object.keys(value).length > 0, "At least one field is required");
