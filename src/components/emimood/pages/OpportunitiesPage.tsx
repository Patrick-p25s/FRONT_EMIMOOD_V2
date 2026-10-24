import { useState } from "react";
import { ArrowUpRight, Bookmark, CalendarDays, MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Heading } from "@/components/emimood/molecules/Heading";
import { opportunities } from "@/components/emimood/data/opportunities";

export function OpportunitiesPage() {
  const [selected, setSelected] = useState<(typeof opportunities)[number] | null>(null);
  const [saved, setSaved] = useState<number[]>([]);
  return (
    <div className="page">
      <Heading title="Opportunités" subtitle="Votre prochain défi commence peut-être ici." />
      <div className="content-grid">
        {opportunities.map((o) => (
          <article className="item-card" key={o.id}>
            <span className="tag">{o.type}</span>
            <h2>{o.title}</h2>
            <p>{o.org}</p>
            <p>{o.text}</p>
            <div className="small flex items-center gap-2">
              <CalendarDays size={14} />
              {o.date}
            </div>
            <div className="flex items-center justify-between mt-5">
              <Button variant="outline" onClick={() => setSelected(o)}>
                Découvrir
                <ArrowUpRight />
              </Button>
              <Button
                size="icon"
                variant="ghost"
                aria-label={`Enregistrer ${o.title}`}
                onClick={() =>
                  setSaved(
                    saved.includes(o.id) ? saved.filter((id) => id !== o.id) : [...saved, o.id],
                  )
                }
              >
                <Bookmark fill={saved.includes(o.id) ? "currentColor" : "none"} />
              </Button>
            </div>
          </article>
        ))}
      </div>
      <Dialog
        open={selected !== null}
        onOpenChange={(o) => {
          if (!o) setSelected(null);
        }}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{selected?.title}</DialogTitle>
            <DialogDescription>{selected?.org}</DialogDescription>
          </DialogHeader>
          <span className="tag">{selected?.type}</span>
          <p>{selected?.text}</p>
          <p className="small flex gap-2">
            <CalendarDays size={16} />
            {selected?.date}
          </p>
          <p className="small flex gap-2">
            <MapPin size={16} />
            EMIT · Fianarantsoa
          </p>
          <p className="small">
            Offre illustrative : les modalités et contacts officiels seront ajoutés par
            l’université.
          </p>
        </DialogContent>
      </Dialog>
    </div>
  );
}
