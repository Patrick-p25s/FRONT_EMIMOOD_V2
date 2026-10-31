## Architecture

- Use TanStack Start file routes with leaf-specific metadata for every academic section; this keeps navigation typed and shareable.
- Organize `src/components/emimood` by atomic design (atoms, molecules, organisms, templates, pages, data, utils) with one component per file and an index barrel per folder; this keeps the app easy to follow and extend.
- Keep this first student experience explicitly demonstrative with in-memory sample interactions; no real academic content or permissions are implied.
- Store only the appearance preference in browser storage; actual accounts and university data must come from the FastAPI backend with authenticated access controls.
