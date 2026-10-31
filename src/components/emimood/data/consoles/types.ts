export type Endpoint = {
  method: "GET" | "POST" | "PATCH" | "PUT" | "DELETE";
  path: string;
  desc: string;
};

export type Row = { id: number; title: string; meta: string; status: string };

export type Section = {
  key: string;
  label: string;
  intro: string;
  addLabel?: string;
  review?: boolean;
  rows: Row[];
  endpoints: Endpoint[];
};

export type RoleConsole = { title: string; subtitle: string; badge: string; sections: Section[] };

export const r = (id: number, title: string, meta: string, status: string): Row => ({
  id,
  title,
  meta,
  status,
});
