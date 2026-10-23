// api/publications.ts
// NB : ces helpers viennent de l'espace enseignant ; à déplacer dans src/lib/api quand l'admin s'en servira.
import { api, del, patch, post, postForm } from "@/features/enseignant/api/http";
import type {
  LikeResult,
  Page,
  Publication,
  PublicationComment,
  PublicationStatus,
  PublicationType,
  PublicationVisibility,
} from "./types";

export type FeedFilters = {
  type?: PublicationType | undefined;
  classeId?: string | undefined;
  authorId?: string | undefined;
};

export type CreatePublicationInput = {
  publication_type: PublicationType;
  visibility: PublicationVisibility;
  classe_id?: string;
  title?: string;
  content: string;
  link_url?: string;
  subject_id?: string;
  event_at?: string;
  event_location?: string;
};
export type UpdatePublicationInput = {
  title?: string;
  content?: string;
  event_at?: string;
  event_location?: string;
};

export const publicationsApi = {
  feed: (filters: FeedFilters, page: number) =>
    api<Page<Publication>>("/publications/", {
      query: {
        page: String(page),
        page_size: "20",
        ...(filters.type ? { publication_type: filters.type } : {}),
        ...(filters.classeId ? { classe_id: filters.classeId } : {}),
        ...(filters.authorId ? { author_id: filters.authorId } : {}),
      },
    }),

  create: (input: CreatePublicationInput) => post<Publication>("/publications/create", input),

  update: (id: string, input: UpdatePublicationInput) =>
    patch<Publication>(`/publications/${id}`, input),

  remove: (id: string) => del(`/publications/${id}`),

  setStatus: (id: string, status: PublicationStatus) =>
    patch<Publication>(`/publications/${id}/status`, { status }),

  like: (id: string) => api<LikeResult>(`/publications/${id}/like`, { method: "PUT" }),

  unlike: (id: string) => api<LikeResult>(`/publications/${id}/like`, { method: "DELETE" }),

  comments: (id: string) =>
    api<Page<PublicationComment>>(`/publications/${id}/comments`, {
      query: { page: "1", page_size: "100" },
    }),

  addComment: (id: string, content: string) =>
    post<PublicationComment>(`/publications/${id}/comments`, { content }),

  createWithFile: (input: {
    file: File;
    title: string;
    content: string;
    visibility: PublicationVisibility;
    classe_id?: string;
    subject_id?: string;
  }) => {
    const form = new FormData();
    form.append("file", input.file);
    form.append("title", input.title);
    form.append("content", input.content);
    form.append("visibility", input.visibility);
    if (input.classe_id) form.append("classe_id", input.classe_id);
    if (input.subject_id) form.append("subject_id", input.subject_id);
    return postForm<Publication>("/publications/create-resource-file", form);
  },
};
