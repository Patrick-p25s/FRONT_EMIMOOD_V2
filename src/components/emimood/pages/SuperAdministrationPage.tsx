import { useMemo, useState } from "react";
import {
  BookOpen,
  Building2,
  ChevronRight,
  CircleAlert,
  GraduationCap,
  LayoutDashboard,
  MoreHorizontal,
  Plus,
  Search,
  ShieldCheck,
  UserCog,
  UsersRound,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

type UniversityState = "Active" | "Désactivée";
type UniversityRow = {
  id: number;
  name: string;
  code: string;
  mentions: number;
  classes: number;
  members: number;
  status: UniversityState;
};
type Person = {
  id: number;
  name: string;
  email: string;
  role: string;
  university: string;
  status: "Actif" | "En attente" | "Suspendu";
};

const initialUniversities: UniversityRow[] = [
  {
    id: 1,
    name: "EMIT — Fianarantsoa",
    code: "EMIT",
    mentions: 3,
    classes: 12,
    members: 1240,
    status: "Active",
  },
  {
    id: 2,
    name: "Université d’Antananarivo",
    code: "UA",
    mentions: 5,
    classes: 18,
    members: 876,
    status: "Active",
  },
  {
    id: 3,
    name: "Institut supérieur de Mahajanga",
    code: "ISM",
    mentions: 2,
    classes: 6,
    members: 315,
    status: "Désactivée",
  },
];

const initialPeople: Person[] = [
  {
    id: 1,
    name: "Hanta Rakoto",
    email: "hanta.rakoto@emit.mg",
    role: "Enseignante",
    university: "EMIT",
    status: "Actif",
  },
  {
    id: 2,
    name: "Patrick Nomentsoa",
    email: "patrick.n@emit.mg",
    role: "Étudiant",
    university: "EMIT",
    status: "Actif",
  },
  {
    id: 3,
    name: "Jean Randria",
    email: "jean.randria@ua.mg",
    role: "Enseignant",
    university: "UA",
    status: "En attente",
  },
  {
    id: 4,
    name: "Compte non vérifié",
    email: "nouveau@ism.mg",
    role: "Étudiant",
    university: "ISM",
    status: "Suspendu",
  },
];

const statusClass: Record<string, string> = {
  Active: "admin-status active",
  Actif: "admin-status active",
  "En attente": "admin-status pending",
  Désactivée: "admin-status disabled",
  Suspendu: "admin-status disabled",
};

export function SuperAdministrationPage() {
  const [universities, setUniversities] = useState(initialUniversities);
  const [people, setPeople] = useState(initialPeople);
  const [query, setQuery] = useState("");
  const [notice, setNotice] = useState<string | null>(null);
  const [activeNav, setActiveNav] = useState("Vue d’ensemble");
  const totalMembers = universities.reduce((total, university) => total + university.members, 0);
  const filteredPeople = useMemo(
    () =>
      people.filter((person) =>
        `${person.name} ${person.email} ${person.university}`
          .toLowerCase()
          .includes(query.toLowerCase()),
      ),
    [people, query],
  );
  const tell = (message: string) => {
    setNotice(message);
    window.setTimeout(() => setNotice(null), 2800);
  };
  const toggleUniversity = (id: number) =>
    setUniversities((items) =>
      items.map((item) =>
        item.id === id
          ? { ...item, status: item.status === "Active" ? "Désactivée" : "Active" }
          : item,
      ),
    );
  const togglePerson = (id: number) =>
    setPeople((items) =>
      items.map((person) =>
        person.id === id
          ? { ...person, status: person.status === "Suspendu" ? "Actif" : "Suspendu" }
          : person,
      ),
    );

  const nav = [
    ["Vue d’ensemble", LayoutDashboard],
    ["Universités", Building2],
    ["Structure académique", BookOpen],
    ["Utilisateurs", UsersRound],
    ["Rôles & accès", ShieldCheck],
  ] as const;

  return (
    <div className="admin-page">
      <div className="admin-topline">
        <span>Administration centrale</span>
        <span className="admin-live">
          <i /> Système opérationnel
        </span>
      </div>
      <header className="admin-hero">
        <div>
          <p className="admin-kicker">Pilotage de la plateforme</p>
          <h1>Super administration</h1>
          <p>
            Gérez les universités, leur structure académique et les accès depuis un seul espace.
          </p>
        </div>
        <Button
          onClick={() =>
            tell("Le formulaire de création d’université est prêt à être relié à l’API.")
          }
        >
          <Plus /> Créer une université
        </Button>
      </header>
      {notice && (
        <div className="admin-notice" role="status">
          {notice}
        </div>
      )}

      <section className="admin-metrics" aria-label="Indicateurs clés">
        <Metric
          icon={<Building2 />}
          value={universities.filter((item) => item.status === "Active").length}
          label="Universités actives"
          detail={`${universities.length} configurées`}
        />
        <Metric
          icon={<UsersRound />}
          value={totalMembers.toLocaleString("fr-FR")}
          label="Utilisateurs inscrits"
          detail="Toutes universités confondues"
        />
        <Metric
          icon={<GraduationCap />}
          value="15"
          label="Mentions académiques"
          detail="36 classes ouvertes"
        />
        <Metric
          icon={<CircleAlert />}
          value={people.filter((person) => person.status === "En attente").length}
          label="Actions à traiter"
          detail="Demandes et invitations"
          attention
        />
      </section>

      <div className="admin-workspace">
        <nav className="admin-nav" aria-label="Sections de l’administration">
          {nav.map(([label, Icon]) => (
            <button
              key={label}
              className={activeNav === label ? "selected" : ""}
              onClick={() => setActiveNav(label)}
            >
              <Icon size={17} />
              {label}
            </button>
          ))}
          <div className="admin-nav-help">
            <ShieldCheck size={18} />
            <strong>Accès sécurisé</strong>
            <span>Toutes les actions sensibles sont journalisées.</span>
          </div>
        </nav>
        <main className="admin-content">
          <section className="admin-section-heading">
            <div>
              <p className="admin-kicker">{activeNav}</p>
              <h2>Universités</h2>
              <p>Activez, désactivez et consultez l’activité de chaque établissement.</p>
            </div>
            <Button
              variant="outline"
              onClick={() => tell("La liste des universités a été actualisée.")}
            >
              Actualiser
            </Button>
          </section>
          <div className="admin-table-card">
            <div className="admin-table-title">
              <div>
                <h3>Établissements</h3>
                <span>{universities.length} universités dans la plateforme</span>
              </div>
              <Button
                size="sm"
                onClick={() => tell("Création d’une université : API POST /universities.")}
              >
                <Plus /> Ajouter
              </Button>
            </div>
            <div className="admin-table-wrap">
              <table>
                <thead>
                  <tr>
                    <th>Université</th>
                    <th>Structure</th>
                    <th>Membres</th>
                    <th>État</th>
                    <th aria-label="Actions" />
                  </tr>
                </thead>
                <tbody>
                  {universities.map((university) => (
                    <tr key={university.id}>
                      <td>
                        <strong>{university.name}</strong>
                        <span>{university.code}</span>
                      </td>
                      <td>
                        {university.mentions} mentions <i>·</i> {university.classes} classes
                      </td>
                      <td>
                        <strong>{university.members.toLocaleString("fr-FR")}</strong>
                      </td>
                      <td>
                        <span className={statusClass[university.status]}>
                          <i />
                          {university.status}
                        </span>
                      </td>
                      <td>
                        <button
                          className="admin-action"
                          onClick={() => {
                            toggleUniversity(university.id);
                            tell(
                              `Université ${university.status === "Active" ? "désactivée" : "activée"} (démonstration).`,
                            );
                          }}
                          aria-label={`Modifier ${university.name}`}
                        >
                          <MoreHorizontal size={19} />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <section className="admin-section-heading admin-users-head">
            <div>
              <p className="admin-kicker">Comptes & permissions</p>
              <h2>Utilisateurs à suivre</h2>
              <p>Recherchez un compte et gérez rapidement son accès.</p>
            </div>
            <Button
              variant="outline"
              onClick={() =>
                tell("Création d’un enseignant : API POST /universities/{id}/teachers.")
              }
            >
              <UserCog /> Créer un enseignant
            </Button>
          </section>
          <div className="admin-table-card">
            <div className="admin-search">
              <Search size={17} />
              <Input
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder="Rechercher par nom, email ou université"
              />
            </div>
            <div className="admin-table-wrap">
              <table>
                <thead>
                  <tr>
                    <th>Utilisateur</th>
                    <th>Rôle</th>
                    <th>Université</th>
                    <th>État</th>
                    <th aria-label="Actions" />
                  </tr>
                </thead>
                <tbody>
                  {filteredPeople.map((person) => (
                    <tr key={person.id}>
                      <td>
                        <strong>{person.name}</strong>
                        <span>{person.email}</span>
                      </td>
                      <td>{person.role}</td>
                      <td>{person.university}</td>
                      <td>
                        <span className={statusClass[person.status]}>
                          <i />
                          {person.status}
                        </span>
                      </td>
                      <td>
                        <button
                          className="admin-action"
                          onClick={() => {
                            togglePerson(person.id);
                            tell(`Accès de ${person.name} mis à jour (démonstration).`);
                          }}
                          aria-label={`Gérer ${person.name}`}
                        >
                          <MoreHorizontal size={19} />
                        </button>
                      </td>
                    </tr>
                  ))}
                  {filteredPeople.length === 0 && (
                    <tr>
                      <td colSpan={5} className="admin-empty">
                        Aucun utilisateur ne correspond à la recherche.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </main>
      </div>
      <section className="admin-path">
        <div>
          <BookOpen />
          <div>
            <strong>Construire une structure académique</strong>
            <span>Université → Mention → Niveau → Année universitaire → Classe</span>
          </div>
        </div>
        <Button
          variant="ghost"
          onClick={() =>
            tell("Les mentions, niveaux et classes utilisent les endpoints documentés.")
          }
        >
          Gérer la structure <ChevronRight />
        </Button>
      </section>
    </div>
  );
}

function Metric({
  icon,
  value,
  label,
  detail,
  attention = false,
}: {
  icon: React.ReactNode;
  value: string | number;
  label: string;
  detail: string;
  attention?: boolean;
}) {
  return (
    <article className={`admin-metric ${attention ? "attention" : ""}`}>
      <span className="admin-metric-icon">{icon}</span>
      <div>
        <strong>{value}</strong>
        <span>{label}</span>
        <small>{detail}</small>
      </div>
    </article>
  );
}
