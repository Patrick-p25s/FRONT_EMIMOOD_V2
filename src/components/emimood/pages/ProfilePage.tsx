import { Link } from "@tanstack/react-router";
import { ArrowRight, GraduationCap } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar } from "@/components/emimood/atoms/Avatar";

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
