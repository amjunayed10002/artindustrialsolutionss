# ART Industrial Solutions

Industrial supply, B2B procurement and multi-seller RFQ website built with React, TypeScript, Vite and Tailwind CSS.

## Local Setup

Requires Node.js 20 or newer.

1. Create a Supabase project.
2. Run [`supabase/schema.sql`](supabase/schema.sql) in the Supabase SQL Editor.
3. Copy `.env.example` to `.env.local` and set `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` from the Supabase project API settings.
4. Run `npm install` and `npm run dev`.

The environment file is ignored by Git. Only the Supabase project URL and public anon key belong in the browser build. Never add a service-role key or database password to a `VITE_` variable.

## Accounts

Buyer and seller accounts use Supabase email/password authentication. New seller accounts remain pending until an authorized administrator approves them. Admin accounts must be provisioned by the project owner in the Supabase SQL Editor after the account has been created:

```sql
update public.profiles
set role = 'admin', admin_role = 'super_admin', is_active = true
where lower(email) = lower('your-registered-email@example.com')
returning id, email, role, admin_role;
```

The query should return one row. If it returns no rows, confirm the email under Supabase Authentication → Users and rerun `supabase/schema.sql`; the schema backfills accounts that existed before the profile trigger was installed.

Configure the Supabase Auth site URL and redirect URLs for both local development and the deployed domain. Enable email confirmation before launch and configure the confirmation email template.

## Deploy

For Vercel, import the repository and set the build command to `npm run build` and output directory to `dist`. Add `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` under the project's environment variables, then redeploy.

## Current Database Boundary

Supabase currently stores authentication profiles and seller approval status. Product catalog, cart, RFQ, offer, order and site-content data are still held in browser storage and are not shared between users or devices. Those workflows require a further database migration before using this as a live marketplace; do not use the current client-side permissions as the security boundary for business records.

## Project Structure

- `src/components` – pages and UI sections
- `src/context/AppContext.tsx` – global app and authentication state
- `src/data/initialData.ts` – starter catalog and company content
- `src/lib/supabase.ts` – Supabase client configuration
- `supabase/schema.sql` – profile, role and seller-review schema
- `public/images` – site images
