"use client";

import { useEffect, useState } from "react";
import api from "@/lib/api";
import type { Sale, CreateSaleInput } from "@/types";

export function useSales() {
  const [sales, setSales] = useState<Sale[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchSales = async () => {
    try {
      const res = await api.get<Sale[]>("/sales");
      setSales(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const createSales = async (data: CreateSaleInput) => {
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
