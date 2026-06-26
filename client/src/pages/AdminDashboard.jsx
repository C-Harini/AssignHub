import { useState } from 'react';
import Layout from '../components/Layout/Layout.jsx';
import AdminOverview from '../components/Admin/AdminOverview.jsx';
import AdminAssignments from '../components/Admin/AdminAssignments.jsx';
import AdminStudents from '../components/Admin/AdminStudents.jsx';
import AdminSubmissions from '../components/Admin/AdminSubmissions.jsx';

const TABS = [
  { id: 'overview', label: 'Overview' },
  { id: 'assignments', label: 'Assignments' },
  { id: 'students', label: 'Students' },
  { id: 'submissions', label: 'Submissions' },
];

export default function AdminDashboard() {
  const [tab, setTab] = useState('overview');
  return (
    <Layout title="Admin">
      <div className="tabs">
        {TABS.map((t) => (
          <button key={t.id} className={`tab ${tab === t.id ? 'active' : ''}`} onClick={() => setTab(t.id)}>
            {t.label}
          </button>
        ))}
      </div>
      {tab === 'overview' && <AdminOverview />}
      {tab === 'assignments' && <AdminAssignments />}
      {tab === 'students' && <AdminStudents />}
      {tab === 'submissions' && <AdminSubmissions />}
    </Layout>
  );
}
