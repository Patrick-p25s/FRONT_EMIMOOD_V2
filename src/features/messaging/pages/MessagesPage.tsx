// features/messaging/pages/MessagesPage.tsx
import { useState } from "react";
import { Heading } from "@/components/emimood/molecules/Heading";
import { cn } from "@/lib/utils";
import { ConversationList } from "../components/ConversationList";
import { GroupDialog } from "../components/GroupDialog";
import { NewChatDialog } from "../components/NewChatDialog";
import { Thread } from "../components/Thread";

export function MessagesPage({ conversationId }: { conversationId?: string | undefined }) {
  const [newChat, setNewChat] = useState(false);
  const [newGroup, setNewGroup] = useState(false);

  return (
    <div className="page">
      <div className={cn(conversationId && "max-md:hidden")}>
        <Heading title="Messages" subtitle="La collaboration commence par une conversation." />
      </div>
      <div className="chat-layout">
        {/* Sur mobile : la liste OU la conversation. */}
        <aside className={cn("chat-people", conversationId && "max-md:hidden")}>
          <ConversationList
            activeId={conversationId}
            onNewChat={() => setNewChat(true)}
            onNewGroup={() => setNewGroup(true)}
          />
        </aside>
        <div className={cn("chat-body", !conversationId && "max-md:hidden")}>
          {conversationId ? (
            <Thread key={conversationId} conversationId={conversationId} />
          ) : (
            <div className="grid h-full place-items-center p-8 text-center">
              <p className="small">Choisissez une conversation, ou démarrez-en une nouvelle.</p>
            </div>
          )}
        </div>
      </div>
      <NewChatDialog open={newChat} onOpenChange={setNewChat} />
      <GroupDialog open={newGroup} onOpenChange={setNewGroup} />
    </div>
  );
}
