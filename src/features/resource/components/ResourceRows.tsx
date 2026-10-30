// features/resources/components/ResourceRow.tsx
import type { ReactNode } from "react";
import { Link } from "@tanstack/react-router";
import {
  Bookmark,
  File,
  FileSpreadsheet,
  FileText,
  Image as ImageIcon,
  Link2,
  Video,
  type LucideIcon,
} from "lucide-react";
import { Button, buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import type { Media, ResourceDoc } from "../api/schemas";
import { formatBytes } from "@/lib/files";

const ICONS: Record<Media, LucideIcon> = {
  pdf: FileText,
  image: ImageIcon,
  video: Video,
  office: FileSpreadsheet,
  text: FileText,
  link: Link2,
  other: File,
};

const hostOf = (url: string | null) => {
  try {
    return url ? new URL(url).hostname : "";
  } catch {
    return "";
  }
};

type ResourceRowProps = {
  doc: ResourceDoc;
  onOpen: (doc: ResourceDoc) => void;
  onToggleSave: (doc: ResourceDoc) => void;
  menu?: ReactNode; // ex. menu « Modifier / Supprimer » de l'auteur
};

export function ResourceRow({ doc, onOpen, onToggleSave, menu }: ResourceRowProps) {
  const Icon = ICONS[doc.media];
  const size = doc.kind === "file" ? formatBytes(doc.size) : hostOf(doc.url);
  return (
    <div className="document-row">
      <span className="resource-symbol">
        <Icon />
      </span>
      <div className="min-w-0 flex-1">
        <h2 className="truncate">{doc.title}</h2>
        <p className="small">
          {doc.subject?.name}
          {doc.owner && (
            <>
              {doc.subject ? " · " : ""}
              <Link
                to="/membres/$userId"
                params={{ userId: doc.owner.id }}
                className="text-inherit no-underline hover:underline"
              >
                {doc.owner.name}
              </Link>
            </>
          )}
          {size && ` · ${size}`}
        </p>
      </div>
      <span className={cn("tag", !doc.official && "warm")}>
        {doc.official ? "Officiel" : "Partagé par un étudiant"}
      </span>
      <Button
        size="icon"
        variant="ghost"
        aria-label={`${doc.saved ? "Retirer des enregistrées" : "Enregistrer"} : ${doc.title}`}
        aria-pressed={doc.saved}
        onClick={() => onToggleSave(doc)}
      >
        <Bookmark fill={doc.saved ? "currentColor" : "none"} />
      </Button>
      {doc.kind === "link" ? (
        doc.url ? (
          <a
            href={doc.url}
            target="_blank"
            rel="noopener noreferrer"
            className={cn(buttonVariants({ variant: "outline", size: "sm" }), "no-underline")}
          >
            Consulter
          </a>
        ) : (
          <span className="small">Lien invalide</span>
        )
      ) : (
        <Button size="sm" variant="outline" onClick={() => onOpen(doc)}>
          Consulter
        </Button>
      )}
      {menu}
    </div>
  );
}
