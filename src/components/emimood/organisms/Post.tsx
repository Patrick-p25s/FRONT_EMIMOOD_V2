import { useState } from "react";
import { Link } from "@tanstack/react-router";
import { Bookmark, FileText, Flag, Heart, MessageCircle, MoreHorizontal, Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Avatar } from "@/components/emimood/atoms/Avatar";
import { initialPosts } from "@/components/emimood/data/posts";

export function Post({ post }: { post: (typeof initialPosts)[number] }) {
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
