import { useState } from 'react';
import { CATEGORIES } from '../constants/categories';
import { roundMoney } from '../utils/roundMoney';

function todayLocal() {
  const now = new Date();
  return new Date(now.getTime() - now.getTimezoneOffset() * 60000)
    .toISOString()
    .slice(0, 10);
}

function validateAmount(value) {
  const number = Number(value);
  if (value.trim() === '' || !Number.isFinite(number) || number <= 0) {
    return 'Enter an amount greater than $0.00';
  }
  return '';
}

function validateDate(value) {
  if (!value || Number.isNaN(new Date(`${value}T00:00:00`).getTime())) {
    return 'Pick a date';
  }
  return '';
}

// "Logged to November 2026", taken from the date currently picked
function monthLabel(value) {
  const parsed = new Date(`${value}T00:00:00`);
  if (!value || Number.isNaN(parsed.getTime())) return 'the selected date';
  return parsed.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
}

function ExpenseForm({ addExpense }) {
  const [amount, setAmount] = useState('');
  const [categoryId, setCategoryId] = useState(CATEGORIES[0].id);
  const [date, setDate] = useState(todayLocal);
  const [note, setNote] = useState('');
  const [amountError, setAmountError] = useState('');
  const [dateError, setDateError] = useState('');

  function handleSubmit(e) {
    e.preventDefault();

    const error = validateAmount(amount);
    const badDate = validateDate(date);
    setAmountError(error);
    setDateError(badDate);
    if (error || badDate) return;

    addExpense({
      // id is assigned by useExpenses
      amount: roundMoney(amount),
      category: categoryId,
      date,
      note: note.trim(),
    });
    setAmount('');
    setNote('');
  }

  return (
    <form className="expense-form" onSubmit={handleSubmit} noValidate>
      <div className="expense-header">
        <h2>Add expense</h2>
        <p>Logged to {monthLabel(date)}</p>
      </div>

      <div className="expense-inputs">
        <div className="expense-amount">
          <label htmlFor="amount">Amount</label>
          <input
            type="number"
            name="amount"
            id="amount"
            step="0.01"
            min="0"
            placeholder="0.00"
            value={amount}
            aria-invalid={amountError ? true : undefined}
            aria-describedby={amountError ? 'amount-error' : undefined}
            onChange={(e) => {
              setAmount(e.target.value);
              if (amountError) setAmountError('');
            }}
            onBlur={(e) => setAmountError(validateAmount(e.target.value))}
          />
          {amountError && (
            <p className="field-error" id="amount-error">{amountError}</p>
          )}
        </div>

        <div className="expense-category">
          <label htmlFor="category">Category</label>
          <select
            name="category"
            id="category"
            value={categoryId}
            onChange={(e) => setCategoryId(e.target.value)}
          >
            {CATEGORIES.map((cat) => (
              <option key={cat.id} value={cat.id}>{cat.label}</option>
            ))}
          </select>
        </div>

        <div className="expense-date">
          <label htmlFor="date">Date</label>
          <input
            type="date"
            name="date"
            id="date"
            value={date}
            aria-invalid={dateError ? true : undefined}
            aria-describedby={dateError ? 'date-error' : undefined}
            onChange={(e) => {
              setDate(e.target.value);
              if (dateError) setDateError('');
            }}
          />
          {dateError && (
            <p className="field-error" id="date-error">{dateError}</p>
          )}
        </div>

        <div className="expense-note">
          <div className="note-text">
            <label htmlFor="note">Note</label>
            <p className="optional">Optional</p>
          </div>
          <input
            type="text"
            name="note"
            id="note"
            placeholder="What was this for?"
            value={note}
            onChange={(e) => setNote(e.target.value)}
          />
        </div>
      </div>

      <button type="submit" className="btn-primary">Add expense</button>
    </form>
  );
}

export default ExpenseForm;
