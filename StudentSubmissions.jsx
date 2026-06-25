export default function StudentSubmissions({ mySubmissions, assignments }) {
  if (mySubmissions.length === 0)
    return <div className="empty">You have not submitted any assignments yet.</div>;

  return (
    <div className="card">
      {mySubmissions.map(s => {
        const a = assignments.find(x => x.id === s.assignmentId);
        return (
          <div key={s.id} className="list-item">
            <div>
              <div style={{ fontSize: 14, fontWeight: 500 }}>{a ? a.title : 'Assignment'}</div>
              <div className="meta">Submitted on {s.submittedAt}</div>
              <div style={{ fontSize: 13, color: 'var(--color-text-secondary)', marginTop: 2, fontStyle: 'italic' }}>
                "{s.content.slice(0, 60)}{s.content.length > 60 ? '…' : ''}"
              </div>
            </div>
            <span className="badge badge-submitted">Done</span>
          </div>
        );
      })}
    </div>
  );
}
