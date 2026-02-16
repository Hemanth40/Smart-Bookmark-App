<p align="center">
  <img src="https://img.icons8.com/3d-fluency/94/bookmark-ribbon.png" width="80" alt="Smart Bookmark Logo"/>
</p>

<h1 align="center">Smart Bookmark</h1>

<p align="center">
  <strong>A real-time bookmark manager — save, sync, and access your links from anywhere.</strong>
</p>

<p align="center">
  <a href="#"><img src="https://img.shields.io/badge/Next.js-16-black?style=for-the-badge&logo=next.js" alt="Next.js"/></a>
  <a href="#"><img src="https://img.shields.io/badge/Supabase-Auth%20%7C%20DB%20%7C%20Realtime-3FCF8E?style=for-the-badge&logo=supabase&logoColor=white" alt="Supabase"/></a>
  <a href="#"><img src="https://img.shields.io/badge/Tailwind_CSS-v4-06B6D4?style=for-the-badge&logo=tailwindcss&logoColor=white" alt="Tailwind CSS"/></a>
  <a href="#"><img src="https://img.shields.io/badge/Deployed_on-Vercel-000?style=for-the-badge&logo=vercel" alt="Vercel"/></a>
</p>

<p align="center">
  <a href="#-live-demo">Live Demo</a> •
  <a href="#-features">Features</a> •
  <a href="#%EF%B8%8F-tech-stack">Tech Stack</a> •
  <a href="#-getting-started">Getting Started</a> •
  <a href="#-problems--solutions">Problems & Solutions</a>
</p>

---

## 🌐 Live Demo

