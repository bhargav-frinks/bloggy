import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { FiEdit3, FiLogOut, FiUser } from 'react-icons/fi';
import '../styles/navbar.css';

export default function Navbar() {
  const { user, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <Link to="/" className="navbar-brand">
          <span className="brand-icon">✦</span>
          <span className="brand-text">Frinks</span>
          <span className="brand-highlight">Admin</span>
        </Link>

        <div className="navbar-links">
          <Link to="/" className="nav-link">Home</Link>

          {isAuthenticated ? (
            <>
              <Link to="/write" className="nav-link write-btn">
                <FiEdit3 />
                <span>Write</span>
              </Link>
              <div className="nav-user">
                <div className="user-avatar">
                  <FiUser />
                </div>
                <span className="user-name">{user?.name}</span>
                <button onClick={handleLogout} className="logout-btn" title="Logout">
                  <FiLogOut />
                </button>
              </div>
            </>
          ) : (
            <div className="auth-buttons">
              <Link to="/login" className="nav-link login-link">Sign In</Link>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}
