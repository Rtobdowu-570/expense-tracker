function RowMenu({ onEdit, onDuplicate, onDelete }) {
  return (
    <div className="rowmenu">
      <button type="button" className="edit-btn" onClick={onEdit}>Edit</button>
      <button type="button" className="duplicate-btn" onClick={onDuplicate}>Duplicate</button>
      <button type="button" className="delete-btn" onClick={onDelete}>Delete</button>
    </div>
  );
}

export default RowMenu;
