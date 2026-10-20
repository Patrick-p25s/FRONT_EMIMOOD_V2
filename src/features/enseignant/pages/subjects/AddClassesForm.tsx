// pages/subjects/AddClassesForm.tsx : classes pas encore liées à la matière
import { useState } from "react";
import { Button } from "@/components/ui/button";
import type { MySubject } from "../../api/types";
import { useAvailableClasses } from "../../hooks/useAvailableClasses";
import { useSubjectMutations } from "../../hooks/useSubjectMutations";
import { ClassPicker } from "./ClassPicker";

const SELECT = "h-9 w-full rounded-md border bg-background px-3 text-sm";
const SEMESTERS = Array.from({ length: 12 }, (_, index) => index + 1);

export function AddClassesForm({ item, onDone }: { item: MySubject; onDone: () => void }) {
  const classes = useAvailableClasses();
  const { addClasses } = useSubjectMutations();
  const [selected, setSelected] = useState<string[]>([]);
  const [semester, setSemester] = useState("");

  const linked = new Set(item.classes.map((assignment) => assignment.classe_id));
  const options = (classes.data ?? []).filter((option) => !linked.has(option.id));
  const toggle = (id: string) =>
    setSelected((current) =>
      current.includes(id) ? current.filter((value) => value !== id) : [...current, id],
    );

  const onSubmit = async () => {
    try {
      await addClasses.mutateAsync({
        id: item.subject.id,
        input: { classe_ids: selected, ...(semester ? { semester: Number(semester) } : {}) },
      });
      onDone();
    } catch {
      // message déjà affiché par la mutation
    }
  };

  return (
    <div className="grid gap-4">
      <ClassPicker
        options={options}
        selected={selected}
        onToggle={toggle}
        loading={classes.isLoading}
        error={classes.error}
        onRetry={() => void classes.refetch()}
        emptyText="Toutes vos classes disponibles sont déjà liées à cette matière."
      />
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
      <div className="flex justify-end gap-2">
        <Button variant="outline" onClick={onDone}>
          Annuler
        </Button>
        <Button
          disabled={selected.length === 0 || addClasses.isPending}
          onClick={() => void onSubmit()}
        >
          Ajouter
        </Button>
      </div>
    </div>
  );
}
