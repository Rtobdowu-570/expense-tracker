import { useState } from 'react';
import { useExpenses } from './hooks/useExpenses';
import { filterExpenses } from './utils/filterExpenses';
import { calculateTotals } from './utils/calculateTotals';

import TopBar from './components/TopBar';
import SummaryStats from './components/SummaryStats';
import ExpenseForm from './components/ExpenseForm';
import FilterBar from './components/FilterBar';
import ExpenseList from './components/ExpenseList';
import UndoBar from './components/UndoBar';
import ReportView from './components/ReportView';

const NO_FILTERS = { search: '', category: 'all', from: '', to: '' };
const MONTH_LABEL = new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' });

export default function App() {
  const {
    expenses, addExpense, updateExpense, removeExpense,
    lastDeleted, undoRemove,
  } = useExpenses();

  const [filters, setFilters] = useState(NO_FILTERS);
  const [view, setView] = useState('dashboard');

  const totals   = calculateTotals(expenses);
  const filtered = filterExpenses(expenses, filters);

  if (view === 'report') {
    return (
      <ReportView
        expenses={expenses}
        totals={totals}
        month={MONTH_LABEL}
        onBack={() => setView('dashboard')}
      />
    );
  }

  return (
    <div className="app">
      <TopBar month={MONTH_LABEL} onExport={() => setView('report')} />

      <main className="page">
        <SummaryStats
          total={totals.total}
          count={totals.count}
          categoryCount={totals.byCategory.length}
          topCategory={totals.topCategory}
        />

        <div className="columns">
          <ExpenseForm addExpense={addExpense} />

          <ExpenseList
            expenses={filtered}
            totalCount={expenses.length}
            onEdit={updateExpense}
            onDelete={removeExpense}
            onClearFilters={() => setFilters(NO_FILTERS)}
          >
            <FilterBar
              filters={filters}
              onChange={(partial) => setFilters(f => ({ ...f, ...partial }))}
            />
          </ExpenseList>
        </div>
      </main>

      {lastDeleted && (
        <UndoBar
          label={`Deleted "${lastDeleted.note || 'expense'}"`}
          onUndo={undoRemove}
        />
      )}
    </div>
  );
}
