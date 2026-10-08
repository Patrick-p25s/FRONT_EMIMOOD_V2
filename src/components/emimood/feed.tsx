import { useState } from "react";
import { Link } from "@tanstack/react-router";
import {
  Heart,
  MessageCircle,
  Bookmark,
  MoreHorizontal,
  FileText,
  Image,
  Link2,
  Send,
  Flag,
  Plus,
  Globe,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import { Avatar } from "./shell";
import { initialPosts } from "./data";
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
function Post({ post }: { post: (typeof initialPosts)[number] }) {
  const [liked, setLiked] = useState(false);
  const [saved, setSaved] = useState(false);
  const [commentsOpen, setCommentsOpen] = useState(false);
  const [comment, setComment] = useState("");
  const [comments, setComments] = useState<string[]>([]);
  const [reported, setReported] = useState(false);
  return (
    <article className="post">
      <div className="post-header">
        <Avatar initials={post.initials} warm={post.category === "Projet"} />
        <div>
          <strong>
            {post.author} {post.category === "Annonce" && <span className="text-success">✓</span>}
          </strong>
          <p className="small">{post.role}</p>
          <p className="small">{post.time} · EMIT</p>
        </div>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              className="more"
              size="icon"
              variant="ghost"
              aria-label={`Options de la publication de ${post.author}`}
            >
              <MoreHorizontal />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuItem onClick={() => setSaved(!saved)}>
              <Bookmark />
              {saved ? "Retirer des enregistrements" : "Enregistrer"}
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => setReported(true)}>
              <Flag />
              {reported ? "Signalement reçu" : "Signaler"}
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
      <div className="post-content">
        <span className={`tag ${post.category === "Projet" ? "warm" : ""}`}>{post.category}</span>
        <h3 className="mt-3">{post.title}</h3>
        <p>{post.text}</p>
        {post.attachment && (
          <Link to="/ressources" className="attachment text-foreground no-underline">
            <FileText size={25} />
            <div>
              <strong className="text-xs">{post.attachment}</strong>
              <p className="small">Document officiel · PDF · 2,4 Mo</p>
            </div>
          </Link>
        )}
      </div>
      {reported && (
        <p className="small text-success">Votre signalement de démonstration a été enregistré.</p>
      )}
      <div className="post-counts">
        <span>♥ {post.likes + (liked ? 1 : 0)} personnes aiment</span>
        <span>{post.comments + comments.length} commentaires</span>
      </div>
      <div className="post-actions">
        <Button
          variant="ghost"
          size="sm"
          className={liked ? "engaged" : ""}
          onClick={() => setLiked(!liked)}
        >
          <Heart fill={liked ? "currentColor" : "none"} />
          J’aime
        </Button>
        <Button variant="ghost" size="sm" onClick={() => setCommentsOpen(!commentsOpen)}>
          <MessageCircle />
          Commenter
        </Button>
        <Button
          variant="ghost"
          size="sm"
          className={saved ? "engaged" : ""}
          onClick={() => setSaved(!saved)}
        >
          <Bookmark fill={saved ? "currentColor" : "none"} />
          {saved ? "Enregistré" : "Enregistrer"}
        </Button>
      </div>
      {commentsOpen && (
        <>
          <p className="small mt-3">
            Les commentaires précédents ne sont pas chargés dans la démonstration.
          </p>
          {comments.map((c, i) => (
            <p className="bubble mt-3" key={i}>
              <strong className="text-xs">Patrick</strong>
              <br />
              {c}
            </p>
          ))}
          <form
            className="comment-form"
            onSubmit={(e) => {
              e.preventDefault();
              if (comment.trim()) {
                setComments([...comments, comment.trim()]);
                setComment("");
              }
            }}
          >
            <Input
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="Écrire un commentaire…"
              aria-label="Commentaire"
            />
            <Button size="icon" type="submit" aria-label="Envoyer le commentaire">
              <Send />
            </Button>
          </form>
        </>
      )}
    </article>
  );
}
