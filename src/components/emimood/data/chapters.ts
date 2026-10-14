
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
