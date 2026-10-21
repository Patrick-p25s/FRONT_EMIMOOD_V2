// lib/questionRules.ts : les mêmes règles que le serveur, pour guider avant l'envoi
import type { Question, QuestionType } from "../api/types";

export const QUESTION_TYPES: { value: QuestionType; label: string }[] = [
  { value: "single_choice", label: "Choix unique" },
  { value: "multiple_choice", label: "Choix multiple" },
  { value: "true_false", label: "Vrai / faux" },
  { value: "short_answer", label: "Réponse courte" },
  { value: "open_answer", label: "Réponse ouverte" },
];

export const questionTypeLabel = (type: QuestionType) =>
  QUESTION_TYPES.find((entry) => entry.value === type)?.label ?? type;

/** Réponse courte et ouverte : pas de choix, correction manuelle. */
export const isManual = (type: QuestionType) => type === "short_answer" || type === "open_answer";

export type ChoiceDraft = { content: string; is_correct: boolean };

export function defaultChoices(type: QuestionType): ChoiceDraft[] {
  if (type === "true_false")
    return [
      { content: "Vrai", is_correct: true },
      { content: "Faux", is_correct: false },
    ];
  if (isManual(type)) return [];
  return [
    { content: "", is_correct: true },
    { content: "", is_correct: false },
  ];
}

export function validateChoices(type: QuestionType, choices: ChoiceDraft[]): string | null {
  if (isManual(type)) return null;
  if (choices.some((choice) => choice.content.trim() === ""))
    return "Chaque choix doit avoir un texte.";
  const correct = choices.filter((choice) => choice.is_correct).length;
  if (type === "true_false") {
    if (choices.length !== 2) return "Vrai / faux : deux choix exactement.";
    return correct === 1 ? null : "Il faut exactement une bonne réponse.";
  }
  if (choices.length < 2) return "Il faut au moins deux choix.";
  if (type === "single_choice")
    return correct === 1 ? null : "Il faut exactement une bonne réponse.";
  return correct >= 1 ? null : "Il faut au moins une bonne réponse.";
}

export const validateQuestion = (question: Question) =>
  validateChoices(
    question.question_type,
    question.choices.map((choice) => ({ content: choice.content, is_correct: choice.is_correct })),
  );
