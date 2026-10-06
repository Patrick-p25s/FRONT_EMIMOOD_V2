import { createFileRoute } from '@tanstack/react-router';
import { SearchPage } from '@/components/emimood/pages';
import { pageHead } from '@/components/emimood/data';
export const Route = createFileRoute('/recherche')({validateSearch:(search:Record<string,unknown>)=>({q:typeof search.q==='string'?search.q:''}),head:()=>pageHead('Recherche','Recherchez des cours, documents et personnes dans votre communauté EMIT.'),component:SearchRoute});
function SearchRoute(){const {q}=Route.useSearch();return <SearchPage q={q}/>;}
