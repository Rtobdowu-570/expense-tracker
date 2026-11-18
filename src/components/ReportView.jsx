import CategoryBar from './CategoryBar';
import { formatCurrency } from '../utils/formatCurrency';
import { formatShortDate } from '../utils/formatDate';

export default function ReportView({
  expenses,
  totals,
  month,
  onBack,
}) {
  const sortedExpenses = [...expenses].sort(
    (a, b) => new Date(a.date) - new Date(b.date)
  );

  const handlePrint = () => {
    window.print();
  };

  return (
    <main className="report-page">

      {/* Navigation */}
      <div className="report-actions">
        <button
          type="button"
          onClick={onBack}
          className="back-button"
        >
          ← Back to expenses
        </button>

        <div className="report-buttons">
          <button
            type="button"
            onClick={handlePrint}
            className="print-button"
          >
            Print
          </button>

          <button
            type="button"
            onClick={handlePrint}
            className="download-button"
          >
            Download PDF
          </button>
        </div>
      </div>

      {/* Report Header */}
      <header className="report-header">
        <div>
          <p className="report-label">Expense report</p>

          <h1>{month}</h1>

          <p className="report-meta">
            {totals.count} expenses · {totals.byCategory.length} categories
          </p>
        </div>

        <div className="report-total">
          <p>Total spent</p>
          <p>{formatCurrency(totals.total)}</p>
        </div>
      </header>

      <hr />

      {/* Category Breakdown */}
      <CategoryBar breakdown={totals.byCategory} />

      {/* All Expenses */}
      <section className="report-section">
        <h2>All {expenses.length} expenses</h2>

        {expenses.length === 0 ? (
          <p className="report-empty">
            No expenses available for this report.
          </p>
        ) : (
          <div className="report-table-wrapper">
            <table className="report-table expense-report-table">
              <thead>
                <tr>
                  <th>Date</th>
                  <th>Description</th>
                  <th>Category</th>
                  <th className="amount-cell">Amount</th>
                </tr>
              </thead>

              <tbody>
                {sortedExpenses.map((expense) => {
                  const category = totals.byCategory.find(
                    (item) => item.id === expense.category
                  );

                  return (
                    <tr key={expense.id}>
                      <td className="date-cell">
                        {formatShortDate(expense.date)}
                      </td>

                      <td>{expense.note || category?.label}</td>

                      <td>
                        {category?.label ?? 'Uncategorized'}
                      </td>

                      <td className="amount-cell">
                        {formatCurrency(expense.amount)}
                      </td>
                    </tr>
                  );
                })}
              </tbody>

              <tfoot>
                <tr>
                  <td colSpan="3">Total</td>

                  <td className="amount-cell">
                    {formatCurrency(totals.total)}
                  </td>
                </tr>
              </tfoot>
            </table>
          </div>
        )}
      </section>

      <hr />

      {/* Footer */}
      <footer className="report-footer">
        Generated {new Date().toLocaleDateString()} · Ledger · All amounts in USD
      </footer>

    </main>
  );
}
