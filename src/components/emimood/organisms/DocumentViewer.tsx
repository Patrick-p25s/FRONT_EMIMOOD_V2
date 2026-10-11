import { useState } from "react";
import { ChevronLeft, ChevronRight, Download, ZoomIn, ZoomOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { docPages } from "@/components/emimood/data/documents";

export function DocumentViewer({
  title,
  subject,
  author,
  onDownload,
}: {
  title: string;
  subject: string;
  author: string;
  onDownload: () => void;
}) {
  const pages = docPages(title, subject, author);
  const [page, setPage] = useState(0);
  const [zoom, setZoom] = useState(100);
  const p = pages[page]!;
  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-center justify-between gap-2 flex-wrap">
        <div className="flex items-center gap-1">
          <Button
            size="icon"
            variant="outline"
            aria-label="Page précédente"
            disabled={page === 0}
            onClick={() => setPage(page - 1)}
          >
            <ChevronLeft />
          </Button>
          <span className="small px-2">
            Page {page + 1} / {pages.length}
          </span>
          <Button
            size="icon"
            variant="outline"
            aria-label="Page suivante"
            disabled={page === pages.length - 1}
            onClick={() => setPage(page + 1)}
          >
            <ChevronRight />
          </Button>
        </div>
        <div className="flex items-center gap-1">
          <Button
            size="icon"
            variant="ghost"
            aria-label="Réduire"
            onClick={() => setZoom(Math.max(70, zoom - 10))}
          >
            <ZoomOut />
          </Button>
          <span className="small w-12 text-center">{zoom}%</span>
          <Button
            size="icon"
            variant="ghost"
            aria-label="Agrandir"
            onClick={() => setZoom(Math.min(150, zoom + 10))}
          >
            <ZoomIn />
          </Button>
          <Button size="icon" variant="outline" aria-label="Télécharger" onClick={onDownload}>
            <Download />
          </Button>
        </div>
      </div>
      <div className="rounded-lg bg-muted p-4 max-h-[60vh] overflow-auto">
        <article
          className="mx-auto bg-card text-card-foreground shadow-md rounded-sm p-8 aspect-[1/1.414] max-w-[520px]"
          style={{ fontSize: `${zoom}%` }}
        >
          <p className="small uppercase tracking-wide text-primary">{subject}</p>
          <h3 className="text-[1.4em] font-bold mt-1 mb-4">{p.heading}</h3>
          {p.body.map((b, i) => (
            <p key={i} className="mb-3 leading-relaxed text-[0.95em]">
              {b}
            </p>
          ))}
          <p className="small mt-8 border-t pt-2">{author} · Aperçu de démonstration</p>
        </article>
      </div>
    </div>
  );
}

/* ---------- Cours par matière ---------- */
