# Aviral, for real

A personal writing space for Aviral Ale — Kathmandu, Nepal. Dark, warm,
typographic. Built with Next.js (App Router) and a custom design system.

The blog content is served by a separate Django REST API (see
`../aviral-unfiltered-api`).

## Stack

- **Next.js 16** (App Router, Server Components, Turbopack)
- **Tailwind CSS v4** with a hand-built token system (no Typography plugin)
- **next/font** — Lora (display), Inter (body), JetBrains Mono (mono)
- **next-themes** — dark (default) / light, class strategy
- **framer-motion** — page transitions, staggered lists, mobile drawer
- **react-markdown** + **rehype-highlight** — post bodies & syntax highlighting

## Getting started

```bash
npm install
cp .env.example .env.local   # then edit NEXT_PUBLIC_API_URL if needed
npm run dev                  # http://localhost:3000
```

`NEXT_PUBLIC_API_URL` must point at the running Django API (default
`http://localhost:8000`).

## Scripts

| Command         | Description                       |
| --------------- | --------------------------------- |
| `npm run dev`   | Start the dev server (Turbopack)  |
| `npm run build` | Production build                  |
| `npm run start` | Serve the production build        |
| `npm run lint`  | ESLint                            |

## Structure

```
app/
  layout.tsx               Root — fonts, ThemeProvider, metadata (no chrome)
  globals.css              Design tokens, .post-body, syntax highlighting
  not-found.tsx            404
  (site)/                  Public site (gets Navbar + Footer)
    layout.tsx               Navbar + Footer shell
    page.tsx                 Homepage — hero + category filter + post list
    posts/[slug]/page.tsx    Post detail — reading progress, body, tags, more
    about/page.tsx           About
  dashboard/               Private admin (gated by proxy.ts)
    login/page.tsx           Sign in (no chrome)
    (panel)/                 Authenticated dashboard (own sidebar chrome)
      layout.tsx, page.tsx   Shell + posts list
      posts/new, posts/[id]/edit, categories, tags
  api/admin/               Server-side auth bridge to Django
    login, logout            Set / clear the httpOnly session cookie
    [...path]                Authenticated proxy (attaches token, forwards)
components/
  ui/                  ThemeToggle, CategoryPill, TagPill, PostMeta, ReadingProgress
  layout/              Navbar (mobile drawer + frosted scroll), Footer, PageWrapper
  post/                PostListItem, PostBody, MorePosts
  home/                HomeFeed (client-side category filter + load more)
  dashboard/           LoginForm, DashboardShell, PostsList, PostEditor, TaxonomyManager
lib/
  api.ts               Public Django API fetch wrappers
  admin.ts             Dashboard client → same-origin /api/admin proxy
  server-api.ts        Route-handler constants (API base, cookie name)
  utils.ts             cn(), formatDate()
proxy.ts               Gates /dashboard on the session cookie
types/
  index.ts             Category, Tag, PostListItem, Post, AdminPost, ...
```

## Dashboard (admin)

A custom admin lives at **`/dashboard`** — sign in, write/edit posts in Markdown
with a live preview and cover upload, publish/unpublish, and manage categories &
tags. It's built in the blog's own design, not the Django admin.

Auth is handled without exposing a token to client JS:

1. `/dashboard/login` posts credentials to the `/api/admin/login` **route
   handler**, which calls Django and stores the returned token in an
   **httpOnly** cookie.
2. `proxy.ts` redirects any `/dashboard/*` request without that cookie to login.
3. Dashboard pages call same-origin `/api/admin/*`; the `[...path]` route handler
   reads the cookie server-side, attaches `Authorization: Token …`, and forwards
   to Django. The token never reaches the browser and CORS is never involved.

Sign in with a Django **staff** account (create one with
`python manage.py createsuperuser` in the API project).

## Design system

All colors, fonts, and the type scale live as CSS variables in
`app/globals.css`. The accent (warm gold) is used **only** for link-underline
hover, the active nav item, category-pill hover, blockquote borders, and the
reading-progress bar — never for backgrounds, headings, or buttons.
# aviral-forreal
