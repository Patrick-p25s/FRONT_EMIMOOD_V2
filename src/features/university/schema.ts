// features/university/api/university.ts
import { z } from "zod";
import { api } from "@/lib/api/client";
import { parseResponse, safeId } from "@/lib/api/validate";

const universitySchema = z.object({
  id: z.string().uuid(),
  name: z.string(),
  code: z.string().nullish(),
  logo_url: z.string().nullish(),
});

export const universityApi = {
  get: async (id: string) =>
    parseResponse(universitySchema, await api<unknown>(`/universities/${safeId(id)}`)),
};
