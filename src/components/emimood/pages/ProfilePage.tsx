import { Link } from "@tanstack/react-router";
import { useState } from "react";
import { ArrowRight, GraduationCap } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Avatar } from "@/components/emimood/atoms/Avatar";
import { useAuth, roleLabels } from "@/lib/auth";
import { identityApi } from "@/api/identity";

export function ProfilePage() {
  const { user, context, updateProfile } = useAuth();
  const [editing, setEditing] = useState(false);
  const [profileMessage, setProfileMessage] = useState("");
  const initials = (user?.name ?? "?")
    .split(" ")
    .map((word) => word[0])
    .slice(0, 2)
    .join("");
  return (
    <div className="page">
      <div className="profile-cover" />
      <div className="profile-content">
        <Avatar initials={initials} />
        <div className="flex justify-between items-start gap-3">
          <div>
            <h1>{user?.name}</h1>
            <p className="subtitle">
              {user?.role ? roleLabels[user.role] : "Utilisateur"}
              {context?.mention ? ` · ${context.mention.name}` : ""}
              {context?.level ? ` · ${context.level.name}` : ""}
              {context?.classe ? ` · ${context.classe.name}` : ""}
            </p>
            <p className="small flex gap-2 items-center mt-3">
              <GraduationCap size={16} />
              {context?.university?.name ?? "Aucune université associée"}
              {context?.academicYear ? ` · ${context.academicYear.name}` : ""}
            </p>
          </div>
          <Button variant="outline" className="mt-5" onClick={() => setEditing(!editing)}>
            {editing ? "Annuler" : "Modifier le profil"}
          </Button>
        </div>
        {editing && user && <EditProfile user={user} onSaved={() => { setEditing(false); setProfileMessage("Profil mis à jour."); }} updateProfile={updateProfile} />}
        <section className="settings-section">
          <h2>Présentation</h2>
          <p>{user?.bio || "Aucune présentation renseignée."}</p>
          {profileMessage && <p className="mt-2 text-sm text-success">{profileMessage}</p>}
        </section>
        <ProblemReport />
        <section className="settings-section">
          <h2>Ma communauté</h2>
          <div className="flex gap-4 flex-wrap">
            <Button variant="outline" asChild>
              <Link to="/publications">
                Publications
                <ArrowRight />
              </Link>
            </Button>
            <Button variant="outline" asChild>
              <Link to="/ressources">
                Ressources
                <ArrowRight />
              </Link>
            </Button>
            <Button variant="outline" asChild>
              <Link to="/messages">
                Messages
                <ArrowRight />
              </Link>
            </Button>
          </div>
        </section>
      </div>
    </div>
  );
}

function EditProfile({ user, updateProfile, onSaved }: { user: NonNullable<ReturnType<typeof useAuth>["user"]>; updateProfile: ReturnType<typeof useAuth>["updateProfile"]; onSaved: () => void }) {
  const [error, setError] = useState("");
  return <form className="settings-section" onSubmit={async (event) => { event.preventDefault(); const data = new FormData(event.currentTarget); try { await updateProfile({ first_name: String(data.get("firstName")).trim(), last_name: String(data.get("lastName")).trim(), phone_number: String(data.get("phoneNumber")).trim() || null, avatar_url: user.avatar_url, bio: String(data.get("bio")).trim() || null }); onSaved(); } catch (reason) { setError(reason instanceof Error ? reason.message : "Mise à jour impossible."); } }}><h2>Modifier mon profil</h2><div className="grid gap-3 sm:grid-cols-2"><Input name="firstName" defaultValue={user.first_name} required /><Input name="lastName" defaultValue={user.last_name} required /></div><Input name="phoneNumber" defaultValue={user.phone_number ?? ""} placeholder="Téléphone" className="mt-3" /><Textarea name="bio" defaultValue={user.bio ?? ""} placeholder="Présentation" className="mt-3" />{error && <p className="mt-2 text-sm text-destructive">{error}</p>}<Button type="submit" className="mt-3">Enregistrer</Button></form>;
}

function ProblemReport() {
  const [message, setMessage] = useState("");
  const [status, setStatus] = useState("");
  return <section className="settings-section"><h2>Signaler un problème</h2><p className="small">Votre signalement sera transmis à l’administration.</p><form className="mt-3" onSubmit={async (event) => { event.preventDefault(); const data = new FormData(event.currentTarget); try { await identityApi.reportProblem({ subject: String(data.get("subject")).trim(), message }); setMessage(""); setStatus("Signalement envoyé."); } catch (reason) { setStatus(reason instanceof Error ? reason.message : "Envoi impossible."); } }}><Input name="subject" required minLength={3} placeholder="Sujet" /><Textarea required minLength={10} value={message} onChange={(event) => setMessage(event.target.value)} placeholder="Décrivez le problème" className="mt-3" />{status && <p className="mt-2 text-sm">{status}</p>}<Button type="submit" className="mt-3">Envoyer le signalement</Button></form></section>;
}
