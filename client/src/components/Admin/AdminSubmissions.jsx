import { useState } from 'react';
import { isOverdue } from '../Common/AssignmentCard.jsx';

export default function AdminSubmissions({ submissions, students, assignments }) {
  const [filter, setFilter] = useState('all');

  const rows = assignments
    .flatMap(a =>
      students
        .filter(s => s.status === 'approved')
        .map(s => {
          const sub = submissions.find(x => x.studentId === s.id && x.assignmentId === a.id);
          const status = sub ? 'submitted' : isOverdue(a.deadline) ? 'missed' : 'pending';
          return { student: s, assignment: a, submission: sub, status };
        })
    )
    .filter(r => filter === 'all' || r.status === filter);

  const filters = ['all', 'submitted', 'pending', 'missed'];

  return (
    <div>
      <div style={{ display: 'flex', gap: 8, marginBottom: '1rem', flexWrap: 'wrap' }}>
        {filters.map(f => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            style={{
              fontSize: 12, padding: '4px 12px',
              background: filter === f ? '#185FA5' : 'var(--color-background-secondary)',
              color: filter === f ? '#fff' : 'var(--color-text-secondary)',
              border: 'none', borderRadius: 100,
            }}
          >
            {f.charAt(0).toUpperCase() + f.slice(1)}
          </button>
        ))}
      </div>
      <div className="card">
        {rows.length === 0 && <div className="empty">No records found.</div>}
        {rows.map((r, i) => (
          <div key={i} className="list-item">
            <div>
              <div style={{ fontSize: 14, fontWeight: 500 }}>{r.student.name}</div>
              <div className="meta">{r.assignment.title}</div>
              {r.submission && (
                <div className="meta" style={{ marginTop: 2 }}>Submitted: {r.submission.submittedAt}</div>
              )}
            </div>
            <span className={`badge badge-${r.status === 'pending' ? 'pending-sub' : r.status}`}>{r.status}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
