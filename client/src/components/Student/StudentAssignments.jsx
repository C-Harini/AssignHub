import { useState } from 'react';
import AssignmentCard, { isOverdue } from '../Common/AssignmentCard.jsx';

export default function StudentAssignments({ student, assignments, submissions, onSubmit }) {
  const [active, setActive] = useState(null);
  const [text, setText] = useState('');
  const [success, setSuccess] = useState('');

  const submit = async (assignmentId) => {
    if (!text.trim()) return;
    await onSubmit({ studentId: student.id, assignmentId, content: text });
    setText('');
    setActive(null);
    setSuccess('Submitted successfully!');
    setTimeout(() => setSuccess(''), 3000);
  };

  if (assignments.length === 0) return <div className="empty">No assignments posted yet.</div>;

  return (
    <div>
      {success && <div className="alert alert-success">{success}</div>}
      {assignments.map(a => {
        const sub = submissions.find(s => s.studentId === student.id && s.assignmentId === a.id);
        const over = isOverdue(a.deadline);
        const badge = sub
          ? <span className="badge badge-submitted">Submitted</span>
          : over
            ? <span className="badge badge-missed">Missed</span>
            : <span className="badge badge-pending">Pending</span>;

        return (
          <AssignmentCard key={a.id} assignment={a} badge={badge}>
            {!sub && !over && (
              active === a.id ? (
                <div>
                  <textarea
                    rows={3}
                    style={{ marginBottom: 8 }}
                    placeholder="Type your submission here..."
                    value={text}
                    onChange={e => setText(e.target.value)}
                  />
                  <div style={{ display: 'flex', gap: 8 }}>
                    <button className="btn-primary" style={{ fontSize: 13 }} onClick={() => submit(a.id)}>Submit</button>
                    <button style={{ fontSize: 13 }} onClick={() => { setActive(null); setText(''); }}>Cancel</button>
                  </div>
                </div>
              ) : (
                <button style={{ fontSize: 13, marginTop: 4 }} onClick={() => setActive(a.id)}>Submit work</button>
              )
            )}
            {sub && (
              <div style={{ fontSize: 12, color: 'var(--color-text-secondary)', marginTop: 6, fontStyle: 'italic' }}>
                "{sub.content.slice(0, 80)}{sub.content.length > 80 ? '…' : ''}"
              </div>
            )}
          </AssignmentCard>
        );
      })}
    </div>
  );
}
