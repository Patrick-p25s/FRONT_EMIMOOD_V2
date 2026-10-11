import { useState } from "react";
import { Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Heading } from "@/components/emimood/molecules/Heading";
import { Avatar } from "@/components/emimood/atoms/Avatar";

export const people = ["Miora Rasoarivelo", "Andry Rakoto", "Groupe L3 Informatique"];

export function MessagesPage() {
  const [person, setPerson] = useState(0);
  const [text, setText] = useState("");
  const [messages, setMessages] = useState<Record<number, string[]>>({});
  return (
    <div className="page">
      <Heading title="Messages" subtitle="La collaboration commence par une conversation." />
      <div className="chat-layout">
        <aside className="chat-people">
          {people.map((p, i) => (
            <Button
              key={p}
              variant={person === i ? "secondary" : "ghost"}
              className="chat-person"
              onClick={() => setPerson(i)}
            >
              <Avatar initials={["MR", "AR", "L3"][i] ?? "EM"} />
              <div>
                <strong>{p}</strong>
                <span>
                  {i === 0
                    ? "À propos de notre projet"
                    : i === 1
                      ? "Développement web"
                      : "Notre espace de discussion"}
                </span>
              </div>
            </Button>
          ))}
        </aside>
        <div className="chat-body">
          <div className="chat-title">
            <strong>{people[person]}</strong>
            <p className="small">Conversation de démonstration</p>
          </div>
          <div className="chat-messages">
            <div className="bubble">
              {person === 0
                ? "Salut Patrick ! Tu es disponible pour discuter de notre projet après les cours ?"
                : person === 1
                  ? "Bonjour Patrick, vous pouvez poser vos questions sur le nouveau chapitre ici."
                  : "Bienvenue dans le groupe de L3 Informatique !"}
            </div>
            {(messages[person] ?? []).map((m, i) => (
              <div className="bubble self" key={i}>
                {m}
                <p className="small mt-1">À l’instant · Non envoyé à un destinataire réel</p>
              </div>
            ))}
          </div>
          <form
            className="chat-input"
            onSubmit={(e) => {
              e.preventDefault();
              if (text.trim()) {
                setMessages({ ...messages, [person]: [...(messages[person] ?? []), text.trim()] });
                setText("");
              }
            }}
          >
            <Input
              placeholder="Écrire un message…"
              value={text}
              onChange={(e) => setText(e.target.value)}
              aria-label="Message"
            />
            <Button type="submit" size="icon" aria-label="Envoyer le message">
              <Send />
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
}
