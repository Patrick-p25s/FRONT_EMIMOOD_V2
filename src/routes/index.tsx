import { createFileRoute, Link } from "@tanstack/react-router";
import {
  GraduationCap,
  BookOpen,
  MessagesSquare,
  ClipboardCheck,
  Building2,
  ArrowRight,
} from "lucide-react";
import campus from "@/assets/campus-community.jpg";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "EMIMood — La communauté universitaire de l’EMIT" },
      {
        name: "description",
        content:
          "Cours, évaluations, ressources et échanges pour les étudiants et enseignants de l’EMIT Fianarantsoa.",
      },
      { property: "og:title", content: "EMIMood — La communauté universitaire de l’EMIT" },
      {
        property: "og:description",
        content: "Cours, évaluations, ressources et échanges pour l’EMIT Fianarantsoa.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Landing,
});

const features = [
  {
    icon: BookOpen,
    title: "Cours par matière",
    text: "Chapitres, vidéos et documents consultables directement.",
  },
  {
    icon: ClipboardCheck,
    title: "Évaluations",
    text: "QCM et devoirs en ligne, résultats et retours des enseignants.",
  },
  {
    icon: MessagesSquare,
    title: "Communauté",
    text: "Publications, discussions et messages entre étudiants et enseignants.",
  },
  {
    icon: Building2,
    title: "Gestion universitaire",
    text: "Universités, années, classes et enseignants gérés par l’administration.",
  },
];

function Landing() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <header className="mx-auto flex max-w-6xl items-center justify-between px-5 py-5">
        <span className="flex items-center gap-2 text-xl font-extrabold">
          <span className="grid size-9 place-items-center rounded-lg bg-primary text-primary-foreground">
            <GraduationCap size={20} />
          </span>
          EMI<em className="not-italic text-primary">Mood</em>
        </span>
        <Button asChild>
          <Link to="/connexion">Se connecter</Link>
        </Button>
      </header>
      <section className="mx-auto grid max-w-6xl items-center gap-10 px-5 py-10 md:grid-cols-2 md:py-16">
        <div>
          <p className="mb-3 text-sm font-semibold uppercase tracking-wide text-success">
            EMIT · Fianarantsoa
          </p>
          <h1 className="text-4xl font-extrabold leading-tight md:text-5xl">
            Votre campus.
            <br />
            Votre communauté.
          </h1>
          <p className="mt-4 max-w-md text-muted-foreground">
            EMIMood réunit étudiants, enseignants et administration autour des cours, des
            évaluations et de la vie universitaire.
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            <Button asChild size="lg">
              <Link to="/connexion">
                Accéder à mon espace <ArrowRight />
              </Link>
            </Button>
            <Button asChild size="lg" variant="outline">
              <Link to="/inscription">Créer un compte</Link>
            </Button>
          </div>
          <p className="mt-3 text-xs text-muted-foreground">
            Inscription uniquement avec un code d’invitation de votre université.
          </p>
        </div>
        <img
          src={campus}
          alt="Étudiants de l’EMIT travaillant ensemble"
          width={1536}
          height={768}
          className="aspect-[4/3] w-full rounded-2xl object-cover"
        />
      </section>
      <section className="mx-auto grid max-w-6xl gap-4 px-5 pb-16 sm:grid-cols-2 lg:grid-cols-4">
        {features.map((f) => (
          <div key={f.title} className="rounded-xl border bg-card p-5">
            <f.icon className="mb-3 text-primary" />
            <h2 className="font-bold">{f.title}</h2>
            <p className="mt-1 text-sm text-muted-foreground">{f.text}</p>
          </div>
        ))}
      </section>
      <footer className="border-t py-6 text-center text-xs text-muted-foreground">
        © 2026 EMIMood · EMIT Fianarantsoa
      </footer>
    </div>
  );
}
