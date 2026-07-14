"use client";

import { useEffect, useState } from "react";
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
} from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import api from "@/lib/api";
import type { Sale } from "@/types";

type ChartPoint = { month: string; sales: number };

export default function SalesChart() {
  const [data, setData] = useState<ChartPoint[]>([]);

  useEffect(() => {
    api.get<Sale[]>("/sales").then((res) => {
      const byMonth: Record<string, number> = {};
      res.data.forEach((s) => {
        const d = new Date(s.date);
        const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
        byMonth[key] = (byMonth[key] ?? 0) + s.amount;
      });
      setData(
        Object.entries(byMonth)
          .sort(([a], [b]) => a.localeCompare(b))
          .map(([key, sales]) => ({
            month: `${parseInt(key.split("-")[1])}月`,
            sales,
          }))
      );
    }).catch(() => {});
  }, []);

  return (
    <Card>
      <CardHeader>
        <CardTitle>月次売上推移</CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={240}>
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
            <XAxis dataKey="month" tick={{ fontSize: 12 }} />
            <YAxis tick={{ fontSize: 12 }} tickFormatter={(v) => `¥${(v / 1000).toFixed(0)}k`} />
            <Tooltip formatter={(v: number) => [`¥${v.toLocaleString()}`, "売上"]} />
            <Line
              type="monotone"
              dataKey="sales"
              stroke="#6366f1"
              strokeWidth={2}
              dot={{ r: 4 }}
              activeDot={{ r: 6 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
