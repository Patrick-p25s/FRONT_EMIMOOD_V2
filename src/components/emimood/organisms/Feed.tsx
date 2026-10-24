import { useState } from "react";
import { FileText, Globe, Image, Link2, Plus, Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Avatar } from "@/components/emimood/atoms/Avatar";
import { initialPosts } from "@/components/emimood/data/posts";
import { Post } from "@/components/emimood/organisms/Post";

export function Feed({ compact = false }: { compact?: boolean }) {
  const [posts, setPosts] = useState(initialPosts);
  const [filter, setFilter] = useState("Pour vous");
  const [open, setOpen] = useState(false);
  const [text, setText] = useState("");
  const [category, setCategory] = useState("Expérience");
  const [error, setError] = useState("");
  function publish() {
    if (!text.trim()) {
      setError("Écrivez quelque chose avant de publier.");
      return;
    }
    setPosts([
      {
        id: Date.now(),
        author: "Patrick Nomentsoa",
        initials: "PN",
        role: "Étudiant · L3 Informatique",
        time: "À l’instant",
        category,
        title: "",
        text: text.trim(),
        likes: 0,
        comments: 0,
      },
      ...posts,
    ]);
    setText("");
    setOpen(false);
    setFilter("Pour vous");
    setError("");
  }
  const visible =
    filter === "Annonces"
      ? posts.filter((p) => p.category === "Annonce")
      : filter === "Projets"
        ? posts.filter((p) => p.category === "Projet")
        : posts;
  return (
    <>
      <div className="composer">
        <div className="composer-top">
          <Avatar />
          <Button variant="ghost" className="composer-trigger" onClick={() => setOpen(true)}>
            Qu’avez-vous envie de partager, Patrick ?
          </Button>
        </div>
        <div className="composer-actions">
          <div className="tools">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => {
                setCategory("Ressource");
                setOpen(true);
              }}
            >
              <FileText />
              Document
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => {
                setCategory("Projet");
                setOpen(true);
              }}
            >
              <Image />
              Projet / photo
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => {
                setCategory("Ressource");
                setOpen(true);
              }}
            >
              <Link2 />
              Lien
            </Button>
          </div>
          <Button size="sm" onClick={() => setOpen(true)}>
            <Plus size={14} /> Publier
          </Button>
        </div>
      </div>
      <div className="feed-tabs">
        {["Pour vous", "Annonces", "Projets"].map((tab) => (
          <Button
            variant="ghost"
            key={tab}
            className={filter === tab ? "selected" : ""}
            onClick={() => setFilter(tab)}
          >
            {tab}
          </Button>
        ))}
      </div>
      {visible.slice(0, compact ? 2 : undefined).map((post) => (
        <Post key={post.id} post={post} />
      ))}
      {visible.length === 0 && <div className="empty">Aucune publication pour le moment.</div>}
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Créer une publication</DialogTitle>
            <DialogDescription>Communauté EMIT · Contenu de démonstration</DialogDescription>
          </DialogHeader>
          <div className="flex items-center gap-3">
            <Avatar />
            <div>
              <strong>Patrick Nomentsoa</strong>
              <p className="small flex items-center gap-1">
                <Globe size={12} /> Université EMIT
              </p>
            </div>
          </div>
          <label className="small" htmlFor="category">
            Catégorie
          </label>
          <select
            id="category"
            className="rounded-md border bg-card p-2"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
          >
            {["Expérience", "Projet", "Ressource", "Annonce", "Événement"].map((c) => (
              <option key={c}>{c}</option>
            ))}
          </select>
          <Textarea
            rows={5}
            placeholder="Partagez une idée, un projet ou une expérience…"
            value={text}
            onChange={(e) => setText(e.target.value)}
            aria-label="Votre publication"
          />
          {error && <p className="text-destructive text-xs">{error}</p>}
          <p className="small">
            Cette publication reste visible pendant cette visite de démonstration.
          </p>
          <Button onClick={publish}>
            <Send />
            Publier
          </Button>
        </DialogContent>
      </Dialog>
    </>
  );
}
