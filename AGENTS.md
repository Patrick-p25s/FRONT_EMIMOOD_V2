<!-- LOVABLE:BEGIN -->
> [!IMPORTANT]
> This project is connected to [Lovable](https://lovable.dev). Avoid rewriting
> published git history — force pushing, or rebasing/amending/squashing commits
> that are already pushed — as it rewrites history on Lovable's side and the
> user will likely lose their project history.
>
> Commits you push to the connected branch sync back to Lovable and show up in
> the editor, so keep the branch in a working state.
<!-- LOVABLE:END -->

## Architecture
- Use TanStack Start file routes with leaf-specific metadata for every academic section; this keeps navigation typed and shareable.
- Keep shared academic UI in `src/components/emimood` and semantic styling in `src/styles.css`; this preserves one identity across future roles.
- Keep this first student experience explicitly demonstrative with in-memory sample interactions; no real academic content or permissions are implied.
- Store only the appearance preference in browser storage; actual accounts and university data must use the connected Lovable Cloud with authenticated access controls.
