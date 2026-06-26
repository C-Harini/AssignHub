import { useEffect, useMemo, useState } from 'react';
import toast from 'react-hot-toast';
import StudentCard from '../Common/StudentCard.jsx';
import SearchBar from '../Common/SearchBar.jsx';
import Pagination from '../Common/Pagination.jsx';
import Spinner from '../Common/Spinner.jsx';
import EmptyState from '../Common/EmptyState.jsx';
import { getStudents, updateStudentStatus } from '../../services/api.js';

const PAGE_SIZE = 10;

export default function AdminStudents() {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [page, setPage] = useState(1);

  const reload = async () => {
    setLoading(true);
    try { setStudents(await getStudents()); }
    catch (err) { toast.error(err.message); }
    finally { setLoading(false); }
  };

  useEffect(() => { reload(); }, []);

  const handleStatus = async (id, status) => {
    try {
      await updateStudentStatus(id, status);
      toast.success(`Student ${status}`);
      reload();
    } catch (err) { toast.error(err.message); }
  };

  const filtered = useMemo(() => {
    const rx = new RegExp(search.trim(), 'i');
    return students.filter((s) =>
      (statusFilter === 'all' || s.status === statusFilter) &&
      (rx.test(s.name) || rx.test(s.email) || rx.test(s.rollNumber || ''))
    );
  }, [students, search, statusFilter]);

  const pending = filtered.filter((s) => s.status === 'pending');
  const others = filtered.filter((s) => s.status !== 'pending');
  const totalPages = Math.max(1, Math.ceil(others.length / PAGE_SIZE));
  const paged = others.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  if (loading) return <Spinner />;

  return (
    <div>
      <div className="card" style={{ marginBottom: '1rem' }}>
        <SearchBar value={search} onChange={(v) => { setPage(1); setSearch(v); }} placeholder="Search by name, email, or roll number…" />
        <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
          {['all', 'pending', 'approved', 'rejected'].map((f) => (
            <button
              key={f}
              onClick={() => { setPage(1); setStatusFilter(f); }}
              style={{
                fontSize: 12, padding: '4px 12px',
                background: statusFilter === f ? '#185FA5' : 'var(--color-background-secondary)',
                color: statusFilter === f ? '#fff' : 'var(--color-text-secondary)',
                border: 'none', borderRadius: 100,
              }}
            >
              {f[0].toUpperCase() + f.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {pending.length > 0 && (
        <div className="card" style={{ marginBottom: '1rem' }}>
          <div className="section-title">Pending approvals ({pending.length})</div>
          {pending.map((s) => (
            <StudentCard
              key={s.id}
              student={s}
              right={
                <div style={{ display: 'flex', gap: 6 }}>
                  <button className="btn-success" style={{ padding: '4px 12px', fontSize: 12 }} onClick={() => handleStatus(s.id, 'approved')}>
                    Approve
                  </button>
                  <button className="btn-danger" style={{ padding: '4px 12px', fontSize: 12 }} onClick={() => handleStatus(s.id, 'rejected')}>
                    Reject
                  </button>
                </div>
              }
            />
          ))}
        </div>
      )}

      <div className="card">
        <div className="section-title">All students ({others.length})</div>
        {paged.length === 0 ? <EmptyState title="No students match your filters" /> : paged.map((s) => (
          <StudentCard
            key={s.id}
            student={s}
            right={<span className={`badge badge-${s.status}`}>{s.status}</span>}
          />
        ))}
        <Pagination page={page} pages={totalPages} onChange={setPage} />
      </div>
    </div>
  );
}
