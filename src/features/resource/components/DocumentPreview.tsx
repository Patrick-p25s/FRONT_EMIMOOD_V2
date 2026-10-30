import { useEffect, useState } from "react";
import { Download, FileText } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { apiBlob } from "@/lib/api/client";
import { downloadFile } from "@/lib/api/download";

import type { ResourceDoc } from "../api/schemas";
import { messageOf } from "@/lib/api/message";

const PREVIEWABLE = new Set([
  "application/pdf",
  "image/png",
  "image/jpeg",
  "image/webp",
  "image/gif",
  "video/mp4",
  "video/webm",
]);
const MAX_PREVIEW_BYTES = 25 * 1024 * 1024;

type State =
  | { status: "loading" }
  | { status: "none" }
  | { status: "error"; message: string }
  | { status: "ready"; url: string; type: string };

export function DocumentPreview({ doc }: { doc: ResourceDoc }) {
  const [state, setState] = useState<State>({ status: "loading" });
  const path = doc.downloadPath;

  useEffect(() => {
    if (!path || (doc.size !== null && doc.size > MAX_PREVIEW_BYTES))
      return setState({ status: "none" });
    let cancelled = false;
    let objectUrl: string | null = null;
    apiBlob(path)
      .then((blob) => {
        if (cancelled) return;
        const type = blob.type.split(";")[0]?.trim().toLowerCase() ?? "";
        if (!PREVIEWABLE.has(type)) return setState({ status: "none" });
        objectUrl = URL.createObjectURL(new Blob([blob], { type })); // type forcé : jamais de HTML
        setState({ status: "ready", url: objectUrl, type });
      })
      .catch(
        (error: unknown) => !cancelled && setState({ status: "error", message: messageOf(error) }),
      );
    return () => {
      cancelled = true;
      if (objectUrl) URL.revokeObjectURL(objectUrl);
    };
  }, [path, doc.size]);

  const download = () =>
    path &&
    downloadFile(path, doc.fileName).catch((error: unknown) => toast.error(messageOf(error)));

  return (
    <div className="grid gap-3">
      {state.status === "loading" && <Skeleton className="h-[60vh] w-full" />}
      {state.status === "ready" && state.type === "application/pdf" && (
        <iframe src={state.url} title={doc.title} className="h-[70vh] w-full rounded-md border" />
      )}
      {state.status === "ready" && state.type.startsWith("image/") && (
        <img
          src={state.url}
          alt={doc.title}
          className="mx-auto max-h-[70vh] rounded-md object-contain"
        />
      )}
      {state.status === "ready" && state.type.startsWith("video/") && (
        <video src={state.url} controls className="mx-auto max-h-[70vh] w-full rounded-md" />
      )}
      {state.status === "none" && (
        <div className="empty">
          <FileText className="mx-auto mb-3" />
          <p>L’aperçu n’est pas disponible pour ce fichier. Vous pouvez le télécharger.</p>
        </div>
      )}
      {state.status === "error" && <p className="small text-destructive">{state.message}</p>}
      <div className="flex justify-end">
        <Button variant="outline" disabled={!path} onClick={() => void download()}>
          <Download /> Télécharger
        </Button>
      </div>
    </div>
  );
}
