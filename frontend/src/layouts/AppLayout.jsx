import React from "react";

export default function AppLayout({ title = "Dashboard", children }) {
    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 text-slate-50 flex">
            {/* Sidebar */}
            <aside className="hidden md:flex w-64 flex-col border-r border-white/10 bg-white/5 backdrop-blur-2xl">
                <div className="px-6 py-6 border-b border-white/10">
                    <div className="flex items-center gap-3">
                        <div className="h-9 w-9 rounded-2xl bg-gradient-to-tr from-emerald-400 via-sky-400 to-blue-500 flex items-center justify-center text-lg font-black shadow-lg shadow-emerald-500/40">
                            ₹
                        </div>
                        <div>
                            <p className="text-sm font-semibold tracking-wide uppercase text-slate-200">
                                Personal Finance AI
                            </p>
                            <p className="text-xs text-slate-400">
                                Smart money insights for you
                            </p>
                        </div>
                    </div>
                </div>

                <nav className="flex-1 px-3 py-4 space-y-1 text-sm">
                    <SidebarItem label="Overview" active />
                    <SidebarItem label="Transactions" />
                    <SidebarItem label="Budgets" />
                    <SidebarItem label="Goals" />
                    <SidebarItem label="Subscriptions" />
                    <SidebarItem label="Settings" />
                </nav>

                <div className="px-4 py-5 border-t border-white/10 text-xs text-slate-400">
                    <p className="font-medium text-slate-300">Today’s tip</p>
                    <p className="mt-1">
                        Track where your money leaks. Small subscriptions add up faster than
                        you think.
                    </p>
                </div>
            </aside>

            {/* Main content */}
            <div className="flex-1 flex flex-col">
                {/* Topbar */}
                <header className="sticky top-0 z-30 border-b border-white/10 bg-slate-950/80 backdrop-blur-xl">
                    <div className="px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between gap-4">
                        <div>
                            <p className="text-xs uppercase tracking-[0.25em] text-slate-500">
                                Overview
                            </p>
                            <h1 className="text-xl sm:text-2xl font-semibold tracking-tight">
                                {title}
                            </h1>
                        </div>
                        <div className="flex items-center gap-3">
                            <button className="hidden sm:inline-flex items-center gap-2 rounded-full border border-white/10 px-3 py-1.5 text-xs font-medium text-slate-200 hover:bg-white/5 transition">
                                <span className="inline-block h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
                                Synced with bank
                            </button>
                            <button className="rounded-full bg-emerald-500 text-slate-950 text-xs sm:text-sm font-semibold px-3 py-1.5 shadow-lg shadow-emerald-500/40 hover:bg-emerald-400 transition">
                                + Add transaction
                            </button>
                        </div>
                    </div>
                </header>

                {/* Page content */}
                <main className="flex-1 px-4 sm:px-6 lg:px-8 py-6">
                    {children}
                </main>
            </div>
        </div>
    );
}

function SidebarItem({ label, active }) {
    return (
        <button
            className={`w-full flex items-center justify-between px-3 py-2 rounded-xl transition-all
      ${active
                    ? "bg-emerald-500 text-slate-950 font-semibold shadow-lg shadow-emerald-500/40"
                    : "text-slate-300 hover:bg-white/5 hover:text-white"
                }`}
        >
            <span>{label}</span>
            {active && (
                <span className="text-[10px] uppercase tracking-wide bg-slate-950/20 px-2 py-0.5 rounded-full">
                    Now
                </span>
            )}
        </button>
    );
}
