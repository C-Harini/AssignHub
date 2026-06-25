// Optional sidebar — used by dashboards on wide screens via the `tabs` API.
export default function Sidebar({ tabs, active, onChange }) {
  return (
    <aside className="sidebar">
      {tabs.map((t) => (
        <button
          key={t.key}
          className={active === t.key ? 'active' : ''}
          onClick={() => onChange(t.key)}
        >
          {t.label}
        </button>
      ))}
    </aside>
  );
}
