"use client";

import { useEffect, useState } from "react";
import api from "@/lib/api";
import type { Expense, CreateExpenseInput } from "@/types";

export function useExpenses() {
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchExpenses = async () => {
    try {
      const res = await api.get<Expense[]>("/expenses");
      setExpenses(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const createExpense = async (data: CreateExpenseInput) => {
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
