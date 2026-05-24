# Admin Security Notes

The admin dashboard must not use hardcoded credentials.

## Current approach

- Admin login uses Supabase Auth.
- The frontend only uses the Supabase anon key.
- A signed-in user must also exist in `admin_profiles`.
- The dashboard does not expose private data unless the account passes that check.

## Before publishing

1. Create the Supabase project.
2. Run `docs/supabase-schema.sql` in the Supabase SQL editor.
3. Create your admin user in Supabase Auth.
4. Insert that user's `id` and email into `admin_profiles`.
5. Add these Vercel environment variables:

```txt
VITE_SUPABASE_URL=
VITE_SUPABASE_ANON_KEY=
```

Never put the Supabase service role key in React or Vercel frontend variables.

Contact form submissions and public client reviews are stored through Supabase using the public insert policies in `docs/supabase-schema.sql`. Add rate limiting or CAPTCHA before launch if spam becomes a concern.
