"use client";

import { useEffect, useState } from "react";
import api from "@/lib/api";

export function useExpenses() {
  const [expenses, setExpenses] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchExpenses = async () => {
    try {
      const res = await api.get("/expenses");
      setExpenses(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const createExpense = async (data: any) => {
    await api.post("/expenses", data);
    fetchExpenses();
  };

  const deleteExpense = async (id: number) => {
    await api.delete(`/expenses/${id}`);
    fetchExpenses();
  };

  useEffect(() => {
    fetchExpenses();
  }, []);

  return {
    expenses,
    loading,
    createExpense,
    deleteExpense,
  };
}
