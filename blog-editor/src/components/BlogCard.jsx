import { Link } from 'react-router-dom';
import '../styles/home.css';

export default function BlogCard({ blog }) {
  const excerpt = blog.html
    ? blog.html.replace(/<[^>]+>/g, '').substring(0, 150) + '...'
    : 'No content available...';

  return (
    <Link to={`/blog/${blog.id}`} className="blog-card">
      {blog.coverImage && (
        <div className="card-image">
          <img src={blog.coverImage} alt={blog.title} />
        </div>
      )}
      <div className="card-body">
        {blog.category && <span className="card-category">{blog.category}</span>}
        <h3 className="card-title">{blog.title}</h3>
        <p className="card-excerpt">{excerpt}</p>
        <div className="card-meta">
          <div className="card-author">
            <div className="card-avatar">
              {blog.author?.name?.charAt(0)?.toUpperCase() || 'A'}
            </div>
            <span>{blog.author?.name || 'Anonymous'}</span>
          </div>
          <span className="card-date">
            {new Date(blog.createdAt).toLocaleDateString('en-US', {
              month: 'short',
              day: 'numeric',
              year: 'numeric',
            })}
          </span>
        </div>
      </div>
    </Link>
  );
}
