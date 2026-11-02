import Markdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { Skeleton } from "@/components/ui/skeleton";
import { toSafeLink } from "@/lib/links";
import { useChapterContent } from "../hooks/useStudentCourses";

export function ChapterContent({ chapterId }: { chapterId: string }) {
  const content = useChapterContent(chapterId);
  if (content.isLoading) return <Skeleton className="mt-4 h-40 w-full" />;
  if (content.isError) {
    return (
      <p className="small mt-4">
        Le contenu n’a pas pu être chargé.{" "}
        <button type="button" className="underline" onClick={() => void content.refetch()}>
          Réessayer
        </button>
      </p>
    );
  }

  const MARKDOWN_COMPONENTS = {
    a: ({ href, children }) => {
      const link = href ? toSafeLink(href) : null;
      return link ? (
        <a href={link.href} target="_blank" rel="noopener noreferrer">
          {children}
        </a>
      ) : (
        <span>{children}</span>
      );
    },
    img: ({ src, alt }) => {
      const link = typeof src === "string" ? toSafeLink(src) : null;
      return link?.href.startsWith("https:") ? (
        <img
          src={link.href}
          alt={alt ?? ""}
          loading="lazy"
          referrerPolicy="no-referrer"
          className="max-w-full rounded-md"
        />
      ) : null;
    },
  };

  const blocks = (content.data ?? []).filter((block) => block.content.trim() !== "");
  if (blocks.length === 0) return null; // aucun texte : on n'affiche que les supports

  return (
    <div className="chapter-content mt-4 space-y-4">
      {blocks.map((block) => (
        <Markdown key={block.id} remarkPlugins={[remarkGfm]} components={MARKDOWN_COMPONENTS}>
          {block.content}
        </Markdown>
      ))}
    </div>
  );
}
