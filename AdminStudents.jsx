import StudentCard from '../Common/StudentCard.jsx';

export default function AdminStudents({ students, onUpdateStatus }) {
  const pending = students.filter(s => s.status === 'pending');
  const others = students.filter(s => s.status !== 'pending');

  return (
    <div>
      {pending.length > 0 && (
        <div className="card" style={{ marginBottom: '1rem' }}>
          <div className="section-title">Pending approvals</div>
          {pending.map(s => (
            <StudentCard
              key={s.id}
              student={s}
              right={
                <div style={{ display: 'flex', gap: 6 }}>
                  <button className="btn-success" style={{ padding: '4px 12px', fontSize: 12 }} onClick={() => onUpdateStatus(s.id, 'approved')}>
                    Approve
                  </button>
                  <button className="btn-danger" style={{ padding: '4px 12px', fontSize: 12 }} onClick={() => onUpdateStatus(s.id, 'rejected')}>
                    Reject
                  </button>
                </div>
              }
            />
          ))}
        </div>
      )}

      <div className="card">
        <div className="section-title">All students</div>
        {students.length === 0 && <div className="empty">No students registered yet.</div>}
        {others.map(s => (
          <StudentCard
            key={s.id}
            student={s}
            right={<span className={`badge badge-${s.status}`}>{s.status}</span>}
          />
        ))}
      </div>
    </div>
  );
}
