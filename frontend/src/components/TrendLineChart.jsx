import { LineChart, Line, XAxis, YAxis, Tooltip } from "recharts";

export default function TrendLineChart({ byDate }) {
    const data = Object.entries(byDate || {}).map(([date, amount]) => ({
        date,
        amount,
    }));

    if (!data.length) return <p className="text-xs text-slate-400">No data</p>;

    return (
        <div className="flex justify-center">
            <LineChart width={360} height={260} data={data}>
                <XAxis dataKey="date" tick={{ fontSize: 10 }} />
                <YAxis tick={{ fontSize: 10 }} />
                <Tooltip />
                <Line type="monotone" dataKey="amount" />
            </LineChart>
        </div>
    );
}
