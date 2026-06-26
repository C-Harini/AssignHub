import DashboardStats from '../Common/DashboardStats.jsx';

export default function AdminOverview({ students, assignments, submissions }) {
  const approved = students.filter(s => s.status === 'approved').length;
  const pending = students.filter(s => s.status === 'pending').length;
  const subCount = submissions.length;
  const totalPossible = approved * assignments.length;
  const pct = totalPossible > 0 ? Math.round((subCount / totalPossible) * 100) : 0;

  return (
    <div>
      <DashboardStats
        items={[
          { label: 'Approved students', value: approved },
          { label: 'Pending approvals', value: pending },
          { label: 'Total assignments', value: assignments.length },
        ]}
      />
      <div className="card">
        <div className="stat-label">Overall submission rate</div>
        <div style={{ fontSize: 20, fontWeight: 500, margin: '4px 0 8px' }}>{pct}%</div>
        <div className="progress-bar">
          <div className="progress-fill" style={{ width: pct + '%' }} />
        </div>
        <div className="meta" style={{ marginTop: 6 }}>
          {subCount} of {totalPossible} possible submissions received
        </div>
      </div>
    </div>
  );
}
