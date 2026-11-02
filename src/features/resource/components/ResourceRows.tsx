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
import { formatBytes } from "@/lib/files";
import { toSafeLink } from "@/lib/links";
import { cn } from "@/lib/utils";
import type { Media, ResourceDoc } from "../api/schemas";

const ICONS: Record<Media, LucideIcon> = {
  pdf: FileText,
  image: ImageIcon,
  video: Video,
  office: FileSpreadsheet,
  text: FileText,
  link: Link2,
  other: File,
};

type ResourceRowProps = {
  doc: ResourceDoc;
  onOpen: (doc: ResourceDoc) => void;
  onToggleSave: (doc: ResourceDoc) => void;
  menu?: ReactNode; // ex. menu « Modifier / Supprimer » de l'auteur
};

export function ResourceRow({ doc, onOpen, onToggleSave, menu }: ResourceRowProps) {
  const Icon = ICONS[doc.media];
  const link = doc.url ? toSafeLink(doc.url) : null;
  const size = doc.kind === "file" ? formatBytes(doc.size) : (link?.host ?? "");

  return (
    <div className="document-row">
      {/* Un seul enfant : la mise en page responsive vit ici, sans lutter avec .document-row */}
      <div className="flex min-w-0 flex-1 flex-col gap-3 sm:flex-row sm:items-center">
        <div className="flex min-w-0 flex-1 items-start gap-3 sm:items-center">
          <span className="resource-symbol shrink-0">
            <Icon />
          </span>
          <div className="min-w-0 flex-1">
            <h2 className="line-clamp-2 break-words sm:line-clamp-1">{doc.title}</h2>
            <p className="small break-words">
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
        </div>

        <div className="flex flex-wrap items-center gap-2 sm:flex-nowrap sm:justify-end">
          <span className={cn("tag", !doc.official && "warm")}>
            {doc.official ? "Officiel" : "Partagé par un étudiant"}
          </span>
          <div className="ml-auto flex items-center gap-1 sm:ml-0">
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
              link ? (
                <a
                  href={link.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={`Consulter : ${doc.title}`}
                  className={cn(buttonVariants({ variant: "outline", size: "sm" }), "no-underline")}
                >
                  Consulter
                </a>
              ) : (
                <span className="small">Lien invalide</span>
              )
            ) : (
              <Button
                size="sm"
                variant="outline"
                aria-label={`Consulter : ${doc.title}`}
                onClick={() => onOpen(doc)}
              >
                Consulter
              </Button>
            )}
            {menu}
          </div>
        </div>
      </div>
    </div>
  );
}
