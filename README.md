# Zankoline

**Zankoline** is a university admission guide that helps students in
Kurdistan find eligible university programs based on their grade, build a
shortlist of choices, and print a ready-to-use admission form. It supports
English and Kurdish (Sorani, RTL), works offline as an installable PWA, and
runs entirely client-side — there's no backend; all data lives in the
browser via a local database.

## Tech stack

- **React + TypeScript** — UI and app logic
- **Vite** — build tooling and dev server
- **Tailwind CSS** + **shadcn/ui** — styling and base components
  (`src/components/ui`)
- **IndexedDB** (via Dexie or similar) — local, client-side data persistence
  for saved application forms and history, managed in `src/db`. There is no
  server; all data stays on the user's device.
- **sonner** — toast notifications
- **next-themes** — light/dark theme switching (`ThemeProvider`,
  `ThemeToggle` in `src/components/custom`)
- **Workbox** (`vite-plugin-pwa`, `injectManifest` mode) — service worker /
  offline support, configured in `src/sw.ts` and `vite.config.ts`
- **Custom i18n** — a small context-based system (`src/helpers/translations.ts`
  - `LanguageContext.tsx`) supporting English and Kurdish Sorani, with full
    RTL layout support
- **ESLint** — linting, configured in `eslint.config.js`

## Project structure

```
src/
├── App.tsx                  # App shell: top-level state, view switching
├── main.tsx                 # Entry point
├── sw.ts                    # Custom service worker (offline precaching)
├── views/                   # Page-level views
│   ├── LoginView.tsx
│   ├── HomeView.tsx
│   ├── ShortListView.tsx
│   └── HistoryView.tsx
├── components/
│   ├── custom/                 # App-specific shared components
│   │   ├── Badge.tsx
│   │   ├── ImageWithFallback.tsx
│   │   ├── LanguageContext.tsx
│   │   ├── LangugeSwitcher.tsx
│   │   ├── MobileNav.tsx
│   │   ├── PopupDialog.tsx
│   │   ├── Sidebar.tsx
│   │   ├── ThemeProvider.tsx
│   │   └── ThemeToggle.tsx
│   └── ui/                     # shadcn/ui primitives (button, dialog, table, ...)
├── db/                       # Local database layer
│   ├── schema.ts                # Data types and DB schema
│   ├── seed.ts                   # Initial data seeding on first load
│   └── queries.ts                # Read/write helpers (create, update, delete forms, etc.)
├── helpers/
│   ├── index.ts                  # General helper functions
│   └── translations.ts            # i18n string dictionaries (en, ckb)
├── lib/
│   └── utils.ts                   # shadcn/ui's cn() helper, etc.
├── data/
│   └── static.ts                  # Static reference data
└── types/
    └── index.ts                    # Shared TypeScript types
```

The `@/` import alias points to `src/`, so `@/views/HomeView` resolves to
`src/views/HomeView.tsx`, and so on.

> Note: `LangugeSwitcher.tsx` is misspelled in the actual filename
> (missing a `u`). If you're renaming it as part of a cleanup PR, please
> update every import site in the same PR rather than leaving the import
> path and filename out of sync.

## Getting started

This project uses [Bun](https://bun.sh) as the package manager and runtime.

```bash
# Install dependencies
bun install

# Start the dev server
bun run dev

# Build for production
bun run build

# Preview the production build locally
bun run preview

# Lint
bun run lint
```

> Check `package.json` for the exact list of available scripts — the ones
> above are the common ones you'll need day to day. There is currently no
> dedicated type-check script; `tsc --noEmit` can be run directly if you
> want to type-check without building.

## How the app works, briefly

- **Login** takes a student's name and total grade; nothing is sent
  anywhere, it's just used to compute eligibility locally.
- **Home** lets students search and filter programs, and shortlist ones
  they're interested in.
- **Shortlist** is where a student's chosen programs live, in priority
  order. Programs can be drag-reordered, removed, and the whole list can be
  printed as a clean admission form. A shortlist can also be saved (with an
  optional label, e.g. _"If I get 95%"_) via `PopupDialog`, so a student can
  compare multiple grade scenarios.
- **History** shows previously saved shortlists/forms, and lets a student
  reopen one for editing.

## Internationalization (i18n) and RTL

All user-facing strings live in `src/helpers/translations.ts`, keyed by
string ID, with one object per supported language (`en`, `ckb`). The
`useLanguage()` hook (from `src/components/custom/LanguageContext.tsx`)
exposes:

- `t(key, vars?)` — translate a string, with `{placeholder}` interpolation
- `language` — the current language code
- `dir` — `"ltr"` or `"rtl"`, derived from the selected language

When adding new UI text:

1. Add the key to **both** language objects in `translations.ts` — a
   missing Kurdish string will fall back to English, but please don't rely
   on that for anything that ships.
2. Use `t("yourKey")` in components rather than hardcoding strings.
3. Use Tailwind's **logical** spacing/alignment classes (`ms-`, `me-`,
   `ps-`, `pe-`, `start-`, `end-`, `text-start`) instead of physical ones
   (`ml-`, `mr-`, `pl-`, `pr-`, `left-`, `right-`, `text-left`) so layouts
   mirror correctly in RTL. Physical-direction classes are the most common
   source of RTL bugs in this codebase — if you're not sure which to use,
   search the file you're editing for an existing example nearby.

If you're proposing changes to the Kurdish (Sorani) translations
specifically, a native-speaker review is especially appreciated — automated
or non-native translations are easy to get subtly wrong, and this is an
area where contributor review matters more than usual.

## Drag and drop

The shortlist's reordering uses the **Pointer Events API**
(`pointerdown`/`pointermove`/`pointerup`) rather than the native HTML5 Drag
and Drop API. This is intentional: native drag-and-drop has a reliability
issue on macOS with trackpad input in Firefox-based browsers (and similar
quirks elsewhere), where `dragstart` fires but the subsequent
`dragenter`/`dragover`/`drop` events never reach the page. Pointer events
sidestep that entirely and behave consistently across mouse, trackpad, and
touch. If you're touching this code, please keep it on Pointer Events rather
than reintroducing native DnD, and test on a trackpad if possible.

## Contributing

1. Fork the repo and create a branch for your change.
2. Keep changes scoped and focused — smaller PRs are easier to review.
3. Run `bun run lint` (and `tsc --noEmit` for type-checking) before opening
   a PR; this project favors strict TypeScript with no `any` where
   avoidable.
4. Match the existing code style: one component per file, Tailwind for
   styling, shadcn/ui primitives from `components/ui` where a suitable one
   exists rather than rebuilding it from scratch, and the i18n/RTL
   conventions described above for anything user-facing.
5. If your change touches the database layer (`src/db/`), please describe
   any schema changes clearly in your PR description, since this affects
   data already saved in users' browsers (IndexedDB) — schema changes need
   to consider backward compatibility/migrations for existing users.
6. Open a PR with a clear description of what changed and why.

Bug reports and feature suggestions are welcome via GitHub Issues, even if
you're not planning to open a PR yourself.

## License

MIT — see [LICENSE](./LICENSE) for details.
