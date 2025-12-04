import { useEffect, useState } from "react";
import axios from "axios";
import { motion } from "framer-motion";
import FileUpload from "../components/FileUpload";
import CategoryPieChart from "../components/CategoryPieChart";
import TrendLineChart from "../components/TrendLineChart";

const API_BASE = "http://localhost:5000/api";

export default function Dashboard({ auth, onLogout }) {
    const [summary, setSummary] = useState(null);
    const [insights, setInsights] = useState([]);
    const [yearMonth, setYearMonth] = useState(() => {
        const now = new Date();
        return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}`;
    });
    const [loading, setLoading] = useState(false);
    const [hasUploaded, setHasUploaded] = useState(false);

    const fetchInsights = async () => {
        const [y, m] = yearMonth.split("-");
        setLoading(true);
        try {
            const res = await axios.get(`${API_BASE}/insights/monthly`, {
                params: { year: y, month: m },
                headers: { Authorization: `Bearer ${auth.token}` },
            });
            setSummary(res.data.summary);
            setInsights(res.data.insights || []);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    // only refetch when month changes AND user has uploaded in this session
    useEffect(() => {
        if (hasUploaded) {
            fetchInsights();
        }
    }, [yearMonth]);

    const topIncome = summary?.topCreditSources || [];
    const topSpends = summary?.topDebitDestinations || [];

    const handleUploaded = () => {
        setHasUploaded(true);
        fetchInsights();
    };

    const handleLogout = () => {
        setHasUploaded(false);
        setSummary(null);
        setInsights([]);
        onLogout();
    };

    return (
        <div className="min-h-[80vh] text-slate-50 relative overflow-hidden pb-10">
            {/* background glow */}
            <div className="pointer-events-none absolute inset-0 opacity-40">
                <div className="absolute -top-24 -left-24 h-72 w-72 rounded-full bg-emerald-500/25 blur-3xl" />
                <div className="absolute top-10 right-[-80px] h-64 w-64 rounded-full bg-cyan-500/20 blur-3xl" />
                <div className="absolute bottom-[-80px] left-10 h-72 w-72 rounded-full bg-indigo-500/25 blur-3xl" />
            </div>

            <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 pt-6">
                {/* HEADER */}
                <motion.section
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mb-6 rounded-3xl border border-slate-800/80 bg-gradient-to-r from-slate-950 via-slate-900 to-slate-950/90 px-5 sm:px-7 py-5 shadow-xl shadow-black/40"
                >
                    <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                        <div>
                            <h1 className="text-2xl sm:text-3xl font-semibold tracking-tight flex items-center gap-2">
                                Personal Finance{" "}
                                <span className="bg-gradient-to-r from-emerald-400 to-cyan-300 bg-clip-text text-transparent">
                                    AI
                                </span>
                                <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/40 text-emerald-300">
                                    Beta
                                </span>
                            </h1>
                            <p className="text-xs sm:text-sm text-slate-300 mt-1">
                                Hi {auth.user.name}, track your monthly inflow, outflow and burn in seconds – directly from raw bank statements.
                            </p>
                        </div>

                        <div className="flex flex-col items-end gap-2 text-xs">
                            <div className="flex items-center gap-2">
                                <span className="hidden sm:inline text-slate-400 truncate max-w-[180px]">
                                    {auth.user.email}
                                </span>
                                <button
                                    onClick={handleLogout}
                                    className="px-3 py-1.5 rounded-full bg-slate-900/80 border border-slate-700/70 hover:bg-slate-800 text-[11px]"
                                >
                                    Logout
                                </button>
                            </div>
                            <div className="flex items-center gap-2 text-[10px] text-slate-400">
                                <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
                                Live for this session · Data refreshed on every upload
                            </div>
                        </div>
                    </div>
                </motion.section>

                {/* UPLOAD + MONTH BAR */}
                <motion.section
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.05 }}
                    className="mb-6 rounded-3xl border border-slate-800/80 bg-slate-950/80 backdrop-blur-xl px-5 sm:px-6 py-4 shadow-lg shadow-black/40 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between"
                >
                    <div className="flex items-center gap-3">
                        <FileUpload token={auth.token} onUploaded={handleUploaded} />
                        <div className="text-[11px] text-slate-400 max-w-xs">
                            Upload CSV/PDF from any supported bank or wallet. Every upload replaces the previous one.
                        </div>
                    </div>

                    <div className="flex items-center gap-3 text-xs">
                        <div className="flex items-center gap-2 rounded-full bg-slate-900/80 border border-slate-700/70 px-3 py-1.5">
                            <span className="text-[11px] text-slate-400">Month</span>
                            <input
                                type="month"
                                className="bg-transparent text-xs outline-none border-none focus:ring-0"
                                value={yearMonth}
                                onChange={(e) => setYearMonth(e.target.value)}
                            />
                        </div>
                    </div>
                </motion.section>

                {/* EMPTY MESSAGE */}
                {!hasUploaded && (
                    <motion.p
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="text-[11px] text-slate-400 mb-4"
                    >
                        Upload a statement to generate this month&apos;s dashboard. On next login, you&apos;ll start fresh again.
                    </motion.p>
                )}

                {/* SUMMARY CARDS */}
                <motion.section
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6"
                >
                    <SummaryCard
                        label="Total Spent"
                        value={summary?.totalDebit ?? 0}
                        prefix="₹"
                        gradient="from-rose-500/80 via-rose-400/80 to-rose-500/90"
                    />
                    <SummaryCard
                        label="Total Inflow"
                        value={summary?.totalCredit ?? 0}
                        prefix="₹"
                        gradient="from-emerald-500/80 via-emerald-400/80 to-emerald-500/90"
                    />
                    <SummaryCard
                        label="Net This Month"
                        value={summary?.net ?? 0}
                        prefix="₹"
                        gradient="from-cyan-500/80 via-sky-400/80 to-cyan-500/90"
                    />
                    <SummaryCard
                        label="Transactions"
                        value={summary?.txCount ?? 0}
                        gradient="from-indigo-500/80 via-violet-400/80 to-indigo-500/90"
                    />
                </motion.section>

                {/* CHARTS */}
                <motion.section
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.15 }}
                    className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6"
                >
                    <GlassCard title="Spend by Category">
                        {hasUploaded ? (
                            <CategoryPieChart data={summary?.byCategory} />
                        ) : (
                            <EmptyHint text="Upload a statement to see how your spending is distributed across categories like Food, Rent, Travel and more." />
                        )}
                    </GlassCard>

                    <GlassCard title="Daily Net Cash Flow">
                        {hasUploaded ? (
                            <TrendLineChart byDate={summary?.byDate} />
                        ) : (
                            <EmptyHint text="Once you upload a statement, we’ll plot how your net balance moves across days of the selected month." />
                        )}
                    </GlassCard>
                </motion.section>

                {/* DETAIL + INSIGHTS */}
                <motion.section
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="grid grid-cols-1 lg:grid-cols-[1.1fr_0.9fr] gap-4"
                >
                    <GlassCard title="Top Income Sources">
                        {!hasUploaded || !topIncome.length ? (
                            <EmptyHint text="Your salary, refunds and top credits will appear here after you upload a statement." />
                        ) : (
                            <ul className="space-y-2 text-xs">
                                {topIncome.map((src, i) => (
                                    <li
                                        key={i}
                                        className="flex items-center justify-between px-3 py-2 rounded-xl bg-slate-900/80 border border-slate-700/60"
                                    >
                                        <span className="truncate max-w-[60%] text-slate-200">
                                            {src.name}
                                        </span>
                                        <span className="font-semibold text-emerald-300">
                                            ₹{src.amount.toFixed(0)}
                                        </span>
                                    </li>
                                ))}
                            </ul>
                        )}
                    </GlassCard>

                    <GlassCard
                        title="AI Insights"
                        rightLabel={loading && hasUploaded ? "Refreshing..." : undefined}
                    >
                        {!hasUploaded ? (
                            <EmptyHint text="Upload a statement to generate personalized AI insights about your spending and saving patterns." />
                        ) : insights && insights.length ? (
                            <ul className="space-y-2 text-sm">
                                {insights.map((line, idx) => (
                                    <li
                                        key={idx}
                                        className="px-3 py-2 rounded-xl bg-slate-900/85 border border-slate-700/60"
                                    >
                                        {line}
                                    </li>
                                ))}
                            </ul>
                        ) : (
                            <EmptyHint text="No insights available for this month yet. Try switching the month or uploading a different statement." />
                        )}
                    </GlassCard>
                </motion.section>
            </div>
        </div>
    );
}

function GlassCard({ title, rightLabel, children }) {
    return (
        <div className="bg-slate-950/80 border border-slate-800 rounded-2xl p-4 sm:p-5 backdrop-blur-xl shadow-lg shadow-black/40">
            <div className="flex items-center justify-between mb-3">
                <h2 className="text-sm font-medium text-slate-100">{title}</h2>
                {rightLabel && (
                    <span className="text-[11px] text-slate-400">{rightLabel}</span>
                )}
            </div>
            {children}
        </div>
    );
}

function SummaryCard({ label, value, prefix = "", gradient }) {
    const display =
        typeof value === "number" && value.toFixed ? value.toFixed(0) : value;

    return (
        <div className="relative rounded-2xl p-[1px] bg-gradient-to-br from-slate-600/40 via-slate-500/20 to-slate-700/40 shadow-lg shadow-black/40">
            <div className="rounded-2xl bg-slate-950/90 h-full w-full p-4 flex flex-col justify-between">
                <p className="text-[11px] text-slate-400 mb-1">{label}</p>
                <p
                    className={`text-xl font-semibold bg-gradient-to-r ${gradient} bg-clip-text text-transparent`}
                >
                    {prefix}
                    {display}
                </p>
            </div>
        </div>
    );
}

function EmptyHint({ text }) {
    return (
        <p className="text-[11px] sm:text-xs text-slate-400 leading-relaxed">
            {text}
        </p>
    );
}
