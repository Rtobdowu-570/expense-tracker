function UndoBar({ label, onUndo }) {
  return (
    <div className="undo-bar" role="status">
      <span className="undo-text">{label}</span>
      <button type="button" className="undo-btn" onClick={onUndo}>Undo</button>
    </div>
  );
}

export default UndoBar;
