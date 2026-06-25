import { useState } from 'react';
import AssignmentCard from '../Common/AssignmentCard.jsx';

export default function AdminAssignments({ assignments, onCreate }) {
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ title: '', description: '', deadline: '' });
  const [error, setError] = useState('');

  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));

  const add = async () => {
    if (!form.title || !form.deadline) return setError('Title and deadline are required.');
    await onCreate(form);
    setForm({ title: '', description: '', deadline: '' });
    setError('');
    setShowForm(false);
  };

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
        <div className="section-title" style={{ margin: 0 }}>Assignments</div>
        <button className="btn-primary" style={{ fontSize: 13 }} onClick={() => setShowForm(f => !f)}>
          {showForm ? 'Cancel' : '+ New assignment'}
        </button>
      </div>

      {showForm && (
        <div className="card" style={{ marginBottom: '1rem' }}>
          {error && <div className="alert alert-error">{error}</div>}
          <div className="form-group">
            <label className="form-label">Title</label>
            <input value={form.title} onChange={e => set('title', e.target.value)} placeholder="e.g. DBMS Assignment 1" />
          </div>
          <div className="form-group">
            <label className="form-label">Description</label>
            <textarea rows={3} value={form.description} onChange={e => set('description', e.target.value)} placeholder="Instructions, links, etc." />
          </div>
          <div className="form-group">
            <label className="form-label">Deadline</label>
            <input type="date" value={form.deadline} onChange={e => set('deadline', e.target.value)} />
          </div>
          <button className="btn-primary" onClick={add}>Create assignment</button>
        </div>
      )}

      {assignments.length === 0 && <div className="empty">No assignments yet.</div>}
      {assignments.map(a => <AssignmentCard key={a.id} assignment={a} />)}
    </div>
  );
}
