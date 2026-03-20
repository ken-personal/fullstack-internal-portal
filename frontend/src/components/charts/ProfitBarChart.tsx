"use client";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const data = [
  { month: "Oct", profit: 5200 },
  { month: "Nov", profit: 6100 },
  { month: "Dec", profit: 7400 },
  { month: "Jan", profit: 6800 },
  { month: "Feb", profit: 7200 },
  { month: "Mar", profit: 7800 },
];

export default function ProfitBarChart() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>月別利益推移</CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={240}>
          <BarChart data={data} margin={{ top: 4, right: 16, left: 0, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
            <XAxis dataKey="month" tick={{ fontSize: 12 }} />
            <YAxis tick={{ fontSize: 12 }} tickFormatter={(v) => `$${v / 1000}k`} />
            <Tooltip formatter={(v) => `$${v}`} />
            <Bar dataKey="profit" fill="#6366f1" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}