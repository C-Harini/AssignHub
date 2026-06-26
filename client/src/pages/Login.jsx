import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext.jsx';

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [role, setRole] = useState('student');
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');

  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      const u = await login({ ...form, role });
      navigate(u.role === 'admin' ? '/admin/dashboard' : '/student/dashboard', { replace: true });
    } catch (err) {
      setError(err.message || 'Login failed.');
    }
  };

  return (
    <div className="auth-wrap">
      <form className="card auth-card" onSubmit={handleSubmit}>
        <div className="auth-header">
          <div className="logo">📋</div>
          <div className="title">AssignHub</div>
          <div className="sub">Assignment management platform</div>
        </div>

        <div className="role-toggle">
          <button type="button" className={role === 'student' ? 'active' : 'idle'} onClick={() => setRole('student')}>Student</button>
          <button type="button" className={role === 'admin' ? 'active' : 'idle'} onClick={() => setRole('admin')}>Admin</button>
        </div>

        {error && <div className="alert alert-error">{error}</div>}

        <div className="form-group">
          <label className="form-label">Email</label>
          <input
            type="email"
            placeholder={role === 'admin' ? 'admin@assignhub.com' : 'student@mail.com'}
            value={form.email}
            onChange={e => set('email', e.target.value)}
          />
        </div>
        <div className="form-group">
          <label className="form-label">Password</label>
          <input
            type="password"
            placeholder={role === 'admin' ? 'admin123' : 'pass123'}
            value={form.password}
            onChange={e => set('password', e.target.value)}
          />
        </div>

        <button type="submit" className="btn-primary" style={{ width: '100%', marginTop: 4 }}>Sign in</button>

        {role === 'student' && (
          <p style={{ textAlign: 'center', fontSize: 13, marginTop: 16, color: 'var(--color-text-secondary)' }}>
            No account? <Link to="/register" className="link">Register here</Link>
          </p>
        )}
      </form>
    </div>
  );
}
