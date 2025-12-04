import { useState } from "react";
import axios from "axios";

const API_BASE = "http://localhost:5000/api";

export default function Login({ onLogin }) {
    const [isRegister, setIsRegister] = useState(false);
    const [form, setForm] = useState({ name: "", email: "", password: "" });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const handleChange = (e) =>
        setForm({ ...form, [e.target.name]: e.target.value });

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError("");
        try {
            const url = isRegister ? "/auth/register" : "/auth/login";
            const payload = isRegister
                ? form
                : { email: form.email, password: form.password };
            const res = await axios.post(API_BASE + url, payload);
            onLogin(res.data);
        } catch (err) {
            setError(err.response?.data?.message || "Something went wrong");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-slate-950 text-slate-50">
            <div className="w-full max-w-md bg-slate-900/70 border border-slate-800 rounded-2xl p-6 shadow-lg">
                <h1 className="text-2xl font-semibold mb-4 text-center">
                    Personal Finance AI
                </h1>
                <p className="text-sm text-slate-400 mb-4 text-center">
                    Upload bank statements. Track burn. Get AI insights.
                </p>

                <form onSubmit={handleSubmit} className="space-y-3">
                    {isRegister && (
                        <input
                            name="name"
                            placeholder="Full name"
                            className="w-full px-3 py-2 rounded-lg bg-slate-800 border border-slate-700 text-sm"
                            value={form.name}
                            onChange={handleChange}
                            required
                        />
                    )}
                    <input
                        name="email"
                        type="email"
                        placeholder="Email"
                        className="w-full px-3 py-2 rounded-lg bg-slate-800 border border-slate-700 text-sm"
                        value={form.email}
                        onChange={handleChange}
                        required
                    />
                    <input
                        name="password"
                        type="password"
                        placeholder="Password"
                        className="w-full px-3 py-2 rounded-lg bg-slate-800 border border-slate-700 text-sm"
                        value={form.password}
                        onChange={handleChange}
                        required
                    />
                    {error && (
                        <p className="text-xs text-red-400 bg-red-950/40 px-2 py-1 rounded">
                            {error}
                        </p>
                    )}
                    <button
                        disabled={loading}
                        className="w-full py-2 rounded-lg bg-emerald-500 hover:bg-emerald-600 text-sm font-medium disabled:opacity-60"
                    >
                        {loading ? "Please wait..." : isRegister ? "Create account" : "Log in"}
                    </button>
                </form>

                <button
                    className="mt-4 w-full text-xs text-slate-400 hover:text-slate-200"
                    onClick={() => setIsRegister((p) => !p)}
                >
                    {isRegister
                        ? "Already have an account? Log in"
                        : "New here? Create an account"}
                </button>
            </div>
        </div>
    );
}
