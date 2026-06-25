import { useAuth } from '../../contexts/AuthContext.jsx';
import { useNavigate } from 'react-router-dom';

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login', { replace: true });
  };

  return (
    <div className="topbar">
      <div className="topbar-title">📋 AssignHub</div>
      <div className="topbar-right">
        <span>{user?.name || 'Guest'}</span>
        <button onClick={handleLogout} style={{ fontSize: 13, padding: '4px 10px' }}>
          Sign out
        </button>
      </div>
    </div>
  );
}
