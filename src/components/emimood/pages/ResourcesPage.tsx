import { useState } from "react";
import { Bookmark, FileText } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Heading } from "@/components/emimood/molecules/Heading";
import { resources } from "@/components/emimood/data/resources";
import { DocumentViewer } from "@/components/emimood/organisms/DocumentViewer";

export function ResourcesPage() {
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState("Toutes");
  const [selected, setSelected] = useState<(typeof resources)[number] | null>(null);
  const [saved, setSaved] = useState<number[]>([]);
  const list = resources.filter(
    (r) =>
      r.title.toLowerCase().includes(query.toLowerCase()) &&
      (filter !== "Officielles" || r.official) &&
      (filter !== "Étudiants" || !r.official) &&
      (filter !== "Enregistrées" || saved.includes(r.id)),
  );
  function download() {
    if (!selected) return;
    const blob = new Blob(
      [
        `EMIMood — Ressource de démonstration\n${selected.title}\n${selected.subject}\nAuteur : ${selected.author}\n\nLe document universitaire original n’a pas encore été importé.`,
      ],
      { type: "text/plain;charset=utf-8" },
    );
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "apercu-ressource.txt";
    a.click();
    URL.revokeObjectURL(url);
  }
  return (
    <div className="page">
      <Heading
        title="Ressources"
        subtitle="Les connaissances de notre communauté, à portée de main."
      />
      <div className="flex gap-3 mb-5">
        <Input
          placeholder="Rechercher un document…"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          aria-label="Rechercher un document"
          className="max-w-md"
        />
      </div>
      <div className="filter-row">
        {["Toutes", "Officielles", "Étudiants", "Enregistrées"].map((f) => (
          <Button
            key={f}
            variant={filter === f ? "secondary" : "outline"}
            size="sm"
            onClick={() => setFilter(f)}
          >
            {f}
          </Button>
        ))}
      </div>
      <div className="document-list">
        {list.map((r) => (
          <div className="document-row" key={r.id}>
            <span className="resource-symbol">
              <FileText />
            </span>
            <div className="flex-1">
              <h2>{r.title}</h2>
              <p className="small">
                {r.subject} · {r.author} · {r.size}
              </p>
            </div>
            <span className={`tag ${!r.official ? "warm" : ""}`}>
              {r.official ? "Officiel" : "Partagé par un étudiant"}
            </span>
            <Button
              size="icon"
              variant="ghost"
              aria-label={`Enregistrer ${r.title}`}
              onClick={() =>
                setSaved(
                  saved.includes(r.id) ? saved.filter((id) => id !== r.id) : [...saved, r.id],
                )
              }
            >
              <Bookmark fill={saved.includes(r.id) ? "currentColor" : "none"} />
            </Button>
            <Button size="sm" variant="outline" onClick={() => setSelected(r)}>
              Consulter
            </Button>
          </div>
        ))}
        {list.length === 0 && (
          <p className="empty">Aucune ressource ne correspond à votre recherche.</p>
        )}
      </div>
      <Dialog
        open={selected !== null}
        onOpenChange={(o) => {
          if (!o) setSelected(null);
        }}
      >
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>{selected?.title}</DialogTitle>
            <DialogDescription>
              {selected?.subject} · {selected?.author}
            </DialogDescription>
          </DialogHeader>
          {selected && (
            <DocumentViewer
              title={selected.title}
              subject={selected.subject}
              author={selected.author}
              onDownload={download}
            />
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
