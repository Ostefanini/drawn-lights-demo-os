import * as z from "zod";

export const tagSchema = z.string().min(1);

export type Tag = z.infer<typeof tagSchema>;