import { useEffect, useState } from 'react';
import { getStudentDashboard } from '../../services/api.js';
import StatCard from '../Common/StatCard.jsx';
import Spinner from '../Common/Spinner.jsx';
import EmptyState from '../Common/EmptyState.jsx';
import { formatDate } from '../Common/AssignmentCard.jsx';

export default function StudentOverview() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let alive = true;
    getStudentDashboard()
      .then((d) => alive && setData(d))
      .finally(() => alive && setLoading(false));
    return () => { alive = false; };
  }, []);

  if (loading) return <Spinner />;
  if (!data) return <EmptyState title="Could not load dashboard" />;

  const { cards, upcomingDeadlines, recentSubmissions } = data;

  return (
    <div>
      <div className="stats-grid">
        <StatCard label="Total assignments" value={cards.totalAssignments} />
        <StatCard label="Completed" value={cards.completed} accent="#3B6D11" />
        <StatCard label="Pending" value={cards.pending} accent="#854F0B" />
        <StatCard label="Missed" value={cards.missed} accent="#A32D2D" />
      </div>

      <div className="grid-2" style={{ marginTop: '1rem' }}>
        <div className="card">
          <div className="section-title">Upcoming deadlines</div>
          {upcomingDeadlines.length === 0 ? (
            <EmptyState title="No upcoming deadlines" />
          ) : upcomingDeadlines.map((a) => (
            <div key={a.id} className="list-item">
              <div>
                <div style={{ fontSize: 14, fontWeight: 500 }}>{a.title}</div>
                <div className="meta">{formatDate(a.deadline)}</div>
              </div>
              <span className="badge badge-pending">Pending</span>
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
                <div style={{ fontSize: 14, fontWeight: 500 }}>{s.assignmentTitle}</div>
                <div className="meta">{formatDate(s.submittedAt)}</div>
              </div>
              <span className={`badge ${s.late ? 'badge-missed' : 'badge-submitted'}`}>
                {s.late ? 'Late' : 'On time'}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
