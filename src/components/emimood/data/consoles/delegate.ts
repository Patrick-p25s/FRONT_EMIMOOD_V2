import { RoleConsole, r } from "@/components/emimood/data/consoles/types";

export const delegateConsole: RoleConsole = {
  title: "Espace délégué",
  subtitle: "Modérez les publications de votre classe et relayez les informations aux étudiants.",
  badge: "Délégué · L3 Informatique",
  sections: [
    {
      key: "signalements",
      label: "Signalements",
      intro: "Publications et commentaires signalés par les étudiants de la classe.",
      review: true,
      rows: [
        r(
          1,
          "Commentaire injurieux sous « Projet tutoré »",
          "Signalé 3 fois · il y a 2 h",
          "En attente",
        ),
        r(2, "Publication hors sujet (vente)", "Signalé 1 fois · hier", "En attente"),
      ],
      endpoints: [
        {
          method: "GET",
          path: "/reports?scope=class&status=pending",
          desc: "Signalements de la classe",
        },
        {
          method: "PATCH",
          path: "/reports/{report_id}",
          desc: "Valider ou rejeter un signalement",
        },
        { method: "POST", path: "/posts/{post_id}/hide", desc: "Masquer une publication" },
        { method: "DELETE", path: "/comments/{comment_id}", desc: "Supprimer un commentaire" },
      ],
    },
    {
      key: "publications",
      label: "Publications à valider",
      intro: "Publications d’étudiants en attente avant diffusion à la classe.",
      review: true,
      rows: [
        r(1, "Groupe de révision SQL samedi", "Par Fanja A.", "En attente"),
        r(2, "Partage de notes — Réseaux", "Par Tiana M.", "En attente"),
      ],
      endpoints: [
        {
          method: "GET",
          path: "/posts?scope=class&status=pending",
          desc: "Publications en attente",
        },
        { method: "PATCH", path: "/posts/{post_id}/review", desc: "Approuver ou refuser" },
      ],
    },
    {
      key: "annonces",
      label: "Annonces de classe",
      intro: "Relayez une information (emploi du temps, réunion) à toute la classe.",
      addLabel: "Nouvelle annonce",
      rows: [r(1, "Changement de salle — lundi", "Salle B12", "Publiée")],
      endpoints: [
        {
          method: "POST",
          path: "/classes/{class_id}/announcements",
          desc: "Publier une annonce de classe",
        },
        {
          method: "POST",
          path: "/conversations/class/{class_id}/messages",
          desc: "Message au groupe de classe",
        },
      ],
    },
    {
      key: "historique",
      label: "Historique",
      intro: "Vos actions de modération sont journalisées.",
      rows: [r(1, "Publication masquée", "« Vente de téléphone » · 6 oct.", "Journalisé")],
      endpoints: [
        { method: "GET", path: "/audit-logs?actor=me", desc: "Mes actions de modération" },
      ],
    },
  ],
};
