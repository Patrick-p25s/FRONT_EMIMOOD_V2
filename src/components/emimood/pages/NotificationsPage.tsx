import { useState } from "react";
import { Link } from "@tanstack/react-router";
import { Bell, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Heading } from "@/components/emimood/molecules/Heading";

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
