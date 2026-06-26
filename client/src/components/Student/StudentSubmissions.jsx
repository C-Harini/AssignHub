import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import Spinner from '../Common/Spinner.jsx';
import EmptyState from '../Common/EmptyState.jsx';
import { getMySubmissions, downloadSubmissionUrl } from '../../services/api.js';
import { formatDate } from '../Common/AssignmentCard.jsx';

export default function StudentSubmissions() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getMySubmissions()
      .then(setItems)
      .catch((e) => toast.error(e.message))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <Spinner />;
  if (items.length === 0) return <EmptyState title="No submissions yet" hint="Submit an assignment to see it here." />;

  return (
    <div className="card">
      <div className="section-title">Submission history</div>
      {items.map((s) => (
        <div key={s.id} className="list-item">
          <div>
            <div style={{ fontSize: 14, fontWeight: 500 }}>{s.assignmentTitle}</div>
            <div className="meta">{formatDate(s.submittedAt)} · {s.fileName}</div>
            {s.remarks && <div className="meta" style={{ fontStyle: 'italic', marginTop: 2 }}>"{s.remarks}"</div>}
          </div>
          <div style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
            <span className={`badge ${s.late ? 'badge-missed' : 'badge-submitted'}`}>{s.late ? 'Late' : 'On time'}</span>
            <a href={downloadSubmissionUrl(s.id)} target="_blank" rel="noreferrer">
              <button style={{ fontSize: 12 }}>Download</button>
            </a>
          </div>
        </div>
      ))}
    </div>
  );
}
