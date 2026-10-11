
export function Heading({
  title,
  subtitle,
  action,
}: {
  title: string;
  subtitle: string;
  action?: ReactNode;
}) {
  return (
    <div className="page-heading">
      <div>
        <h1>{title}</h1>
        <p className="subtitle">{subtitle}</p>
      </div>
      {action}
    </div>
  );
}
