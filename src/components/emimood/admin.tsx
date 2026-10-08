import { useState } from "react";
import { Check, X, Trash2, Plus, Server } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Heading } from "./shell";

type Endpoint = { method: "GET" | "POST" | "PATCH" | "PUT" | "DELETE"; path: string; desc: string };
type Row = { id: number; title: string; meta: string; status: string };
type Section = {
  key: string;
  label: string;
  intro: string;
  addLabel?: string;
  review?: boolean;
  rows: Row[];
  endpoints: Endpoint[];
};
export type RoleConsole = { title: string; subtitle: string; badge: string; sections: Section[] };

const r = (id: number, title: string, meta: string, status: string): Row => ({ id, title, meta, status });

export const teacherConsole: RoleConsole = {
  title: "Espace enseignant",
  subtitle: "Gérez vos classes, cours, évaluations et notes — uniquement pour les matières qui vous sont attribuées.",
  badge: "Enseignant · Base de données L3",
  sections: [
    {
      key: "classes",
      label: "Mes classes",
      intro: "Classes et matières attribuées par l’administration.",
      rows: [r(1, "L3 Informatique — Bases de données", "42 étudiants · Semestre 5", "Active"), r(2, "L2 Informatique — Algorithmique", "55 étudiants · Semestre 3", "Active")],
      endpoints: [
        { method: "GET", path: "/teachers/me/classes", desc: "Classes et matières attribuées" },
        { method: "GET", path: "/classes/{class_id}/students", desc: "Liste des étudiants d’une classe" },
      ],
    },
    {
      key: "cours",
      label: "Cours & chapitres",
      intro: "Créez des cours, ajoutez des chapitres et publiez-les.",
      addLabel: "Nouveau chapitre",
      rows: [r(1, "Chapitre 4 — Jointures SQL", "Bases de données · publié le 2 oct.", "Publié"), r(2, "Chapitre 5 — Normalisation", "Bases de données", "Brouillon")],
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
      rows: [r(1, "TD 3 — Requêtes imbriquées.pdf", "Partagé par Hery R. (étudiant)", "En attente"), r(2, "Support de cours — Chapitre 4.pdf", "Officiel", "Publié")],
      endpoints: [
        { method: "POST", path: "/resources", desc: "Téléverser une ressource officielle (multipart)" },
        { method: "GET", path: "/resources?status=pending&subject={id}", desc: "Ressources étudiantes à valider" },
        { method: "PATCH", path: "/resources/{resource_id}/review", desc: "Approuver ou refuser" },
        { method: "DELETE", path: "/resources/{resource_id}", desc: "Retirer une ressource" },
      ],
    },
    {
      key: "evaluations",
      label: "Évaluations",
      intro: "Créez des QCM ou devoirs, fixez la date limite et corrigez les copies.",
      addLabel: "Nouvelle évaluation",
      rows: [r(1, "QCM — Jointures SQL", "10 questions · limite 15 oct. · 31/42 rendus", "Ouverte"), r(2, "Devoir — Modèle relationnel", "Rendu fichier · 42/42 rendus", "À corriger")],
      endpoints: [
        { method: "POST", path: "/evaluations", desc: "Créer une évaluation (QCM, devoir)" },
        { method: "POST", path: "/evaluations/{id}/questions", desc: "Ajouter des questions" },
        { method: "PATCH", path: "/evaluations/{id}", desc: "Ouvrir / fermer / modifier la date limite" },
        { method: "GET", path: "/evaluations/{id}/submissions", desc: "Copies rendues" },
        { method: "PUT", path: "/submissions/{submission_id}/grade", desc: "Noter une copie avec commentaire" },
        { method: "POST", path: "/evaluations/{id}/publish-results", desc: "Publier les résultats" },
      ],
    },
    {
      key: "annonces",
      label: "Annonces",
      intro: "Publiez une annonce visible par une classe ou une matière.",
      addLabel: "Nouvelle annonce",
      rows: [r(1, "Rattrapage TP jeudi 14h", "L3 Informatique", "Publiée")],
      endpoints: [
        { method: "POST", path: "/posts", desc: "Publier une annonce (visibilité : classe, matière)" },
        { method: "POST", path: "/notifications/broadcast", desc: "Notifier les étudiants concernés" },
      ],
    },
  ],
};

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
      rows: [r(1, "Commentaire injurieux sous « Projet tutoré »", "Signalé 3 fois · il y a 2 h", "En attente"), r(2, "Publication hors sujet (vente)", "Signalé 1 fois · hier", "En attente")],
      endpoints: [
        { method: "GET", path: "/reports?scope=class&status=pending", desc: "Signalements de la classe" },
        { method: "PATCH", path: "/reports/{report_id}", desc: "Valider ou rejeter un signalement" },
        { method: "POST", path: "/posts/{post_id}/hide", desc: "Masquer une publication" },
        { method: "DELETE", path: "/comments/{comment_id}", desc: "Supprimer un commentaire" },
      ],
    },
    {
      key: "publications",
      label: "Publications à valider",
      intro: "Publications d’étudiants en attente avant diffusion à la classe.",
      review: true,
      rows: [r(1, "Groupe de révision SQL samedi", "Par Fanja A.", "En attente"), r(2, "Partage de notes — Réseaux", "Par Tiana M.", "En attente")],
      endpoints: [
        { method: "GET", path: "/posts?scope=class&status=pending", desc: "Publications en attente" },
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
        { method: "POST", path: "/classes/{class_id}/announcements", desc: "Publier une annonce de classe" },
        { method: "POST", path: "/conversations/class/{class_id}/messages", desc: "Message au groupe de classe" },
      ],
    },
    {
      key: "historique",
      label: "Historique",
      intro: "Vos actions de modération sont journalisées.",
      rows: [r(1, "Publication masquée", "« Vente de téléphone » · 6 oct.", "Journalisé")],
      endpoints: [{ method: "GET", path: "/audit-logs?actor=me", desc: "Mes actions de modération" }],
    },
  ],
};

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

