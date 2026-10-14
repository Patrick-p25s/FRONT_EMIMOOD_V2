
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
