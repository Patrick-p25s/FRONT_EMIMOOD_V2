import { useState } from "react";
import { ArrowLeft, ArrowRight, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { courseChapters } from "@/components/emimood/data/chapters";

export function CourseDetail({ courseId, onBack }: { courseId: number; onBack: () => void }) {
  const course = courseChapters.find((c) => c.id === courseId)!;
  const [index, setIndex] = useState(0);
  const [done, setDone] = useState<number[]>([]);
  const ch = course.chapters[index]!;

  return (
    <div>
      <Button variant="ghost" onClick={onBack} className="mb-3">
        <ArrowLeft />
        Toutes les matières
      </Button>
      <div className="grid gap-5 md:grid-cols-[260px_1fr]">
        <aside className="document-list h-fit">
          {course.chapters.map((c, i) => (
            <button
              key={c.title}
              onClick={() => setIndex(i)}
              className={`document-row text-left w-full ${i === index ? "ring-2 ring-primary" : ""}`}
            >
              {done.includes(i) ? (
                <CheckCircle2 size={18} className="text-success shrink-0" />
              ) : (
                <span className="small w-4.5">{i + 1}</span>
              )}
              <span className="text-sm font-medium">{c.title}</span>
            </button>
          ))}
        </aside>
        <article className="item-card">
          <span className="tag">
            {course.title} · Chapitre {index + 1}
          </span>
          <h2>{ch.title}</h2>
          {ch.content.map((p, i) => (
            <p key={i}>{p}</p>
          ))}
          {ch.video && (
            <div className="aspect-video rounded-lg overflow-hidden mt-3">
              <iframe
                className="w-full h-full"
                src={`https://www.youtube-nocookie.com/embed/${ch.video}`}
                title={ch.title}
                allowFullScreen
              />
            </div>
          )}
          <div className="flex justify-between mt-5 gap-2 flex-wrap">
            <Button variant="outline" disabled={index === 0} onClick={() => setIndex(index - 1)}>
              <ArrowLeft />
              Précédent
            </Button>
            <Button
              onClick={() => {
                if (!done.includes(index)) setDone([...done, index]);
                if (index < course.chapters.length - 1) setIndex(index + 1);
              }}
            >
              {index < course.chapters.length - 1 ? (
                <>
                  Terminé, chapitre suivant
                  <ArrowRight />
                </>
              ) : (
                <>
                  Marquer comme terminé
                  <CheckCircle2 />
                </>
              )}
            </Button>
          </div>
        </article>
      </div>
    </div>
  );
}

/* ---------- Répondre à une évaluation ---------- */
