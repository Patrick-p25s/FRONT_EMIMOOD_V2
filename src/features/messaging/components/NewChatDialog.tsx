// components/NewChatDialog.tsx
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import type { Person } from "../api/schemas";
import { useMessagingMutations } from "../hooks/useMessagingMutations";
import { useMessagingNav } from "./MessagingNav";
import { PeoplePicker } from "./PeoplePicker";

export function NewChatDialog({
  open,
  onOpenChange,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  const nav = useMessagingNav();
  const { startPrivate } = useMessagingMutations();

  const pick = async (person: Person) => {
    try {
      const conversation = await startPrivate.mutateAsync(person.id); // renvoie l'existante si elle existe déjà
      onOpenChange(false);
      nav.open(conversation.id);
    } catch {
      // message déjà affiché par la mutation
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Nouvelle conversation</DialogTitle>
          <DialogDescription>Cherchez un membre de votre université.</DialogDescription>
        </DialogHeader>
        <PeoplePicker multiple={false} selected={[]} onToggle={(person) => void pick(person)} />
      </DialogContent>
    </Dialog>
  );
}
