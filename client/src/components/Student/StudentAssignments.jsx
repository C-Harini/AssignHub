import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import AssignmentCard, { isOverdue } from '../Common/AssignmentCard.jsx';
import SearchBar from '../Common/SearchBar.jsx';
import Pagination from '../Common/Pagination.jsx';
import Spinner from '../Common/Spinner.jsx';
import EmptyState from '../Common/EmptyState.jsx';
import {
  getAssignments,
  getMySubmissions,
  submitAssignment,
  downloadAssignmentAttachment,
  downloadSubmissionUrl,
} from '../../services/api.js';

const MAX_MB = 15;
const ALLOWED = ['.pdf', '.doc', '.docx', '.zip', '.png', '.jpg', '.jpeg', '.webp'];

function validateFile(file) {
  if (!file) return 'Please choose a file';
  const ext = '.' + file.name.split('.').pop().toLowerCase();
  if (!ALLOWED.includes(ext)) return `Unsupported file type. Allowed: ${ALLOWED.join(', ')}`;
  if (file.size > MAX_MB * 1024 * 1024) return `File too large. Max ${MAX_MB}MB`;
  return null;
}

export default function StudentAssignments() {
  const [items, setItems] = useState([]);
  const [pagination, setPagination] = useState({ page: 1, pages: 1 });
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [mySubs, setMySubs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeId, setActiveId] = useState(null);
  const [file, setFile] = useState(null);
  const [remarks, setRemarks] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const reload = async () => {
    setLoading(true);
    try {
      const [assignmentsResp, subs] = await Promise.all([
        getAssignments({ search, page, limit: 10 }),
        getMySubmissions(),
      ]);
      setItems(assignmentsResp.assignments);
      setPagination(assignmentsResp.pagination);
      setMySubs(subs);
    } catch (err) {
      toast.error(err.message);
    } finally { setLoading(false); }
  };

  useEffect(() => { reload(); /* eslint-disable-next-line */ }, [page, search]);

  const subFor = (id) => mySubs.find((s) => s.assignmentId === id);

  const handleSubmit = async (assignmentId) => {
    const err = validateFile(file);
    if (err) return toast.error(err);
    setSubmitting(true);
    try {
      await submitAssignment(assignmentId, file, remarks);
      toast.success('Submission successful');
      setActiveId(null); setFile(null); setRemarks('');
      reload();
    } catch (e) {
      toast.error(e.message);
    } finally { setSubmitting(false); }
  };

  if (loading) return <Spinner />;

  return (
    <div>
      <div className="card" style={{ marginBottom: '1rem' }}>
        <SearchBar value={search} onChange={(v) => { setPage(1); setSearch(v); }} placeholder="Search assignments…" />
      </div>

      {items.length === 0 ? <EmptyState title="No assignments posted yet" /> : items.map((a) => {
        const sub = subFor(a.id);
        const over = isOverdue(a.deadline);
        const badge = sub
          ? <span className={`badge ${sub.late ? 'badge-missed' : 'badge-submitted'}`}>{sub.late ? 'Late submission' : 'Submitted'}</span>
          : over
            ? <span className="badge badge-missed">Missed</span>
            : <span className="badge badge-pending">Not started</span>;
        const canEdit = !over;
        return (
          <AssignmentCard
            key={a.id}
            assignment={a}
            badge={badge}
            actions={
              <>
                {a.hasAttachment && (
                  <a href={downloadAssignmentAttachment(a.id)} target="_blank" rel="noreferrer">
                    <button style={{ fontSize: 12 }}>Attachment</button>
                  </a>
                )}
                {a.externalLink && (
                  <a href={a.externalLink} target="_blank" rel="noreferrer">
                    <button style={{ fontSize: 12 }}>Open link</button>
                  </a>
                )}
              </>
            }
          >
            {sub && (
              <div className="meta" style={{ marginBottom: 6 }}>
                Submitted {new Date(sub.submittedAt).toLocaleString()} · {sub.fileName}{' '}
                <a href={downloadSubmissionUrl(sub.id)} target="_blank" rel="noreferrer" style={{ marginLeft: 6 }}>Download</a>
                {sub.remarks && <div style={{ fontStyle: 'italic', marginTop: 4 }}>"{sub.remarks}"</div>}
              </div>
            )}

            {!over && (
              activeId === a.id ? (
                <div>
                  <div className="form-group">
                    <label className="form-label">File (PDF / DOCX / Image / ZIP, max {MAX_MB}MB)</label>
                    <input type="file" accept={ALLOWED.join(',')} onChange={(e) => setFile(e.target.files?.[0] || null)} />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Remarks (optional)</label>
                    <textarea rows={2} value={remarks} onChange={(e) => setRemarks(e.target.value)} maxLength={1000} />
                  </div>
                  <div style={{ display: 'flex', gap: 8 }}>
                    <button className="btn-primary" disabled={submitting} onClick={() => handleSubmit(a.id)}>
                      {submitting ? 'Uploading…' : sub ? 'Replace submission' : 'Submit'}
                    </button>
                    <button onClick={() => { setActiveId(null); setFile(null); setRemarks(''); }}>Cancel</button>
                  </div>
                </div>
              ) : canEdit && (
                <button style={{ fontSize: 13, marginTop: 4 }} onClick={() => { setActiveId(a.id); setRemarks(sub?.remarks || ''); }}>
                  {sub ? 'Replace submission' : 'Submit work'}
                </button>
              )
            )}
          </AssignmentCard>
        );
      })}

      <Pagination page={pagination.page} pages={pagination.pages} onChange={setPage} />
    </div>
  );
}
