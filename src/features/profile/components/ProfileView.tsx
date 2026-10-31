// features/profile/components/ProfileView.tsx : la maquette, alimentée par l'API
import type { ReactNode } from "react";
import { Link } from "@tanstack/react-router";
import { ArrowRight, CalendarDays } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { Profile } from "../api/schemas";
import { memberSince, roleLabel } from "../lib/labels";
import { UserAvatar } from "./UserAvatar";

export function ProfileView({ profile, actions }: { profile: Profile; actions?: ReactNode }) {
  return (
    <div className="page">
      <div className="profile-cover" />
      <div className="profile-content">
        <UserAvatar
          name={profile.name}
          url={profile.avatar_url}
          className="size-24 text-2xl ring-4 ring-background"
        />
        <div className="flex items-start justify-between gap-3">
          <div>
            <h1>{profile.name}</h1>
            <p className="subtitle">{roleLabel(profile.role)}</p>
            <p className="small mt-3 flex items-center gap-2">
              <CalendarDays size={16} aria-hidden />
              Membre depuis {memberSince(profile.member_since)}
            </p>
          </div>
          {actions && <div className="mt-5 flex flex-wrap gap-2">{actions}</div>}
        </div>

        <section className="settings-section">
          <h2>Présentation</h2>
          {profile.bio?.trim() ? (
            <p className="whitespace-pre-line">{profile.bio}</p>
          ) : (
            <p className="small">
              {profile.is_me
                ? "Ajoutez une présentation en modifiant votre profil."
                : "Aucune présentation pour le moment."}
            </p>
          )}
        </section>

        {profile.subjects.length > 0 && (
          <section className="settings-section">
            <h2>Matières enseignées</h2>
            <div className="skill-list">
              {profile.subjects.map((subject) => (
                <span className="tag" key={subject}>
                  {subject}
                </span>
              ))}
            </div>
          </section>
        )}

        <section className="settings-section">
          <h2>Activité</h2>
          <p>
            {profile.publications_count} publication{profile.publications_count > 1 ? "s" : ""}
          </p>
        </section>

        {profile.is_me && (
          <section className="settings-section">
            <h2>Ma communauté</h2>
            <div className="flex flex-wrap gap-4">
              {(["/publications", "/ressources", "/messages"] as const).map((to) => (
                <Button key={to} variant="outline" asChild>
                  <Link to={to}>
                    {to === "/publications"
                      ? "Publications"
                      : to === "/ressources"
                        ? "Ressources"
                        : "Messages"}
                    <ArrowRight />
                  </Link>
                </Button>
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
}
