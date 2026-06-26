import { Link } from 'react-router-dom';

export default function Unauthorized() {
  return (
    <div className="page" style={{ textAlign: 'center', paddingTop: '4rem' }}>
      <div style={{ fontSize: 64, fontWeight: 600, color: '#A32D2D' }}>403</div>
      <div style={{ fontSize: 18, fontWeight: 500, marginTop: 8 }}>Unauthorized</div>
      <div className="meta" style={{ marginTop: 6 }}>You don’t have permission to view this page.</div>
      <Link to="/" style={{ display: 'inline-block', marginTop: 16 }}>
        <button className="btn-primary">Go home</button>
      </Link>
    </div>
  );
}
