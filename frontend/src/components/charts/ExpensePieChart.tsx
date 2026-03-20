"use client";
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const data = [
  { name: "人件費", value: 2100 },
  { name: "設備費", value: 800 },
  { name: "広告費", value: 600 },
  { name: "その他", value: 700 },
];
const COLORS = ["#6366f1", "#22d3ee", "#f59e0b", "#94a3b8"];

export default function ExpensePieChart() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>経費内訳</CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={240}>
          <PieChart>
            <Pie data={data} cx="50%" cy="50%" innerRadius={60} outerRadius={90}
              paddingAngle={3} dataKey="value">
              {data.map((_, i) => (
                <Cell key={i} fill={COLORS[i % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip formatter={(v) => `$${v}`} />
            <Legend />
          </PieChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}