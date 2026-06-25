import Navbar from './Navbar.jsx';

export default function Layout({ children }) {
  return (
    <div>
      <Navbar />
      <div className="page">{children}</div>
    </div>
  );
}
