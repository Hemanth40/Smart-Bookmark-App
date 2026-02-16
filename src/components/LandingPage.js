"use client";

import AuthButton from "@/components/AuthButton";

export default function LandingPage() {
    return (
        <main className="min-h-screen flex items-center justify-center p-6">
            {/* Decorative background elements */}
            <div className="fixed inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-1/4 -left-32 w-96 h-96 rounded-full bg-[var(--gradient-from)] opacity-[0.04] blur-3xl" />
                <div className="absolute bottom-1/4 -right-32 w-96 h-96 rounded-full bg-[var(--gradient-to)] opacity-[0.04] blur-3xl" />
            </div>

            <div className="relative w-full max-w-md text-center">
                {/* Logo / Icon */}
                <div className="mx-auto w-20 h-20 rounded-2xl bg-gradient-to-br from-[var(--gradient-from)] to-[var(--gradient-to)] flex items-center justify-center mb-8 shadow-lg shadow-indigo-500/20 animate-pulse-glow">
                    <svg
                        className="w-10 h-10 text-white"
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

                {/* Title */}
                <h1 className="text-4xl font-bold mb-3 bg-gradient-to-r from-[var(--gradient-from)] to-[var(--gradient-to)] bg-clip-text text-transparent">
                    Smart Bookmark
                </h1>
                <p className="text-[var(--muted)] text-lg mb-10 leading-relaxed">
                    Save, organize, and sync your bookmarks across all your devices in
                    real-time.
                </p>

                {/* Sign In Card */}
                <div className="bg-[var(--card-bg)] border border-[var(--card-border)] rounded-2xl p-8 shadow-xl">
                    <h2 className="text-xl font-semibold mb-2">Get Started</h2>
                    <p className="text-[var(--muted)] text-sm mb-6">
                        Sign in with your Google account to begin
                    </p>
                    <AuthButton />
                </div>

                {/* Features */}
                <div className="mt-10 grid grid-cols-3 gap-4 text-center">
                    <div className="p-3">
                        <div className="text-2xl mb-2">⚡</div>
                        <p className="text-xs text-[var(--muted)]">Real-time Sync</p>
                    </div>
                    <div className="p-3">
                        <div className="text-2xl mb-2">🔒</div>
                        <p className="text-xs text-[var(--muted)]">Private & Secure</p>
                    </div>
                    <div className="p-3">
                        <div className="text-2xl mb-2">🌐</div>
                        <p className="text-xs text-[var(--muted)]">Access Anywhere</p>
                    </div>
                </div>
            </div>
        </main>
    );
}
