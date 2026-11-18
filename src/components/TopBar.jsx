function TopBar({ month, onExport }) {
  return (
    <header className="topbar">
      <div className="topbar-brand">
        <span className="topbar-mark" />
        <span className="topbar-name">Ledger</span>
        <span className="topbar-month">{month}</span>
      </div>

      <button type="button" className="btn-primary" onClick={onExport}>
        Export report
      </button>
    </header>
  );
}

export default TopBar;
