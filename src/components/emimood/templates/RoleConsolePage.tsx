import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Heading } from "@/components/emimood/molecules/Heading";
import { RoleConsole } from "@/components/emimood/data/consoles/types";
import { SectionPanel } from "@/components/emimood/organisms/SectionPanel";

export function RoleConsolePage({ config }: { config: RoleConsole }) {
  return (
    <div className="page">
      <Heading
        title={config.title}
        subtitle={config.subtitle}
        action={<span className="tag">{config.badge}</span>}
      />
      <p className="small mb-4">Démonstration : les actions ne sont pas enregistrées.</p>
      <Tabs defaultValue={config.sections[0]?.key ?? ""}>
        <TabsList className="mb-4 h-auto flex-wrap justify-start">
          {config.sections.map((s) => (
            <TabsTrigger key={s.key} value={s.key}>
              {s.label}
            </TabsTrigger>
          ))}
        </TabsList>
        {config.sections.map((s) => (
          <TabsContent key={s.key} value={s.key}>
            <SectionPanel section={s} />
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
}
