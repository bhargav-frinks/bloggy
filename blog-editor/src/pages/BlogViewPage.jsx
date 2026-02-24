import { useState, useEffect, useMemo } from 'react';
import { useParams, Link } from 'react-router-dom';
import TableOfContents from '../components/TableOfContents';
import { FaLinkedinIn, FaFacebookF, FaInstagram, FaXTwitter } from 'react-icons/fa6';
import '../styles/blog-view.css';

export default function BlogViewPage() {
  const { id } = useParams();
  const [blog, setBlog] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // TODO: Replace with API call
    // const res = await axios.get(`/api/blogs/${id}`);
    const blogs = JSON.parse(localStorage.getItem('blogs') || '[]');
    const found = blogs.find((b) => b.id === id);
    setBlog(found || null);
    setLoading(false);
  }, [id]);

  // Add IDs to headings for TOC scroll
  const processedHtml = useMemo(() => {
    if (!blog?.html) return '';
    let headingIndex = 0;
    return blog.html.replace(/<(h[1-3])([^>]*)>/gi, (match, tag, attrs) => {
      return `<${tag}${attrs} id="heading-${headingIndex++}">`;
    });
  }, [blog]);

  if (loading) {
    return (
      <div className="blog-view-loading">
        <div className="loading-spinner" />
      </div>
    );
  }

  if (!blog) {
    return (
      <div className="blog-not-found">
        <h2>Blog not found</h2>
        <Link to="/">Go back home</Link>
      </div>
    );
  }

  return (
    <div className="blog-view-page">
      {/* Decorative curves */}
      <div className="decorative-curves">
        <svg viewBox="0 0 200 800" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M50 0 C 150 200, 0 400, 100 600 S 50 800, 100 800" stroke="#E84D30" strokeWidth="2" fill="none" opacity="0.3" />
          <path d="M80 0 C 180 200, 30 400, 130 600 S 80 800, 130 800" stroke="#F97316" strokeWidth="1.5" fill="none" opacity="0.2" />
        </svg>
      </div>

      {/* Breadcrumbs */}
      <div className="blog-breadcrumbs">
        <Link to="/">Article</Link>
        <span className="breadcrumb-sep">›</span>
        <span>{blog.category || 'General'}</span>
        <span className="breadcrumb-sep">›</span>
        <span className="breadcrumb-current">{blog.title}</span>
      </div>

      {/* Title */}
      <h1 className="blog-view-title">{blog.title}</h1>

      {/* Cover Image */}
      {blog.coverImage && (
        <div className="blog-cover-image">
          <img src={blog.coverImage} alt={blog.title} />
        </div>
      )}

      {/* Author Row */}
      <div className="blog-author-row">
        <div className="author-info">
          <div className="author-avatar-large">
            {blog.author?.name?.charAt(0)?.toUpperCase() || 'A'}
          </div>
          <div className="author-details">
            <span className="author-name">{blog.author?.name || 'Anonymous'}</span>
            <span className="author-date">
              Published{' '}
              {new Date(blog.createdAt).toLocaleDateString('en-US', {
                month: 'long',
                day: 'numeric',
                year: 'numeric',
              })}
            </span>
          </div>
        </div>
        <div className="social-icons">
          <a href="#" className="social-icon" title="LinkedIn"><FaLinkedinIn /></a>
          <a href="#" className="social-icon" title="Facebook"><FaFacebookF /></a>
          <a href="#" className="social-icon" title="Instagram"><FaInstagram /></a>
          <a href="#" className="social-icon" title="X"><FaXTwitter /></a>
        </div>
      </div>

      {/* Content with TOC */}
      <div className="blog-content-layout">
        <aside className="blog-sidebar">
          <TableOfContents content={blog.html} />
        </aside>
        <article
          className="blog-article-body"
          dangerouslySetInnerHTML={{ __html: processedHtml }}
        />
      </div>
    </div>
  );
}
