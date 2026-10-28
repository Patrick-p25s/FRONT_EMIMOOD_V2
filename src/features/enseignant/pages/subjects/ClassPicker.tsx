import { ErrorState } from "@/components/emimood/molecules/states";
import { Skeleton } from "@/components/ui/skeleton";
import type { ClassChoice } from "../../api/types";

type ClassPickerProps = {
  options: ClassChoice[];
  selected: string[];
  onToggle: (id: string) => void;
  loading: boolean;
  error: unknown;
  onRetry: () => void;
  emptyText: string;
};

export function ClassPicker({
  options,
  selected,
  onToggle,
  loading,
  error,
  onRetry,
  emptyText,
}: ClassPickerProps) {
  if (error) return <ErrorState error={error} onRetry={onRetry} />;
  if (loading) return <Skeleton className="h-28 w-full" />;
  if (options.length === 0)
    return (
      <p className="rounded-lg border border-dashed p-4 text-center text-sm text-muted-foreground">
        {emptyText}
      </p>
    );

  const groups: Record<string, ClassChoice[]> = {};
  options.forEach((option) => {
    (groups[option.academic_year_name] ??= []).push(option);
  });

  return (
    <div className="grid max-h-56 gap-3 overflow-y-auto rounded-lg border p-3">
      {Object.entries(groups).map(([year, list]) => (
        <fieldset key={year}>
          <legend className="mb-1 text-xs font-semibold text-muted-foreground">{year}</legend>
          {list.map((option) => (
            <label
              key={option.id}
              className="flex cursor-pointer items-center gap-2 rounded-md px-2 py-1.5 text-sm hover:bg-muted"
            >
              <input
                type="checkbox"
                checked={selected.includes(option.id)}
                onChange={() => onToggle(option.id)}
              />
              <span className="flex-1">{option.name}</span>
              <span className="text-xs text-muted-foreground">{option.code}</span>
            </label>
          ))}
        </fieldset>
      ))}
    </div>
  );
}
