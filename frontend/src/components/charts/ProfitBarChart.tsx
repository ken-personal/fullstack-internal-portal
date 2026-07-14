"use client";

import { useEffect, useState } from "react";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
} from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import api from "@/lib/api";
import type { Sale, Expense } from "@/types";

type ChartPoint = { month: string; profit: number };

export default function ProfitBarChart() {
  const [data, setData] = useState<ChartPoint[]>([]);

  useEffect(() => {
    Promise.all([
      api.get<Sale[]>("/sales"),
      api.get<Expense[]>("/expenses"),
    ]).then(([salesRes, expensesRes]) => {
      const toKey = (dateStr: string) => {
        const d = new Date(dateStr);
        return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
      };

      const salesByMonth: Record<string, number> = {};
      salesRes.data.forEach((s) => {
        const key = toKey(s.date);
        salesByMonth[key] = (salesByMonth[key] ?? 0) + s.amount;
      });

      const expensesByMonth: Record<string, number> = {};
      expensesRes.data.forEach((e) => {
        const key = toKey(e.date);
        expensesByMonth[key] = (expensesByMonth[key] ?? 0) + e.amount;
      });

      const allMonths = [
        ...new Set([...Object.keys(salesByMonth), ...Object.keys(expensesByMonth)]),
      ].sort();

      setData(
        allMonths.map((key) => ({
          month: `${parseInt(key.split("-")[1])}月`,
          profit: (salesByMonth[key] ?? 0) - (expensesByMonth[key] ?? 0),
        }))
      );
    }).catch(() => {});
  }, []);

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
            <YAxis
              tick={{ fontSize: 12 }}
              tickFormatter={(v) => `¥${(v / 1000).toFixed(0)}k`}
            />
            <Tooltip formatter={(v: number) => [`¥${v.toLocaleString()}`, "利益"]} />
            <Bar
              dataKey="profit"
              fill="#6366f1"
              radius={[4, 4, 0, 0]}
            />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
