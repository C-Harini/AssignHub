import StatCard from './StatCard.jsx';

export default function DashboardStats({ items }) {
  return (
    <div className="stats-grid">
      {items.map((it) => (
        <StatCard key={it.label} label={it.label} value={it.value} accent={it.accent} sublabel={it.sublabel} />
      ))}
    </div>
  );
}
