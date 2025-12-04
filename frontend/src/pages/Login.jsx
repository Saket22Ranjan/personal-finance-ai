// src/pages/Login.jsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const API_BASE = "http://localhost:5000/api";

export default function Login() {
    const navigate = useNavigate();

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");
        setLoading(true);

        try {
            if (!email || !password) {
                throw new Error("Please enter email and password");
            }

            // ✅ REAL LOGIN CALL TO BACKEND
            const res = await axios.post(`${API_BASE}/auth/login`, {
                email,
                password,
            });

            // Console me dekh sakte ho kya mil raha:
            // console.log("Login response:", res.data);

            // ⚠️ Most likely backend returns { token: "..." }
            // If name different ho (e.g. accessToken), yahan change karna.
            const token = res.data?.token;
            if (!token) {
                throw new Error("Login successful but token missing in response");
            }

            // 👉 Ye wahi key hai jo Dashboard + upload use kar rahe hain
            localStorage.setItem("token", token);

            // Optional: email bhi store kar sakte ho
            localStorage.setItem("userEmail", email);

            navigate("/dashboard");
        } catch (err) {
            console.error("Login error:", err);
            const msg =
                err.response?.data?.message ||
                err.message ||
                "Failed to login. Please try again.";
            setError(msg);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 flex items-center justify-center px-4">
            <div className="max-w-md w-full space-y-6">
                {/* Logo + heading */}
                <div className="text-center">
                    <div className="mx-auto h-12 w-12 rounded-3xl bg-gradient-to-tr from-emerald-400 via-sky-400 to-blue-500 flex items-center justify-center text-2xl font-black shadow-lg shadow-emerald-500/40">
                        ₹
                    </div>
                    <h1 className="mt-4 text-2xl font-semibold text-slate-50">
                        Personal Finance AI
                    </h1>
                    <p className="mt-1 text-sm text-slate-400">
                        Secure login to your money dashboard.
                    </p>
                </div>

                {/* Card */}
                <div className="rounded-2xl border border-slate-800 bg-slate-900/80 backdrop-blur-xl p-6 shadow-xl shadow-black/50">
                    <form className="space-y-4" onSubmit={handleSubmit}>
                        {error && (
                            <div className="text-xs rounded-lg border border-rose-500/50 bg-rose-500/10 text-rose-200 px-3 py-2">
                                {error}
                            </div>
                        )}

                        <div className="space-y-1">
                            <label className="block text-xs font-medium text-slate-200">
                                Email address
                            </label>
                            <input
                                type="email"
                                className="w-full rounded-lg border border-slate-700 bg-slate-950/80 px-3 py-2 text-sm text-slate-100 placeholder:text-slate-500 focus:outline-none focus:ring-1 focus:ring-emerald-400"
                                placeholder="you@example.com"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                            />
                        </div>

                        <div className="space-y-1">
                            <label className="block text-xs font-medium text-slate-200">
                                Password
                            </label>
                            <input
                                type="password"
                                className="w-full rounded-lg border border-slate-700 bg-slate-950/80 px-3 py-2 text-sm text-slate-100 placeholder:text-slate-500 focus:outline-none focus:ring-1 focus:ring-emerald-400"
                                placeholder="••••••••"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                            />
                        </div>

                        <div className="flex items-center justify-between text-xs text-slate-400">
                            <label className="inline-flex items-center gap-2">
                                <input
                                    type="checkbox"
                                    className="h-3 w-3 rounded border-slate-600 bg-slate-900 text-emerald-500 focus:ring-emerald-400"
                                />
                                <span>Remember this device</span>
                            </label>
                            <button
                                type="button"
                                className="hover:text-emerald-300 transition"
                            >
                                Forgot password?
                            </button>
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full inline-flex items-center justify-center rounded-full bg-emerald-500 text-slate-950 text-sm font-semibold px-4 py-2.5 mt-2 hover:bg-emerald-400 transition shadow-lg shadow-emerald-500/40 disabled:opacity-60 disabled:cursor-not-allowed"
                        >
                            {loading ? "Logging in..." : "Login"}
                        </button>
                    </form>

                    <p className="mt-4 text-[11px] text-slate-500 text-center">
                        By continuing, you agree to our Terms & Privacy Policy.
                    </p>
                </div>
            </div>
        </div>
    );
}
