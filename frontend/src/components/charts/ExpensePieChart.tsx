"use client";

import { useEffect, useState } from "react";
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import api from "@/lib/api";
import type { Expense } from "@/types";

type ChartPoint = { name: string; value: number };

const COLORS = ["#6366f1", "#22d3ee", "#f59e0b", "#94a3b8", "#f43f5e", "#10b981"];

export default function ExpensePieChart() {
  const [data, setData] = useState<ChartPoint[]>([]);

  useEffect(() => {
    api.get<Expense[]>("/expenses").then((res) => {
      const byTitle: Record<string, number> = {};
      res.data.forEach((e) => {
        byTitle[e.title] = (byTitle[e.title] ?? 0) + e.amount;
      });
      setData(
        Object.entries(byTitle)
          .sort(([, a], [, b]) => b - a)
          .slice(0, 6)
          .map(([name, value]) => ({ name, value }))
      );
    }).catch(() => {});
  }, []);

  return (
    <Card>
      <CardHeader>
        <CardTitle>経費内訳</CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={240}>
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              innerRadius={60}
              outerRadius={90}
              paddingAngle={3}
              dataKey="value"
            >
              {data.map((_, i) => (
                <Cell key={i} fill={COLORS[i % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip formatter={(v: number) => `¥${v.toLocaleString()}`} />
            <Legend />
          </PieChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
