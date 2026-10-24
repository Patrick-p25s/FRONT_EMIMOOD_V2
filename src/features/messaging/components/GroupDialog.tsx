// components/GroupDialog.tsx : créer un groupe
import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import type { Person } from "../api/schemas";
import { useMessagingMutations } from "../hooks/useMessagingMutations";
import { useMessagingNav } from "./MessagingNav";
import { PeoplePicker } from "./PeoplePicker";

const MAX_MEMBERS = 49; // sans vous

function GroupForm({ onDone }: { onDone: () => void }) {
  const nav = useMessagingNav();
  const { createGroup } = useMessagingMutations();
  const [name, setName] = useState("");
  const [members, setMembers] = useState<Person[]>([]);

  const toggle = (person: Person) =>
    setMembers((current) =>
      current.some((item) => item.id === person.id)
        ? current.filter((item) => item.id !== person.id)
        : current.length >= MAX_MEMBERS
          ? current
          : [...current, person],
    );

  const clean = name.trim();
  const valid = clean.length >= 2 && clean.length <= 100 && members.length >= 1;

  const submit = async () => {
    try {
      const conversation = await createGroup.mutateAsync({
        name: clean,
        memberIds: members.map((member) => member.id),
      });
      onDone();
      nav.open(conversation.id);
    } catch {
      // message déjà affiché par la mutation
    }
  };

  return (
    <div className="grid gap-4">
      <div className="grid gap-1.5">
        <label htmlFor="group-name" className="text-sm font-medium">
          Nom du groupe
        </label>
        <Input
          id="group-name"
          maxLength={100}
          autoComplete="off"
          value={name}
          onChange={(event) => setName(event.target.value)}
        />
        <p className="text-xs text-muted-foreground">2 à 100 caractères.</p>
      </div>
      <div className="grid gap-1.5">
        <p className="text-sm font-medium">
          Membres{" "}
          <span className="font-normal text-muted-foreground">
            ({members.length}/{MAX_MEMBERS})
          </span>
        </p>
        <PeoplePicker multiple selected={members} onToggle={toggle} />
      </div>
      <div className="flex justify-end gap-2">
        <Button variant="outline" onClick={onDone}>
          Annuler
        </Button>
        <Button disabled={!valid || createGroup.isPending} onClick={() => void submit()}>
          {createGroup.isPending ? "Création…" : "Créer le groupe"}
        </Button>
      </div>
    </div>
  );
}

export function GroupDialog({
  open,
  onOpenChange,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Nouveau groupe</DialogTitle>
          <DialogDescription>Vous en serez l’administrateur. De 3 à 50 membres.</DialogDescription>
        </DialogHeader>
        <GroupForm onDone={() => onOpenChange(false)} />
      </DialogContent>
    </Dialog>
  );
}
