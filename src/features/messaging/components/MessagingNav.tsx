// components/MessagingNav.tsx : la page ne connaît pas vos routes, l'espace les lui donne
import { createContext, useContext, type ReactNode } from "react";

export type NavLinkProps = {
  className?: string | undefined;
  "aria-current"?: "page" | undefined;
  children: ReactNode;
};

export type MessagingNav = {
  link: (conversationId: string, props: NavLinkProps) => ReactNode; // lien vers une conversation
  profile: (userId: string, props: NavLinkProps) => ReactNode; // lien vers un profil
  open: (conversationId: string) => void;
  close: () => void; // retour à la liste
};

const MessagingNavContext = createContext<MessagingNav | null>(null);
export const MessagingNavProvider = MessagingNavContext.Provider;

export function useMessagingNav(): MessagingNav {
  const nav = useContext(MessagingNavContext);
  if (!nav) throw new Error("MessagingNavProvider manquant");
  return nav;
}
