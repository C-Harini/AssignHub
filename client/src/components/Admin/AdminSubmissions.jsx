import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import SearchBar from '../Common/SearchBar.jsx';
import Pagination from '../Common/Pagination.jsx';
import Spinner from '../Common/Spinner.jsx';
import EmptyState from '../Common/EmptyState.jsx';
import { getAllSubmissions, downloadSubmissionUrl } from '../../services/api.js';
import { formatDate } from '../Common/AssignmentCard.jsx';

export default function AdminSubmissions() {
  const [rows, setRows] = useState([]);
  const [pagination, setPagination] = useState({ page: 1, pages: 1 });
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState('all');
  const [loading, setLoading] = useState(true);

  const reload = async () => {
    setLoading(true);
    try {
      const data = await getAllSubmissions({ page, limit: 15, search, status: status === 'all' ? undefined : status });
      setRows(data.submissions);
      setPagination(data.pagination);
    } catch (err) {
      toast.error(err.message);
    } finally { setLoading(false); }
  };

  useEffect(() => { reload(); /* eslint-disable-next-line */ }, [page, search, status]);

  return (
    <div>
      <div className="card" style={{ marginBottom: '1rem' }}>
        <SearchBar value={search} onChange={(v) => { setPage(1); setSearch(v); }} placeholder="Search by student or assignment…" />
        <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
          {['all', 'ontime', 'late'].map((f) => (
            <button
              key={f}
              onClick={() => { setPage(1); setStatus(f); }}
              style={{
                fontSize: 12, padding: '4px 12px',
                background: status === f ? '#185FA5' : 'var(--color-background-secondary)',
                color: status === f ? '#fff' : 'var(--color-text-secondary)',
                border: 'none', borderRadius: 100,
              }}
            >
              {f === 'all' ? 'All' : f === 'ontime' ? 'On time' : 'Late'}
            </button>
          ))}
        </div>
      </div>

      <div className="card">
        {loading ? <Spinner /> : rows.length === 0 ? (
          <EmptyState title="No submissions found" />
        ) : rows.map((s) => (
          <div key={s.id} className="list-item">
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontSize: 14, fontWeight: 500 }}>{s.student?.name || '—'} <span style={{ color: 'var(--color-text-secondary)', fontWeight: 400 }}>· {s.student?.rollNumber || '—'}</span></div>
              <div className="meta">{s.assignment?.title || '—'}</div>
              <div className="meta" style={{ marginTop: 2 }}>
                Submitted: {formatDate(s.submittedAt)} · {Math.round((s.fileSize || 0) / 1024)} KB
              </div>
              {s.remarks && <div className="meta" style={{ marginTop: 2, fontStyle: 'italic' }}>"{s.remarks}"</div>}
            </div>
            <div style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
              <span className={`badge ${s.late ? 'badge-missed' : 'badge-submitted'}`}>{s.late ? 'Late' : 'On time'}</span>
              <a href={downloadSubmissionUrl(s.id)} target="_blank" rel="noreferrer">
                <button style={{ fontSize: 12 }}>Download</button>
              </a>
            </div>
          </div>
        ))}
        <Pagination page={pagination.page} pages={pagination.pages} onChange={setPage} />
      </div>
    </div>
  );
}
