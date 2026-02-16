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

> 🔗 **[smart-bookmark-app.vercel.app](#)** *(link will be updated after deployment)*
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

## 🐛 Problems & Solutions

<details>
<summary><b>1. OAuth Redirect URI Mismatch</b></summary>

**Problem:** Google sign-in failed with `redirect_uri_mismatch` after deploying to Vercel.

**Root Cause:** The production URL wasn't registered as an authorized redirect URI.

**Fix:** Added `https://<app>.vercel.app/auth/callback` to both Google Cloud Console *and* Supabase redirect URL settings.

</details>

<details>
<summary><b>2. Realtime Events Leaking Between Users</b></summary>

**Problem:** Subscribing to the `bookmarks` table pushed events from *all* users to every client.

**Root Cause:** No filter was applied on the Realtime channel.

**Fix:** Applied a user-scoped filter on subscription:
```js
filter: `user_id=eq.${user.id}`
```

</details>

<details>
<summary><b>3. Session Lost Between Pages (App Router)</b></summary>

**Problem:** After Google sign-in, navigating to `/dashboard` sometimes treated the user as unauthenticated.

**Root Cause:** Supabase auth cookies weren't being refreshed on navigation in Next.js App Router.

**Fix:** Added `middleware.js` using `@supabase/ssr` that refreshes the session on every request by syncing cookies between request and response.

</details>

<details>
<summary><b>4. Duplicate Bookmarks Appearing</b></summary>

**Problem:** Adding a bookmark showed it twice — once from the optimistic update and once from the Realtime event.

**Root Cause:** Both the form callback and the Realtime subscription were adding the same bookmark to state.

**Fix:** Added deduplication in the state setter:
```js
if (prev.some(b => b.id === payload.new.id)) return prev;
```

</details>

<details>
<summary><b>5. RLS Silently Blocking Inserts</b></summary>

**Problem:** Users couldn't insert bookmarks — the insert returned no error but no data either.

**Root Cause:** The RLS `INSERT` policy uses `WITH CHECK (auth.uid() = user_id)`, but `user_id` wasn't being sent from the client.

**Fix:** Ensured the Supabase client auto-attaches the auth token, and the `user_id` column is populated via the authenticated user's JWT.

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
