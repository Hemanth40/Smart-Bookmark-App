# Smart Bookmark App 🔖

A real-time bookmark manager built with **Next.js**, **Supabase**, and **Tailwind CSS**. Sign in with Google, save your favorite links, and see them sync across tabs instantly.

## 🚀 Live Demo

> **Vercel URL**: *(add after deployment)*

## ✨ Features

- **Google OAuth** — Sign in securely with your Google account (no email/password)
- **Add Bookmarks** — Save any URL with a title in one click
- **Delete Bookmarks** — Remove bookmarks you no longer need
- **Private & Secure** — Row Level Security ensures only you can see your bookmarks
- **Real-time Sync** — Open two tabs, add a bookmark in one ─ it appears in the other instantly
- **Responsive Design** — Works beautifully on desktop and mobile

## 🛠️ Tech Stack

| Technology | Purpose |
|-----------|---------|
| [Next.js 16](https://nextjs.org/) (App Router) | Frontend framework with SSR |
| [Supabase](https://supabase.com/) | Auth, PostgreSQL Database, Realtime |
| [Tailwind CSS v4](https://tailwindcss.com/) | Utility-first CSS styling |
| [Vercel](https://vercel.com/) | Deployment & hosting |

## 📁 Project Structure

```
src/
├── app/
│   ├── layout.js              # Root layout
│   ├── page.js                # Landing page (sign-in)
│   ├── dashboard/page.js      # Bookmark manager (protected)
│   └── auth/callback/route.js # OAuth callback handler
├── components/
│   ├── AuthButton.js          # Google sign-in/sign-out
│   ├── DashboardClient.js     # Dashboard with realtime
│   ├── BookmarkForm.js        # Add bookmark form
│   └── BookmarkCard.js        # Bookmark display card
├── lib/
│   ├── supabase.js            # Browser Supabase client
│   └── supabase-server.js     # Server Supabase client
└── middleware.js               # Session refresh middleware
```

## 🗄️ Database Setup

Run this SQL in your **Supabase SQL Editor**:

```sql
-- Create bookmarks table
CREATE TABLE bookmarks (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  title TEXT NOT NULL,
  url TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now() NOT NULL
);

-- Enable Row Level Security
ALTER TABLE bookmarks ENABLE ROW LEVEL SECURITY;

-- Policy: Users can only see their own bookmarks
CREATE POLICY "Users can view own bookmarks" ON bookmarks
  FOR SELECT USING (auth.uid() = user_id);

-- Policy: Users can only insert their own bookmarks
CREATE POLICY "Users can insert own bookmarks" ON bookmarks
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Policy: Users can only delete their own bookmarks
CREATE POLICY "Users can delete own bookmarks" ON bookmarks
  FOR DELETE USING (auth.uid() = user_id);

-- Enable Realtime
ALTER PUBLICATION supabase_realtime ADD TABLE bookmarks;
```

## ⚙️ Local Development

1. Clone the repo:
   ```bash
   git clone <your-repo-url>
   cd smart-bookmark-app
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create `.env.local`:
   ```
   NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
   ```

4. Run the dev server:
   ```bash
   npm run dev
   ```

5. Open [http://localhost:3000](http://localhost:3000)

## 🚢 Deploy to Vercel

1. Push code to a public GitHub repo
2. Go to [vercel.com](https://vercel.com) → Import your repo
3. Add environment variables:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
4. Deploy! Update the Google OAuth redirect URI to include your Vercel domain:
   ```
   https://your-app.vercel.app/auth/callback
   ```
   Add this in **both** Google Cloud Console (Authorized redirect URIs) **and** Supabase Dashboard (Authentication → URL Configuration → Redirect URLs).

## 🐛 Problems Encountered & Solutions

### 1. OAuth Redirect URI Mismatch
**Problem**: After deploying to Vercel, Google sign-in failed with a "redirect_uri_mismatch" error.
**Solution**: Added the Vercel production URL (`https://your-app.vercel.app/auth/callback`) to both Google Cloud Console and Supabase redirect URL settings.

### 2. Realtime Events for Other Users Leaking
**Problem**: When subscribing to Supabase Realtime on the `bookmarks` table, events from all users were received.
**Solution**: Applied a filter on the Realtime subscription: `filter: 'user_id=eq.${user.id}'` to only receive events for the current user's bookmarks.

### 3. Session Not Persisting Across Pages (App Router)
**Problem**: After sign-in, navigating to `/dashboard` sometimes showed the user as unauthenticated.
**Solution**: Implemented Next.js middleware (`middleware.js`) that refreshes the Supabase session on every request using `@supabase/ssr`, ensuring cookies stay in sync between server and client.

### 4. Duplicate Bookmarks on Insert
**Problem**: When adding a bookmark, it appeared twice — once from the form's optimistic update and once from the Realtime subscription.
**Solution**: Added deduplication logic in the state handler: `if (prev.some(b => b.id === payload.new.id)) return prev;`

### 5. RLS Blocking Inserts
**Problem**: Users couldn't insert bookmarks because the `user_id` column wasn't being set automatically.
**Solution**: The `user_id` is set by the client, and the RLS policy `WITH CHECK (auth.uid() = user_id)` ensures users can only insert with their own ID. The Supabase client auto-includes the auth token.

## 📄 License

MIT
