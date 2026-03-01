"use client";

import { useEffect, useState } from "react";
import api from "@/lib/api";

export function useDashboard() {
  const [data, setData] = useState<any>({
    totalSales: 0,
    totalExpenses: 0,
    recentAnnouncements: []
  });
  const [loading, setLoading] = useState(true);

  const fetchDashboard = async () => {
    try {
      setLoading(true);
      // 売上、経費、お知らせを同時に取得
      const [salesRes, expensesRes, announcementsRes] = await Promise.all([
        api.get("/sales"),
        api.get("/expenses"),
        api.get("/announcements"),
      ]);

      // 数値として合計を算出
      const totalS = Array.isArray(salesRes.data) 
        ? salesRes.data.reduce((sum: number, item: any) => sum + (Number(item.amount) || 0), 0) 
        : 0;

      const totalE = Array.isArray(expensesRes.data) 
        ? expensesRes.data.reduce((sum: number, item: any) => sum + (Number(item.amount) || 0), 0) 
        : 0;

      setData({
        totalSales: totalS,
        totalExpenses: totalE,
        recentAnnouncements: Array.isArray(announcementsRes.data) ? announcementsRes.data.slice(0, 5) :[],
      });
    } catch (err) {
      console.error("Dashboard calculation error:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboard();
  }, []);

  return { data, loading, refresh: fetchDashboard };
}
