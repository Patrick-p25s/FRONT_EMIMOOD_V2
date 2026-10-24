import { useState } from "react";
import { ArrowLeft, CheckCircle2, XCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Heading } from "@/components/emimood/molecules/Heading";
import { type Quiz } from "@/components/emimood/data/quizzes";

export function QuizRunner({ quiz, onClose }: { quiz: Quiz; onClose: (score?: number) => void }) {
  const [answers, setAnswers] = useState<Record<number, number>>({});
  const [submitted, setSubmitted] = useState(false);
  const score = quiz.questions.reduce((s, q, i) => s + (answers[i] === q.answer ? 1 : 0), 0);
  const total = quiz.questions.length;
  return (
    <div>
      <Button
        variant="ghost"
        onClick={() => onClose(submitted ? score : undefined)}
        className="mb-3"
      >
        <ArrowLeft />
        Retour aux évaluations
      </Button>
      <Heading title={quiz.title} subtitle={`${total} questions · QCM · Démonstration`} />
      {submitted && (
        <div className="item-card mb-5">
          <h2>Résultat : {Math.round((score / total) * 20)} / 20</h2>
          <p>
            {score} bonne(s) réponse(s) sur {total}.
          </p>
        </div>
      )}
      <div className="flex flex-col gap-4 max-w-3xl">
        {quiz.questions.map((q, i) => (
          <fieldset key={i} className="item-card">
            <legend className="sr-only">Question {i + 1}</legend>
            <h2 className="text-base">
              {i + 1}. {q.text}
            </h2>
            <div className="flex flex-col gap-2 mt-2">
              {q.options.map((o, j) => {
                const chosen = answers[i] === j;
                const correct = submitted && j === q.answer;
                const wrong = submitted && chosen && j !== q.answer;
                return (
                  <label
                    key={j}
                    className={`flex items-center gap-3 rounded-md border p-3 cursor-pointer ${chosen ? "border-primary" : ""} ${correct ? "border-success bg-success/10" : ""} ${wrong ? "border-destructive bg-destructive/10" : ""}`}
                  >
                    <input
                      type="radio"
                      name={`q${i}`}
                      checked={chosen}
                      disabled={submitted}
                      onChange={() => setAnswers({ ...answers, [i]: j })}
                      className="accent-(--primary)"
                    />
                    <span className="flex-1">{o}</span>
                    {correct && <CheckCircle2 size={18} className="text-success" />}
                    {wrong && <XCircle size={18} className="text-destructive" />}
                  </label>
                );
              })}
            </div>
          </fieldset>
        ))}
        {!submitted ? (
          <Button disabled={Object.keys(answers).length < total} onClick={() => setSubmitted(true)}>
            Soumettre mes réponses ({Object.keys(answers).length}/{total})
          </Button>
        ) : (
          <Button variant="outline" onClick={() => onClose(score)}>
            Terminer
          </Button>
        )}
      </div>
    </div>
  );
}
