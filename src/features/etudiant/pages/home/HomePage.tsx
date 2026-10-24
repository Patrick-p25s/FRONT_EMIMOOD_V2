// features/etudiant/pages/home/HomePage.tsx : votre accueil, branché
import { Link } from "@tanstack/react-router";
import {
  ArrowUpRight,
  BookOpen,
  CalendarDays,
  ChevronRight,
  ClipboardCheck,
  FileText,
  Sparkles,
  TrendingUp,
  type LucideIcon,
} from "lucide-react";
import campus from "@/assets/campus-community.jpg";
import { resources } from "@/components/emimood/data/resources"; // maquette : en attente du backend
import { Heading } from "@/components/emimood/molecules/Heading";
import { SectionHeading } from "@/components/emimood/molecules/SectionHeading";
import { useAuth } from "@/lib/auth";
import { useCampusTargets } from "../../hooks/useCampusTargets";
import { useStudentSubjects } from "../../hooks/useStudentCourses";
import { typeLabel } from "../../lib/assessments";
import { useStudentAssessments } from "../../hooks/useStudentAttempts";
import { usePublicationFeed } from "@/features/enseignant/hooks/usePublications";
import { dayTile, inDays, timeOf, todayLabel } from "@/lib/dates";
import { CampusFeed } from "@/features/enseignant/components/CampusFeed";

type AgendaItem = {
  key: string;
  at: string;
  title: string;
  line: string;
  tag: string;
  warm: boolean;
};

