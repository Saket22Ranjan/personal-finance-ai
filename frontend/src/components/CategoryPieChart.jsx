import { PieChart, Pie, Tooltip, Cell } from "recharts";

export default function CategoryPieChart({ data }) {
    const entries = Object.entries(data || {}).map(([name, value]) => ({
        name,
        value,
    }));

    if (!entries.length) return <p className="text-xs text-slate-400">No data</p>;

    return (
        <div className="flex justify-center">
            <PieChart width={320} height={260}>
                <Pie
                    data={entries}
                    dataKey="value"
                    nameKey="name"
                    outerRadius={100}
                    label
                >
                    {entries.map((_, i) => (
                        <Cell key={i} />
                    ))}
                </Pie>
                <Tooltip />
            </PieChart>
        </div>
    );
}
