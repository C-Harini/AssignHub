export default function StatCard({ label, value, accent = '#185FA5', sublabel }) {
  return (
    <div className="card stat-card">
      <div style={{ fontSize: 12, color: 'var(--color-text-secondary)' }}>{label}</div>
      <div style={{ fontSize: 24, fontWeight: 600, color: accent, marginTop: 4 }}>{value}</div>
      {sublabel && <div style={{ fontSize: 11, color: 'var(--color-text-secondary)', marginTop: 4 }}>{sublabel}</div>}
    </div>
  );
}
