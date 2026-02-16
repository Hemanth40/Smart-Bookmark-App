"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase";
import AuthButton from "@/components/AuthButton";
import BookmarkForm from "@/components/BookmarkForm";
import BookmarkCard from "@/components/BookmarkCard";

export default function DashboardClient({ user, initialBookmarks }) {
    const [bookmarks, setBookmarks] = useState(initialBookmarks);
    const supabase = createClient();

    useEffect(() => {
        // Subscribe to realtime changes on the bookmarks table for this user
        const channel = supabase
            .channel("bookmarks-realtime")
            .on(
                "postgres_changes",
                {
                    event: "INSERT",
                    schema: "public",
                    table: "bookmarks",
                    filter: `user_id=eq.${user.id}`,
                },
                (payload) => {
                    setBookmarks((prev) => {
                        // Avoid duplicates (in case we already added it optimistically)
                        if (prev.some((b) => b.id === payload.new.id)) return prev;
                        return [payload.new, ...prev];
                    });
                }
            )
            .on(
                "postgres_changes",
                {
                    event: "DELETE",
                    schema: "public",
                    table: "bookmarks",
                    filter: `user_id=eq.${user.id}`,
                },
                (payload) => {
                    setBookmarks((prev) =>
                        prev.filter((b) => b.id !== payload.old.id)
                    );
                }
            )
            .subscribe();

        return () => {
            supabase.removeChannel(channel);
        };
    }, [user.id]);

    const handleBookmarkAdded = (newBookmark) => {
        setBookmarks((prev) => {
            if (prev.some((b) => b.id === newBookmark.id)) return prev;
            return [newBookmark, ...prev];
        });
    };

    const handleBookmarkDeleted = (deletedId) => {
        setBookmarks((prev) => prev.filter((b) => b.id !== deletedId));
    };

    return (
        <div className="min-h-screen">
            {/* Header */}
            <header className="sticky top-0 z-10 border-b border-[var(--card-border)] bg-[var(--background)]/80 backdrop-blur-xl">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-[var(--gradient-from)] to-[var(--gradient-to)] flex items-center justify-center shadow-md">
                            <svg
                                className="w-5 h-5 text-white"
                                fill="none"
                                viewBox="0 0 24 24"
                                strokeWidth={1.5}
                                stroke="currentColor"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    d="M17.593 3.322c1.1.128 1.907 1.077 1.907 2.185V21L12 17.25 4.5 21V5.507c0-1.108.806-2.057 1.907-2.185a48.507 48.507 0 0111.186 0z"
                                />
                            </svg>
                        </div>
                        <h1 className="text-lg font-bold bg-gradient-to-r from-[var(--gradient-from)] to-[var(--gradient-to)] bg-clip-text text-transparent">
                            Smart Bookmark
                        </h1>
                    </div>
                    <AuthButton user={user} />
                </div>
            </header>

            {/* Main Content */}
            <main className="max-w-4xl mx-auto px-4 sm:px-6 py-8">
                {/* Add Bookmark Form */}
                <BookmarkForm onBookmarkAdded={handleBookmarkAdded} />

                {/* Bookmarks List */}
                <section className="mt-8">
                    <div className="flex items-center justify-between mb-5">
                        <h2 className="text-xl font-semibold">Your Bookmarks</h2>
                        <span className="text-sm text-[var(--muted)] bg-[var(--card-bg)] px-3 py-1 rounded-full border border-[var(--card-border)]">
                            {bookmarks.length} {bookmarks.length === 1 ? "link" : "links"}
                        </span>
                    </div>

                    {bookmarks.length === 0 ? (
                        <div className="text-center py-16 bg-[var(--card-bg)] border border-[var(--card-border)] rounded-2xl">
                            <div className="text-5xl mb-4">📑</div>
                            <p className="text-[var(--muted)] text-lg">No bookmarks yet</p>
                            <p className="text-[var(--muted)] text-sm mt-1">
                                Add your first bookmark above to get started!
                            </p>
                        </div>
                    ) : (
                        <div className="grid gap-3">
                            {bookmarks.map((bookmark, index) => (
                                <BookmarkCard
                                    key={bookmark.id}
                                    bookmark={bookmark}
                                    onDelete={handleBookmarkDeleted}
                                    style={{ animationDelay: `${index * 50}ms` }}
                                />
                            ))}
                        </div>
                    )}
                </section>
            </main>
        </div>
    );
}
