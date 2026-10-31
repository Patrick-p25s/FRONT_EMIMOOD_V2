// components/GroupInfoDialog.tsx : membres, renommer, ajouter, retirer, quitter
import { useState } from "react";
import { ConfirmDialog } from "@/components/emimood/organisms/dialogs";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/lib/auth";
import type { ConversationDetail, Person } from "../api/schemas";
import { useMessagingMutations } from "../hooks/useMessagingMutations";
import { useMessagingNav } from "./MessagingNav";
import { PeoplePicker } from "./PeoplePicker";
import { UserAvatar } from "@/features/profile/components/UserAvatar";

const MAX_TOTAL = 50;

type GroupInfoDialogProps = {
  conversation: ConversationDetail;
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

export function GroupInfoDialog({ conversation, open, onOpenChange }: GroupInfoDialogProps) {
  const { user } = useAuth();
  const nav = useMessagingNav();
  const { rename, addMembers, removeMember } = useMessagingMutations();
  const isAdmin = conversation.my_role === "admin";

  const [name, setName] = useState(conversation.name);
  const [adding, setAdding] = useState(false);
  const [picked, setPicked] = useState<Person[]>([]);
  const [leaving, setLeaving] = useState(false);
  const [removing, setRemoving] = useState<{ id: string; name: string } | null>(null);

  const room = MAX_TOTAL - conversation.members.length;
  const cleanName = name.trim();

  const toggle = (person: Person) =>
    setPicked((current) =>
      current.some((item) => item.id === person.id)
        ? current.filter((item) => item.id !== person.id)
        : current.length >= room
          ? current
          : [...current, person],
    );

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Infos du groupe</DialogTitle>
          </DialogHeader>

          {isAdmin && (
            <form
              className="flex gap-2"
              onSubmit={(event) => {
                event.preventDefault();
                if (cleanName.length >= 2 && cleanName !== conversation.name)
                  rename.mutate({ conversationId: conversation.id, name: cleanName });
              }}
            >
              <Input
                aria-label="Nom du groupe"
                maxLength={100}
                value={name}
                onChange={(event) => setName(event.target.value)}
              />
              <Button
                type="submit"
                variant="outline"
                disabled={
                  rename.isPending || cleanName.length < 2 || cleanName === conversation.name
                }
              >
                Renommer
              </Button>
            </form>
          )}

          <section aria-label="Membres">
            <p className="mb-2 text-sm font-medium">
              {conversation.members.length} membre{conversation.members.length > 1 ? "s" : ""}
            </p>
            <ul className="grid gap-1">
              {conversation.members.map((member) => (
                <li key={member.user.id} className="flex items-center gap-3 rounded-md p-1.5">
                  <UserAvatar name={member.user.name} url={member.user.avatar_url} />
                  <span className="flex-1 truncate">
                    {nav.profile(member.user.id, {
                      className: "no-underline hover:underline",
                      children: member.user.name,
                    })}
                    {member.user.id === user?.id ? " (vous)" : ""}
                  </span>
                  {member.role === "admin" && <span className="tag">Admin</span>}
                  {isAdmin && member.user.id !== user?.id && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setRemoving({ id: member.user.id, name: member.user.name })}
                    >
                      Retirer
                    </Button>
                  )}
                </li>
              ))}
            </ul>
          </section>

          {isAdmin && (
            <section className="grid gap-2">
              {adding ? (
                <>
                  <PeoplePicker
                    multiple
                    selected={picked}
                    onToggle={toggle}
                    excludeIds={conversation.members.map((member) => member.user.id)}
                  />
                  <div className="flex justify-end gap-2">
                    <Button variant="outline" onClick={() => (setAdding(false), setPicked([]))}>
                      Annuler
                    </Button>
                    <Button
                      disabled={picked.length === 0 || addMembers.isPending}
                      onClick={async () => {
                        try {
                          await addMembers.mutateAsync({
                            conversationId: conversation.id,
                            userIds: picked.map((person) => person.id),
                          });
                          setAdding(false);
                          setPicked([]);
                        } catch {
                          // message déjà affiché par la mutation
                        }
                      }}
                    >
                      Ajouter ({picked.length})
                    </Button>
                  </div>
                  {room <= 0 && (
                    <p className="text-xs text-destructive">Le groupe est complet (50 membres).</p>
                  )}
                </>
              ) : (
                <Button variant="outline" disabled={room <= 0} onClick={() => setAdding(true)}>
                  Ajouter des membres
                </Button>
              )}
            </section>
          )}

          <Button variant="ghost" className="text-destructive" onClick={() => setLeaving(true)}>
            Quitter le groupe
          </Button>
        </DialogContent>
      </Dialog>

      <ConfirmDialog
        open={leaving}
        onOpenChange={setLeaving}
        title="Quitter ce groupe ?"
        description="Vous ne verrez plus ses messages. Si vous revenez, vous ne verrez pas ce qui s’est écrit entre-temps."
        confirmLabel="Quitter"
        destructive
        onConfirm={async () => {
          if (!user) return;
          try {
            await removeMember.mutateAsync({ conversationId: conversation.id, userId: user.id });
            setLeaving(false);
            onOpenChange(false);
            nav.close();
          } catch {
            // message déjà affiché par la mutation
          }
        }}
      />

      <ConfirmDialog
        open={removing !== null}
        onOpenChange={(value) => !value && setRemoving(null)}
        title={`Retirer ${removing?.name ?? ""} ?`}
        description="Cette personne ne pourra plus lire ce groupe."
        confirmLabel="Retirer"
        destructive
        onConfirm={async () => {
          if (!removing) return;
          try {
            await removeMember.mutateAsync({
              conversationId: conversation.id,
              userId: removing.id,
            });
            setRemoving(null);
          } catch {
            // message déjà affiché par la mutation
          }
        }}
      />
    </>
  );
}
