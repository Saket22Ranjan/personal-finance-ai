import React, { useState, useEffect } from "react";
import axios from "axios";
import CategoryPieChart from "../components/CategoryPieChart";
import TrendLineChart from "../components/TrendLineChart";
import "./Dashboard.css";

const API_BASE = "http://localhost:5000/api";

export default function Dashboard() {
    const [transactions, setTransactions] = useState([]);
    const [txLoading, setTxLoading] = useState(true);
    const [txError, setTxError] = useState("");

    const token = localStorage.getItem("token"); // tumhara JWT yahi store hota hoga

    // 🔥 REAL: load transactions from backend
    const loadTransactions = async () => {
        if (!token) {
            setTxError("Missing auth token. Please login again.");
            setTxLoading(false);
            return;
        }

        try {
            setTxLoading(true);
            setTxError("");
            const res = await axios.get(`${API_BASE}/transactions`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            // backend se list aa rahi hogi: res.data.transactions ya res.data
            const list = Array.isArray(res.data)
                ? res.data
                : Array.isArray(res.data.transactions)
                    ? res.data.transactions
                    : [];
            setTransactions(list);
        } catch (err) {
            console.error("Fetch transactions error:", err);
            setTxError(
                err?.response?.data?.message ||
                "Could not load transactions from server."
            );
        } finally {
            setTxLoading(false);
        }
    };

    useEffect(() => {
        loadTransactions();
    }, []); // mount pe load

    const upcoming = [
        { name: "Spotify", date: "05 Dec", amount: "₹ 199", type: "Subscription" },
        { name: "Electricity bill", date: "07 Dec", amount: "₹ 1,850", type: "Utility" },
        { name: "Credit card", date: "10 Dec", amount: "₹ 3,071", type: "Payment" },
    ];

    return (
        <div className="pf-dashboard">
            {/* TOP NAVBAR */}
            <header className="pf-header">
                <div className="pf-header-left">
                    <div className="pf-logo-circle">₹</div>
                    <div>
                        <div className="pf-app-name">Personal Finance AI</div>
                        <div className="pf-app-subtitle">
                            Smart expense tracking from bank statements
                        </div>
                    </div>
                </div>

                <nav className="pf-nav-links">
                    <button className="pf-nav-link pf-nav-link--active">Overview</button>
                    <button className="pf-nav-link">Accounts</button>
                    <button className="pf-nav-link">Transactions</button>
                    <button className="pf-nav-link">Budgets</button>
                    <button className="pf-nav-link">Goals</button>
                    <button className="pf-nav-link">Settings</button>
                </nav>

                <div className="pf-header-right">
                    <div className="pf-user-info">
                        <span className="pf-user-label">Logged in as</span>
                        <span className="pf-user-email">pinky@gmail.com</span>
                    </div>
                    <button className="pf-btn pf-btn--ghost">Logout</button>
                </div>
            </header>

            {/* MAIN SHELL */}
            <main className="pf-shell">
                {/* ROW 1 – HERO + AI CARD */}
                <section className="pf-row pf-row--2col">
                    <div className="pf-card pf-card--hero">
                        <div className="pf-hero-top">
                            <div>
                                <div className="pf-kicker">OVERVIEW</div>
                                <h1 className="pf-hero-title">Good evening, Saket 👋</h1>
                                <p className="pf-hero-subtitle">
                                    Here’s a quick summary of your money today.
                                </p>
                            </div>
                            <div className="pf-hero-balance">
                                <span className="pf-hero-balance-label">Total balance</span>
                                <span className="pf-hero-balance-value">₹ 82,450</span>
                                <span className="pf-hero-balance-change">+ ₹ 3,200 today</span>
                            </div>
                        </div>

                        <div className="pf-hero-grid">
                            <div className="pf-mini-card">
                                <div className="pf-mini-label">Safe to spend</div>
                                <div className="pf-mini-value">₹ 18,900</div>
                                <div className="pf-mini-text">
                                    You’re inside your monthly budget.
                                </div>
                            </div>
                            <div className="pf-mini-card">
                                <div className="pf-mini-label">Credit usage</div>
                                <div className="pf-mini-value">32%</div>
                                <div className="pf-mini-text">
                                    Try to stay under 40% for a healthy score.
                                </div>
                            </div>
                            <div className="pf-mini-card pf-mini-card--accent">
                                <div className="pf-mini-label pf-mini-label--accent">
                                    AI insight
                                </div>
                                <div className="pf-mini-text pf-mini-text--accent">
                                    Cut just <strong>₹150/day</strong> on food & shopping to hit
                                    your savings goal easily.
                                </div>
                            </div>
                        </div>
                    </div>

                    <AskAiCard />
                </section>

                {/* ROW 2 – REAL UPLOAD CARD */}
                <section className="pf-row">
                    <UploadStatementCard onUploaded={loadTransactions} />
                </section>

                {/* ROW 3 – SUMMARY CARDS (still static for now) */}
                <section className="pf-row pf-row--4col">
                    <SummaryCard
                        label="Total balance"
                        value="₹ 82,450"
                        tag="Across all linked accounts"
                    />
                    <SummaryCard
                        label="This month spent"
                        value="₹ 24,580"
                        tag="↑ 8.2% vs last month"
                    />
                    <SummaryCard
                        label="This month saved"
                        value="₹ 7,400"
                        tag="Goal: ₹ 10,000"
                    />
                    <SummaryCard
                        label="AI risk score"
                        value="Low"
                        tag="Spending is under control"
                    />
                </section>

                {/* ROW 4 – CHARTS (tum pehle jaise bhi data de rahe the, TrendLineChart/CategoryPieChart waha se use karenge) */}
                <section className="pf-row pf-row--2col">
                    <div className="pf-card pf-card--chart">
                        <div className="pf-card-header">
                            <div>
                                <div className="pf-card-title">Spending trend</div>
                                <div className="pf-card-subtitle">Last 6 months</div>
                            </div>
                        </div>
                        <div className="pf-chart-container">
                            <TrendLineChart />
                        </div>
                    </div>

                    <div className="pf-card pf-card--chart">
                        <div className="pf-card-header">
                            <div>
                                <div className="pf-card-title">Spending by category</div>
                                <div className="pf-card-subtitle">This month</div>
                            </div>
                            <span className="pf-chip">AI analysed</span>
                        </div>
                        <div className="pf-chart-container">
                            <CategoryPieChart />
                        </div>
                    </div>
                </section>

                {/* ROW 5 – UPCOMING + REAL RECENT TX */}
                <section className="pf-row pf-row--2col">
                    <div className="pf-card">
                        <div className="pf-card-header">
                            <div className="pf-card-title">Upcoming bills</div>
                            <button className="pf-link">View all</button>
                        </div>
                        <div className="pf-list">
                            {upcoming.map((b) => (
                                <div key={b.name} className="pf-list-item">
                                    <div>
                                        <div className="pf-list-title">{b.name}</div>
                                        <div className="pf-list-subtitle">
                                            {b.type} · due {b.date}
                                        </div>
                                    </div>
                                    <div className="pf-list-amount">{b.amount}</div>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="pf-card">
                        <div className="pf-card-header">
                            <div className="pf-card-title">Recent transactions</div>
                            <button className="pf-link">View statement</button>
                        </div>

                        {txLoading ? (
                            <div className="pf-table-wrapper">
                                <div className="pf-table pf-table--loading">
                                    Loading transactions…
                                </div>
                            </div>
                        ) : txError ? (
                            <div className="pf-table-wrapper">
                                <div className="pf-table pf-table--error">{txError}</div>
                            </div>
                        ) : transactions.length === 0 ? (
                            <div className="pf-table-wrapper">
                                <div className="pf-table pf-table--empty">
                                    No transactions yet. Upload a statement to get started.
                                </div>
                            </div>
                        ) : (
                            <div className="pf-table-wrapper">
                                <table className="pf-table">
                                    <thead>
                                        <tr>
                                            <th>Date</th>
                                            <th>Description</th>
                                            <th>Category</th>
                                            <th className="pf-table-right">Amount</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {transactions.slice(0, 10).map((t) => (
                                            <tr key={t._id || t.id || `${t.date}-${t.description}`}>
                                                <td>{t.date?.slice(0, 10) || "-"}</td>
                                                <td>{t.description || t.merchant || "—"}</td>
                                                <td className="pf-muted">
                                                    {t.category || t.predictedCategory || "Uncategorised"}
                                                </td>
                                                <td
                                                    className={
                                                        "pf-table-right " +
                                                        (t.amount >= 0 ? "pf-amount-pos" : "pf-amount-neg")
                                                    }
                                                >
                                                    {t.amount >= 0 ? `+₹ ${t.amount}` : `-₹ ${Math.abs(t.amount)}`}
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        )}
                    </div>
                </section>
            </main>
        </div>
    );
}

/* SMALL COMPONENTS */

function SummaryCard({ label, value, tag }) {
    return (
        <div className="pf-card pf-card--summary">
            <div className="pf-summary-label">{label}</div>
            <div className="pf-summary-value">{value}</div>
            <div className="pf-summary-tag">{tag}</div>
        </div>
    );
}

function AskAiCard() {
    return (
        <div className="pf-card pf-card--ai">
            <div className="pf-ai-header">
                <div>
                    <div className="pf-kicker pf-kicker--green">ASK THE AI</div>
                    <div className="pf-ai-title">
                        Confused about your money? Just ask.
                    </div>
                </div>
                <div className="pf-ai-icon">💬</div>
            </div>
            <p className="pf-ai-example">
                Example:{" "}
                <span>
                    “Why did my savings drop this month?” or “Can I afford a new phone
                    EMI?”
                </span>
            </p>
            <textarea
                rows={3}
                className="pf-textarea"
                placeholder="Type your question here..."
            />
            <div className="pf-ai-footer">
                <span className="pf-ai-note">
                    AI is for guidance only. Final decisions are yours.
                </span>
            </div>
        </div>
    );
}

function UploadStatementCard({ onUploaded }) {
    const [file, setFile] = useState(null);
    const [status, setStatus] = useState("");

    const token = localStorage.getItem("token");

    const handleUpload = async () => {
        if (!file) {
            setStatus("Please choose a file first.");
            return;
        }
        if (!token) {
            setStatus("Missing auth token. Please login again.");
            return;
        }

        const formData = new FormData();
        formData.append("file", file);

        try {
            setStatus("Uploading...");
            const res = await axios.post(`${API_BASE}/transactions/upload`, formData, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "multipart/form-data",
                },
            });

            const count = res.data?.count;
            setStatus(
                typeof count === "number"
                    ? `Uploaded ${count} transactions`
                    : "Upload successful"
            );

            if (onUploaded) {
                await onUploaded(); // upload ke turant baad naye tx fetch
            }
        } catch (err) {
            console.error("Upload error:", err);
            setStatus(err?.response?.data?.message || "Upload failed");
        }
    };

    const handleFileChange = (e) => {
        const f = e.target.files?.[0];
        setFile(f || null);
        if (f) setStatus(`Selected: ${f.name}`);
    };

    return (
        <div className="pf-card pf-card--upload">
            <div className="pf-upload-text">
                <div className="pf-kicker pf-kicker--green">UPLOAD BANK STATEMENT</div>
                <div className="pf-upload-title">
                    Drop your CSV and let the AI create transactions.
                </div>
                <p className="pf-upload-subtitle">
                    We never store your credentials. Only statement data is processed to
                    generate insights.
                </p>
                {status && <p className="pf-upload-status">{status}</p>}
            </div>
            <div className="pf-upload-actions">
                <label className="pf-btn pf-btn--outline pf-btn--full">
                    <input
                        type="file"
                        accept=".csv"
                        onChange={handleFileChange}
                        style={{ display: "none" }}
                    />
                    Choose file
                </label>
                <button
                    className="pf-btn pf-btn--primary pf-btn--full"
                    onClick={handleUpload}
                >
                    Upload & analyse
                </button>
            </div>
        </div>
    );
}
