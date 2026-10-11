import { createFileRoute } from "@tanstack/react-router";
import { VideosPage } from "@/components/emimood/pages";
import { pageHead } from "@/components/emimood/data";
export const Route = createFileRoute("/videos")({
  head: () =>
    pageHead(
      "Vidéos",
      "Recherchez et regardez des vidéos YouTube éducatives directement dans EMIMood.",
    ),
  component: VideosPage,
});
