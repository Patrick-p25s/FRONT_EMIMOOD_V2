import { toSafeLink } from "@/lib/links";
import Markdown from "react-markdown";
import remarkGfm from "remark-gfm";
const MARKDOWN_COMPONENTS = {
  a: ({ href, children }: { href: string; children: React.ReactNode }) => {
    const link = href ? toSafeLink(href) : null;
    return link ? (
      <a href={link.href} target="_blank" rel="noopener noreferrer">
        {children}
      </a>
    ) : (
      <span>{children}</span>
    );
  },
  img: ({ src, alt }: { src: unknown | string; alt: string }) => {
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
export function MarkdownBlock({ source }: { source: string }) {
  return (
    <Markdown remarkPlugins={[remarkGfm]} components={MARKDOWN_COMPONENTS}>
      {source}
    </Markdown>
  );
}
