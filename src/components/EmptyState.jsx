function EmptyState({variant, onClearFilters}) {

    if (variant === 'first-run') {
      return (
        <div className="empty-state">
          <p className="empty-title">No expenses yet.</p>
          <p className="empty-hint">Add your first one to get started.</p>
        </div>
      );
    }

    return (
        <div className="empty-state">
          <p className="empty-title">No expenses match these filters.</p>
          <button type="button" className="empty-action" onClick={onClearFilters}>
            Clear filters
          </button>
        </div>
      );
}

export default EmptyState;
