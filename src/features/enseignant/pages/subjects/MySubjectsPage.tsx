import { useState } from "react";
import { Plus } from "lucide-react";
import { PageHeader } from "@/components/emimood/molecules/PageHeader";
import { EmptyState, ErrorState } from "@/components/emimood/molecules/states";
import { ConfirmDialog } from "@/components/emimood/organisms/dialogs";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Skeleton } from "@/components/ui/skeleton";
import type { MyAssignment, MySubject } from "../../api/types";
import { useMySubjects } from "../../hooks/useMySubjects";
import { useSubjectMutations } from "../../hooks/useSubjectMutations";
import { AddClassesForm } from "./AddClassesForm";
import { SubjectCard } from "./SubjectCard";
import { SubjectForm } from "./SubjectForm";

const plural = (count: number, one: string, many: string) => `${count} ${count > 1 ? many : one}`;

export function MySubjectsPage() {
  const { data, isLoading, error, refetch } = useMySubjects();
  const { remove, removeClass } = useSubjectMutations();
  const [creating, setCreating] = useState(false);
  const [editing, setEditing] = useState<MySubject | null>(null);
  const [adding, setAdding] = useState<MySubject | null>(null);
  const [deleting, setDeleting] = useState<MySubject | null>(null);
  const [unlinking, setUnlinking] = useState<{ item: MySubject; assignment: MyAssignment } | null>(
    null,
  );

  const subjects = data ?? [];
  const classCount = subjects.reduce((total, item) => total + item.classes.length, 0);

  return (
    <>
      <PageHeader
        title="Mes matières"
        description={
          data && subjects.length > 0
            ? `${plural(subjects.length, "matière", "matières")} · ${plural(classCount, "classe", "classes")}`
            : "Les matières que vous enseignez, avec leurs classes."
        }
        actions={
          <Button onClick={() => setCreating(true)}>
            <Plus className="size-4" aria-hidden /> Nouvelle matière
          </Button>
        }
      />

      {error ? (
        <ErrorState error={error} onRetry={() => void refetch()} />
      ) : isLoading ? (
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {Array.from({ length: 3 }, (_, index) => (
            <Skeleton key={index} className="h-42 w-full rounded-xl" />
          ))}
        </div>
      ) : subjects.length === 0 ? (
        <EmptyState
          title="Vous n’avez pas encore de matière"
          description="Créez votre première matière et choisissez les classes où vous l’enseignez. Vous pourrez ensuite y publier cours et évaluations."
          action={<Button onClick={() => setCreating(true)}>Créer ma première matière</Button>}
        />
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {subjects.map((item) => (
            <SubjectCard
              key={item.subject.id}
              item={item}
              actions={
                item.is_owner
                  ? {
                      onEdit: () => setEditing(item),
                      onAddClasses: () => setAdding(item),
                      onDelete: () => setDeleting(item),
                      onRemoveClass: (assignment) => setUnlinking({ item, assignment }),
                    }
                  : undefined
              }
            />
          ))}
        </div>
      )}

      <Dialog open={creating} onOpenChange={setCreating}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Nouvelle matière</DialogTitle>
            <DialogDescription>
              Vous y serez affecté automatiquement pour chaque classe cochée.
            </DialogDescription>
          </DialogHeader>
          <SubjectForm onDone={() => setCreating(false)} />
        </DialogContent>
      </Dialog>

      <Dialog open={editing !== null} onOpenChange={(open) => !open && setEditing(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Modifier la matière</DialogTitle>
            <DialogDescription>Le code ne peut pas être modifié.</DialogDescription>
          </DialogHeader>
          {editing && (
            <SubjectForm
              key={editing.subject.id}
              subject={editing.subject}
              onDone={() => setEditing(null)}
            />
          )}
        </DialogContent>
      </Dialog>

      <Dialog open={adding !== null} onOpenChange={(open) => !open && setAdding(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {adding ? `Ajouter des classes à ${adding.subject.name}` : ""}
            </DialogTitle>
            <DialogDescription>Seules vos classes actives sont proposées.</DialogDescription>
          </DialogHeader>
          {adding && (
            <AddClassesForm key={adding.subject.id} item={adding} onDone={() => setAdding(null)} />
          )}
        </DialogContent>
      </Dialog>

      <ConfirmDialog
        open={deleting !== null}
        onOpenChange={(open) => !open && setDeleting(null)}
        title={deleting ? `Supprimer « ${deleting.subject.name} » ?` : ""}
        description="La suppression est refusée tant que la matière est encore liée à une classe : retirez d’abord ses classes."
        confirmLabel="Supprimer"
        destructive
        onConfirm={async () => {
          if (!deleting) return;
          try {
            await remove.mutateAsync(deleting.subject.id);
            setDeleting(null);
          } catch {
            // message déjà affiché par la mutation
          }
        }}
      />

      <ConfirmDialog
        open={unlinking !== null}
        onOpenChange={(open) => !open && setUnlinking(null)}
        title={unlinking ? `Retirer « ${unlinking.assignment.classe_name} » ?` : ""}
        description="La classe n’aura plus cette matière. Refusé par le serveur si elle contient déjà des cours ou des évaluations."
        confirmLabel="Retirer"
        destructive
        onConfirm={async () => {
          if (!unlinking) return;
          try {
            await removeClass.mutateAsync({
              id: unlinking.item.subject.id,
              classeId: unlinking.assignment.classe_id,
            });
            setUnlinking(null);
          } catch {
            // message déjà affiché par la mutation
          }
        }}
      />
    </>
  );
}
