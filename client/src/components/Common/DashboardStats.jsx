export default function DashboardStats({ items }) {
  return (
    <div className="stat-grid">
      {items.map((it) => (
        <div key={it.label} className="stat-card">
          <div className="stat-label">{it.label}</div>
          <div className="stat-value">{it.value}</div>
        </div>
      ))}
    </div>
  );
}
