import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext.jsx';

export default function Register() {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: '', email: '', rollNo: '', password: '' });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(''); setSuccess('');
    try {
      await register(form);
      setSuccess('Registration submitted! Wait for admin approval.');
      setForm({ name: '', email: '', rollNo: '', password: '' });
      setTimeout(() => navigate('/login'), 1500);
    } catch (err) {
      setError(err.message || 'Registration failed.');
    }
  };

  return (
    <div className="auth-wrap">
      <form className="card auth-card" onSubmit={handleSubmit}>
        <div className="auth-header">
          <div className="logo">📋</div>
          <div className="title">AssignHub</div>
          <div className="sub">Student registration</div>
        </div>

        {error && <div className="alert alert-error">{error}</div>}
        {success && <div className="alert alert-success">{success}</div>}

        <div className="form-group">
          <label className="form-label">Full name</label>
          <input value={form.name} onChange={e => set('name', e.target.value)} placeholder="Arun Kumar" />
        </div>
        <div className="form-group">
          <label className="form-label">Roll number</label>
          <input value={form.rollNo} onChange={e => set('rollNo', e.target.value)} placeholder="CS001" />
        </div>
        <div className="form-group">
          <label className="form-label">Email</label>
          <input type="email" value={form.email} onChange={e => set('email', e.target.value)} placeholder="you@mail.com" />
        </div>
        <div className="form-group">
          <label className="form-label">Password</label>
          <input type="password" value={form.password} onChange={e => set('password', e.target.value)} />
        </div>

        <button type="submit" className="btn-primary" style={{ width: '100%', marginTop: 4 }}>
          Submit registration
        </button>

        <p style={{ textAlign: 'center', fontSize: 13, marginTop: 16, color: 'var(--color-text-secondary)' }}>
          <Link to="/login" className="link">← Back to login</Link>
        </p>
      </form>
    </div>
  );
}
