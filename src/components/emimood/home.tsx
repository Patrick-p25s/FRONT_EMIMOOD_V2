import { Link } from "@tanstack/react-router";
import {
  CalendarDays,
  BookOpen,
  Files,
  ClipboardCheck,
  ArrowUpRight,
  FileText,
  ChevronRight,
  Clock3,
  Sparkles,
} from "lucide-react";
import campus from "@/assets/campus-community.jpg";
import { Heading, SectionHeading } from "./shell";
import { Feed } from "./feed";
import { resources } from "./data";
export function HomePage() {
  return (
    <div className="page">
      <Heading
        title="Bonjour Patrick"
        subtitle="Heureux de vous retrouver. Qu’allez-vous apprendre aujourd’hui ?"
        action={
          <span className="date-label">
            <CalendarDays size={15} />
            Mardi 6 octobre 2026
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
            {[
              { icon: BookOpen, value: "6", label: "Cours ce semestre", to: "/cours" },
              {
                icon: ClipboardCheck,
                value: "2",
                label: "Évaluations à venir",
                to: "/evaluations",
              },
              { icon: Files, value: "24", label: "Ressources disponibles", to: "/ressources" },
            ].map((s) => (
              <Link
                to={s.to as "/cours" | "/evaluations" | "/ressources"}
                key={s.label}
                className="stat no-underline text-foreground"
              >
                <div className="stat-icon">
                  <s.icon size={19} />
                </div>
                <div>
                  <strong>{s.value}</strong>
                  <span>{s.label}</span>
                </div>
              </Link>
            ))}
          </div>
          <SectionHeading title="Le fil du campus" to="/publications" />
          <Feed compact />
        </div>
        <aside className="right-column">
          <section className="right-section">
            <SectionHeading title="À votre agenda" to="/evaluations" />
            <div className="agenda-item">
              <div className="date-tile">
                <span>OCT</span>
                <strong>08</strong>
              </div>
              <div>
                <h3>Évaluation · Base de données</h3>
                <p>
                  <Clock3 size={10} className="inline" /> 09:00 – 10:00 · En ligne
                </p>
                <span className="tag warm">Dans 2 jours</span>
              </div>
            </div>
            <div className="agenda-item">
              <div className="date-tile">
                <span>OCT</span>
                <strong>12</strong>
              </div>
              <div>
                <h3>TP · Développement web</h3>
                <p>14:00 – 16:00 · Salle B204</p>
                <span className="tag">L3 Informatique</span>
              </div>
            </div>
            <div className="agenda-item">
              <div className="date-tile">
                <span>OCT</span>
                <strong>15</strong>
              </div>
              <div>
                <h3>Évaluation · Gestion de projet</h3>
                <p>10:00 – 11:00 · En ligne</p>
              </div>
            </div>
          </section>
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
            <br />
            <span className="text-success">Contenus de démonstration</span> · © 2026 EMIMood
          </div>
        </aside>
      </div>
    </div>
  );
}
