import { Plus } from "lucide-react";
import { RoleConsole, r } from "@/components/emimood/data/consoles/types";

export const teacherConsole: RoleConsole = {
  title: "Espace enseignant",
  subtitle:
    "Gérez vos classes, cours, évaluations et notes — uniquement pour les matières qui vous sont attribuées.",
  badge: "Enseignant · Base de données L3",
  sections: [
    {
      key: "classes",
      label: "Mes classes",
      intro: "Classes et matières attribuées par l’administration.",
      rows: [
        r(1, "L3 Informatique — Bases de données", "42 étudiants · Semestre 5", "Active"),
        r(2, "L2 Informatique — Algorithmique", "55 étudiants · Semestre 3", "Active"),
      ],
      endpoints: [
        { method: "GET", path: "/teachers/me/classes", desc: "Classes et matières attribuées" },
        {
          method: "GET",
          path: "/classes/{class_id}/students",
          desc: "Liste des étudiants d’une classe",
        },
      ],
    },
    {
      key: "matieres",
      label: "Matières",
      intro: "Créez les matières de vos classes (dans votre université).",
      addLabel: "Nouvelle matière",
      rows: [
        r(1, "Bases de données", "L3 Informatique · 4 crédits", "Active"),
        r(2, "Algorithmique", "L2 Informatique · 5 crédits", "Active"),
      ],
      endpoints: [
        { method: "GET", path: "/teachers/me/subjects", desc: "Mes matières" },
        { method: "POST", path: "/subjects", desc: "Créer une matière (classe de mon université)" },
        { method: "PATCH", path: "/subjects/{subject_id}", desc: "Modifier une matière" },
      ],
    },
    {
      key: "cours",
      label: "Cours & chapitres",
      intro: "Créez des cours, ajoutez des chapitres et publiez-les.",
      addLabel: "Nouveau chapitre",
      rows: [
        r(1, "Chapitre 4 — Jointures SQL", "Bases de données · publié le 2 oct.", "Publié"),
        r(2, "Chapitre 5 — Normalisation", "Bases de données", "Brouillon"),
      ],
      endpoints: [
        { method: "GET", path: "/courses?teacher=me", desc: "Mes cours" },
        { method: "POST", path: "/courses", desc: "Créer un cours" },
        { method: "POST", path: "/courses/{course_id}/chapters", desc: "Ajouter un chapitre" },
        { method: "PATCH", path: "/chapters/{chapter_id}", desc: "Modifier / publier un chapitre" },
        { method: "DELETE", path: "/chapters/{chapter_id}", desc: "Supprimer un chapitre" },
      ],
    },
    {
      key: "ressources",
      label: "Ressources",
      intro: "Documents officiels et validation des ressources partagées par les étudiants.",
      addLabel: "Nouvelle ressource",
      review: true,
      rows: [
        r(1, "TD 3 — Requêtes imbriquées.pdf", "Partagé par Hery R. (étudiant)", "En attente"),
        r(2, "Support de cours — Chapitre 4.pdf", "Officiel", "Publié"),
      ],
      endpoints: [
        {
          method: "POST",
          path: "/resources",
          desc: "Téléverser une ressource officielle (multipart)",
        },
        {
          method: "GET",
          path: "/resources?status=pending&subject={id}",
          desc: "Ressources étudiantes à valider",
        },
        { method: "PATCH", path: "/resources/{resource_id}/review", desc: "Approuver ou refuser" },
        { method: "DELETE", path: "/resources/{resource_id}", desc: "Retirer une ressource" },
      ],
    },
    {
      key: "evaluations",
      label: "Évaluations",
      intro: "Créez des QCM ou devoirs, fixez la date limite et corrigez les copies.",
      addLabel: "Nouvelle évaluation",
      rows: [
        r(1, "QCM — Jointures SQL", "10 questions · limite 15 oct. · 31/42 rendus", "Ouverte"),
        r(2, "Devoir — Modèle relationnel", "Rendu fichier · 42/42 rendus", "À corriger"),
      ],
      endpoints: [
        { method: "POST", path: "/evaluations", desc: "Créer une évaluation (QCM, devoir)" },
        { method: "POST", path: "/evaluations/{id}/questions", desc: "Ajouter des questions" },
        {
          method: "PATCH",
          path: "/evaluations/{id}",
          desc: "Ouvrir / fermer / modifier la date limite",
        },
        { method: "GET", path: "/evaluations/{id}/submissions", desc: "Copies rendues" },
        {
          method: "PUT",
          path: "/submissions/{submission_id}/grade",
          desc: "Noter une copie avec commentaire",
        },
        {
          method: "POST",
          path: "/evaluations/{id}/publish-results",
          desc: "Publier les résultats",
        },
      ],
    },
    {
      key: "resultats",
      label: "Résultats",
      intro: "Résultats de chaque étudiant ayant passé vos évaluations.",
      rows: [
        r(1, "Fanja Andriamalala — QCM Jointures", "17/20 · rendu le 9 oct.", "Publié"),
        r(2, "Hery Rabe — QCM Jointures", "11/20 · rendu le 10 oct.", "À corriger"),
      ],
      endpoints: [
        { method: "GET", path: "/evaluations/{id}/results", desc: "Résultats par étudiant" },
        {
          method: "GET",
          path: "/students/{student_id}/results?subject={id}",
          desc: "Historique d’un étudiant",
        },
        { method: "GET", path: "/evaluations/{id}/results/export", desc: "Export CSV" },
      ],
    },
    {
      key: "feedbacks",
      label: "Feedbacks",
      intro: "Avis des étudiants sur vos cours et chapitres.",
      rows: [
        r(1, "« Le chapitre 4 est très clair »", "Note 5/5 · Bases de données", "Publié"),
        r(2, "« Plus d’exercices SQL svp »", "Note 3/5 · Bases de données", "Publié"),
      ],
      endpoints: [
        { method: "GET", path: "/courses/{course_id}/feedbacks", desc: "Feedbacks d’un cours" },
        {
          method: "POST",
          path: "/courses/{course_id}/feedbacks",
          desc: "(Étudiant) Laisser un avis",
        },
      ],
    },
    {
      key: "annonces",
      label: "Annonces",
      intro: "Publiez une annonce visible par une classe ou une matière.",
      addLabel: "Nouvelle annonce",
      rows: [r(1, "Rattrapage TP jeudi 14h", "L3 Informatique", "Publiée")],
      endpoints: [
        {
          method: "POST",
          path: "/posts",
          desc: "Publier une annonce (visibilité : classe, matière)",
        },
        {
          method: "POST",
          path: "/notifications/broadcast",
          desc: "Notifier les étudiants concernés",
        },
      ],
    },
  ],
};
