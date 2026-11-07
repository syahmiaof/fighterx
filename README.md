# FighterX V1

Mobile-first training and performance platform for Silat Seni and Silat Olahraga.

## Local preview

```bash
npm install
npm run dev
```

Open `http://localhost:3000`.

## Current scope

- Public homepage built from HTML, CSS, React components, and supplied image layers.
- Responsive registration-preview and sign-in routes.
- Registration and authentication are intentionally not persisted; the UI states this clearly.
- Shared product and design tokens are in `PRODUCT.md` and `DESIGN.md`.
- Initial role, discipline, training assignment, submission, evidence, and verification contracts are in `src/types/platform.ts`.

## Supabase setup checklist

1. Create/select a Supabase project for FighterX V1.
2. Copy `.env.example` to `.env.local` and set the project URL and public anon key.
3. Add Supabase Auth, database migrations, Row Level Security policies, and private evidence storage before enabling any real sign-in or submission flows.
4. Keep the service-role key server-only; never prefix it with `NEXT_PUBLIC_` or commit it.
5. Seed only explicitly labeled demo records until real organization and athlete data is connected.

No Supabase URL, key, database, or storage bucket is configured in this workspace.
