import { useState } from "react";
import { Link } from "@tanstack/react-router";
import { ArrowRight, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Heading } from "@/components/emimood/molecules/Heading";
import { QuizRunner } from "@/components/emimood/organisms/QuizRunner";
import { quizzes } from "@/components/emimood/data/quizzes";

export function EvaluationsPage() {
  const [tab, setTab] = useState("À venir");
  const [selected, setSelected] = useState<string | null>(null);
  const [taking, setTaking] = useState<string | null>(null);
  const [results, setResults] = useState<Record<string, number>>({});
  const quiz = quizzes.find((q) => q.title === taking);
  if (quiz)
    return (
      <div className="page">
        <QuizRunner
          quiz={quiz}
          onClose={(s) => {
            if (s !== undefined)
              setResults({
                ...results,
                [quiz.title]: Math.round((s / quiz.questions.length) * 20),
              });
            setTaking(null);
          }}
        />
      </div>
    );
  return (
    <div className="page">
      <Heading
        title="Mes évaluations"
        subtitle="Préparez votre prochaine étape et retrouvez vos résultats."
      />
      <div className="filter-row">
        {["À venir", "Résultats"].map((t) => (
          <Button variant={tab === t ? "secondary" : "outline"} onClick={() => setTab(t)} key={t}>
            {t}
          </Button>
        ))}
      </div>
      {tab === "À venir" ? (
        <div className="content-grid">
          {[
            {
              title: "Base de données",
              date: "8 octobre 2026 · 09:00",
              time: "60 minutes",
              questions: "20 questions",
            },
            {
              title: "Gestion de projet",
              date: "15 octobre 2026 · 10:00",
              time: "60 minutes",
              questions: "15 questions",
            },
          ].map((e) => (
            <article className="item-card" key={e.title}>
              <span className="tag warm">À venir</span>
              <h2>{e.title}</h2>
              <p>{e.date}</p>
              <p>
                {e.time} · {e.questions}
                <br />
                QCM · En ligne
              </p>
              <div className="flex gap-2 flex-wrap">
                {results[e.title] !== undefined ? (
                  <span className="tag">Rendu · {results[e.title]} / 20</span>
                ) : (
                  <Button onClick={() => setTaking(e.title)}>
                    Commencer
                    <ArrowRight />
                  </Button>
                )}
                <Button variant="outline" onClick={() => setSelected(e.title)}>
                  Informations
                </Button>
              </div>
            </article>
          ))}
        </div>
      ) : (
        <div className="document-list">
          <div className="document-row">
            <CheckCircle2 className="text-success" />
            <div className="flex-1">
              <h2>Algorithmique — Évaluation 1</h2>
              <p className="small">28 septembre 2026 · Résultat illustratif</p>
            </div>
            <strong className="text-success text-xl">16 / 20</strong>
          </div>
          {Object.entries(results).map(([t, n]) => (
            <div className="document-row" key={t}>
              <CheckCircle2 className="text-success" />
              <div className="flex-1">
                <h2>{t}</h2>
                <p className="small">Rendu à l’instant · Démonstration</p>
              </div>
              <strong className="text-success text-xl">{n} / 20</strong>
            </div>
          ))}
        </div>
      )}
      <Dialog
        open={selected !== null}
        onOpenChange={(o) => {
          if (!o) setSelected(null);
        }}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Évaluation · {selected}</DialogTitle>
            <DialogDescription>Informations de démonstration</DialogDescription>
          </DialogHeader>
          <p>QCM en ligne. Cliquez sur « Commencer » pour répondre aux questions.</p>
          <p className="small">
            Questions de démonstration : les vraies épreuves seront configurées par votre
            enseignant.
          </p>
          <Link to="/cours" className="text-success flex items-center gap-2">
            Réviser mes cours
            <ArrowRight size={16} />
          </Link>
        </DialogContent>
      </Dialog>
    </div>
  );
}
