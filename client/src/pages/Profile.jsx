import Layout from '../components/Layout/Layout.jsx';
import { useAuth } from '../contexts/AuthContext.jsx';
import { formatDate } from '../components/Common/AssignmentCard.jsx';

export default function Profile() {
  const { user } = useAuth();
  if (!user) return null;
  return (
    <Layout title="Profile">
      <div className="card">
        <div className="section-title">Profile</div>
        <div className="form-group"><label className="form-label">Name</label><div>{user.name}</div></div>
        <div className="form-group"><label className="form-label">Email</label><div>{user.email}</div></div>
        {user.rollNumber && <div className="form-group"><label className="form-label">Roll Number</label><div>{user.rollNumber}</div></div>}
        <div className="form-group"><label className="form-label">Role</label><div style={{ textTransform: 'capitalize' }}>{user.role}</div></div>
        {user.status && (
          <div className="form-group">
            <label className="form-label">Status</label>
            <div><span className={`badge badge-${user.status}`}>{user.status}</span></div>
          </div>
        )}
        {user.createdAt && (
          <div className="form-group"><label className="form-label">Joined</label><div>{formatDate(user.createdAt)}</div></div>
        )}
      </div>
    </Layout>
  );
}
