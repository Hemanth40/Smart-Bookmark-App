"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase";

export default function BookmarkForm({ onBookmarkAdded }) {
    const [url, setUrl] = useState("");
    const [title, setTitle] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const supabase = createClient();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");

        if (!url.trim() || !title.trim()) {
            setError("Both URL and title are required.");
            return;
        }

        // Basic URL validation
        try {
            new URL(url.trim());
        } catch {
            setError("Please enter a valid URL (e.g. https://example.com).");
            return;
        }

        setLoading(true);

        const { data, error: insertError } = await supabase
            .from("bookmarks")
            .insert([{ url: url.trim(), title: title.trim() }])
            .select()
            .single();

        setLoading(false);

        if (insertError) {
            setError(insertError.message);
            return;
        }

        onBookmarkAdded(data);
        setUrl("");
        setTitle("");
    };

    return (
        <form
            onSubmit={handleSubmit}
            className="bg-[var(--card-bg)] border border-[var(--card-border)] rounded-2xl p-6 shadow-lg"
        >
            <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <svg
                    className="w-5 h-5 text-[var(--accent)]"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={1.5}
                    stroke="currentColor"
                >
                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M12 4.5v15m7.5-7.5h-15"
                    />
                </svg>
                Add Bookmark
            </h2>

            <div className="grid sm:grid-cols-2 gap-4">
                <div>
                    <label
                        htmlFor="title"
                        className="block text-sm text-[var(--muted)] mb-1.5"
                    >
                        Title
                    </label>
                    <input
                        id="title"
                        type="text"
                        placeholder="My Favorite Site"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        className="w-full px-4 py-2.5 rounded-xl bg-[var(--input-bg)] border border-[var(--input-border)] text-[var(--foreground)] placeholder-[var(--muted)]/50 outline-none focus:border-[var(--input-focus)] focus:ring-1 focus:ring-[var(--input-focus)] transition-all duration-200"
                    />
                </div>
                <div>
                    <label
                        htmlFor="url"
                        className="block text-sm text-[var(--muted)] mb-1.5"
                    >
                        URL
                    </label>
                    <input
                        id="url"
                        type="text"
                        placeholder="https://example.com"
                        value={url}
                        onChange={(e) => setUrl(e.target.value)}
                        className="w-full px-4 py-2.5 rounded-xl bg-[var(--input-bg)] border border-[var(--input-border)] text-[var(--foreground)] placeholder-[var(--muted)]/50 outline-none focus:border-[var(--input-focus)] focus:ring-1 focus:ring-[var(--input-focus)] transition-all duration-200"
                    />
                </div>
            </div>

            {error && (
                <p className="mt-3 text-sm text-[var(--danger)]">{error}</p>
            )}

            <button
                type="submit"
                disabled={loading}
                className="mt-4 w-full sm:w-auto px-6 py-2.5 rounded-xl bg-gradient-to-r from-[var(--gradient-from)] to-[var(--gradient-to)] text-white font-medium hover:opacity-90 disabled:opacity-50 transition-all duration-200 shadow-md hover:shadow-lg cursor-pointer disabled:cursor-not-allowed"
            >
                {loading ? (
                    <span className="flex items-center justify-center gap-2">
                        <svg
                            className="w-4 h-4 animate-spin"
                            viewBox="0 0 24 24"
                            fill="none"
                        >
                            <circle
                                className="opacity-25"
                                cx="12"
                                cy="12"
                                r="10"
                                stroke="currentColor"
                                strokeWidth="4"
                            />
                            <path
                                className="opacity-75"
                                fill="currentColor"
                                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                            />
                        </svg>
                        Adding…
                    </span>
                ) : (
                    "Add Bookmark"
                )}
            </button>
        </form>
    );
}
