import { z } from "zod";

export const NCT_ID_PATTERN = /^NCT\d{8}$/;

export const NctIdSchema = z
  .string()
  .trim()
  .toUpperCase()
  .regex(NCT_ID_PATTERN, "NCT ID must be the letters NCT followed by 8 digits");

export function isValidNctId(value: string): boolean {
  return NctIdSchema.safeParse(value).success;
}