> 🔗 **[smart-bookmark-app-xi-ruddy.vercel.app](https://smart-bookmark-app-xi-ruddy.vercel.app)**
>
> Sign in with your Google account to test — your bookmarks are private and synced in real-time.

---

## ✨ Features

| Feature | Description |
|---------|-------------|
| 🔐 **Google OAuth** | One-click sign-in with Google — no passwords needed |
| ➕ **Add Bookmarks** | Save any URL with a custom title instantly |
| 🗑️ **Delete Bookmarks** | Remove links you no longer need |
| 🔒 **Private by Default** | Row Level Security ensures your bookmarks are invisible to others |
| ⚡ **Real-time Sync** | Add a bookmark in one tab → it appears in another tab instantly |
| 📱 **Responsive** | Fully responsive dark-themed UI — works on desktop & mobile |

---

## 🛠️ Tech Stack

```
Frontend       →  Next.js 16 (App Router)
Styling        →  Tailwind CSS v4
Auth           →  Supabase Auth (Google OAuth 2.0)
Database       →  Supabase PostgreSQL + Row Level Security
Real-time      →  Supabase Realtime (Postgres Changes)
Hosting        →  Vercel
```

---

## 📂 Project Structure

```
src/
├── app/
│   ├── layout.js                # Root layout with fonts & metadata
│   ├── page.js                  # Landing page — Google sign-in
│   ├── dashboard/
│   │   └── page.js              # Protected dashboard (server-side auth check)
│   └── auth/
│       └── callback/
│           └── route.js         # OAuth code → session exchange
├── components/
│   ├── AuthButton.js            # Sign-in / Sign-out with avatar
│   ├── DashboardClient.js       # Client component with Realtime subscription
│   ├── BookmarkForm.js          # URL + Title form with validation
│   └── BookmarkCard.js          # Card with favicon, domain, delete
├── lib/
│   ├── supabase.js              # Browser client (@supabase/ssr)
│   └── supabase-server.js       # Server client with cookie handling
└── middleware.js                 # Session refresh on every request
```

---

## 🗄️ Database Schema

```sql
CREATE TABLE bookmarks (
  id         UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id    UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  title      TEXT NOT NULL,
  url        TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now() NOT NULL
);
```

**RLS Policies** — each user can only `SELECT`, `INSERT`, and `DELETE` their own rows:

```sql
ALTER TABLE bookmarks ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own bookmarks"  ON bookmarks FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own bookmarks" ON bookmarks FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can delete own bookmarks" ON bookmarks FOR DELETE USING (auth.uid() = user_id);

ALTER PUBLICATION supabase_realtime ADD TABLE bookmarks;
```

---

## 🚀 Getting Started

### Prerequisites

- Node.js 18+
- A [Supabase](https://supabase.com) project
- Google OAuth credentials ([Google Cloud Console](https://console.cloud.google.com))

### 1️⃣ Clone & Install

```bash
git clone https://github.com/<your-username>/smart-bookmark-app.git
cd smart-bookmark-app
npm install
```

### 2️⃣ Environment Variables

Create `.env.local` in the root:

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
```

### 3️⃣ Database Setup

Run the SQL from the [Database Schema](#%EF%B8%8F-database-schema) section in your **Supabase SQL Editor**.

### 4️⃣ Run Locally

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) 🎉

---

## 🚢 Deploy to Vercel

1. Push to a **public GitHub repo**
2. Import the repo on [vercel.com](https://vercel.com)
3. Add environment variables: `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY`
4. Deploy

> **Important:** After deployment, add your Vercel URL as a redirect URI:
> - **Google Cloud Console** → Credentials → your OAuth client → Authorized redirect URIs → add `https://your-app.vercel.app/auth/callback`
> - **Supabase Dashboard** → Authentication → URL Configuration → Redirect URLs → add `https://your-app.vercel.app/auth/callback`

---

## 🐛 Problems Faced & How I Solved Them

<details>
<summary><b>1. Google Sign-In Button Required Two Clicks</b></summary>

**Problem:** The "Sign in with Google" button had to be clicked twice — the first click did nothing, and only the second click triggered the OAuth redirect.

**Root Cause:** The sign-in handler was defined as `async () => { await supabase.auth.signInWithOAuth(...) }`. Browsers block redirects from `async` callbacks because they no longer count as a "user gesture" after the first `await`. The first click was consumed by hydration/async setup.

**Fix:** Removed `async/await` from the handler and added `type="button"` to the button element:
```js
// Before (broken)
const handleSignIn = async () => { await supabase.auth.signInWithOAuth({...}) };

// After (fixed)
const handleSignIn = () => { supabase.auth.signInWithOAuth({...}) };
```

</details>

<details>
<summary><b>2. OAuth Callback Not Setting Session Cookies on Redirect</b></summary>

**Problem:** After authenticating with Google, the user was redirected back to the sign-in page instead of the dashboard. They had to click sign-in again to reach the dashboard.

**Root Cause:** The `/auth/callback` route handler used a shared `createClient()` utility that sets cookies via `cookieStore` from `next/headers`. In a route handler, these cookies are **not automatically attached** to the `NextResponse.redirect()` response, so the session was lost during the redirect.

**Fix:** Rewrote the callback route to create the Supabase client **directly with the response object's cookies**, so session cookies travel with the redirect:
```js
const response = NextResponse.redirect(`${origin}/dashboard`);
const supabase = createServerClient(URL, KEY, {
  cookies: {
    getAll() { return request.cookies.getAll(); },
    setAll(cookiesToSet) {
      cookiesToSet.forEach(({ name, value, options }) => {
        response.cookies.set(name, value, options);  // Cookies on the RESPONSE
      });
    },
  },
});
```

</details>

<details>
<summary><b>3. OAuth Redirect URI Mismatch After Vercel Deployment</b></summary>

**Problem:** Google sign-in worked locally but failed on the deployed Vercel URL with a redirect error.

**Root Cause:** Three separate configurations needed to stay in sync:
1. Google Cloud Console → Authorized redirect URIs
2. Supabase Dashboard → Authentication → URL Configuration → Site URL
3. Supabase Dashboard → Authentication → URL Configuration → Redirect URLs

Missing the Vercel callback URL (`https://<app>.vercel.app/auth/callback`) from the Supabase Redirect URLs caused the redirect to fail silently.

**Fix:** Added the Vercel callback URL to Supabase's Redirect URLs list and set the Site URL to the Vercel domain.

</details>

<details>
<summary><b>4. Duplicate Bookmarks from Realtime + Optimistic Update</b></summary>

**Problem:** Adding a bookmark showed it twice — once immediately from the form's callback and once from the Supabase Realtime INSERT event.

**Root Cause:** Both the form's `onBookmarkAdded` callback and the Realtime subscription's INSERT handler were adding the same bookmark to the React state.

**Fix:** Added deduplication logic that checks by ID before adding:
```js
setBookmarks((prev) => {
  if (prev.some((b) => b.id === payload.new.id)) return prev;
  return [payload.new, ...prev];
});
```

</details>

<details>
<summary><b>5. Server Component Landing Page Swallowing Button Clicks</b></summary>

**Problem:** The landing page's interactive "Sign in with Google" button occasionally didn't respond on the first click.

**Root Cause:** The landing page was an `async` server component that rendered a client component (`AuthButton`) inside it. Next.js hydrates client components embedded in server components lazily, meaning the first click could be consumed by the hydration process rather than triggering the `onClick` handler.

**Fix:** Extracted the entire landing page UI into a separate `LandingPage.js` client component (`"use client"`), and kept the server `page.js` only for the auth redirect check. This ensures the button is interactive from the moment the page loads.

</details>

<details>
<summary><b>6. Realtime Events Leaking Between Users</b></summary>

**Problem:** Without proper filtering, the Supabase Realtime subscription would push bookmark events from *all* users to every connected client.

**Root Cause:** The Realtime channel was subscribed to the entire `bookmarks` table without a user-scoped filter.

**Fix:** Applied a filter on the Realtime subscription to only receive events for the authenticated user:
```js
filter: `user_id=eq.${user.id}`
```

</details>

---

## 🔒 Security

- **Row Level Security (RLS)** on all database operations — users can never access another user's data
- **Server-side auth checks** on protected routes
- **Middleware** refreshes sessions to prevent stale tokens
- **No secrets exposed** — only `NEXT_PUBLIC_*` env vars are used client-side

---

## 📄 License

MIT — feel free to fork and build on it.

---

<p align="center">
  Built with ☕ and 💜 using Next.js + Supabase
</p>
