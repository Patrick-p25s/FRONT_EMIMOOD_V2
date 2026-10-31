import { yearsApi } from "../api";
import { useAdminMutation } from "./useAdminList";

type CreateBody = Parameters<typeof yearsApi.create>[0];
type UpdateBody = Parameters<typeof yearsApi.update>[1];
export function useAcademicYearMutations() {
  const create = useAdminMutation(
    (body: CreateBody) => yearsApi.create(body),
    ["academic-years"],
    "Année créée",
  );
  const update = useAdminMutation(
    (v: { id: string; body: UpdateBody }) => yearsApi.update(v.id, v.body),
    ["academic-years"],
    "Année mise à jour",
  );
  const remove = useAdminMutation(
    (id: string) => yearsApi.remove(id),
    ["academic-years"],
    "Année suprimé",
  );
  const setCurrent = useAdminMutation(
    (id: string) => yearsApi.setCurrent(id),
    ["academic-years"],
    "Année mise à jour",
  );

  return { create, remove, update, setCurrent };
}
