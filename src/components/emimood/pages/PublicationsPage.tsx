import { Heading } from "@/components/emimood/molecules/Heading";
import { Feed } from "@/components/emimood/organisms/Feed";

export function PublicationsPage() {
  return (
    <div className="page">
      <Heading
        title="Publications"
        subtitle="Les idées, projets et expériences qui font vivre notre campus."
      />
      <div className="max-w-3xl">
        <Feed />
      </div>
    </div>
  );
}
