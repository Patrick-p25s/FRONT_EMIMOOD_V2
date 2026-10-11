import { Link } from "@tanstack/react-router";
import { ArrowUpRight } from "lucide-react";

export function SectionHeading({
  title,
  to,
}: {
  title: string;
  to?: "/cours" | "/ressources" | "/opportunites" | "/publications" | "/evaluations";
}) {
  return (
    <div className="section-heading">
      <h2>{title}</h2>
      {to && (
        <Link to={to}>
          Voir tout <ArrowUpRight size={13} />
        </Link>
      )}
    </div>
  );
}
