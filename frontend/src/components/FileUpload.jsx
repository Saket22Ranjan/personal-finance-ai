import { useState } from "react";
import axios from "axios";

const API_BASE = "http://localhost:5000/api";

export default function FileUpload({ token, onUploaded }) {
    const [file, setFile] = useState(null);
    const [status, setStatus] = useState("");

    const handleUpload = async () => {
        if (!file) return;
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
            setStatus(`Uploaded ${res.data.count} transactions`);
            onUploaded();
        } catch (err) {
            setStatus(err.response?.data?.message || "Upload failed");
        }
    };

    return (
        <div className="flex items-center gap-3">
            <input
                type="file"
                accept=".csv"
                onChange={(e) => setFile(e.target.files[0])}
                className="text-sm text-slate-300"
            />
            <button
                onClick={handleUpload}
                className="px-3 py-1.5 rounded-lg bg-emerald-500 hover:bg-emerald-600 text-xs font-medium"
            >
                Upload CSV
            </button>
            {status && <span className="text-xs text-slate-400">{status}</span>}
        </div>
    );
}
