import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { useAuth } from '../contexts/AuthContext.jsx';

const EMAIL_RX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export default function Register() {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: '', email: '', rollNumber: '', password: '', confirm: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const set = (k, v) => setForm((f) => ({ ...f, [k]: v }));

  const submit = async (e) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.rollNumber || !form.password) return setError('All fields are required.');
    if (!EMAIL_RX.test(form.email)) return setError('Please enter a valid email address.');
    if (form.password.length < 6) return setError('Password must be at least 6 characters.');
    if (form.password !== form.confirm) return setError('Passwords do not match.');
    setError(''); setLoading(true);
    try {
      await register(form);
      toast.success('Registration submitted — awaiting admin approval');
      navigate('/login', { replace: true });
    } catch (err) {
      setError(err.message);
    } finally { setLoading(false); }
  };

  return (
    <div className="page" style={{ maxWidth: 480, marginTop: '3rem' }}>
      <div className="card">
        <div className="section-title">Create student account</div>
        <form onSubmit={submit}>
          {error && <div className="alert alert-error">{error}</div>}
          <div className="form-group">
            <label className="form-label">Full name</label>
            <input value={form.name} onChange={(e) => set('name', e.target.value)} />
          </div>
          <div className="form-group">
            <label className="form-label">Email</label>
            <input type="email" value={form.email} onChange={(e) => set('email', e.target.value)} />
          </div>
          <div className="form-group">
            <label className="form-label">Roll number</label>
            <input value={form.rollNumber} onChange={(e) => set('rollNumber', e.target.value)} />
          </div>
          <div className="form-group">
            <label className="form-label">Password (min 6 chars)</label>
            <input type="password" value={form.password} onChange={(e) => set('password', e.target.value)} />
          </div>
          <div className="form-group">
            <label className="form-label">Confirm password</label>
            <input type="password" value={form.confirm} onChange={(e) => set('confirm', e.target.value)} />
          </div>
          <button type="submit" className="btn-primary" disabled={loading} style={{ width: '100%' }}>
            {loading ? 'Submitting…' : 'Register'}
          </button>
        </form>
        <div className="meta" style={{ marginTop: 12, textAlign: 'center' }}>
          Already registered? <Link to="/login">Sign in</Link>
        </div>
      </div>
    </div>
  );
}