const done = ["Publié", "Publiée", "Active", "Actif", "Ouverte", "Approuvé", "Journalisé"];

function SectionPanel({ section }: { section: Section }) {
  const [rows, setRows] = useState(section.rows);
  const [draft, setDraft] = useState("");
  const setStatus = (id: number, status: string) =>
    setRows((rs) => rs.map((x) => (x.id === id ? { ...x, status } : x)));
  return (
    <div className="grid gap-5 lg:grid-cols-[1fr_340px]">
      <section className="settings-section">
        <p className="subtitle mb-4">{section.intro}</p>
        {section.addLabel && (
          <form
            className="mb-4 flex gap-2"
            onSubmit={(e) => {
              e.preventDefault();
              if (!draft.trim()) return;
              setRows((rs) => [{ id: Date.now(), title: draft.trim(), meta: "Ajouté à l’instant", status: "Brouillon" }, ...rs]);
              setDraft("");
            }}
          >
            <Input value={draft} onChange={(e) => setDraft(e.target.value)} placeholder={section.addLabel} />
            <Button type="submit">
              <Plus /> Ajouter
            </Button>
          </form>
        )}
        <div className="document-list">
          {rows.map((row) => (
            <div key={row.id} className="document-row flex-wrap gap-3">
              <div className="min-w-0 flex-1">
                <strong className="text-sm">{row.title}</strong>
                <p className="small">{row.meta}</p>
              </div>
              <span className={`tag ${done.includes(row.status) ? "text-success" : ""}`}>{row.status}</span>
              <div className="flex gap-1">
                {section.review && row.status === "En attente" && (
                  <>
                    <Button size="sm" variant="outline" onClick={() => setStatus(row.id, "Approuvé")} aria-label="Approuver">
                      <Check />
                    </Button>
                    <Button size="sm" variant="outline" onClick={() => setStatus(row.id, "Refusé")} aria-label="Refuser">
                      <X />
                    </Button>
                  </>
                )}
                {row.status === "Brouillon" && (
                  <Button size="sm" variant="outline" onClick={() => setStatus(row.id, "Publié")}>
                    Publier
                  </Button>
                )}
                <Button size="sm" variant="ghost" onClick={() => setRows((rs) => rs.filter((x) => x.id !== row.id))} aria-label="Supprimer">
                  <Trash2 />
                </Button>
              </div>
            </div>
          ))}
          {rows.length === 0 && <p className="empty">Aucun élément.</p>}
        </div>
      </section>
      <aside className="settings-section">
        <h2 className="flex items-center gap-2">
          <Server size={16} /> Endpoints FastAPI
        </h2>
        <p className="small mb-3">Préfixe suggéré : /api/v1</p>
        <ul className="grid gap-3">
          {section.endpoints.map((ep) => (
            <li key={ep.method + ep.path}>
              <code className="text-xs">
                <strong className="text-primary">{ep.method}</strong> {ep.path}
              </code>
              <p className="small">{ep.desc}</p>
            </li>
          ))}
        </ul>
      </aside>
    </div>
  );
}

export function RoleConsolePage({ config }: { config: RoleConsole }) {
  return (
    <div className="page">
      <Heading title={config.title} subtitle={config.subtitle} action={<span className="tag">{config.badge}</span>} />
      <p className="small mb-4">Démonstration : les actions ne sont pas enregistrées.</p>
      <Tabs defaultValue={config.sections[0]?.key ?? ""}>
        <TabsList className="mb-4 h-auto flex-wrap justify-start">
          {config.sections.map((s) => (
            <TabsTrigger key={s.key} value={s.key}>
              {s.label}
            </TabsTrigger>
          ))}
        </TabsList>
        {config.sections.map((s) => (
          <TabsContent key={s.key} value={s.key}>
            <SectionPanel section={s} />
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
}
