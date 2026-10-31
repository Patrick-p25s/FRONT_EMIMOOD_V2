// src/features/admin/pages/university-detail/UniversityDetailPage.tsx
import { Link } from "@tanstack/react-router";
import { ArrowLeft } from "lucide-react";
import { Logo } from "@/components/emimood/atoms/Logo";
import { ErrorState } from "@/components/emimood/molecules/states";
import { StatusBadge } from "@/components/emimood/molecules/StatusBadge";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import type { University } from "../../api/types";
import { useAdminDetail } from "../../hooks/useAdminList";
import { useAdminSearch } from "../../hooks/useAdminSearch";
import { keepU } from "../../lib/search";
import { OverviewTab } from "./OverviewTab";
import { TeachersTab } from "./TeachersTab";
import { CodesTab } from "./CodesTab";
import { ClassesTab } from "./ClassesTab";

const TABS = [
  { value: "overview", label: "Aperçu" },
  { value: "teachers", label: "Enseignants" },
  { value: "codes", label: "Codes d’invitation" },
  { value: "classes", label: "Classes" },
  { value: "users", label: "Utilisateurs" },
] as const;

type TabValue = (typeof TABS)[number]["value"];
const isTab = (value: string | undefined): value is TabValue =>
  TABS.some((tab) => tab.value === value);

type Props = { universityId: string };

export function UniversityDetailPage({ universityId }: Props) {
  const [search, setSearch] = useAdminSearch();
  const tab: TabValue = isTab(search.tab) ? search.tab : "overview";
  const {
    data: university,
    isLoading,
    error,
    refetch,
  } = useAdminDetail<University>("universities", `/universities/${universityId}`, universityId);

  return (
    <>
      <Link
        to="/admin/universities"
        search={keepU}
        className="mb-4 inline-flex items-center gap-1.5 text-sm text-muted-foreground no-underline hover:text-foreground"
      >
        <ArrowLeft className="size-4" aria-hidden /> Toutes les universités
      </Link>

      {error ? (
        <ErrorState error={error} onRetry={() => void refetch()} />
      ) : isLoading || !university ? (
        <Skeleton className="h-16 w-full max-w-md" />
      ) : (
        <div className="mb-6 flex items-center gap-4">
          <Logo url={university.logo_url} name={university.name} />
          <div className="min-w-0">
            <h1 className="truncate text-2xl font-extrabold tracking-tight">{university.name}</h1>
            <p className="text-sm text-muted-foreground">{university.code}</p>
          </div>
          <StatusBadge statut={university.statut} />
        </div>
      )}

      <Tabs value={tab} onValueChange={(value) => setSearch({ tab: value }, false)}>
        <TabsList>
          {TABS.map((item) => (
            <TabsTrigger key={item.value} value={item.value}>
              {item.label}
            </TabsTrigger>
          ))}
        </TabsList>
        {TABS.map((item) => (
          <TabsContent key={item.value} value={item.value} className="mt-6">
            <TabsContent value="overview" className="mt-6">
              {university && <OverviewTab university={university} />}
            </TabsContent>
            <TabsContent value="teachers" className="mt-6">
              <TeachersTab universityId={universityId} />
            </TabsContent>
            <TabsContent value="codes" className="mt-6">
              <CodesTab universityId={universityId} />
            </TabsContent>
            <TabsContent value="classes" className="mt-6">
              <ClassesTab universityId={universityId} />
            </TabsContent>
            <TabsContent value="users" className="mt-6">
              <p className="rounded-lg border border-dashed p-8 text-center text-sm text-muted-foreground">
                En construction.
              </p>
            </TabsContent>
          </TabsContent>
        ))}
      </Tabs>
    </>
  );
}
