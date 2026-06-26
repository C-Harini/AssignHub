import { Link } from 'react-router-dom';

export default function NotFound() {
  return (
    <div className="page" style={{ textAlign: 'center', paddingTop: '4rem' }}>
      <div style={{ fontSize: 64, fontWeight: 600, color: '#185FA5' }}>404</div>
      <div style={{ fontSize: 18, fontWeight: 500, marginTop: 8 }}>Page not found</div>
      <div className="meta" style={{ marginTop: 6 }}>The page you’re looking for doesn’t exist.</div>
      <Link to="/" style={{ display: 'inline-block', marginTop: 16 }}>
        <button className="btn-primary">Go home</button>
      </Link>
    </div>
  );
}
