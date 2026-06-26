import Navbar from './Navbar.jsx';

export default function Layout({ title, children }) {
  return (
    <div>
      <Navbar title={title} />
      <div className="page">{children}</div>
    </div>
  );
}
