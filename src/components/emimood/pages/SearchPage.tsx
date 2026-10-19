import { useState } from "react";
import { Link } from "@tanstack/react-router";
import { ArrowRight, FileText, Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Heading } from "@/components/emimood/molecules/Heading";
import { Avatar } from "@/components/emimood/atoms/Avatar";
import { courses } from "@/components/emimood/data/courses";
import { resources } from "@/components/emimood/data/resources";
import { BookIcon } from "@/components/emimood/atoms/BookIcon";
import { people } from "@/components/emimood/pages/MessagesPage";

export function SearchPage({ q }: { q: string }) {
  const [query, setQuery] = useState(q);
  const found = courses.filter((c) => c.title.toLowerCase().includes(query.toLowerCase()));
  const docs = resources.filter((r) => r.title.toLowerCase().includes(query.toLowerCase()));
  return (
    <div className="page">
      <Heading
        title="Recherche"
        subtitle="Trouvez votre prochaine ressource, un cours ou une personne."
      />
      <Input
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Rechercher dans EMIMood…"
        aria-label="Recherche"
        className="max-w-lg mb-6"
      />
      {query ? (
        <>
          <h2 className="text-lg font-semibold mb-4">Cours · {found.length}</h2>
          <div className="document-list mb-6">
            {found.map((c) => (
              <Link key={c.id} to="/cours" className="document-row no-underline text-foreground">
                <BookIcon />
                <div>
                  <h2>{c.title}</h2>
                  <p className="small">{c.teacher}</p>
                </div>
                <ArrowRight size={17} className="ml-auto" />
              </Link>
            ))}
            {!found.length && <p className="empty">Aucun cours trouvé.</p>}
          </div>
          <h2 className="text-lg font-semibold mb-4">Ressources · {docs.length}</h2>
          <div className="document-list">
            {docs.map((r) => (
              <Link
                to="/ressources"
                key={r.id}
                className="document-row no-underline text-foreground"
              >
                <FileText />
                <div>
                  <h2>{r.title}</h2>
                  <p className="small">{r.author}</p>
                </div>
              </Link>
            ))}
            {!docs.length && <p className="empty">Aucune ressource trouvée.</p>}
          </div>
          {people
            .filter((p) => p.toLowerCase().includes(query.toLowerCase()))
            .map((p) => (
              <Link to="/messages" key={p} className="document-row text-foreground">
                <Avatar initials={p.slice(0, 2).toUpperCase()} />
                {p}
              </Link>
            ))}
        </>
      ) : (
        <div className="empty">
          <Search className="mx-auto mb-4" />
          <p>Que souhaitez-vous trouver ?</p>
        </div>
      )}
    </div>
  );
}
