// components/PeoplePicker.tsx : recherche d'un membre (un seul ou plusieurs)
import { useState } from "react";
import { Check, X } from "lucide-react";
import { roleLabel } from "@/features/profile/lib/labels";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { useAuth } from "@/lib/auth";
import { cn } from "@/lib/utils";
import type { Person } from "../api/schemas";
import { useDebounced, usePeopleSearch } from "../hooks/useMessaging";
import { UserAvatar } from "@/features/profile/componets/UserAvatar";

type PeoplePickerProps = {
  selected: Person[];
  onToggle: (person: Person) => void;
  multiple: boolean;
  excludeIds?: string[];
};

export function PeoplePicker({ selected, onToggle, multiple, excludeIds = [] }: PeoplePickerProps) {
  const { user } = useAuth();
  const [query, setQuery] = useState("");
  const debounced = useDebounced(query, 300);
  const search = usePeopleSearch(debounced);

  const hidden = new Set([...excludeIds, ...(user ? [user.id] : [])]);
  const results = (search.data ?? []).filter((person) => !hidden.has(person.id));

  return (
    <div className="grid gap-3">
      {multiple && selected.length > 0 && (
        <div className="flex flex-wrap gap-1.5">
          {selected.map((person) => (
            <button
              key={person.id}
              type="button"
              className="tag inline-flex items-center gap-1"
              aria-label={`Retirer ${person.name}`}
              onClick={() => onToggle(person)}
            >
              {person.name} <X size={12} aria-hidden />
            </button>
          ))}
        </div>
      )}
      <Input
        placeholder="Rechercher un nom…"
        aria-label="Rechercher une personne"
        maxLength={100}
        value={query}
        onChange={(event) => setQuery(event.target.value)}
      />
      <ul className="grid max-h-64 gap-1 overflow-y-auto">
        {debounced.trim().length < 2 ? (
          <li className="small p-2">Tapez au moins 2 caractères.</li>
        ) : search.isLoading ? (
          <Skeleton className="h-10 w-full" />
        ) : search.error ? (
          <li className="small p-2 text-destructive">
            La recherche est indisponible pour le moment.
          </li>
        ) : results.length === 0 ? (
          <li className="small p-2">Aucun résultat.</li>
        ) : (
          results.map((person) => {
            const isSelected = selected.some((item) => item.id === person.id);
            return (
              <li key={person.id}>
                <button
                  type="button"
                  aria-pressed={multiple ? isSelected : undefined}
                  onClick={() => onToggle(person)}
                  className={cn(
                    "flex w-full items-center gap-3 rounded-md p-2 text-left hover:bg-muted",
                    isSelected && "bg-muted",
                  )}
                >
                  <UserAvatar name={person.name} url={person.avatar_url} />
                  <span className="flex-1 truncate">{person.name}</span>
                  {person.role && <span className="small">{roleLabel(person.role)}</span>}
                  {isSelected && <Check size={16} aria-hidden />}
                </button>
              </li>
            );
          })
        )}
      </ul>
    </div>
  );
}
