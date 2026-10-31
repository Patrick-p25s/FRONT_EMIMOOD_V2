# EMIMood — Front

React + TanStack Router/Start, TanStack Query v5, Tailwind v4, shadcn/ui,
React Hook Form + zod, sonner, lucide. TypeScript strict
(`exactOptionalPropertyTypes`, `noPropertyAccessFromIndexSignature`,
`noUncheckedIndexedAccess`). Langue de l'interface : français.

## Commandes

- `pnpm dev` : serveur de développement (régénère `routeTree.gen.ts`)
- `pnpm exec tsc --noEmit` : doit rester à 0 erreur avant chaque commit
- `pnpm gen:api` : régénère `src/lib/api/schema.gen.ts` depuis l'OpenAPI du backend
- `pnpm audit` : à lancer avant une release

## Organisation

- `src/routes/*.tsx` : routes fines (fichiers plats), aucune logique métier.
- `src/features/<domaine>/` : un dossier par **domaine métier** (messaging,
  notifications, search, resources, course-resources, publications, videos,
  university, profile, admin…), avec `api/`, `hooks/`, `components/`, `pages/`,
  `keys.ts`.
- `src/components/emimood/*` : kit partagé (atomes, molécules, organismes).
- `src/lib/` : outils transverses (client API, format, links, auth, realtime).
- Les pages enseignant/étudiant/admin sont de **fines enveloppes** qui passent
  des props (rôle, droits) à une page partagée du domaine.

## Règle d'or : API par domaine, pas par rôle

- Un endpoint = une seule fonction d'API, dans le dossier de son domaine.
  Jamais de `teacherApi` / `studentApi` qui appellent la même route.
- Un type ou un schéma zod = une seule définition. Avant d'en créer un,
  chercher s'il existe déjà.
- Les droits viennent du serveur (403/404). Le front masque les boutons par
  confort, jamais par sécurité.
- Les pages n'appellent pas `fetch`/`api` : elles utilisent des hooks.

## Types et nommage

- Les champs gardent le **snake_case de l'API** (`file_name`, `created_at`).
  Pas de nouveau modèle camelCase par transformation.
  (`features/resources` est encore en camelCase : à migrer, sans urgence.)
- Types de l'API : `src/lib/api/types.ts` (alias de `schema.gen.ts`).
  Ne jamais modifier `schema.gen.ts` à la main.
- zod valide ce que TypeScript ne voit pas (réponses, UUID, URL, tailles).
  Le type de sortie du schéma doit rester assignable au type généré.

## Sécurité (non négociable)

- Toute adresse venant de l'API passe par `toSafeLink` (`@/lib/links`)
  avant d'être affichée : seul http(s) est cliquable. Liens externes :
  `target="_blank"` + `rel="noopener noreferrer"`.
- Jamais de `dangerouslySetInnerHTML`, `innerHTML`, `eval`, `new Function`.
- Identifiants envoyés dans une URL : `safeId` (UUID) d'abord.
- Réponses : `parseResponse` ; envois : `parseRequest`.
- Aperçus de fichiers : seulement les types autorisés (pdf, png, jpeg, webp,
  gif, mp4, webm), avec le type imposé par `new Blob([blob], { type })`.
  Téléchargements : chemins relatifs seulement (`downloadFile`).
- YouTube : id validé par `/^[\w-]{11}$/`, miniatures de `i.ytimg.com` seulement,
  embed en `youtube-nocookie.com`.
- Redirections après connexion : `safeNext` (`src/lib/navigation.ts`).
- Jetons : jamais dans une URL ni dans les logs ; le jeton d'accès reste en
  mémoire. [Passage aux cookies httpOnly + CSRF en attente du backend :
  l'authentification est isolée dans `tokenStore.ts`, `client.ts`, `auth.tsx`.]
- À la déconnexion : vider le cache Query, fermer le socket, effacer les jetons.

## Temps réel

- Un seul socket (`src/lib/realtime/socket.ts`), monté par `RealtimeBridge`.
- Les événements mettent à jour le cache Query : aucun état parallèle.

## Conventions d'écriture

- Messages d'erreur utilisateur : `messageOf(error)`. Toasts avec sonner.
- Clés de cache : un fichier `keys.ts` par domaine, jamais de chaînes en dur.
- Formulaires : RHF + zod ; les règles partagées avec l'API restent dans le
  schéma du domaine.
- Dates et tailles : `@/lib/format` (`fmtDate`, `fmtDateTime`, `formatBytes`).
- Un commit par étape cohérente, `tsc` propre avant de committer.

## Dette connue

- Le document d'une publication n'utilise pas encore le même schéma que
  `ResourceOut` (alignement backend repoussé).
- `components/emimood/organisms/CourseDetail.tsx` utilise encore des données
  de démonstration.
