import { createFileRoute } from '@tanstack/react-router';
import { ProfilePage } from '@/components/emimood/pages';
import { pageHead } from '@/components/emimood/data';
export const Route = createFileRoute('/profil')({head:()=>pageHead('Mon profil','Votre profil académique, compétences et communauté EMIT.'),component:ProfilePage});
