import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { useAuth } from '../contexts/AuthContext.jsx';

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: '', password: '', role: 'student' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const set = (k, v) => setForm((f) => ({ ...f, [k]: v }));

  const submit = async (e) => {
    e.preventDefault();
    if (!form.email || !form.password) return setError('Email and password are required.');
    setError(''); setLoading(true);
    try {
      const u = await login(form);
      toast.success(`Welcome back, ${u.name}`);
      navigate(u.role === 'admin' ? '/admin/dashboard' : '/student/dashboard', { replace: true });
    } catch (err) {
      setError(err.message);
    } finally { setLoading(false); }
  };

  return (
    <div className="page" style={{ maxWidth: 420, marginTop: '4rem' }}>
      <div className="card">
        <div className="section-title">Sign in to AssignHub</div>
        <form onSubmit={submit}>
          {error && <div className="alert alert-error">{error}</div>}
          <div className="form-group">
            <label className="form-label">I am a</label>
            <select value={form.role} onChange={(e) => set('role', e.target.value)}>
              <option value="student">Student</option>
              <option value="admin">Admin</option>
            </select>
          </div>
          <div className="form-group">
            <label className="form-label">Email</label>
            <input type="email" value={form.email} onChange={(e) => set('email', e.target.value)} autoComplete="email" />
          </div>
          <div className="form-group">
            <label className="form-label">Password</label>
            <input type="password" value={form.password} onChange={(e) => set('password', e.target.value)} autoComplete="current-password" />
          </div>
          <button type="submit" className="btn-primary" disabled={loading} style={{ width: '100%' }}>
            {loading ? 'Signing in…' : 'Sign in'}
          </button>
        </form>
        <div className="meta" style={{ marginTop: 12, textAlign: 'center' }}>
          New student? <Link to="/register">Create an account</Link>
        </div>
      </div>
    </div>
  );
}
