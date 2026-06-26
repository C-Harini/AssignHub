export default function EmptyState({ title = 'Nothing here yet', hint }) {
  return (
    <div className="empty">
      <div style={{ fontWeight: 500, marginBottom: 4 }}>{title}</div>
      {hint && <div style={{ fontSize: 12 }}>{hint}</div>}
    </div>
  );
}
