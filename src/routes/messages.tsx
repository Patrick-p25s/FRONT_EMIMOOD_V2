import { createFileRoute } from '@tanstack/react-router';
import { MessagesPage } from '@/components/emimood/pages';
import { pageHead } from '@/components/emimood/data';
export const Route = createFileRoute('/messages')({head:()=>pageHead('Messages','Conversations et échanges avec votre communauté universitaire.'),component:MessagesPage});
