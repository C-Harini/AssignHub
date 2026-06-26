export default function ConfirmDialog({ open, title, message, onConfirm, onCancel, confirmLabel = 'Confirm' }) {
  if (!open) return null;
  return (
    <div className="modal-backdrop" onClick={onCancel}>
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        <div style={{ fontSize: 15, fontWeight: 500, marginBottom: 8 }}>{title}</div>
        <div style={{ fontSize: 13, color: 'var(--color-text-secondary)', marginBottom: 16 }}>{message}</div>
        <div style={{ display: 'flex', gap: 8, justifyContent: 'flex-end' }}>
          <button onClick={onCancel} style={{ fontSize: 13 }}>Cancel</button>
          <button className="btn-danger" onClick={onConfirm} style={{ fontSize: 13 }}>{confirmLabel}</button>
        </div>
      </div>
    </div>
  );
}
