import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { profileApi } from "../api/profile";
import { profileKeys } from "../keys";
import { messageOf, retryPolicy } from "@/lib/api/message";

export const useAccount = () =>
  useQuery({ queryKey: profileKeys.account, queryFn: profileApi.account, retry: retryPolicy });
export const useMyProfile = () =>
  useQuery({ queryKey: profileKeys.me, queryFn: profileApi.myProfile, retry: retryPolicy });
export const usePublicProfile = (userId: string) =>
  useQuery({
    queryKey: profileKeys.of(userId),
    queryFn: () => profileApi.profile(userId),
    retry: retryPolicy,
  });

export function useProfileMutations() {
  const client = useQueryClient();
  const refresh = () => client.invalidateQueries({ queryKey: profileKeys.all });
  const onError = (error: unknown) => toast.error(messageOf(error));

  const update = useMutation({
    mutationFn: profileApi.updateAccount,
    onSuccess: async () => {
      await refresh();
      toast.success("Profil enregistré");
    },
    onError,
  });
  const upload = useMutation({
    mutationFn: profileApi.uploadAvatar,
    onSuccess: async () => {
      await refresh();
      toast.success("Photo mise à jour");
    },
    onError,
  });
  const removeAvatar = useMutation({
    mutationFn: profileApi.deleteAvatar,
    onSuccess: async () => {
      await refresh();
      toast.success("Photo retirée");
    },
    onError,
  });
  // Les erreurs du mot de passe s'affichent dans le formulaire.
  const changePassword = useMutation({ mutationFn: profileApi.changePassword });

  return { update, upload, removeAvatar, changePassword };
}
