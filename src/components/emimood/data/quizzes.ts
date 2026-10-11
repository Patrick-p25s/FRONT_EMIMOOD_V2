
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
