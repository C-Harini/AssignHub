import { useEffect, useState } from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, BarChart, Bar, XAxis, YAxis } from 'recharts';
import { getAdminDashboard } from '../../services/api.js';
import StatCard from '../Common/StatCard.jsx';
import Spinner from '../Common/Spinner.jsx';
import EmptyState from '../Common/EmptyState.jsx';
import { formatDate } from '../Common/AssignmentCard.jsx';

const COLORS = ['#185FA5', '#A32D2D', '#854F0B'];

export default function AdminOverview() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let alive = true;
    getAdminDashboard()
      .then((d) => { if (alive) setData(d); })
      .finally(() => { if (alive) setLoading(false); });
    return () => { alive = false; };
  }, []);

  if (loading) return <Spinner />;
  if (!data) return <EmptyState title="Could not load dashboard" />;

  const { cards, charts, recentRegistrations, recentSubmissions, upcomingDeadlines } = data;

  return (
    <div>
      <div className="stats-grid">
        <StatCard label="Total students" value={cards.totalStudents} />
        <StatCard label="Approved" value={cards.approvedStudents} accent="#3B6D11" />
        <StatCard label="Pending" value={cards.pendingStudents} accent="#854F0B" />
        <StatCard label="Rejected" value={cards.rejectedStudents} accent="#A32D2D" />
        <StatCard label="Assignments" value={cards.assignments} />
        <StatCard label="Submissions" value={cards.submissions} />
        <StatCard label="Late submissions" value={cards.lateSubmissions} accent="#A32D2D" />
        <StatCard label="Completion" value={`${cards.completion}%`} accent="#185FA5" />
      </div>

      <div className="grid-2" style={{ marginTop: '1rem' }}>
        <div className="card">
          <div className="section-title">Submission status</div>
          <div style={{ width: '100%', height: 220 }}>
            <ResponsiveContainer>
              <PieChart>
                <Pie data={charts.submissionStatus} dataKey="value" nameKey="name" innerRadius={50} outerRadius={80} paddingAngle={2}>
                  {charts.submissionStatus.map((_, i) => (
                    <Cell key={i} fill={COLORS[i % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', fontSize: 12, color: 'var(--color-text-secondary)' }}>
            {charts.submissionStatus.map((s, i) => (
              <div key={s.name} style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
                <span style={{ width: 10, height: 10, background: COLORS[i % COLORS.length], borderRadius: 2 }} />
                {s.name}: {s.value}
              </div>
            ))}
          </div>
        </div>

        <div className="card">
          <div className="section-title">Assignment completion</div>
          <div style={{ width: '100%', height: 220 }}>
            <ResponsiveContainer>
              <BarChart data={[{ name: 'Completion', value: cards.completion }]}>
                <XAxis dataKey="name" fontSize={11} />
                <YAxis domain={[0, 100]} fontSize={11} />
                <Tooltip />
                <Bar dataKey="value" fill="#185FA5" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      <div className="grid-2" style={{ marginTop: '1rem' }}>
        <div className="card">
          <div className="section-title">Recent registrations</div>
          {recentRegistrations.length === 0 ? (
            <EmptyState title="No registrations yet" />
          ) : recentRegistrations.map((s) => (
            <div key={s.id} className="list-item">
              <div>
                <div style={{ fontSize: 14, fontWeight: 500 }}>{s.name}</div>
                <div className="meta">{s.email} · {formatDate(s.createdAt)}</div>
              </div>
              <span className={`badge badge-${s.status}`}>{s.status}</span>
            </div>
          ))}
        </div>

        <div className="card">
          <div className="section-title">Recent submissions</div>
          {recentSubmissions.length === 0 ? (
            <EmptyState title="No submissions yet" />
          ) : recentSubmissions.map((s) => (
            <div key={s.id} className="list-item">
              <div>
                <div style={{ fontSize: 14, fontWeight: 500 }}>{s.assignment?.title || '—'}</div>
                <div className="meta">{s.student?.name} · {formatDate(s.submittedAt)}</div>
              </div>
              <span className={`badge ${s.late ? 'badge-missed' : 'badge-submitted'}`}>
                {s.late ? 'Late' : 'On time'}
              </span>
            </div>
          ))}
        </div>
      </div>

      <div className="card" style={{ marginTop: '1rem' }}>
        <div className="section-title">Upcoming deadlines</div>
        {upcomingDeadlines.length === 0 ? (
          <EmptyState title="No upcoming deadlines" />
        ) : upcomingDeadlines.map((a) => (
          <div key={a.id} className="list-item">
            <div style={{ fontSize: 14, fontWeight: 500 }}>{a.title}</div>
            <div className="meta">{formatDate(a.deadline)}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
