// hooks/usePublicationMutations.ts
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import {
  publicationsApi,
  type CreatePublicationInput,
  type UpdatePublicationInput,
} from "../api/publications";
import type { PublicationStatus } from "../api/types";
import { pubKeys } from "../keys";
import { errorMessage } from "../lib/errorMessage";

function useRefreshingMutation<TVars, TData>(fn: (vars: TVars) => Promise<TData>, success: string) {
  const client = useQueryClient();
  return useMutation({
    mutationFn: fn,
    onSuccess: async () => {
      await client.invalidateQueries({ queryKey: pubKeys.all });
      toast.success(success);
    },
    onError: (error) => toast.error(errorMessage(error)),
  });
}

export function usePublicationMutations() {
  const create = useRefreshingMutation(
    (input: CreatePublicationInput) => publicationsApi.create(input),
    "Publication créée",
  );
  const update = useRefreshingMutation(
    (v: { id: string; input: UpdatePublicationInput }) => publicationsApi.update(v.id, v.input),
    "Publication enregistrée",
  );
  const remove = useRefreshingMutation(
    (id: string) => publicationsApi.remove(id),
    "Publication supprimée",
  );
  const setStatus = useRefreshingMutation(
    (v: { id: string; status: PublicationStatus }) => publicationsApi.setStatus(v.id, v.status),
    "Statut mis à jour",
  );
  return { create, update, remove, setStatus };
}

/** Like : réponse immédiate dans la carte, pas de rechargement du fil. */
export const useLikeMutation = () =>
  useMutation({
    mutationFn: (v: { id: string; liked: boolean }) =>
      v.liked ? publicationsApi.unlike(v.id) : publicationsApi.like(v.id),
    onError: (error) => toast.error(errorMessage(error)),
  });

export function useAddComment(publicationId: string) {
  const client = useQueryClient();
  return useMutation({
    mutationFn: (content: string) => publicationsApi.addComment(publicationId, content),
    onSuccess: () => client.invalidateQueries({ queryKey: pubKeys.comments(publicationId) }),
    onError: (error) => toast.error(errorMessage(error)),
  });
}
