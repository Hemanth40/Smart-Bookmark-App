"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase";

export default function BookmarkCard({ bookmark, onDelete, style }) {
    const [deleting, setDeleting] = useState(false);
    const supabase = createClient();

    const handleDelete = async () => {
        setDeleting(true);
        const { error } = await supabase
            .from("bookmarks")
            .delete()
            .eq("id", bookmark.id);

        if (error) {
            console.error("Delete error:", error);
            setDeleting(false);
            return;
        }

        onDelete(bookmark.id);
    };

    // Extract domain for display
    let domain = "";
    try {
        domain = new URL(bookmark.url).hostname.replace("www.", "");
    } catch {
        domain = bookmark.url;
    }

    const faviconUrl = `https://www.google.com/s2/favicons?domain=${domain}&sz=32`;

    const timeAgo = (dateStr) => {
        const diff = Date.now() - new Date(dateStr).getTime();
        const mins = Math.floor(diff / 60000);
        if (mins < 1) return "just now";
        if (mins < 60) return `${mins}m ago`;
        const hours = Math.floor(mins / 60);
        if (hours < 24) return `${hours}h ago`;
        const days = Math.floor(hours / 24);
        if (days < 7) return `${days}d ago`;
        return new Date(dateStr).toLocaleDateString();
    };

    return (
        <div
            className="animate-fade-in-up group flex items-center gap-4 p-4 bg-[var(--card-bg)] border border-[var(--card-border)] rounded-xl hover:border-[var(--accent)]/30 transition-all duration-200"
            style={style}
        >
            {/* Favicon */}
            <div className="flex-shrink-0 w-10 h-10 rounded-lg bg-[var(--background)] border border-[var(--card-border)] flex items-center justify-center overflow-hidden">
                <img
                    src={faviconUrl}
                    alt=""
                    className="w-5 h-5"
                    onError={(e) => {
                        e.target.style.display = "none";
                    }}
                />
            </div>

            {/* Content */}
            <div className="flex-1 min-w-0">
                <h3 className="font-medium text-[var(--foreground)] truncate">
                    {bookmark.title}
                </h3>
                <a
                    href={bookmark.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm text-[var(--accent)] hover:text-[var(--accent-hover)] truncate block transition-colors duration-200"
                >
                    {domain}
                    <svg
                        className="w-3 h-3 inline ml-1 opacity-0 group-hover:opacity-100 transition-opacity"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth={2}
                        stroke="currentColor"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M13.5 6H5.25A2.25 2.25 0 003 8.25v10.5A2.25 2.25 0 005.25 21h10.5A2.25 2.25 0 0018 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25"
                        />
                    </svg>
                </a>
            </div>

            {/* Time */}
            <span className="hidden sm:inline text-xs text-[var(--muted)] flex-shrink-0">
                {timeAgo(bookmark.created_at)}
            </span>

            {/* Open button */}
            <a
                href={bookmark.url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-shrink-0 px-3 py-1.5 rounded-lg text-sm font-medium bg-[var(--accent)] text-white hover:bg-[var(--accent-hover)] transition-all duration-200 flex items-center gap-1.5 shadow-sm hover:shadow-md"
            >
                Open
                <svg
                    className="w-3.5 h-3.5"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={2}
                    stroke="currentColor"
                >
                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M13.5 6H5.25A2.25 2.25 0 003 8.25v10.5A2.25 2.25 0 005.25 21h10.5A2.25 2.25 0 0018 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25"
                    />
                </svg>
            </a>

            {/* Delete button */}
            <button
                onClick={handleDelete}
                disabled={deleting}
                className="flex-shrink-0 p-2 rounded-lg text-[var(--muted)] hover:text-[var(--danger)] hover:bg-[var(--danger)]/10 opacity-0 group-hover:opacity-100 transition-all duration-200 cursor-pointer disabled:opacity-50"
                title="Delete bookmark"
            >
                {deleting ? (
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
                ) : (
                    <svg
                        className="w-4 h-4"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth={1.5}
                        stroke="currentColor"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0"
                        />
                    </svg>
                )}
            </button>
        </div>
    );
}
