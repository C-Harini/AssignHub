export function isOverdue(deadline) {
  if (!deadline) return false;
  return new Date(deadline) < new Date();
}

export function formatDate(d) {
  if (!d) return '';
  const date = new Date(d);
  return date.toLocaleString(undefined, {
    year: 'numeric', month: 'short', day: 'numeric',
    hour: '2-digit', minute: '2-digit',
  });
}

export default function AssignmentCard({ assignment, badge, children, actions }) {
  const overdue = isOverdue(assignment.deadline);
  return (
    <div className="card assignment-card">
      <div style={{ display: 'flex', justifyContent: 'space-between', gap: 12, alignItems: 'flex-start' }}>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ display: 'flex', gap: 8, alignItems: 'center', flexWrap: 'wrap' }}>
            <div style={{ fontSize: 15, fontWeight: 500 }}>{assignment.title}</div>
            {assignment.type && (
              <span className="badge" style={{ background: '#eef2ff', color: '#3730a3' }}>
                {assignment.type}
              </span>
            )}
            {badge}
          </div>
          {assignment.description && (
            <div className="meta" style={{ marginTop: 6, whiteSpace: 'pre-wrap' }}>
              {assignment.description}
            </div>
          )}
          <div className="meta" style={{ marginTop: 6, color: overdue ? 'var(--color-text-danger)' : 'var(--color-text-secondary)' }}>
            Deadline: {formatDate(assignment.deadline)} {overdue && '(overdue)'}
          </div>
        </div>
        {actions && <div style={{ display: 'flex', gap: 6 }}>{actions}</div>}
      </div>
      {children && <div style={{ marginTop: 10 }}>{children}</div>}
    </div>
  );
}
