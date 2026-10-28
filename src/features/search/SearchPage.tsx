// features/search/pages/SearchPage.tsx
import { useState } from "react";
import { Link } from "@tanstack/react-router";
import { ArrowRight, FileText, Search } from "lucide-react";
import { BookIcon } from "@/components/emimood/atoms/BookIcon";
import { Heading } from "@/components/emimood/molecules/Heading";
import { ErrorState } from "@/components/emimood/molecules/states";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { useSearch } from "./hooks/useSearch";
import { UserAvatar } from "../profile/componets/UserAvatar";
import { downloadFile } from "@/lib/api/download";
import { messageOf } from "../etudiant/lib/messages";
import { toast } from "sonner";

export function SearchPage({ q }: { q: string }) {
  const [input, setInput] = useState(q);
  const search = useSearch(input);
  const typed = input.trim().length >= 2;
  const courses = search.data?.courses?.items ?? [];
  const resources = search.data?.resources?.items ?? [];
  const people = search.data?.people?.items ?? [];
  const totals = {
    courses: search.data?.courses?.total ?? 0,
    resources: search.data?.resources?.total ?? 0,
    people: search.data?.people?.total ?? 0,
  };

  return (
    <div className="page">
      <Heading
        title="Recherche"
        subtitle="Trouvez votre prochaine ressource, un cours ou une personne."
      />
      <Input
        value={input}
        onChange={(event) => setInput(event.target.value)}
        placeholder="Rechercher dans EMIMood…"
        aria-label="Recherche"
        maxLength={100}
        className="mb-6 max-w-lg"
      />

      {!typed ? (
        <div className="empty">
          <Search className="mx-auto mb-4" />
          <p>Que souhaitez-vous trouver ? (2 caractères minimum)</p>
        </div>
      ) : search.error ? (
        <ErrorState error={search.error} onRetry={() => void search.refetch()} />
      ) : search.isLoading ? (
        <Skeleton className="h-24 w-full max-w-lg" />
      ) : (
        <>
          <h2 className="mb-4 text-lg font-semibold">Cours · {totals.courses}</h2>
          <div className="document-list mb-6">
            {courses.map((c) => (
              <Link key={c.id} to="/cours" className="document-row text-foreground no-underline">
                <BookIcon />
                <div>
                  <h2>{c.title}</h2>
                  {c.subtitle && <p className="small">{c.subtitle}</p>}
                </div>
                <ArrowRight size={17} className="ml-auto" />
              </Link>
            ))}
            {!courses.length && <p className="empty">Aucun cours trouvé.</p>}
          </div>

          <h2 className="mb-4 text-lg font-semibold">Ressources · {totals.resources}</h2>
          <div className="document-list mb-6">
            {resources.map((r) =>
              r.kind === "file" && r.documentId ? (
                <button
                  key={r.id}
                  type="button"
                  className="document-row w-full text-left text-foreground"
                  onClick={() =>
                    downloadFile(`/documents/${r.documentId}/download`, r.fileName).catch((error) =>
                      toast.error(messageOf(error)),
                    )
                  }
                >
                  <FileText />
                  <div>
                    <h2>{r.title}</h2>
                    {r.subtitle && <p className="small">{r.subtitle}</p>}
                  </div>
                </button>
              ) : (
                <Link
                  key={r.id}
                  to="/publications"
                  className="document-row text-foreground no-underline"
                >
                  <FileText />
                  <div>
                    <h2>{r.title}</h2>
                    {r.subtitle && <p className="small">{r.subtitle}</p>}
                  </div>
                </Link>
              ),
            )}
            {!resources.length && <p className="empty">Aucune ressource trouvée.</p>}
          </div>

          <h2 className="mb-4 text-lg font-semibold">Personnes · {totals.people}</h2>
          <div className="document-list">
            {people.map((p) => (
              <Link
                key={p.id}
                to="/membres/$userId"
                params={{ userId: p.id }}
                className="document-row text-foreground no-underline"
              >
                <UserAvatar name={p.name} url={p.avatar_url} />
                {p.name}
              </Link>
            ))}
            {!people.length && <p className="empty">Aucune personne trouvée.</p>}
          </div>
        </>
      )}
    </div>
  );
}
