"use client";

import { useEffect, useState } from "react";
import api from "@/lib/api";

export function useSales() {
  const [sales, setSales] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchSales = async () => {
    try {
      const res = await api.get("/sales");
      setSales(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const createSales = async (data: any) => {
    await api.post("/sales", data);
    fetchSales();
  };

  const deleteSales = async (id: number) => {
    await api.delete(`/sales/${id}`);
    fetchSales();
  };

  useEffect(() => {
    fetchSales();
  }, []);

  return {
    sales,
    loading,
    createSales,
    deleteSales,
  };
}
