import { createFileRoute } from '@tanstack/react-router';
import { ResourcesPage } from '@/components/emimood/pages';
import { pageHead } from '@/components/emimood/data';
export const Route = createFileRoute('/ressources')({head:()=>pageHead('Ressources','Documents officiels et ressources partagées par la communauté EMIT.'),component:ResourcesPage});
