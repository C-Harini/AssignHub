import { useState } from 'react';
import Layout from '../components/Layout/Layout.jsx';
import StudentOverview from '../components/Student/StudentOverview.jsx';
import StudentAssignments from '../components/Student/StudentAssignments.jsx';
import StudentSubmissions from '../components/Student/StudentSubmissions.jsx';

const TABS = [
  { id: 'overview', label: 'Overview' },
  { id: 'assignments', label: 'Assignments' },
  { id: 'submissions', label: 'My submissions' },
];

export default function StudentDashboard() {
  const [tab, setTab] = useState('overview');
  return (
    <Layout title="Student">
      <div className="tabs">
        {TABS.map((t) => (
          <button key={t.id} className={`tab ${tab === t.id ? 'active' : ''}`} onClick={() => setTab(t.id)}>
            {t.label}
          </button>
        ))}
      </div>
      {tab === 'overview' && <StudentOverview />}
      {tab === 'assignments' && <StudentAssignments />}
      {tab === 'submissions' && <StudentSubmissions />}
    </Layout>
  );
}
