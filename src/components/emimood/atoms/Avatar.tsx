export function Avatar({ initials = "PN", warm = false }: { initials?: string; warm?: boolean }) {
  return <span className={`avatar ${warm ? "warm" : ""}`}>{initials}</span>;
}
