import { useState } from "react";
import { Check, Plus, Server, Trash2, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Section } from "@/components/emimood/data/consoles/types";

export const done = ["Publié", "Publiée", "Active", "Actif", "Ouverte", "Approuvé", "Journalisé"];

export function SectionPanel({ section }: { section: Section }) {
  const [rows, setRows] = useState(section.rows);
  const [draft, setDraft] = useState("");
  const setStatus = (id: number, status: string) =>
    setRows((rs) => rs.map((x) => (x.id === id ? { ...x, status } : x)));
  return (
    <div className="grid gap-5 lg:grid-cols-[1fr_340px]">
      <section className="settings-section">
        <p className="subtitle mb-4">{section.intro}</p>
        {section.addLabel && (
          <form
            className="mb-4 flex gap-2"
            onSubmit={(e) => {
              e.preventDefault();
              if (!draft.trim()) return;
              setRows((rs) => [{ id: Date.now(), title: draft.trim(), meta: "Ajouté à l’instant", status: "Brouillon" }, ...rs]);
              setDraft("");
            }}
          >
            <Input value={draft} onChange={(e) => setDraft(e.target.value)} placeholder={section.addLabel} />
            <Button type="submit">
              <Plus /> Ajouter
            </Button>
          </form>
        )}
        <div className="document-list">
          {rows.map((row) => (
            <div key={row.id} className="document-row flex-wrap gap-3">
              <div className="min-w-0 flex-1">
                <strong className="text-sm">{row.title}</strong>
                <p className="small">{row.meta}</p>
              </div>
              <span className={`tag ${done.includes(row.status) ? "text-success" : ""}`}>{row.status}</span>
              <div className="flex gap-1">
                {section.review && row.status === "En attente" && (
                  <>
                    <Button size="sm" variant="outline" onClick={() => setStatus(row.id, "Approuvé")} aria-label="Approuver">
                      <Check />
                    </Button>
                    <Button size="sm" variant="outline" onClick={() => setStatus(row.id, "Refusé")} aria-label="Refuser">
                      <X />
                    </Button>
                  </>
                )}
                {row.status === "Brouillon" && (
                  <Button size="sm" variant="outline" onClick={() => setStatus(row.id, "Publié")}>
                    Publier
                  </Button>
                )}
                <Button size="sm" variant="ghost" onClick={() => setRows((rs) => rs.filter((x) => x.id !== row.id))} aria-label="Supprimer">
                  <Trash2 />
                </Button>
              </div>
            </div>
          ))}
          {rows.length === 0 && <p className="empty">Aucun élément.</p>}
        </div>
      </section>
      <aside className="settings-section">
        <h2 className="flex items-center gap-2">
          <Server size={16} /> Endpoints FastAPI
        </h2>
        <p className="small mb-3">Préfixe suggéré : /api/v1</p>
        <ul className="grid gap-3">
          {section.endpoints.map((ep) => (
            <li key={ep.method + ep.path}>
              <code className="text-xs">
                <strong className="text-primary">{ep.method}</strong> {ep.path}
              </code>
              <p className="small">{ep.desc}</p>
            </li>
          ))}
        </ul>
      </aside>
    </div>
  );
}
