import { useEffect, useState } from 'react';
import Layout from '../components/Layout/Layout.jsx';
import StudentAssignments from '../components/Student/StudentAssignments.jsx';
import StudentSubmissions from '../components/Student/StudentSubmissions.jsx';
import { useAuth } from '../contexts/AuthContext.jsx';
import * as api from '../services/api.js';

const TABS = [
  { key: 'assignments', label: 'Assignments' },
  { key: 'mine', label: 'My submissions' },
];

export default function StudentDashboard() {
  const { user } = useAuth();
  const [tab, setTab] = useState('assignments');
  const [assignments, setAssignments] = useState([]);
  const [submissions, setSubmissions] = useState([]);

  const refresh = async () => {
    const [a, s] = await Promise.all([api.getAssignments(), api.getSubmissions()]);
    setAssignments(a); setSubmissions(s);
  };

  useEffect(() => { refresh(); }, []);

  const handleSubmit = async (payload) => {
    const created = await api.submitAssignment(payload);
    setSubmissions(prev => [...prev, created]);
  };

  const mySubmissions = submissions.filter(s => s.studentId === user.id);

  return (
    <Layout>
      <div className="tabs">
        {TABS.map(t => (
          <button key={t.key} className={`tab ${tab === t.key ? 'active' : ''}`} onClick={() => setTab(t.key)}>
            {t.label}
          </button>
        ))}
      </div>

      {tab === 'assignments' && (
        <StudentAssignments
          student={user}
          assignments={assignments}
          submissions={submissions}
          onSubmit={handleSubmit}
        />
      )}
      {tab === 'mine' && <StudentSubmissions mySubmissions={mySubmissions} assignments={assignments} />}
    </Layout>
  );
}
