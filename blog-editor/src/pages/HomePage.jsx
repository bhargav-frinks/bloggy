import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import BlogCard from '../components/BlogCard';
import { FiEdit3, FiBookOpen } from 'react-icons/fi';
import '../styles/home.css';

export default function HomePage() {
  const { isAuthenticated } = useAuth();
  const [blogs, setBlogs] = useState([]);

  useEffect(() => {
    // TODO: Replace with API call
    // const res = await axios.get('/api/blogs');
    const stored = JSON.parse(localStorage.getItem('blogs') || '[]');
    setBlogs(stored.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)));
  }, []);

  return (
    <div className="home-page">
      <section className="hero-section">
        <div className="hero-content">
          <h1 className="hero-title">
            Frinks <span className="hero-highlight">Blog Admin</span>
          </h1>
          <p className="hero-subtitle">
            Create, manage, and publish articles for the Frinks website.
          </p>
          {isAuthenticated ? (
            <Link to="/write" className="hero-cta">
              <FiEdit3 />
              <span>Write a Story</span>
            </Link>
          ) : (
            <Link to="/login" className="hero-cta">
              <span>Get Started</span>
            </Link>
          )}
        </div>
        <div className="hero-decoration">
          <div className="hero-shape hero-shape-1" />
          <div className="hero-shape hero-shape-2" />
          <div className="hero-shape hero-shape-3" />
        </div>
      </section>

      <section className="blogs-section">
        <div className="section-header">
          <h2>
            <FiBookOpen className="section-icon" />
            Latest Stories
          </h2>
        </div>

        {blogs.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon">📝</div>
            <h3>No blogs yet</h3>
            <p>Create a new blog post to display on the company website.</p>
            {isAuthenticated && (
              <Link to="/write" className="empty-cta">Create first blog</Link>
            )}
          </div>
        ) : (
          <div className="blogs-grid">
            {blogs.map((blog) => (
              <BlogCard key={blog.id} blog={blog} />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
