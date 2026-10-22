# SSW.Products

Multi-tenant Next.js + TinaCMS site. One codebase serves YakShaver, EagleEye, Tiger and TimePro.

## Checks

`pnpm check` runs lint, typecheck and tests together. CI runs the same command on every PR.

## Navigation

- **Content** lives in `content/pages/<Tenant>/`, with `zh/` beside it for the Chinese locale. A change for one tenant leaves the other three alone — decide which ones it belongs to.
- **Blocks** are wired in `components/shared/blocksRenderer.tsx`. Some sections are rendered from code instead of from a Tina block, so they need no schema change; `/media`'s heading specimen is one.
- **Skills** in `.claude/skills/` cover the YakShaver blog: banner images and the weekly sprint post.

## Headings

Two scales, deliberately:

- Site-wide: `h1`–`h6` in `app/globals.css` (`@layer base`). Blocks pick the right level and inherit it, carrying layout classes rather than typography.
- Doc and blog prose: `tina/tinamarkdownStyles/DocAndBlogMarkdownStyle.tsx` sets its own smaller scale that overrides the base. It stays on that scale when the site scale changes.

Headings inherit Inter from `<body>` (`app/[product]/layout.tsx`), so leave the font family off them — `font-sans` is Tailwind's system stack, not Inter.

## TinaCMS

- `tina/tina-lock.json` is generated, committed, and 442KB on one line. `pnpm dev` rewrites it: revert it unless your change touched `tina/collectionSchema/`.
- `tina/__generated__/` holds the generated client and types. It is gitignored, so a fresh clone cannot typecheck until you run `pnpm exec tinacms build --local --skip-cloud-checks --skip-indexing --skip-search-index`, which needs no credentials. CI runs that step before `pnpm check`.
- `pnpm dev` runs against a local GraphQL server, so it needs **no TinaCloud credentials** — only `NEXT_PUBLIC_PRODUCT_LIST` and `DEFAULT_PRODUCT` in `.env.local`, both non-secret and shown in `.env.example`. Editing through the CMS UI is what needs `NEXT_PUBLIC_TINA_CLIENT_ID` and `TINA_TOKEN`.
