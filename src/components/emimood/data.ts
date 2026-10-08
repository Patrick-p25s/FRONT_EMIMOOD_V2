export const courses = [
  {
    id: 1,
    title: "Développement web",
    code: "INF 302",
    teacher: "Pr. Rakoto Andry",
    chapters: 12,
    progress: 65,
    icon: "code",
    description: "HTML, CSS, JavaScript et applications web modernes.",
    chapter: "Chapitre 7 · Introduction à React",
  },
  {
    id: 2,
    title: "Base de données",
    code: "INF 304",
    teacher: "Pr. Rasoanaivo Hery",
    chapters: 10,
    progress: 40,
    icon: "database",
    description: "Modélisation relationnelle, SQL et gestion des données.",
    chapter: "Chapitre 4 · Les jointures SQL",
  },
  {
    id: 3,
    title: "Gestion de projet",
    code: "MAN 301",
    teacher: "Pr. Razafindrakoto",
    chapters: 8,
    progress: 80,
    icon: "project",
    description: "Méthodes agiles et organisation des projets numériques.",
    chapter: "Chapitre 6 · La méthode Scrum",
  },
];
export const resources = [
  {
    id: 1,
    title: "Introduction à React.pdf",
    subject: "Développement web",
    author: "Pr. Rakoto Andry",
    size: "2,4 Mo",
    official: true,
  },
  {
    id: 2,
    title: "Exercices SQL — Série 3.pdf",
    subject: "Base de données",
    author: "Pr. Rasoanaivo Hery",
    size: "1,2 Mo",
    official: true,
  },
  {
    id: 3,
    title: "Fiche de révision — Algorithmique.pdf",
    subject: "Algorithmique",
    author: "Miora R.",
    size: "850 Ko",
    official: false,
  },
  {
    id: 4,
    title: "Méthodologie de gestion de projet.pdf",
    subject: "Gestion de projet",
    author: "Pr. Razafindrakoto",
    size: "3,1 Mo",
    official: true,
  },
];
export const initialPosts = [
  {
    id: 1,
    author: "Andry Rakoto",
    initials: "AR",
    role: "Enseignant · Développement web",
    time: "Il y a 35 min",
    category: "Annonce",
    title: "Le nouveau chapitre sur React est disponible !",
    text: "Bonjour à tous ! Le chapitre 7 est maintenant disponible dans votre espace cours. Vous y trouverez le support et les exercices pour notre prochaine séance. Bonne lecture !",
    attachment: "Chapitre 7 — Introduction à React.pdf",
    likes: 24,
    comments: 6,
  },
  {
    id: 2,
    author: "Miora Rasoarivelo",
    initials: "MR",
    role: "Étudiante · L3 Informatique",
    time: "Il y a 2 h",
    category: "Projet",
    title: "Notre premier projet collaboratif",
    text: "Avec notre équipe, nous travaillons sur une application pour faciliter le partage de ressources entre étudiants. Si vous aimez le développement web et souhaitez échanger des idées, discutons-en !",
    likes: 38,
    comments: 12,
  },
  {
    id: 3,
    author: "Association des étudiants EMIT",
    initials: "AE",
    role: "Vie universitaire",
    time: "Il y a 3 h",
    category: "Événement",
    title: "Une nouvelle semaine, de nouvelles rencontres",
    text: "Rendez-vous à la bibliothèque pour notre atelier de partage de connaissances. Toutes les mentions sont les bienvenues.",
    likes: 16,
    comments: 3,
  },
];
export const opportunities = [
  {
    id: 1,
    type: "Hackathon",
    title: "Hackathon Innovation 2026",
    org: "Communauté EMIT",
    text: "48 heures pour imaginer des solutions qui font avancer notre communauté.",
    date: "24 – 25 octobre 2026",
  },
  {
    id: 2,
    type: "Stage",
    title: "Développeur web junior",
    org: "Entreprise partenaire · Fianarantsoa",
    text: "Participez à des projets web au sein d’une équipe de développement.",
    date: "Candidatures ouvertes",
  },
  {
    id: 3,
    type: "Bourse",
    title: "Programme de mobilité académique",
    org: "Relations internationales",
    text: "Une opportunité pour enrichir votre parcours et découvrir une nouvelle université.",
    date: "Dossier à préparer",
  },
];
export function pageHead(title: string, description: string) {
  return {
    meta: [
      { title: `${title} — EMIMood` },
      { name: "description", content: description },
      { property: "og:title", content: `${title} — EMIMood` },
      { property: "og:description", content: description },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  };
}

export const courseChapters = [
  {
    id: 1,
    title: "Développement web",
    chapters: [
      {
        title: "HTML et structure des pages",
        content: [
          "Le HTML décrit la structure d’une page : titres, paragraphes, listes, liens et formulaires.",
          "Exercice : réalisez la page d’accueil de votre projet avec une structure sémantique.",
        ],
      },
      {
        title: "CSS et mise en page",
        content: [
          "Le CSS contrôle les couleurs, les espacements et la disposition grâce à Flexbox et Grid.",
          "Exercice : adaptez votre page pour mobile et ordinateur.",
        ],
      },
      {
        title: "JavaScript moderne",
        content: [
          "Variables, fonctions, tableaux et objets : les bases pour rendre une page interactive.",
        ],
      },
      {
        title: "Introduction à React",
        content: [
          "React construit des interfaces avec des composants réutilisables et un état.",
          "Regardez la vidéo puis créez votre premier composant.",
        ],
        video: "SqcY0GlETPk",
      },
    ],
  },
  {
    id: 2,
    title: "Base de données",
    chapters: [
      {
        title: "Modèle relationnel",
        content: ["Tables, lignes, colonnes, clés primaires et clés étrangères."],
      },
      { title: "Requêtes SELECT", content: ["SELECT, WHERE, ORDER BY : interroger une table."] },
      {
        title: "Les jointures SQL",
        content: ["INNER JOIN, LEFT JOIN : combiner plusieurs tables à partir d’une clé commune."],
        video: "9yeOJ0ZMUYw",
      },
    ],
  },
  {
    id: 3,
    title: "Gestion de projet",
    chapters: [
      {
        title: "Cycle de vie d’un projet",
        content: ["Initialisation, planification, exécution, suivi et clôture."],
      },
      {
        title: "Méthodes agiles",
        content: ["Itérations courtes, livraisons fréquentes et collaboration avec le client."],
      },
      {
        title: "La méthode Scrum",
        content: ["Rôles (Product Owner, Scrum Master, équipe), sprints et cérémonies."],
      },
    ],
  },
];
export function docPages(title: string, subject: string, author: string) {
  return [
    {
      heading: title.replace(/\.pdf$/, ""),
      body: [
        `Document de ${subject}, préparé par ${author}.`,
        "Sommaire : 1. Objectifs · 2. Notions essentielles · 3. Exercices.",
      ],
    },
    {
      heading: "1. Objectifs",
      body: [
        "Comprendre les notions fondamentales du chapitre.",
        "Savoir les appliquer dans un projet universitaire.",
      ],
    },
    {
      heading: "2. Notions essentielles",
      body: [
        "Chaque notion est illustrée par un exemple commenté.",
        "Prenez des notes et comparez vos réponses avec votre groupe.",
      ],
    },
    {
      heading: "3. Exercices",
      body: [
        "Exercice 1 : résumez le chapitre en cinq points.",
        "Exercice 2 : proposez un exemple d’application personnel.",
      ],
    },
  ];
}
export type Quiz = {
  title: string;
  questions: { text: string; options: string[]; answer: number }[];
};
export const quizzes: Quiz[] = [
  {
    title: "Base de données",
    questions: [
      {
        text: "Quelle commande permet de lire des données ?",
        options: ["INSERT", "SELECT", "DELETE", "DROP"],
        answer: 1,
      },
      {
        text: "Une clé primaire doit être…",
        options: ["Unique et non nulle", "Toujours un texte", "Facultative", "Dupliquée"],
        answer: 0,
      },
      {
        text: "LEFT JOIN renvoie…",
        options: [
          "Seulement les correspondances",
          "Toutes les lignes de la table de gauche",
          "Toutes les lignes de droite",
          "Aucune ligne",
        ],
        answer: 1,
      },
    ],
  },
  {
    title: "Gestion de projet",
    questions: [
      {
        text: "Qui priorise le backlog en Scrum ?",
        options: ["Le Scrum Master", "Le Product Owner", "Le client final", "Le testeur"],
        answer: 1,
      },
      {
        text: "Un sprint dure généralement…",
        options: ["1 à 4 semaines", "6 mois", "1 jour", "1 an"],
        answer: 0,
      },
    ],
  },
];
