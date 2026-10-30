import { z } from "zod";

const id = z.string().uuid();
const httpUrl = (value?: string | null) => (value && /^https?:\/\//i.test(value) ? value : null);

/** Un chemin d'API relatif uniquement : le jeton n'est jamais envoyé vers un autre serveur. */
const apiPath = (value?: string | null) =>
  value && /^\/(?!\/)/.test(value) && !value.includes("..") && !value.includes("://")
    ? value
    : null;

export const MEDIA = ["pdf", "image", "video", "office", "text", "link", "other"] as const;
export type Media = (typeof MEDIA)[number];

export const resourceSchema = z
  .object({
    id,
    title: z.string(),
    description: z.string().nullish(),
    kind: z.enum(["file", "link"]),
    media: z.enum(MEDIA).catch("other"),
    file_name: z.string().nullish(),
    file_type: z.string().nullish(),
    file_size: z.number().nullish(),
    url: z.string().nullish(),
    download_path: z.string().nullish(),
    source: z.string(),
    origin: z.enum(["official", "community"]).catch("community"),
    owner: z
      .object({ id, name: z.string(), role: z.string(), avatar_url: z.string().nullish() })
      .nullish(),
    subject: z.object({ id, name: z.string() }).nullish(),
    context: z.object({ type: z.string(), label: z.string().nullish() }),
    saved: z.boolean(),
    created_at: z.string(),
  })
  .transform((r) => ({
    id: r.id,
    title: r.title,
    description: r.description ?? "",
    kind: r.kind,
    media: r.media,
    fileName: r.file_name ?? r.title,
    fileType: r.file_type ?? "",
    size: r.file_size ?? null,
    url: httpUrl(r.url),
    downloadPath: apiPath(r.download_path),
    source: r.source,
    official: r.origin === "official",
    owner: r.owner ?? null,
    subject: r.subject ?? null,
    contextType: r.context.type,
    contextLabel: r.context.label ?? "",
    saved: r.saved,
    createdAt: r.created_at,
  }));

export const resourcesPageSchema = z.object({
  items: z.array(resourceSchema),
  total: z.number().int(),
  page: z.number().int(),
  page_size: z.number().int(),
  pages: z.number().int(),
});

export const saveSchema = z.object({ saved: z.boolean() });

export const updateSchema = z.object({
  title: z.string().trim().min(2, "Au moins 2 caractères.").max(200, "200 caractères au maximum."),
  description: z.string().trim().max(5000, "5000 caractères au maximum."),
});

export type ResourceDoc = z.output<typeof resourceSchema>;
export type ResourcesPageData = z.output<typeof resourcesPageSchema>;
