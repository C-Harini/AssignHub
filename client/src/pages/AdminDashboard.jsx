import { useEffect, useState } from 'react';
import Layout from '../components/Layout/Layout.jsx';
import AdminOverview from '../components/Admin/AdminOverview.jsx';
import AdminStudents from '../components/Admin/AdminStudents.jsx';
import AdminAssignments from '../components/Admin/AdminAssignments.jsx';
import AdminSubmissions from '../components/Admin/AdminSubmissions.jsx';
import * as api from '../services/api.js';

const TABS = ['overview', 'students', 'assignments', 'submissions'];

export default function AdminDashboard() {
  const [tab, setTab] = useState('overview');
  const [students, setStudents] = useState([]);
  const [assignments, setAssignments] = useState([]);
  const [submissions, setSubmissions] = useState([]);

  // Load mock data from the api service.
  const refresh = async () => {
    const [s, a, sub] = await Promise.all([
      api.getStudents(),
      api.getAssignments(),
      api.getSubmissions(),
    ]);
    setStudents(s); setAssignments(a); setSubmissions(sub);
  };

  useEffect(() => { refresh(); }, []);

  const handleUpdateStatus = async (id, status) => {
    await api.updateStudentStatus(id, status);
    setStudents(prev => prev.map(s => (s.id === id ? { ...s, status } : s)));
  };

  const handleCreateAssignment = async (form) => {
    const created = await api.uploadAssignment(form);
    setAssignments(prev => [...prev, created]);
  };

  const pendingCount = students.filter(s => s.status === 'pending').length;

  return (
    <Layout>
      <div className="tabs">
        {TABS.map(t => (
          <button key={t} className={`tab ${tab === t ? 'active' : ''}`} onClick={() => setTab(t)}>
            {t.charAt(0).toUpperCase() + t.slice(1)}
            {t === 'students' && pendingCount > 0 ? ` (${pendingCount})` : ''}
          </button>
        ))}
      </div>

      {tab === 'overview' && <AdminOverview students={students} assignments={assignments} submissions={submissions} />}
      {tab === 'students' && <AdminStudents students={students} onUpdateStatus={handleUpdateStatus} />}
      {tab === 'assignments' && <AdminAssignments assignments={assignments} onCreate={handleCreateAssignment} />}
      {tab === 'submissions' && <AdminSubmissions submissions={submissions} students={students} assignments={assignments} />}
    </Layout>
  );
}
