import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext.jsx';

export default function Navbar({ title }) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login', { replace: true });
  };

  return (
    <div className="topbar">
      <div className="topbar-title">
        <span style={{ width: 8, height: 8, background: '#185FA5', borderRadius: 2 }} />
        AssignHub {title && <span style={{ color: 'var(--color-text-secondary)', fontWeight: 400 }}> · {title}</span>}
      </div>
      <div className="topbar-right">
        {user && (
          <>
            <Link to="/profile" style={{ color: 'inherit', textDecoration: 'none' }}>
              {user.name} <span style={{ opacity: 0.6 }}>({user.role})</span>
            </Link>
            <button style={{ fontSize: 12, padding: '4px 10px' }} onClick={handleLogout}>Logout</button>
          </>
        )}
      </div>
    </div>
  );
}
