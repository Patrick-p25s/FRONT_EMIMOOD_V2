import { Check, Monitor, Moon, Sun } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Heading } from "@/components/emimood/molecules/Heading";
import { type Theme, useTheme } from "@/components/emimood/theme";
import { useAuth } from "@/lib/auth";

export function SettingsPage() {
  const { theme, setTheme } = useTheme();
  const { context } = useAuth();
  return (
    <div className="page">
      <Heading title="Paramètres" subtitle="Un espace qui vous ressemble." />
      <section className="settings-section">
        <h2>Apparence</h2>
        <p className="subtitle mb-5">Choisissez le thème de votre espace universitaire.</p>
        <div className="theme-options">
          {(
            [
              { value: "light", label: "Clair", icon: Sun },
              { value: "dark", label: "Sombre", icon: Moon },
              { value: "system", label: "Système", icon: Monitor },
            ] as { value: Theme; label: string; icon: typeof Sun }[]
          ).map((t) => (
            <Button
              key={t.value}
              variant={theme === t.value ? "secondary" : "outline"}
              onClick={() => setTheme(t.value)}
              aria-pressed={theme === t.value}
            >
              <t.icon />
              {t.label}
              {theme === t.value && <Check size={13} />}
            </Button>
          ))}
        </div>
      </section>
      <section className="settings-section">
        <h2>Langue</h2>
        <div className="flex justify-between">
          <span>Français</span>
          <span className="tag">
            <Check size={12} className="mr-1" />
            Langue de l’application
          </span>
        </div>
      </section>
      <section className="settings-section">
        <h2>Mon établissement</h2>
        <p>{context?.university?.name ?? "Aucune université associée"}</p>
        {context?.classe && (
          <p className="small mt-2">
            {[context.mention?.name, context.level?.name, context.classe.name, context.academicYear?.name]
              .filter(Boolean)
              .join(" · ")}
          </p>
        )}
      </section>
      <section className="settings-section">
        <h2>À propos</h2>
        <p className="small">
          EMIMood · Connecté à votre compte universitaire.
        </p>
      </section>
    </div>
  );
}
