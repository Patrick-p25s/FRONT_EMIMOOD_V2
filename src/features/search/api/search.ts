// features/search/api/search.ts
import { api } from "@/lib/api/client";
import { parseRequest, parseResponse } from "@/lib/api/validate";
import { searchSchema, searchTerm } from "./schema";

export const searchApi = {
  all: async (q: string) =>
    parseResponse(
      searchSchema,
      await api<unknown>("/search", { query: { q: parseRequest(searchTerm, q) } }),
    ),
};
