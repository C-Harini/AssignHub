import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import AssignmentCard from '../Common/AssignmentCard.jsx';
import SearchBar from '../Common/SearchBar.jsx';
import Pagination from '../Common/Pagination.jsx';
import Spinner from '../Common/Spinner.jsx';
import EmptyState from '../Common/EmptyState.jsx';
import ConfirmDialog from '../Common/ConfirmDialog.jsx';
import {
  getAssignments,
  createAssignment,
  updateAssignment,
  deleteAssignment,
  downloadAssignmentAttachment,
} from '../../services/api.js';

const emptyForm = { title: '', description: '', type: 'richtext', externalLink: '', deadline: '', attachment: null };

export default function AdminAssignments() {
  const [items, setItems] = useState([]);
  const [pagination, setPagination] = useState({ page: 1, pages: 1 });
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [fromDate, setFromDate] = useState('');
  const [toDate, setToDate] = useState('');
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editId, setEditId] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [error, setError] = useState('');
  const [confirmDelete, setConfirmDelete] = useState(null);

  const set = (k, v) => setForm((f) => ({ ...f, [k]: v }));

  const reload = async () => {
    setLoading(true);
    try {
      const data = await getAssignments({
        search, page, limit: 10,
        from: fromDate || undefined,
        to: toDate || undefined,
      });
      setItems(data.assignments);
      setPagination(data.pagination);
    } catch (err) {
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { reload(); /* eslint-disable-next-line */ }, [page, search, fromDate, toDate]);

  const resetForm = () => { setForm(emptyForm); setEditId(null); setError(''); setShowForm(false); };

  const startEdit = (a) => {
    setEditId(a.id);
    setForm({
      title: a.title,
      description: a.description || '',
      type: a.type || 'richtext',
      externalLink: a.externalLink || '',
      deadline: a.deadline ? new Date(a.deadline).toISOString().slice(0, 16) : '',
      attachment: null,
    });
    setShowForm(true);
  };

  const save = async () => {
    if (!form.title.trim()) return setError('Title is required.');
    if (!form.deadline) return setError('Deadline is required.');
    if (form.type === 'link' && !form.externalLink.trim()) return setError('External link required for link type.');
    setError('');
    try {
      if (editId) {
        await updateAssignment(editId, form);
        toast.success('Assignment updated');
      } else {
        await createAssignment(form);
        toast.success('Assignment created');
      }
      resetForm();
      reload();
    } catch (err) {
      toast.error(err.message);
    }
  };

  const doDelete = async () => {
    try {
      await deleteAssignment(confirmDelete.id);
      toast.success('Assignment deleted');
      setConfirmDelete(null);
      reload();
    } catch (err) {
      toast.error(err.message);
    }
  };

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem', gap: 8, flexWrap: 'wrap' }}>
        <div className="section-title" style={{ margin: 0 }}>Assignments</div>
        <button className="btn-primary" style={{ fontSize: 13 }} onClick={() => { resetForm(); setShowForm(true); }}>
          + New assignment
        </button>
      </div>

      <div className="card" style={{ marginBottom: '1rem' }}>
        <SearchBar value={search} onChange={(v) => { setPage(1); setSearch(v); }} placeholder="Search assignments…" />
        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
          <div style={{ flex: 1, minWidth: 160 }}>
            <label className="form-label">From</label>
            <input type="date" value={fromDate} onChange={(e) => { setPage(1); setFromDate(e.target.value); }} />
          </div>
          <div style={{ flex: 1, minWidth: 160 }}>
            <label className="form-label">To</label>
            <input type="date" value={toDate} onChange={(e) => { setPage(1); setToDate(e.target.value); }} />
          </div>
        </div>
      </div>

      {showForm && (
        <div className="card" style={{ marginBottom: '1rem' }}>
          <div className="section-title">{editId ? 'Edit assignment' : 'New assignment'}</div>
          {error && <div className="alert alert-error">{error}</div>}
          <div className="form-group">
            <label className="form-label">Title</label>
            <input value={form.title} onChange={(e) => set('title', e.target.value)} maxLength={200} />
          </div>
          <div className="form-group">
            <label className="form-label">Description</label>
            <textarea rows={3} value={form.description} onChange={(e) => set('description', e.target.value)} maxLength={5000} />
          </div>
          <div className="form-group">
            <label className="form-label">Type</label>
            <select value={form.type} onChange={(e) => set('type', e.target.value)}>
              <option value="richtext">Rich text instructions</option>
              <option value="pdf">PDF attachment</option>
              <option value="link">External link</option>
            </select>
          </div>
          {form.type === 'link' && (
            <div className="form-group">
              <label className="form-label">External link</label>
              <input type="url" value={form.externalLink} onChange={(e) => set('externalLink', e.target.value)} placeholder="https://…" />
            </div>
          )}
          {form.type === 'pdf' && (
            <div className="form-group">
              <label className="form-label">PDF attachment</label>
              <input type="file" accept="application/pdf" onChange={(e) => set('attachment', e.target.files?.[0] || null)} />
            </div>
          )}
          <div className="form-group">
            <label className="form-label">Deadline</label>
            <input type="datetime-local" value={form.deadline} onChange={(e) => set('deadline', e.target.value)} />
          </div>
          <div style={{ display: 'flex', gap: 8 }}>
            <button className="btn-primary" onClick={save}>{editId ? 'Save changes' : 'Create assignment'}</button>
            <button onClick={resetForm}>Cancel</button>
          </div>
        </div>
      )}

      {loading ? <Spinner /> : items.length === 0 ? (
        <EmptyState title="No assignments" hint="Click ‘+ New assignment’ to create one." />
      ) : items.map((a) => (
        <AssignmentCard
          key={a.id}
          assignment={a}
          actions={
            <>
              {a.hasAttachment && (
                <a href={downloadAssignmentAttachment(a.id)} target="_blank" rel="noreferrer" style={{ fontSize: 12 }}>
                  <button style={{ fontSize: 12 }}>Attachment</button>
                </a>
              )}
              {a.externalLink && (
                <a href={a.externalLink} target="_blank" rel="noreferrer">
                  <button style={{ fontSize: 12 }}>Open link</button>
                </a>
              )}
              <button style={{ fontSize: 12 }} onClick={() => startEdit(a)}>Edit</button>
              <button className="btn-danger" style={{ fontSize: 12 }} onClick={() => setConfirmDelete(a)}>Delete</button>
            </>
          }
        />
      ))}

      <Pagination page={pagination.page} pages={pagination.pages} onChange={setPage} />

      <ConfirmDialog
        open={!!confirmDelete}
        title="Delete assignment?"
        message={`This will permanently delete “${confirmDelete?.title}” and all of its submissions.`}
        confirmLabel="Delete"
        onCancel={() => setConfirmDelete(null)}
        onConfirm={doDelete}
      />
    </div>
  );
}
