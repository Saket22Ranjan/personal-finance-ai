// src/pages/AuthPage.jsx
import { useState } from "react";
import axios from "axios";
import { motion } from "framer-motion";

const API_BASE = "http://localhost:5000/api";

export default function AuthPage({ onAuth }) {
    const [mode, setMode] = useState("login"); // 'login' | 'register'
    const [form, setForm] = useState({ name: "", email: "", password: "" });
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const switchMode = (next) => {
        setMode(next);
        setError("");
    };

    const handleChange = (e) => {
        setForm((f) => ({ ...f, [e.target.name]: e.target.value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");
        setLoading(true);

        try {
            if (mode === "register" && !form.name.trim()) {
                setError("Please enter your name.");
                setLoading(false);
                return;
            }

            const url =
                mode === "login"
                    ? `${API_BASE}/auth/login`
                    : `${API_BASE}/auth/register`;

            const payload =
                mode === "login"
                    ? { email: form.email, password: form.password }
                    : form;

            const res = await axios.post(url, payload);
            onAuth(res.data);
        } catch (err) {
            const msg =
                err.response?.data?.message ||
                (mode === "login"
                    ? "Login failed, please check your credentials."
                    : "Registration failed, please try again.");
            setError(msg);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-[70vh] flex items-center justify-center">
            <div className="w-full max-w-5xl mx-auto">
                <div className="grid grid-cols-1 lg:grid-cols-[1.1fr_0.9fr] gap-8 lg:gap-10 items-stretch">
                    {/* Left: Marketing / Hero */}
                    <motion.div
                        initial={{ x: -20, opacity: 0 }}
                        animate={{ x: 0, opacity: 1 }}
                        className="relative overflow-hidden rounded-3xl border border-slate-800 bg-gradient-to-br from-slate-900 via-slate-950 to-black p-6 sm:p-8 flex flex-col justify-between shadow-xl shadow-black/40"
                    >
                        <div className="absolute -top-20 -left-24 h-56 w-56 rounded-full bg-emerald-500/20 blur-3xl" />
                        <div className="absolute bottom-[-40px] right-[-40px] h-64 w-64 rounded-full bg-indigo-500/20 blur-3xl" />

                        <div className="relative z-10 space-y-5">
                            <p className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-900/80 border border-slate-700/70 text-[11px] text-slate-300">
                                <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
                                AI-powered expense intelligence for your real bank data.
                            </p>

                            <div className="space-y-2">
                                <h2 className="text-2xl sm:text-3xl font-semibold tracking-tight">
                                    Turn raw bank statements
                                    <br />
                                    into a clean,{" "}
                                    <span className="text-emerald-400">actionable money report.</span>
                                </h2>
                                <p className="text-xs sm:text-sm text-slate-400 max-w-md leading-relaxed">
                                    Upload CSV/PDF from your bank, PhonePe, GPay, Paytm or UPI app.
                                    We auto-categorize each transaction and show monthly burn, top
                                    merchants and smart savings ideas.
                                </p>
                            </div>

                            <ul className="mt-3 space-y-1.5 text-xs text-slate-300 max-w-md">
                                <li>• Auto-detect Food, Rent, Travel, Subscriptions & more</li>
                                <li>• Works with multiple banks & wallet exports</li>
                                <li>• Built with MERN + basic AI for portfolio / viva</li>
                            </ul>
                        </div>

                        <div className="relative z-10 mt-8 grid grid-cols-3 gap-3 text-[11px]">
                            <StatPill label="Banks & Wallets" value="Multi-source" />
                            <StatPill label="Setup Time" value="< 5 min" />
                            <StatPill label="Stack" value="MERN + AI" />
                        </div>
                    </motion.div>

                    {/* Right: Auth Card */}
                    <motion.div
                        initial={{ x: 20, opacity: 0 }}
                        animate={{ x: 0, opacity: 1 }}
                        className="rounded-3xl border border-slate-800 bg-slate-950/85 backdrop-blur-xl p-6 sm:p-7 flex flex-col justify-center shadow-xl shadow-black/40"
                    >
                        {/* Tabs */}
                        <div className="flex items-center gap-2 mb-5 bg-slate-900/70 border border-slate-800 rounded-full p-1 text-xs">
                            <button
                                type="button"
                                onClick={() => switchMode("login")}
                                className={`flex-1 py-1.5 rounded-full transition-colors ${mode === "login"
                                        ? "bg-slate-800 text-slate-50"
                                        : "text-slate-400 hover:text-slate-200"
                                    }`}
                            >
                                Login
                            </button>
                            <button
                                type="button"
                                onClick={() => switchMode("register")}
                                className={`flex-1 py-1.5 rounded-full transition-colors ${mode === "register"
                                        ? "bg-slate-800 text-slate-50"
                                        : "text-slate-400 hover:text-slate-200"
                                    }`}
                            >
                                Create account
                            </button>
                        </div>

                        <div className="mb-4">
                            <h2 className="text-lg sm:text-xl font-semibold">
                                {mode === "login"
                                    ? "Welcome back"
                                    : "Create your finance workspace"}
                            </h2>
                            <p className="text-[11px] text-slate-400 mt-1">
                                {mode === "login"
                                    ? "Login to view or upload your latest monthly report."
                                    : "Use dummy credentials and sample statements – perfect for demos & CV."}
                            </p>
                        </div>

                        <form onSubmit={handleSubmit} className="space-y-3 text-xs">
                            {mode === "register" && (
                                <div className="space-y-1.5">
                                    <label className="block text-slate-300">Full name</label>
                                    <input
                                        type="text"
                                        name="name"
                                        value={form.name}
                                        onChange={handleChange}
                                        className="w-full rounded-lg bg-slate-900 border border-slate-700 px-3 py-2 outline-none focus:ring-1 focus:ring-emerald-500 focus:border-emerald-500 text-xs"
                                        placeholder="Saket Ranjan"
                                    />
                                </div>
                            )}

                            <div className="space-y-1.5">
                                <label className="block text-slate-300">Email</label>
                                <input
                                    type="email"
                                    name="email"
                                    value={form.email}
                                    onChange={handleChange}
                                    className="w-full rounded-lg bg-slate-900 border border-slate-700 px-3 py-2 outline-none focus:ring-1 focus:ring-emerald-500 focus:border-emerald-500 text-xs"
                                    placeholder="you@example.com"
                                />
                            </div>

                            <div className="space-y-1.5">
                                <label className="block text-slate-300">Password</label>
                                <input
                                    type="password"
                                    name="password"
                                    value={form.password}
                                    onChange={handleChange}
                                    className="w-full rounded-lg bg-slate-900 border border-slate-700 px-3 py-2 outline-none focus:ring-1 focus:ring-emerald-500 focus:border-emerald-500 text-xs"
                                    placeholder="••••••••"
                                />
                            </div>

                            {error && (
                                <p className="text-[11px] text-rose-400 bg-rose-950/40 border border-rose-900/60 rounded-lg px-3 py-2">
                                    {error}
                                </p>
                            )}

                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full mt-2 inline-flex items-center justify-center gap-2 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-slate-950 text-xs font-medium py-2.5 transition-colors disabled:opacity-60"
                            >
                                {loading
                                    ? mode === "login"
                                        ? "Logging in..."
                                        : "Creating account..."
                                    : mode === "login"
                                        ? "Login & open dashboard"
                                        : "Sign up & start"}
                            </button>

                            <p className="text-[10px] text-slate-500 mt-2">
                                This is a local developer build. Your data stays on your machine –
                                perfect for showcasing the MERN + AI stack in interviews.
                            </p>
                        </form>
                    </motion.div>
                </div>
            </div>
        </div>
    );
}

function StatPill({ label, value }) {
    return (
        <div className="rounded-2xl bg-slate-950/70 border border-slate-800 px-3 py-2">
            <p className="text-[10px] text-slate-400">{label}</p>
            <p className="text-xs font-semibold text-slate-100">{value}</p>
        </div>
    );
}
