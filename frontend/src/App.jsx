// src/App.jsx
import { useEffect, useState } from "react";
import axios from "axios";
import AuthPage from "./pages/AuthPage";
import Dashboard from "./pages/Dashboard";

const API_BASE = "http://localhost:5000/api";

export default function App() {
  const [auth, setAuth] = useState(() => {
    const stored = localStorage.getItem("pfa_auth");
    return stored ? JSON.parse(stored) : null;
  });

  // keep axios default
  useEffect(() => {
    if (auth?.token) {
      axios.defaults.headers.common["Authorization"] = `Bearer ${auth.token}`;
    } else {
      delete axios.defaults.headers.common["Authorization"];
    }
  }, [auth]);

  const handleAuth = (data) => {
    setAuth(data);
    localStorage.setItem("pfa_auth", JSON.stringify(data));
  };

  const handleLogout = () => {
    setAuth(null);
    localStorage.removeItem("pfa_auth");
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-50">
      {/* Top nav, always visible */}
      <header className="border-b border-slate-800/80 bg-slate-950/80 backdrop-blur sticky top-0 z-20">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-xl bg-gradient-to-br from-emerald-400 to-indigo-500 flex items-center justify-center text-xs font-bold">
              ₹
            </div>
            <div>
              <h1 className="text-sm sm:text-base font-semibold tracking-tight">
                Personal Finance AI
              </h1>
              <p className="text-[10px] text-slate-400 leading-tight">
                Smart expense tracking from raw bank statements.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3 text-[11px]">
            {!auth ? (
              <>
                <span className="hidden sm:inline text-slate-400">
                  Built with MERN + AI
                </span>
                <span className="px-2 py-0.5 rounded-full border border-emerald-500/40 bg-emerald-500/10 text-emerald-300">
                  MVP
                </span>
              </>
            ) : (
              <>
                <span className="hidden sm:inline text-slate-400 truncate max-w-[140px]">
                  {auth.user.email}
                </span>
                <button
                  onClick={handleLogout}
                  className="px-3 py-1 rounded-full bg-slate-900/80 border border-slate-700/70 hover:bg-slate-800 text-[11px]"
                >
                  Logout
                </button>
              </>
            )}
          </div>
        </div>
      </header>

      {/* Main content */}
      <main className="max-w-6xl mx-auto px-4 sm:px-6 py-6">
        {!auth ? (
          <AuthPage onAuth={handleAuth} />
        ) : (
          <Dashboard auth={auth} onLogout={handleLogout} />
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-800/80 mt-6">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-3 flex flex-col sm:flex-row items-center justify-between gap-2 text-[11px] text-slate-500">
          <span>© {new Date().getFullYear()} Personal Finance AI · Built as a portfolio project.</span>
          <span className="flex gap-3">
            <span>Bank CSV / PDF → Insights</span>
            <span className="hidden sm:inline">·</span>
            <span className="hidden sm:inline">Made by Saket 🧠</span>
          </span>
        </div>
      </footer>
    </div>
  );
}
