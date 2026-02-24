import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { FiMail, FiLock, FiArrowRight } from 'react-icons/fi';
import axios from 'axios';
import { setCookie } from '@/shared/hocs/withAuthenticated';
import '../styles/auth.css';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const from = location.state?.from?.pathname || '/';

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (!email || !password) {
      setError('Please fill in all fields');
      return;
    }
    setLoading(true);
    try {
      const res = await axios.post(`${import.meta.env.VITE_BASE_API_URL}/user/login`, { email, password });
      
      const token = res.data?.token || res.data?.data?.token;
      if (token) {
        setCookie(token);
      }
      
      const userData = res.data?.user || res.data?.data?.user || {
        id: Date.now(),
        name: email.split('@')[0],
        email
      };
      
      await login(userData);
      navigate(from, { replace: true });
    } catch (err) {
      console.error('Login error:', err);
      setError(err.response?.data?.message || err.response?.data?.data?.message || 'Invalid credentials. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-container">
        <div className="auth-left">
          <div className="auth-decoration">
            <div className="deco-circle deco-circle-1" />
            <div className="deco-circle deco-circle-2" />
            <div className="deco-circle deco-circle-3" />
          </div>
          <div className="auth-left-content">
            <h1>Welcome Back</h1>
            <p>Enter your ERP credentials to create a new blog</p>
          </div>
        </div>

        <div className="auth-right">
          <form className="auth-form" onSubmit={handleSubmit}>
            <div className="auth-header">
              <h2>Sign In</h2>
              <p>Enter your credentials to continue</p>
            </div>

            {error && <div className="auth-error">{error}</div>}

            <div className="input-group">
              <FiMail className="input-icon" />
              <input
                type="email"
                placeholder="Email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                autoComplete="email"
              />
            </div>

            <div className="input-group">
              <FiLock className="input-icon" />
              <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                autoComplete="current-password"
              />
            </div>

            <button type="submit" className="auth-submit" disabled={loading}>
              {loading ? 'Signing in...' : 'Sign In'}
              {!loading && <FiArrowRight />}
            </button>

          </form>
        </div>
      </div>
    </div>
  );
}
