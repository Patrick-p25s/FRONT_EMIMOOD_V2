// hooks/useTeacherMutation.ts : toast et rafraîchissement, comme useAdminMutation
import { useMutation, useQueryClient, type QueryKey } from "@tanstack/react-query";
import { toast } from "sonner";
import { ApiError } from "@/lib/api/client";

export function useTeacherMutation<V, R = unknown>(
  fn: (variables: V) => Promise<R>,
  invalidate: readonly QueryKey[],
  success?: string,
) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: fn,
    onSuccess: () => {
      invalidate.forEach((queryKey) => void queryClient.invalidateQueries({ queryKey }));
      if (success) toast.success(success);
    },
    onError: (error) => {
      toast.error(error instanceof ApiError ? error.detail : "Une erreur est survenue, réessayez");
    },
  });
}
