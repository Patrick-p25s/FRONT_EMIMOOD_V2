import { createFileRoute } from '@tanstack/react-router';
import { HomePage } from '@/components/emimood/home';
import { pageHead } from '@/components/emimood/data';
export const Route = createFileRoute('/')({head:()=>pageHead('Accueil','Votre communauté académique EMIT : cours, ressources, projets et vie universitaire à Fianarantsoa.'),component:HomePage});
