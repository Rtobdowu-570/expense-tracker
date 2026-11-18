import { useState, useEffect, useCallback } from 'react';
import { useLocalStorage } from './useLocalStorage';

const UNDO_MS = 6000;

export function useExpenses() {
  const [expenses, setExpenses] = useLocalStorage('expenses', []);
  const [lastDeleted, setLastDeleted] = useState(null);

  const addExpense = useCallback((expense) => {
    setExpenses((prev) => [...prev, { ...expense, id: crypto.randomUUID() }]);
  }, [setExpenses]);

  const updateExpense = useCallback((id, updatedData) => {
    setExpenses((prev) =>
      prev.map((expense) => (expense.id === id ? { ...expense, ...updatedData } : expense))
    );
  }, [setExpenses]);

  const removeExpense = useCallback((id) => {
    const target = expenses.find((expense) => expense.id === id);
    if (!target) return;
    setLastDeleted(target);
    setExpenses((prev) => prev.filter((expense) => expense.id !== id));
  }, [expenses, setExpenses]);

  const undoRemove = useCallback(() => {
    if (!lastDeleted) return;
    setExpenses((prev) => [...prev, lastDeleted]);
    setLastDeleted(null);
  }, [lastDeleted, setExpenses]);

  const dismissUndo = useCallback(() => setLastDeleted(null), []);

  useEffect(() => {
    if (!lastDeleted) return;
    const timer = setTimeout(() => setLastDeleted(null), UNDO_MS);
    return () => clearTimeout(timer);
  }, [lastDeleted]);

  return {
    expenses,
    addExpense,
    updateExpense,
    removeExpense,
    lastDeleted,
    undoRemove,
    dismissUndo,
  };
}
