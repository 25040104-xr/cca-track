// Reusable "Are you sure?" popup.
// Props:
// - title: the question, e.g. "Update status?"
// - message: more details (optional)
// - confirmText: text on the confirm button (default "Confirm")
// - onConfirm: function to call when the user clicks confirm
// - onCancel: function to call when the user clicks cancel
function ConfirmDialog({ title, message, confirmText = "Confirm", onConfirm, onCancel }) {
  return (
    <div className="dialog-overlay">
      <div className="dialog-box">
        <h3>{title}</h3>
        {message && <p>{message}</p>}
        <div className="dialog-buttons">
          <button className="btn" onClick={onCancel}>
            Cancel
          </button>
          <button className="btn btn-primary" onClick={onConfirm}>
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
}

export default ConfirmDialog;