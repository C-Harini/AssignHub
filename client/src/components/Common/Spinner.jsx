export default function Spinner({ label = 'Loading…' }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10, padding: '2rem 0', color: 'var(--color-text-secondary)', fontSize: 13 }}>
      <span className="spinner" />
      <span>{label}</span>
    </div>
  );
}
