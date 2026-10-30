# studio_space_client

Next.js 16 App Router frontend (single package, no workspace). App code lives in `src/app/`; path alias `@/*` -> `src/*`. There are no API routes, data layer, tests, or CI yet.

<!-- BEGIN:nextjs-agent-rules -->

## This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

## Commands

- `npm run dev` — Turbopack dev server. It also rewrites the managed block above and restores it if removed; commit `AGENTS.md` with your work rather than fighting it.
- `npm run build` — production build.
- `npm run lint` — ESLint (flat config in `eslint.config.mjs`, `eslint-config-next`).
- No typecheck or test script exists. Typecheck with `npx tsc --noEmit`. Don't add tests assuming a framework — none is configured.

## Toolchain quirks

- **React Compiler is on** (`reactCompiler: true` + `babel-plugin-react-compiler` in `next.config.ts`). Write compiler-compatible components; manual `memo`/`useMemo`/`useCallback` is unnecessary.
- **Tailwind CSS v4, CSS-first**: no `tailwind.config`/PostCSS config. All theme setup is the `@import`s in `src/app/globals.css`, loaded by the `@tailwindcss/turbopack` rule in `next.config.ts`. Don't add config files for Tailwind.
- **shadcn/ui, `base-nova` style** (`components.json`): primitives come from `@base-ui/react`, **not Radix**. The files in `src/components/ui/` are generated — add components with `npx shadcn add <component>` instead of hand-writing them, and keep direct edits to generated files minimal.
- `cn` is imported from the `cn` npm package, re-exported by `src/lib/utils.ts` — the usual clsx + tailwind-merge boilerplate is not present.
- shiki highlighting (`src/lib/highlighter.tsx`) uses a fixed lazily-loaded language map; add new languages to that map.
