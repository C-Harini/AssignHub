export const isOverdue = (deadline) => new Date(deadline) < new Date();

export default function AssignmentCard({ assignment, badge, children }) {
  const { title, description, deadline } = assignment;
  return (
    <div className="card assign-card">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 8 }}>
        <div className="assign-title">{title}</div>
        {badge}
      </div>
      <div className="assign-meta">
        Deadline: {deadline}
        {isOverdue(deadline) ? ' · Overdue' : ''}
      </div>
      {description && (
        <div style={{ fontSize: 13, color: 'var(--color-text-secondary)', marginBottom: 8 }}>
          {description}
        </div>
      )}
      {children}
    </div>
  );
}
