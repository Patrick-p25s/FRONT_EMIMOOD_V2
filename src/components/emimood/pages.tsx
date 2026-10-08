import { useState } from "react";
import { Link } from "@tanstack/react-router";
import {
  Code2,
  Database,
  Kanban,
  ArrowRight,
  FileText,
  Download,
  Search,
  CalendarDays,
  MapPin,
  Send,
  Check,
  Bell,
  Sun,
  Moon,
  Monitor,
  Bookmark,
  GraduationCap,
  CheckCircle2,
  ArrowUpRight,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Heading, Avatar } from "./shell";
import { Feed } from "./feed";
import { courses, resources, opportunities } from "./data";
import { useTheme, type Theme } from "./theme";
import { DocumentViewer, CourseDetail, QuizRunner, quizzes } from "./learning";
export function CoursesPage() {
  const [selected, setSelected] = useState<(typeof courses)[number] | null>(null);
  const [chapter, setChapter] = useState(0);
  const [open, setOpen] = useState<number | null>(null);
  if (open !== null)
    return (
      <div className="page">
        <CourseDetail courseId={open} onBack={() => setOpen(null)} />
      </div>
    );
  return (
    <div className="page">
      <Heading title="Mes cours" subtitle="Votre semestre, une connaissance à la fois." />
      <div className="filter-row">
        <span className="tag">L3 Informatique</span>
        <span className="tag">Semestre 5</span>
        <span className="small">Année universitaire 2026 – 2027 · Démonstration</span>
      </div>
      <div className="content-grid">
        {courses.map((c, i) => {
          const Icon = [Code2, Database, Kanban][i] ?? Code2;
          return (
            <article className="item-card" key={c.id}>
              <div className="flex items-center justify-between">
                <span className="stat-icon">
                  <Icon />
                </span>
                <span className="tag">{c.code}</span>
              </div>
              <h2>{c.title}</h2>
              <p>{c.description}</p>
              <div className="flex gap-2 items-center">
                <Avatar initials={i === 0 ? "AR" : i === 1 ? "RH" : "PR"} />
                <span className="small">{c.teacher}</span>
              </div>
              <div className="progress-track">
                <div className={`progress-fill p${c.progress}`} />
              </div>
              <div className="flex justify-between small">
                <span>{c.chapters} chapitres</span>
                <span>{c.progress}% parcouru</span>
              </div>
              <Button variant="outline" className="w-full mt-5" onClick={() => setOpen(c.id)}>
                Voir les chapitres <ArrowRight />
              </Button>
            </article>
          );
        })}
      </div>
      <Dialog
        open={selected !== null}
        onOpenChange={(open) => {
          if (!open) setSelected(null);
        }}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{selected?.title}</DialogTitle>
            <DialogDescription>
              {selected?.teacher} · {selected?.code}
            </DialogDescription>
          </DialogHeader>
          <div className="detail-content">
            <span className="tag">Cours officiel · Aperçu</span>
            <h3>{selected?.chapter}</h3>
            {chapter === 0 ? (
              <>
                <p>
                  Ce chapitre présente les notions essentielles, suivies d’une mise en pratique et
                  d’exercices guidés.
                </p>
                <p className="small mt-4">
                  Le support complet sera disponible lorsque les contenus de l’université seront
                  importés.
                </p>
              </>
            ) : (
              <>
                <h3>Exercice de mise en pratique</h3>
                <p>
                  Identifiez les concepts clés du chapitre et rédigez un exemple d’application pour
                  votre projet universitaire.
                </p>
              </>
            )}
            <Button className="mt-5" onClick={() => setChapter(chapter === 0 ? 1 : 0)}>
              {chapter === 0 ? "Voir l’exercice" : "Revenir au chapitre"}
              <ArrowRight />
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
export function ResourcesPage() {
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState("Toutes");
  const [selected, setSelected] = useState<(typeof resources)[number] | null>(null);
  const [saved, setSaved] = useState<number[]>([]);
  const list = resources.filter(
    (r) =>
      r.title.toLowerCase().includes(query.toLowerCase()) &&
      (filter !== "Officielles" || r.official) &&
      (filter !== "Étudiants" || !r.official) &&
      (filter !== "Enregistrées" || saved.includes(r.id)),
  );
  function download() {
    if (!selected) return;
    const blob = new Blob(
      [
        `EMIMood — Ressource de démonstration\n${selected.title}\n${selected.subject}\nAuteur : ${selected.author}\n\nLe document universitaire original n’a pas encore été importé.`,
      ],
      { type: "text/plain;charset=utf-8" },
    );
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "apercu-ressource.txt";
    a.click();
    URL.revokeObjectURL(url);
  }
  return (
    <div className="page">
      <Heading
        title="Ressources"
        subtitle="Les connaissances de notre communauté, à portée de main."
      />
      <div className="flex gap-3 mb-5">
        <Input
          placeholder="Rechercher un document…"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          aria-label="Rechercher un document"
          className="max-w-md"
        />
      </div>
      <div className="filter-row">
        {["Toutes", "Officielles", "Étudiants", "Enregistrées"].map((f) => (
          <Button
            key={f}
            variant={filter === f ? "secondary" : "outline"}
            size="sm"
            onClick={() => setFilter(f)}
          >
            {f}
          </Button>
        ))}
      </div>
      <div className="document-list">
        {list.map((r) => (
          <div className="document-row" key={r.id}>
            <span className="resource-symbol">
              <FileText />
            </span>
            <div className="flex-1">
              <h2>{r.title}</h2>
              <p className="small">
                {r.subject} · {r.author} · {r.size}
              </p>
            </div>
            <span className={`tag ${!r.official ? "warm" : ""}`}>
              {r.official ? "Officiel" : "Partagé par un étudiant"}
            </span>
            <Button
              size="icon"
              variant="ghost"
              aria-label={`Enregistrer ${r.title}`}
              onClick={() =>
                setSaved(
                  saved.includes(r.id) ? saved.filter((id) => id !== r.id) : [...saved, r.id],
                )
              }
            >
              <Bookmark fill={saved.includes(r.id) ? "currentColor" : "none"} />
            </Button>
            <Button size="sm" variant="outline" onClick={() => setSelected(r)}>
              Consulter
            </Button>
          </div>
        ))}
        {list.length === 0 && (
          <p className="empty">Aucune ressource ne correspond à votre recherche.</p>
        )}
      </div>
      <Dialog
        open={selected !== null}
        onOpenChange={(o) => {
          if (!o) setSelected(null);
        }}
      >
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>{selected?.title}</DialogTitle>
            <DialogDescription>
              {selected?.subject} · {selected?.author}
            </DialogDescription>
          </DialogHeader>
          {selected && (
            <DocumentViewer
              title={selected.title}
              subject={selected.subject}
              author={selected.author}
              onDownload={download}
            />
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
export function PublicationsPage() {
  return (
    <div className="page">
      <Heading
        title="Publications"
        subtitle="Les idées, projets et expériences qui font vivre notre campus."
      />
      <div className="max-w-3xl">
        <Feed />
      </div>
    </div>
  );
}
export function OpportunitiesPage() {
  const [selected, setSelected] = useState<(typeof opportunities)[number] | null>(null);
  const [saved, setSaved] = useState<number[]>([]);
  return (
    <div className="page">
      <Heading title="Opportunités" subtitle="Votre prochain défi commence peut-être ici." />
      <div className="content-grid">
        {opportunities.map((o) => (
          <article className="item-card" key={o.id}>
            <span className="tag">{o.type}</span>
            <h2>{o.title}</h2>
            <p>{o.org}</p>
            <p>{o.text}</p>
            <div className="small flex items-center gap-2">
              <CalendarDays size={14} />
              {o.date}
            </div>
            <div className="flex items-center justify-between mt-5">
              <Button variant="outline" onClick={() => setSelected(o)}>
                Découvrir
                <ArrowUpRight />
              </Button>
              <Button
                size="icon"
                variant="ghost"
                aria-label={`Enregistrer ${o.title}`}
                onClick={() =>
                  setSaved(
                    saved.includes(o.id) ? saved.filter((id) => id !== o.id) : [...saved, o.id],
                  )
                }
              >
                <Bookmark fill={saved.includes(o.id) ? "currentColor" : "none"} />
              </Button>
            </div>
          </article>
        ))}
      </div>
      <Dialog
        open={selected !== null}
        onOpenChange={(o) => {
          if (!o) setSelected(null);
        }}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{selected?.title}</DialogTitle>
            <DialogDescription>{selected?.org}</DialogDescription>
          </DialogHeader>
          <span className="tag">{selected?.type}</span>
          <p>{selected?.text}</p>
          <p className="small flex gap-2">
            <CalendarDays size={16} />
            {selected?.date}
          </p>
          <p className="small flex gap-2">
            <MapPin size={16} />
            EMIT · Fianarantsoa
          </p>
          <p className="small">
            Offre illustrative : les modalités et contacts officiels seront ajoutés par
            l’université.
          </p>
        </DialogContent>
      </Dialog>
    </div>
  );
}
export function EvaluationsPage() {
  const [tab, setTab] = useState("À venir");
  const [selected, setSelected] = useState<string | null>(null);
  const [taking, setTaking] = useState<string | null>(null);
  const [results, setResults] = useState<Record<string, number>>({});
  const quiz = quizzes.find((q) => q.title === taking);
  if (quiz)
    return (
      <div className="page">
        <QuizRunner
          quiz={quiz}
          onClose={(s) => {
            if (s !== undefined)
              setResults({
                ...results,
                [quiz.title]: Math.round((s / quiz.questions.length) * 20),
              });
            setTaking(null);
          }}
        />
      </div>
    );
  return (
    <div className="page">
      <Heading
        title="Mes évaluations"
        subtitle="Préparez votre prochaine étape et retrouvez vos résultats."
      />
      <div className="filter-row">
        {["À venir", "Résultats"].map((t) => (
          <Button variant={tab === t ? "secondary" : "outline"} onClick={() => setTab(t)} key={t}>
            {t}
          </Button>
        ))}
      </div>
      {tab === "À venir" ? (
        <div className="content-grid">
          {[
            {
              title: "Base de données",
              date: "8 octobre 2026 · 09:00",
              time: "60 minutes",
              questions: "20 questions",
            },
            {
              title: "Gestion de projet",
              date: "15 octobre 2026 · 10:00",
              time: "60 minutes",
              questions: "15 questions",
            },
          ].map((e) => (
            <article className="item-card" key={e.title}>
              <span className="tag warm">À venir</span>
              <h2>{e.title}</h2>
              <p>{e.date}</p>
              <p>
                {e.time} · {e.questions}
                <br />
                QCM · En ligne
              </p>
              <div className="flex gap-2 flex-wrap">
                {results[e.title] !== undefined ? (
                  <span className="tag">Rendu · {results[e.title]} / 20</span>
                ) : (
                  <Button onClick={() => setTaking(e.title)}>
                    Commencer
                    <ArrowRight />
                  </Button>
                )}
                <Button variant="outline" onClick={() => setSelected(e.title)}>
                  Informations
                </Button>
              </div>
            </article>
          ))}
        </div>
      ) : (
        <div className="document-list">
          <div className="document-row">
            <CheckCircle2 className="text-success" />
            <div className="flex-1">
              <h2>Algorithmique — Évaluation 1</h2>
              <p className="small">28 septembre 2026 · Résultat illustratif</p>
            </div>
            <strong className="text-success text-xl">16 / 20</strong>
          </div>
          {Object.entries(results).map(([t, n]) => (
            <div className="document-row" key={t}>
              <CheckCircle2 className="text-success" />
              <div className="flex-1">
                <h2>{t}</h2>
                <p className="small">Rendu à l’instant · Démonstration</p>
              </div>
              <strong className="text-success text-xl">{n} / 20</strong>
            </div>
          ))}
        </div>
      )}
      <Dialog
        open={selected !== null}
        onOpenChange={(o) => {
          if (!o) setSelected(null);
        }}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Évaluation · {selected}</DialogTitle>
            <DialogDescription>Informations de démonstration</DialogDescription>
          </DialogHeader>
          <p>QCM en ligne. Cliquez sur « Commencer » pour répondre aux questions.</p>
          <p className="small">
            Questions de démonstration : les vraies épreuves seront configurées par votre
            enseignant.
          </p>
          <Link to="/cours" className="text-success flex items-center gap-2">
            Réviser mes cours
            <ArrowRight size={16} />
          </Link>
        </DialogContent>
      </Dialog>
    </div>
  );
}
const people = ["Miora Rasoarivelo", "Andry Rakoto", "Groupe L3 Informatique"];
export function MessagesPage() {
  const [person, setPerson] = useState(0);
  const [text, setText] = useState("");
  const [messages, setMessages] = useState<Record<number, string[]>>({});
  return (
    <div className="page">
      <Heading title="Messages" subtitle="La collaboration commence par une conversation." />
      <div className="chat-layout">
        <aside className="chat-people">
          {people.map((p, i) => (
            <Button
              key={p}
              variant={person === i ? "secondary" : "ghost"}
              className="chat-person"
              onClick={() => setPerson(i)}
            >
              <Avatar initials={["MR", "AR", "L3"][i] ?? "EM"} />
              <div>
                <strong>{p}</strong>
                <span>
                  {i === 0
                    ? "À propos de notre projet"
                    : i === 1
                      ? "Développement web"
                      : "Notre espace de discussion"}
                </span>
              </div>
            </Button>
          ))}
        </aside>
        <div className="chat-body">
          <div className="chat-title">
            <strong>{people[person]}</strong>
            <p className="small">Conversation de démonstration</p>
          </div>
          <div className="chat-messages">
            <div className="bubble">
              {person === 0
                ? "Salut Patrick ! Tu es disponible pour discuter de notre projet après les cours ?"
                : person === 1
                  ? "Bonjour Patrick, vous pouvez poser vos questions sur le nouveau chapitre ici."
                  : "Bienvenue dans le groupe de L3 Informatique !"}
            </div>
            {(messages[person] ?? []).map((m, i) => (
              <div className="bubble self" key={i}>
                {m}
                <p className="small mt-1">À l’instant · Non envoyé à un destinataire réel</p>
              </div>
            ))}
          </div>
          <form
            className="chat-input"
            onSubmit={(e) => {
              e.preventDefault();
              if (text.trim()) {
                setMessages({ ...messages, [person]: [...(messages[person] ?? []), text.trim()] });
                setText("");
              }
            }}
          >
            <Input
              placeholder="Écrire un message…"
              value={text}
              onChange={(e) => setText(e.target.value)}
              aria-label="Message"
            />
            <Button type="submit" size="icon" aria-label="Envoyer le message">
              <Send />
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
}
export function NotificationsPage() {
  const [read, setRead] = useState<number[]>([]);
  const entries = [
    {
      title: "Un nouveau chapitre vous attend",
      text: "Andry Rakoto a publié le chapitre 7 de Développement web.",
      to: "/cours",
      time: "Il y a 35 min",
    },
    {
      title: "Votre prochaine évaluation approche",
      text: "Base de données · 8 octobre à 09:00.",
      to: "/evaluations",
      time: "Il y a 1 h",
    },
    {
      title: "Miora a partagé un nouveau projet",
      text: "Découvrez les projets de votre communauté.",
      to: "/publications",
      time: "Il y a 2 h",
    },
  ] as const;
  return (
    <div className="page">
      <Heading
        title="Notifications"
        subtitle="Restez connecté à ce qui compte sur votre campus."
        action={
          <Button variant="outline" onClick={() => setRead([0, 1, 2])}>
            <Check />
            Tout marquer comme lu
          </Button>
        }
      />
      <div className="document-list">
        {entries.map((n, i) => (
          <div className="document-row" key={n.title}>
            <span className="stat-icon">
              <Bell />
            </span>
            <div className="flex-1">
              <Link to={n.to} className="text-foreground no-underline">
                <h2>{n.title}</h2>
              </Link>
              <p className="small">{n.text}</p>
              <p className="small">{n.time}</p>
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setRead(read.includes(i) ? read.filter((x) => x !== i) : [...read, i])}
              aria-label={`Marquer ${n.title} comme ${read.includes(i) ? "non lu" : "lu"}`}
            >
              {read.includes(i) ? (
                <Check className="text-success" />
              ) : (
                <span className="notification-dot relative top-auto right-auto" />
              )}
            </Button>
          </div>
        ))}
      </div>
    </div>
  );
}
export function SettingsPage() {
  const { theme, setTheme } = useTheme();
  return (
    <div className="page">
      <Heading title="Paramètres" subtitle="Un espace qui vous ressemble." />
      <section className="settings-section">
        <h2>Apparence</h2>
        <p className="subtitle mb-5">Choisissez le thème de votre espace universitaire.</p>
        <div className="theme-options">
          {(
            [
              { value: "light", label: "Clair", icon: Sun },
              { value: "dark", label: "Sombre", icon: Moon },
              { value: "system", label: "Système", icon: Monitor },
            ] as { value: Theme; label: string; icon: typeof Sun }[]
          ).map((t) => (
            <Button
              key={t.value}
              variant={theme === t.value ? "secondary" : "outline"}
              onClick={() => setTheme(t.value)}
              aria-pressed={theme === t.value}
            >
              <t.icon />
              {t.label}
              {theme === t.value && <Check size={13} />}
            </Button>
          ))}
        </div>
      </section>
      <section className="settings-section">
        <h2>Langue</h2>
        <div className="flex justify-between">
          <span>Français</span>
          <span className="tag">
            <Check size={12} className="mr-1" />
            Langue de l’application
          </span>
        </div>
      </section>
      <section className="settings-section">
        <h2>Mon établissement</h2>
        <p>EMIT — Fianarantsoa</p>
        <p className="small mt-2">L3 Informatique · Semestre 5</p>
      </section>
      <section className="settings-section">
        <h2>À propos</h2>
        <p className="small">
          EMIMood · Version de démonstration
          <br />
          Les comptes et contenus réels ne sont pas encore configurés.
        </p>
      </section>
    </div>
  );
}
export function ProfilePage() {
  return (
    <div className="page">
      <div className="profile-cover" />
      <div className="profile-content">
        <Avatar />
        <div className="flex justify-between items-start gap-3">
          <div>
            <h1>Patrick Nomentsoa</h1>
            <p className="subtitle">Étudiant · L3 Informatique</p>
            <p className="small flex gap-2 items-center mt-3">
              <GraduationCap size={16} />
              EMIT · Fianarantsoa, Madagascar
            </p>
          </div>
          <Button variant="outline" asChild className="mt-5">
            <Link to="/parametres">Paramètres</Link>
          </Button>
        </div>
        <section className="settings-section">
          <h2>Présentation</h2>
          <p>Passionné par le développement web, la technologie et les projets collaboratifs.</p>
          <p className="small mt-2">Présentation et compétences de démonstration.</p>
          <div className="skill-list">
            {["Développement web", "React", "JavaScript", "SQL", "Travail en équipe"].map((s) => (
              <span className="tag" key={s}>
                {s}
              </span>
            ))}
          </div>
        </section>
        <section className="settings-section">
          <h2>Ma communauté</h2>
          <div className="flex gap-4 flex-wrap">
            <Button variant="outline" asChild>
              <Link to="/publications">
                Publications
                <ArrowRight />
              </Link>
            </Button>
            <Button variant="outline" asChild>
              <Link to="/ressources">
                Ressources
                <ArrowRight />
              </Link>
            </Button>
            <Button variant="outline" asChild>
              <Link to="/messages">
                Messages
                <ArrowRight />
              </Link>
            </Button>
          </div>
        </section>
      </div>
    </div>
  );
}
export function SearchPage({ q }: { q: string }) {
  const [query, setQuery] = useState(q);
  const found = courses.filter((c) => c.title.toLowerCase().includes(query.toLowerCase()));
  const docs = resources.filter((r) => r.title.toLowerCase().includes(query.toLowerCase()));
  return (
    <div className="page">
      <Heading
        title="Recherche"
        subtitle="Trouvez votre prochaine ressource, un cours ou une personne."
      />
      <Input
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Rechercher dans EMIMood…"
        aria-label="Recherche"
        className="max-w-lg mb-6"
      />
      {query ? (
        <>
          <h2 className="text-lg font-semibold mb-4">Cours · {found.length}</h2>
          <div className="document-list mb-6">
            {found.map((c) => (
              <Link key={c.id} to="/cours" className="document-row no-underline text-foreground">
                <BookIcon />
                <div>
                  <h2>{c.title}</h2>
                  <p className="small">{c.teacher}</p>
                </div>
                <ArrowRight size={17} className="ml-auto" />
              </Link>
            ))}
            {!found.length && <p className="empty">Aucun cours trouvé.</p>}
          </div>
          <h2 className="text-lg font-semibold mb-4">Ressources · {docs.length}</h2>
          <div className="document-list">
            {docs.map((r) => (
              <Link
                to="/ressources"
                key={r.id}
                className="document-row no-underline text-foreground"
              >
                <FileText />
                <div>
                  <h2>{r.title}</h2>
                  <p className="small">{r.author}</p>
                </div>
              </Link>
            ))}
            {!docs.length && <p className="empty">Aucune ressource trouvée.</p>}
          </div>
          {people
            .filter((p) => p.toLowerCase().includes(query.toLowerCase()))
            .map((p) => (
              <Link to="/messages" key={p} className="document-row text-foreground">
                <Avatar initials={p.slice(0, 2).toUpperCase()} />
                {p}
              </Link>
            ))}
        </>
      ) : (
        <div className="empty">
          <Search className="mx-auto mb-4" />
          <p>Que souhaitez-vous trouver ?</p>
        </div>
      )}
    </div>
  );
}
function BookIcon() {
  return <Code2 className="text-success" />;
}
