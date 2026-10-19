import { Link } from "@tanstack/react-router";
import { GraduationCap } from "lucide-react";
// src/components/emimood/atoms/Brand.tsx
export function Brand({ link }: { link: string }) {
  return (
    <Link to={link} className="brand">
      <span className="brand-mark">
        <GraduationCap size={33} strokeWidth={2.3} />
      </span>
      <span>
        EMI<em>Mood</em>
        <span className="text-primary">.</span>
      </span>
    </Link>
  );
}
