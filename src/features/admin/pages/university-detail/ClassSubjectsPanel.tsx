// pages/university-detail/ClassSubjectsPanel.tsx
import { useState } from "react";
import { X } from "lucide-react";
import { ErrorState } from "@/components/emimood/molecules/states";
import { StatusPill } from "@/components/emimood/atoms/StatusPill";
import { ConfirmDialog } from "@/components/emimood/organisms/dialogs";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import type { Classe, ClassSubject } from "../../api/types";
import {
  useAssignments,
  useClassSubjectMutations,
  useClassSubjects,
  useUniversitySubjects,
  useUniversityTeachers,
} from "../../hooks/useClassSubjects";

const SELECT = "h-9 w-full rounded-md border bg-background px-3 text-sm";
const SEMESTERS = Array.from({ length: 12 }, (_, index) => index + 1);

type TeacherOption = {
  id: string;
  name?: string | null | undefined;
  email?: string | null | undefined;
};
const teacherLabel = (teacher: TeacherOption) => teacher.name ?? teacher.email ?? "Sans nom";

function ClassSubjectRow({ item, teachers }: { item: ClassSubject; teachers: TeacherOption[] }) {
  const { data: assignments, isLoading } = useAssignments(item.id);
  const { remove, assign, unassign } = useClassSubjectMutations();
  const [teacherId, setTeacherId] = useState("");
  const [confirming, setConfirming] = useState(false);

  const assigned = assignments ?? [];
  const assignedIds = new Set(assigned.map((assignment) => assignment.teacher_id));
  const options = teachers.filter((teacher) => !assignedIds.has(teacher.id));
  const nameOf = (id: string) => {
    const teacher = teachers.find((candidate) => candidate.id === id);
    return teacher ? teacherLabel(teacher) : "Enseignant inconnu";
  };

  const onAssign = async () => {
    if (!teacherId) return;
    try {
      await assign.mutateAsync({ teacher_id: teacherId, class_subject_id: item.id });
      setTeacherId("");
    } catch {
      // message déjà affiché par la mutation
    }
  };

  return (
    <li className="grid gap-3 rounded-lg border p-3">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="truncate text-sm font-semibold">
            {item.subject.name}
            {item.subject.code ? (
              <span className="ml-2 font-normal text-muted-foreground">{item.subject.code}</span>
            ) : null}
          </p>
          {item.semester && <StatusPill className="mt-1">Semestre {item.semester}</StatusPill>}
        </div>
        <Button variant="ghost" size="sm" onClick={() => setConfirming(true)}>
          Retirer la matière
        </Button>
      </div>

      {isLoading ? (
        <Skeleton className="h-6 w-40" />
      ) : assigned.length === 0 ? (
        <p className="text-xs text-muted-foreground">Aucun enseignant affecté.</p>
      ) : (
        <ul className="flex flex-wrap gap-2">
          {assigned.map((assignment) => (
            <li
              key={assignment.id}
              className="inline-flex items-center gap-1 rounded-full bg-muted py-1 pr-1 pl-3 text-xs"
            >
              {nameOf(assignment.teacher_id)}
              <button
                type="button"
                aria-label={`Retirer ${nameOf(assignment.teacher_id)}`}
                className="grid size-5 place-items-center rounded-full hover:bg-background"
                onClick={() => unassign.mutate(assignment.id)}
              >
                <X className="size-3" aria-hidden />
              </button>
            </li>
          ))}
        </ul>
      )}

      <div className="flex gap-2">
        <select
          className={SELECT}
          value={teacherId}
          onChange={(event) => setTeacherId(event.target.value)}
          aria-label="Enseignant à affecter"
        >
          <option value="">
            {options.length ? "Choisir un enseignant…" : "Aucun enseignant disponible"}
          </option>
          {options.map((teacher) => (
            <option key={teacher.id} value={teacher.id}>
              {teacherLabel(teacher)}
            </option>
          ))}
        </select>
        <Button
          variant="outline"
          disabled={!teacherId || assign.isPending}
          onClick={() => void onAssign()}
        >
          Affecter
        </Button>
      </div>

      <ConfirmDialog
        open={confirming}
        onOpenChange={setConfirming}
        title={`Retirer « ${item.subject.name} » de la classe ?`}
        description="La matière et ses affectations d’enseignants seront retirées de cette classe."
        confirmLabel="Retirer"
        destructive
        onConfirm={async () => {
          try {
            await remove.mutateAsync(item.id);
            setConfirming(false);
          } catch {
            // message déjà affiché par la mutation
          }
        }}
      />
    </li>
  );
}

export function ClassSubjectsPanel({
  classe,
  universityId,
}: {
  classe: Classe;
  universityId: string;
}) {
  const classSubjects = useClassSubjects(classe.id);
  const catalog = useUniversitySubjects(universityId);
  const teachers = useUniversityTeachers(universityId);
  const { add } = useClassSubjectMutations();
  const [subjectId, setSubjectId] = useState("");
  const [semester, setSemester] = useState("");

  const items = classSubjects.data ?? [];
  const taken = new Set(items.map((item) => item.subject_id));
  const available = (catalog.data ?? []).filter((subject) => !taken.has(subject.id));

  const onAdd = async () => {
    if (!subjectId) return;
    try {
      await add.mutateAsync({
        classe_id: classe.id,
        subject_id: subjectId,
        ...(semester ? { semester: Number(semester) } : {}),
      });
      setSubjectId("");
      setSemester("");
    } catch {
      // message déjà affiché par la mutation
    }
  };

  return (
    <div className="grid max-h-[65vh] gap-4 overflow-y-auto pr-1">
      <div className="grid gap-2 rounded-lg bg-muted/40 p-3 sm:grid-cols-[1fr_9rem_auto]">
        <select
          className={SELECT}
          value={subjectId}
          onChange={(event) => setSubjectId(event.target.value)}
          aria-label="Matière à ajouter"
        >
          <option value="">
            {available.length ? "Choisir une matière…" : "Aucune matière à ajouter"}
          </option>
          {available.map((subject) => (
            <option key={subject.id} value={subject.id}>
              {subject.name}
            </option>
          ))}
        </select>
        <select
          className={SELECT}
          value={semester}
          onChange={(event) => setSemester(event.target.value)}
          aria-label="Semestre"
        >
          <option value="">Semestre —</option>
          {SEMESTERS.map((value) => (
            <option key={value} value={value}>
              Semestre {value}
            </option>
          ))}
        </select>
        <Button disabled={!subjectId || add.isPending} onClick={() => void onAdd()}>
          Ajouter
        </Button>
      </div>

      {classSubjects.error ? (
        <ErrorState error={classSubjects.error} onRetry={() => void classSubjects.refetch()} />
      ) : classSubjects.isLoading ? (
        <Skeleton className="h-24 w-full" />
      ) : items.length === 0 ? (
        <p className="py-6 text-center text-sm text-muted-foreground">
          Aucune matière dans cette classe pour le moment.
        </p>
      ) : (
        <ul className="grid gap-3">
          {items.map((item) => (
            <ClassSubjectRow key={item.id} item={item} teachers={teachers.data ?? []} />
          ))}
        </ul>
      )}
    </div>
  );
}
