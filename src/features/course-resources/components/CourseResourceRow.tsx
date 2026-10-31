import type { ReactNode } from "react";
import { ExternalLink, FileText, Link2, PlayCircle, type LucideIcon } from "lucide-react";
import { toSafeLink } from "@/lib/links";
import { cn } from "@/lib/utils";
import type { CourseResource, ResourceType } from "../api/schemas";

const ICONS: Record<ResourceType, LucideIcon> = {
  document: FileText,
  video: PlayCircle,
  link: Link2,
  other: ExternalLink,
};

export function CourseResourceRow({
  resource,
  menu,
}: {
  resource: CourseResource;
  menu?: ReactNode;
}) {
  const Icon = ICONS[resource.resource_type];
  const link = toSafeLink(resource.url); // une adresse qui n'est pas en http(s) n'est jamais cliquable
  const body = (
    <>
      <Icon size={18} className="shrink-0" aria-hidden />
      <span className="min-w-0 flex-1">
        <span className="block truncate text-sm font-medium">{resource.title}</span>
        {resource.description && (
          <span className="small block truncate">{resource.description}</span>
        )}
      </span>
      <span className="small shrink-0">{link ? link.host : "Lien invalide"}</span>
    </>
  );
  return (
    <div className={cn("document-row", !link && "opacity-60")}>
      {link ? (
        <a
          href={link.href}
          target="_blank"
          rel="noopener noreferrer"
          referrerPolicy="no-referrer"
          className="flex min-w-0 flex-1 items-center gap-3 text-foreground no-underline"
        >
          {body}
        </a>
      ) : (
        <div className="flex min-w-0 flex-1 items-center gap-3" aria-disabled>
          {body}
        </div>
      )}
      {menu}
    </div>
  );
}
