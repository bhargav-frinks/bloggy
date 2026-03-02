import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import TiptapEditor from '../components/TiptapEditor';
import { FiImage, FiSend, FiTag } from 'react-icons/fi';
import { uploadMediaForEditor } from '../shared/utils/uploadMedia';
import axios from 'axios';
import '../styles/editor.css';
import { getCDNUrl } from "../utils/cdn";

export default function BlogEditorPage() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [title, setTitle] = useState('');
  const [name, setName] = useState('');
  const [pathName, setPathName] = useState('');
  const [category, setCategory] = useState('');
  const [shortDescription, setShortDescription] = useState('');
  
  // S3 URLs for uploaded images
  const [coverImageUrl, setCoverImageUrl] = useState('');
  const [coverImageUploading, setCoverImageUploading] = useState(false);
  const [coverImageFileName, setCoverImageFileName] = useState('');
  
  const [authorImageUrl, setAuthorImageUrl] = useState('');
  const [authorImageUploading, setAuthorImageUploading] = useState(false);
  const [authorImageFileName, setAuthorImageFileName] = useState('');
  
  const [content, setContent] = useState({ json: null, html: '' });
  
  const [publishing, setPublishing] = useState(false);

  const handleCoverImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    try {
      setCoverImageUploading(true);
      const s3Url = await uploadMediaForEditor(file);
      setCoverImageUrl(s3Url);
      setCoverImageFileName(file.name);
    } catch (err) {
      console.error('Cover image upload failed:', err);
      alert('Failed to upload cover image. Please try again.');
    } finally {
      setCoverImageUploading(false);
    }
  };

  const handleAuthorImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    try {
      setAuthorImageUploading(true);
      const s3Url = await uploadMediaForEditor(file);
      setAuthorImageUrl(s3Url);
      setAuthorImageFileName(file.name);
    } catch (err) {
      console.error('Author image upload failed:', err);
      alert('Failed to upload author image. Please try again.');
    } finally {
      setAuthorImageUploading(false);
    }
  };

  const handlePublish = async () => {
    if (!title.trim()) {
      alert('Please add a title for your blog');
      return;
    }
    if (!content.html || content.html === '<p></p>') {
      alert('Please add some content to your blog');
      return;
    }

    setPublishing(true);
    try {
      const formData = new FormData();
      formData.append('title', title.trim());
      formData.append('category', category.trim() || 'General');

      formData.append('pathName', pathName.trim());
      formData.append('shortDescription', shortDescription.trim());
      
      // Store the content (images inside are already S3 URLs)
      formData.append('contentJson', JSON.stringify(content.json));
      formData.append('contentHtml', content.html);

      // Append author information
      if (name) {
         formData.append('authorName', name || '');
      }

      if (user) {
        formData.append('created_by', user.id);
      }

      // Helper to generate the CDN URL dynamically
      const parseCDNUrl = (urlStr) => {
        try {
          const parsedUrl = new URL(urlStr);
          const pathParts = parsedUrl.pathname.split('/').filter(Boolean);
          const fileName = pathParts.pop();
          const typePath = pathParts.join('/');
          return getCDNUrl(typePath, fileName);
        } catch(e) {
          return urlStr;
        }
      };

      // Send S3 URLs instead of raw files
      if (coverImageUrl) {
        formData.append('coverImageUrl', parseCDNUrl(coverImageUrl));
      }

      if (authorImageUrl) {
        formData.append('authorImageUrl', parseCDNUrl(authorImageUrl));
      }

      const baseURL = import.meta.env.VITE_BASE_API_URL || 'http://localhost:9000/api';
      const token = localStorage.getItem('blog_token');

      const response = await axios.post(`${baseURL}/new-blog/create`, formData, {
         headers: {
           'Content-Type': 'multipart/form-data',
           ...(token ? { Authorization: `Bearer ${token}` } : {})
         }
      });
      
      const newBlogId = response?.data?.id || Date.now().toString();

      navigate(`/blog/${newBlogId}`);
    } catch (err) {
      console.error(err);
      alert('Failed to publish. Please check your connection or try again.');
    } finally {
      setPublishing(false);
    }
  };

  return (
    <div className="editor-page">
      <div className="editor-page-container">
        <div className="editor-meta">
          <input
            type="text"
            className="editor-title-input"
            placeholder="Your story title..."
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />

          <div className="editor-meta-row">
            <div className="meta-input-group">
              <FiTag className="meta-icon" />
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
              >
                <option value="" disabled>Select Category</option>
                <option value="Blog">Blog</option>
                <option value="Case Studies">Case Studies</option>
                <option value="Press Release">Press Release</option>
                <option value="News">News</option>
              </select>
            </div>
            <div className="meta-input-group" style={{ position: 'relative' }}>
              <FiImage className="meta-icon" />
              <div style={{
                  width: '100%',
                  padding: '12px 12px 12px 38px',
                  border: '1.5px solid var(--color-border)',
                  borderRadius: 'var(--radius-md)',
                  fontSize: '0.9rem',
                  background: 'var(--color-bg-white)',
                  color: coverImageUrl ? 'var(--color-text)' : 'var(--color-text-light)',
                  whiteSpace: 'nowrap',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis'
              }}>
                 {coverImageUploading ? 'Uploading...' : coverImageUrl ? (coverImageFileName || 'Cover Image Uploaded ✓') : 'Upload Cover Image'}
              </div>
              <input
                type="file"
                accept="image/*"
                onChange={handleCoverImageUpload}
                disabled={coverImageUploading}
                style={{
                   position: 'absolute',
                   top: 0,
                   left: 0,
                   width: '100%',
                   height: '100%',
                   opacity: 0,
                   cursor: coverImageUploading ? 'wait' : 'pointer'
                }}
              />
            </div>
          </div>

          <div className="editor-meta-row">
            <div className="meta-input-group">
              <FiTag className="meta-icon" />
              <input
                type="name"
                placeholder="Author Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                autoComplete="name"
              />
            </div>
            <div className="meta-input-group" style={{ position: 'relative' }}>
              <FiImage className="meta-icon" />
              <div style={{
                  width: '100%',
                  padding: '12px 12px 12px 38px',
                  border: '1.5px solid var(--color-border)',
                  borderRadius: 'var(--radius-md)',
                  fontSize: '0.9rem',
                  background: 'var(--color-bg-white)',
                  color: authorImageUrl ? 'var(--color-text)' : 'var(--color-text-light)',
                  whiteSpace: 'nowrap',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis'
              }}>
                 {authorImageUploading ? 'Uploading...' : authorImageUrl ? (authorImageFileName || 'Author Image Uploaded ✓') : 'Upload Author Image'}
              </div>
              <input
                type="file"
                accept="image/*"
                onChange={handleAuthorImageUpload}
                disabled={authorImageUploading}
                style={{
                   position: 'absolute',
                   top: 0,
                   left: 0,
                   width: '100%',
                   height: '100%',
                   opacity: 0,
                   cursor: authorImageUploading ? 'wait' : 'pointer'
                }}
              />
            </div>
            
          </div>
          <div className="editor-meta-row">
            <div className="meta-input-group">
              <FiTag className="meta-icon" />
              <input
                type="name"
                placeholder="Path Name"
                value={pathName}
                onChange={(e) => setPathName(e.target.value)}
                autoComplete="pathName"
              />
            </div>
            <div className="meta-input-group" style={{ position: 'relative' }}>
              <FiTag className="meta-icon" />
              <input
                type="name"
                placeholder="Short Description"
                value={shortDescription}
                onChange={(e) => setShortDescription(e.target.value)}
                autoComplete="shortDescription"
              />
            </div>
            
          </div>

          <div className="previews-container" style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', marginTop: '1rem' }}>
            {coverImageUrl && (
              <div className="cover-preview" style={{ flex: 1, minWidth: '300px', margin: 0 }}>
                <p style={{ margin: '0 0 0.5rem 0', fontSize: '0.9rem', color: 'var(--color-text-light)' }}>Cover Image Preview</p>
                <img src={(() => {
                  try {
                    const parsedUrl = new URL(coverImageUrl);
                    const pathParts = parsedUrl.pathname.split('/').filter(Boolean);
                    const fileName = pathParts.pop();
                    const typePath = pathParts.join('/');
                    
                    return getCDNUrl(typePath, fileName);
                  } catch(e) { return coverImageUrl; }
                })()} alt="Cover preview" style={{ objectFit: 'contain', width: '100%', height: '100%', borderRadius: 'var(--radius-lg)' }} />
              </div>
            )}
            {authorImageUrl && (
              <div className="author-preview" style={{ flex: 0, minWidth: '100px', margin: 0 }}>
                <p style={{ margin: '0 0 0.5rem 0', fontSize: '0.9rem', color: 'var(--color-text-light)' }}>Author Image Preview</p>
                <img src={(() => {
                  try {
                    const parsedUrl = new URL(authorImageUrl);
                    const pathParts = parsedUrl.pathname.split('/').filter(Boolean);
                    const fileName = pathParts.pop();
                    const typePath = pathParts.join('/');
                    return getCDNUrl(typePath, fileName);
                  } catch(e) { return authorImageUrl; }
                })()} alt="Author preview" style={{ objectFit: 'contain', width: '100px', height: '100px', borderRadius: '50%' }} />
              </div>
            )}
          </div>
        </div>

        <TiptapEditor
          content="<p></p>"
          onUpdate={setContent}
        />

        <div className="editor-actions">
          <button
            className="publish-btn"
            onClick={handlePublish}
            disabled={publishing || coverImageUploading || authorImageUploading}
          >
            <FiSend />
            <span>{publishing ? 'Publishing...' : 'Publish Story'}</span>
          </button>
        </div>
      </div>
    </div>
  );
}

