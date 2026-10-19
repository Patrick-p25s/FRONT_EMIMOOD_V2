import { useState } from "react";
import { ArrowRight, Code2, Database, Kanban } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Heading } from "@/components/emimood/molecules/Heading";
import { Avatar } from "@/components/emimood/atoms/Avatar";
import { courses } from "@/components/emimood/data/courses";
import { CourseDetail } from "@/components/emimood/organisms/CourseDetail";

export function CoursesPage() {
  const [selected, setSelected] = useState<(typeof courses)[number] | null>(null);
  const [chapter, setChapter] = useState(0);
  const [open, setOpen] = useState<number | null>(null);
  if (open !== null)
    return (
      <div className="page">
        <CourseDetail courseId={open} onBack={() => setOpen(null)} />
      </div>
    );
  return (
    <div className="page">
      <Heading title="Mes cours" subtitle="Votre semestre, une connaissance à la fois." />
      <div className="filter-row">
        <span className="tag">L3 Informatique</span>
        <span className="tag">Semestre 5</span>
        <span className="small">Année universitaire 2026 – 2027 · Démonstration</span>
      </div>
      <div className="content-grid">
        {courses.map((c, i) => {
          const Icon = [Code2, Database, Kanban][i] ?? Code2;
          return (
            <article className="item-card" key={c.id}>
              <div className="flex items-center justify-between">
                <span className="stat-icon">
                  <Icon />
                </span>
                <span className="tag">{c.code}</span>
              </div>
              <h2>{c.title}</h2>
              <p>{c.description}</p>
              <div className="flex gap-2 items-center">
                <Avatar initials={i === 0 ? "AR" : i === 1 ? "RH" : "PR"} />
                <span className="small">{c.teacher}</span>
              </div>
              <div className="progress-track">
                <div className={`progress-fill p${c.progress}`} />
              </div>
              <div className="flex justify-between small">
                <span>{c.chapters} chapitres</span>
                <span>{c.progress}% parcouru</span>
              </div>
              <Button variant="outline" className="w-full mt-5" onClick={() => setOpen(c.id)}>
                Voir les chapitres <ArrowRight />
              </Button>
            </article>
          );
        })}
      </div>
      <Dialog
        open={selected !== null}
        onOpenChange={(open) => {
          if (!open) setSelected(null);
        }}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{selected?.title}</DialogTitle>
            <DialogDescription>
              {selected?.teacher} · {selected?.code}
            </DialogDescription>
          </DialogHeader>
          <div className="detail-content">
            <span className="tag">Cours officiel · Aperçu</span>
            <h3>{selected?.chapter}</h3>
            {chapter === 0 ? (
              <>
                <p>
                  Ce chapitre présente les notions essentielles, suivies d’une mise en pratique et
                  d’exercices guidés.
                </p>
                <p className="small mt-4">
                  Le support complet sera disponible lorsque les contenus de l’université seront
                  importés.
                </p>
              </>
            ) : (
              <>
                <h3>Exercice de mise en pratique</h3>
                <p>
                  Identifiez les concepts clés du chapitre et rédigez un exemple d’application pour
                  votre projet universitaire.
                </p>
              </>
            )}
            <Button className="mt-5" onClick={() => setChapter(chapter === 0 ? 1 : 0)}>
              {chapter === 0 ? "Voir l’exercice" : "Revenir au chapitre"}
              <ArrowRight />
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