export function HomePage() {
  const { user } = useAuth();
  const { classes, subjects } = useCampusTargets();
  const subjectsQuery = useStudentSubjects(undefined);
  const assessments = useStudentAssessments();
  const events = usePublicationFeed({ type: "event" });

  const cards = subjectsQuery.data?.subjects ?? [];
  const live = assessments.rows.filter((row) => row.phase === "upcoming" || row.phase === "open");
  const average =
    cards.length > 0
      ? Math.round(cards.reduce((sum, card) => sum + card.progress_percent, 0) / cards.length)
      : null;

  // Agenda : vos évaluations et les événements publiés, du plus proche au plus lointain.
  const evaluationItems: AgendaItem[] = live.flatMap((row) => {
    const at = row.phase === "upcoming" ? row.start_at : row.end_at;
    if (!at) return [];
    return [
      {
        key: `a-${row.id}`,
        at,
        title: `${typeLabel(row.assessment_type)} · ${row.subject_name}`,
        line:
          row.phase === "upcoming"
            ? `${timeOf(at)}${row.duration_minutes ? ` · ${row.duration_minutes} min` : ""} · En ligne`
            : `Se termine à ${timeOf(at)}`,
        tag: inDays(at),
        warm: true,
      },
    ];
  });
  const eventItems: AgendaItem[] = (events.data?.pages[0]?.items ?? []).flatMap((publication) => {
    const at = publication.event_at;
    if (!at || new Date(at).getTime() < Date.now()) return [];
    return [
      {
        key: `e-${publication.id}`,
        at,
        title: publication.title ?? "Événement",
        line: `${timeOf(at)}${publication.event_location ? ` · ${publication.event_location}` : ""}`,
        tag: inDays(at),
        warm: false,
      },
    ];
  });
  const agenda = [...evaluationItems, ...eventItems]
    .sort((a, b) => Date.parse(a.at) - Date.parse(b.at))
    .slice(0, 4);

  const stats: {
    icon: LucideIcon;
    value: string;
    label: string;
    to: "/subjects" | "/evaluations";
  }[] = [
    {
      icon: BookOpen,
      value: subjectsQuery.data ? String(cards.length) : "—",
      label: "Matières",
      to: "/subjects",
    },
    {
      icon: ClipboardCheck,
      value: assessments.isLoading ? "—" : String(live.length),
      label: "Évaluations à venir",
      to: "/evaluations",
    },
    {
      icon: TrendingUp,
      value: average === null ? "—" : `${average}%`,
      label: "Progression moyenne",
      to: "/subjects",
    },
  ];

  return (
    <div className="page">
      <Heading
        title={`Bonjour${user ? ` ${user.name.split(" ")[0]}` : ""}`}
        subtitle="Heureux de vous retrouver. Qu’allez-vous apprendre aujourd’hui ?"
        action={
          <span className="date-label">
            <CalendarDays size={15} />
            {todayLabel()}
          </span>
        }
      />
      <div className="home-grid">
        <div>
          <section className="welcome-banner">
            <img
              src={campus}
              alt="Étudiants malgaches collaborant à la bibliothèque universitaire"
              width={1536}
              height={768}
            />
            <div className="banner-copy">
              <span className="eyebrow">Apprendre · Partager · Grandir</span>
              <h2>
                Votre campus.
                <br />
                Votre communauté.
              </h2>
              <p>
                Des idées qui se rencontrent.
                <br />
                Des connaissances qui se partagent.
              </p>
              <Link to="/publications">
                Explorer la communauté <ArrowUpRight size={15} />
              </Link>
            </div>
          </section>

          <div className="stats">
            {stats.map((stat) => (
              <Link to={stat.to} key={stat.label} className="stat no-underline text-foreground">
                <div className="stat-icon">
                  <stat.icon size={19} />
                </div>
                <div>
                  <strong>{stat.value}</strong>
                  <span>{stat.label}</span>
                </div>
              </Link>
            ))}
          </div>

          <SectionHeading title="Le fil du campus" to="/publications" />
          <CampusFeed compact classes={classes} subjects={subjects} />
        </div>

        <aside className="right-column">
          <section className="right-section">
            <SectionHeading title="À votre agenda" to="/evaluations" />
            {agenda.length === 0 && <p className="small">Rien de prévu pour le moment.</p>}
            {agenda.map((item) => {
              const tile = dayTile(item.at);
              return (
                <div className="agenda-item" key={item.key}>
                  <div className="date-tile">
                    <span>{tile.month}</span>
                    <strong>{tile.day}</strong>
                  </div>
                  <div>
                    <h3>{item.title}</h3>
                    <p>{item.line}</p>
                    <span className={item.warm ? "tag warm" : "tag"}>{item.tag}</span>
                  </div>
                </div>
              );
            })}
          </section>

          {/* maquette : en attente du backend (liste de ressources) */}
          <section className="right-section">
            <SectionHeading title="Dernières ressources" to="/ressources" />
            {resources.slice(0, 3).map((r) => (
              <Link to="/ressources" className="resource-item" key={r.id}>
                <span className="resource-symbol">
                  <FileText size={19} />
                </span>
                <div>
                  <h3>{r.title}</h3>
                  <p>
                    {r.subject} · {r.size}
                  </p>
                </div>
                <ChevronRight size={13} className="ml-auto text-muted-foreground" />
              </Link>
            ))}
          </section>

          {/* maquette : en attente du type « opportunité » côté backend */}
          <section className="right-section">
            <SectionHeading title="À ne pas manquer" to="/opportunites" />
            <div className="opportunity-box">
              <span className="tag">
                <Sparkles size={11} className="mr-1" /> Hackathon
              </span>
              <h3>Hackathon Innovation 2026</h3>
              <p>48 heures pour créer, collaborer et faire la différence.</p>
              <p className="mt-2">
                <CalendarDays size={12} className="inline" /> 24 – 25 octobre · EMIT
              </p>
              <Link to="/opportunites">
                Découvrir l’événement <ArrowUpRight size={13} />
              </Link>
            </div>
          </section>

          <div className="community-footer">
            EMIMood · La communauté qui vous fait grandir.
            <br />
            EMIT Fianarantsoa · Madagascar
            <br />© 2026 EMIMood
          </div>
        </aside>
      </div>
    </div>
  );
}
