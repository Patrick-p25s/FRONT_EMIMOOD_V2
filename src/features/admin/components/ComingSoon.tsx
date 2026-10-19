// src/features/admin/components/ComingSoon.tsx
import { PageHeader } from "@/components/emimood/molecules/PageHeader";
import { EmptyState } from "@/components/emimood/molecules/states";

export function ComingSoon({ title }: { title: string }) {
  return (
    <>
      <PageHeader title={title} />
      <EmptyState
        title="Écran en construction"
        description="Cette page sera disponible prochainement."
      />
    </>
  );
}
