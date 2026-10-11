import { RoleConsole, r } from "@/components/emimood/data/consoles/types";

export const superAdminConsole: RoleConsole = {
  title: "Super administration",
  subtitle: "Structure de l’université, comptes, rôles, codes d’invitation et journal des actions sensibles.",
  badge: "Super administrateur · EMIT",
  sections: [
    {
      key: "universites",
      label: "Universités",
      intro: "Chaque université est une communauté séparée.",
      addLabel: "Nouvelle université",
      rows: [r(1, "EMIT — Fianarantsoa", "1 240 membres · 3 mentions", "Active")],
      endpoints: [
        { method: "GET", path: "/universities", desc: "Lister les universités" },
        { method: "POST", path: "/universities", desc: "Créer une université" },
        { method: "PATCH", path: "/universities/{id}", desc: "Modifier / suspendre" },
      ],
    },
    {
      key: "annees",
      label: "Années universitaires",
      intro: "Chaque université a ses années ; les classes sont créées dans une année.",
      addLabel: "Nouvelle année (ex. 2026-2027)",
      rows: [r(1, "2026-2027 — EMIT", "Année en cours · 12 classes", "Active"), r(2, "2025-2026 — EMIT", "Archivée", "Journalisé")],
      endpoints: [
        { method: "GET", path: "/universities/{id}/academic-years", desc: "Années d’une université" },
        { method: "POST", path: "/universities/{id}/academic-years", desc: "Créer une année" },
        { method: "PATCH", path: "/academic-years/{year_id}", desc: "Définir l’année en cours / archiver" },
      ],
    },
    {
      key: "classes",
      label: "Classes",
      intro: "Classes d’une université pour une année donnée.",
      addLabel: "Nouvelle classe (ex. L3 Informatique)",
      rows: [r(1, "L3 Informatique · 2026-2027", "42 étudiants", "Active"), r(2, "M1 Génie logiciel · 2026-2027", "28 étudiants", "Active")],
      endpoints: [
        { method: "GET", path: "/academic-years/{year_id}/classes", desc: "Classes d’une année" },
        { method: "POST", path: "/academic-years/{year_id}/classes", desc: "Créer une classe" },
        { method: "POST", path: "/classes/{class_id}/students", desc: "Inscrire des étudiants" },
      ],
    },
    {
      key: "enseignants",
      label: "Enseignants",
      intro: "Créez un enseignant ou attribuez ce rôle à un utilisateur existant dans une université précise.",
      addLabel: "Email de l’enseignant",
      rows: [r(1, "Hanta Rakoto", "EMIT · Bases de données, Algorithmique", "Actif"), r(2, "Jean Randria", "EMIT · invitation envoyée", "En attente")],
      endpoints: [
        { method: "POST", path: "/universities/{id}/teachers", desc: "Créer un compte enseignant" },
        { method: "PUT", path: "/universities/{id}/teachers/{user_id}", desc: "Assigner un utilisateur comme enseignant" },
        { method: "DELETE", path: "/universities/{id}/teachers/{user_id}", desc: "Retirer le rôle" },
      ],
    },
    {
      key: "structure",
      label: "Structure",
      intro: "Niveaux, classes et matières, et attribution des enseignants.",
      addLabel: "Nouvelle classe ou matière",
      rows: [r(1, "L3 Informatique", "8 matières · 42 étudiants", "Active"), r(2, "Bases de données → M. Rakoto", "Attribution enseignant", "Active")],
      endpoints: [
        { method: "POST", path: "/universities/{id}/levels", desc: "Créer un niveau (L1…M2)" },
        { method: "POST", path: "/classes", desc: "Créer une classe" },
        { method: "POST", path: "/subjects", desc: "Créer une matière" },
        { method: "POST", path: "/subjects/{id}/teachers", desc: "Attribuer un enseignant" },
        { method: "POST", path: "/classes/{id}/delegates", desc: "Nommer un délégué" },
      ],
    },
    {
      key: "utilisateurs",
      label: "Utilisateurs & rôles",
      intro: "Comptes, rôles et suspension.",
      review: true,
      rows: [r(1, "Patrick Nomentsoa", "Étudiant · L3 Informatique", "Actif"), r(2, "Hanta Rakoto", "Enseignant · demande de compte", "En attente"), r(3, "Compte suspect", "Inscription sans classe", "En attente")],
      endpoints: [
        { method: "GET", path: "/users?role=&class=&q=", desc: "Rechercher des utilisateurs" },
        { method: "PATCH", path: "/users/{user_id}", desc: "Activer / suspendre un compte" },
        { method: "PUT", path: "/users/{user_id}/roles", desc: "Changer les rôles (table séparée)" },
        { method: "DELETE", path: "/users/{user_id}", desc: "Supprimer un compte" },
      ],
    },
    {
      key: "invitations",
      label: "Codes d’invitation",
      intro: "L’inscription se fait uniquement avec un code d’université.",
      addLabel: "Générer un code",
      rows: [r(1, "EMIT-L3INFO-2026", "Étudiant · L3 Informatique · 38/50 utilisés", "Actif"), r(2, "EMIT-PROF-7Q2K", "Enseignant · 1 utilisation", "Expiré")],
      endpoints: [
        { method: "POST", path: "/invitations", desc: "Générer un code (rôle, classe, quota, expiration)" },
        { method: "GET", path: "/invitations", desc: "Lister les codes" },
        { method: "DELETE", path: "/invitations/{code}", desc: "Révoquer un code" },
        { method: "POST", path: "/auth/register", desc: "Inscription avec code (public)" },
      ],
    },
    {
      key: "journal",
      label: "Journal & statistiques",
      intro: "Actions sensibles journalisées et indicateurs de la plateforme.",
      rows: [r(1, "Rôle modifié : Hanta R. → enseignant", "Par admin · 7 oct. 09:12", "Journalisé"), r(2, "Code révoqué EMIT-PROF-7Q2K", "Par admin · 6 oct.", "Journalisé")],
      endpoints: [
        { method: "GET", path: "/audit-logs", desc: "Journal des actions sensibles" },
        { method: "GET", path: "/stats/overview", desc: "Statistiques (membres, contenus, signalements)" },
      ],
    },
  ],
};
