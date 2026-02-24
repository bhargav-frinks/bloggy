import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import TiptapEditor from '../components/TiptapEditor';
import { FiImage, FiSend, FiTag } from 'react-icons/fi';
import axios from 'axios';
import '../styles/editor.css';

export default function BlogEditorPage() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [title, setTitle] = useState('');
  const [name, setName] = useState('');
  const [pathName, setPathName] = useState('');
  const [category, setCategory] = useState('');
  const [shortDescription, setShortDescription] = useState('');
  
  // File objects for uploading
  const [coverImageFile, setCoverImageFile] = useState(null);
  const [coverImagePreview, setCoverImagePreview] = useState('');
  
  const [authorImageFile, setAuthorImageFile] = useState(null);
  
  const [content, setContent] = useState({ json: null, html: '' });
  // Store media files (images/videos) added inside the editor
  const [mediaFiles, setMediaFiles] = useState([]);
  
  const [publishing, setPublishing] = useState(false);

  const handleMediaAdd = (file, url) => {
    setMediaFiles(prev => [...prev, { file, url }]);
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
      
      // Store the content logic
      formData.append('contentJson', JSON.stringify(content.json));
      formData.append('contentHtml', content.html);

      // Append author information
      if (name) {
         formData.append('authorName', name || '');
      }

      if (user) {
        formData.append('created_by', user.id);
      }

      // Append cover image
      if (coverImageFile) {
        formData.append('coverImage', coverImageFile);
      }

      // Append author image
      if (authorImageFile) {
        formData.append('authorImage', authorImageFile);
      }

      // Append inside blog files
      // We pass the local blob URLs along with the files so the backend can map them in the content JSON/HTML.
      // E.g., appending 'mediaFiles' with specific filenames or mapping.
      mediaFiles.forEach((media, index) => {
        // Appending standard 'media' field with the file, you might also need 
        // to pass mapping data so the backend can replace `media.url` with the S3 url.
        formData.append('media', media.file);
        // We'll also send the temporary URL so the backend knows which file matches which URL in the HTML/JSON
        formData.append('media_mapping_urls', media.url); 
      });

      const baseURL = import.meta.env.VITE_BASE_API_URL || 'http://localhost:9000/api';
      const token = localStorage.getItem('blog_token');

      // Now send the complete blog to the single API
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
                  color: coverImageFile ? 'var(--color-text)' : 'var(--color-text-light)',
                  whiteSpace: 'nowrap',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis'
              }}>
                 {coverImageFile ? coverImageFile.name : "Upload Cover Image"}
              </div>
              <input
                type="file"
                accept="image/*"
                onChange={(e) => {
                  const file = e.target.files[0];
                  if (!file) return;
                  
                  setCoverImageFile(file);
                  setCoverImagePreview(URL.createObjectURL(file));
                }}
                style={{
                   position: 'absolute',
                   top: 0,
                   left: 0,
                   width: '100%',
                   height: '100%',
                   opacity: 0,
                   cursor: 'pointer'
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
                  color: authorImageFile ? 'var(--color-text)' : 'var(--color-text-light)',
                  whiteSpace: 'nowrap',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis'
              }}>
                 {authorImageFile ? authorImageFile.name : "Upload Author Image"}
              </div>
              <input
                type="file"
                accept="image/*"
                onChange={(e) => {
                  const file = e.target.files[0];
                  if (!file) return;
                  
                  setAuthorImageFile(file);
                }}
                style={{
                   position: 'absolute',
                   top: 0,
                   left: 0,
                   width: '100%',
                   height: '100%',
                   opacity: 0,
                   cursor: 'pointer'
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
            {coverImagePreview && (
              <div className="cover-preview" style={{ flex: 1, minWidth: '300px', margin: 0 }}>
                <p style={{ margin: '0 0 0.5rem 0', fontSize: '0.9rem', color: 'var(--color-text-light)' }}>Cover Image Preview</p>
                <img src={coverImagePreview} alt="Cover preview" style={{ objectFit: 'contain', width: '100%', height: '100%', borderRadius: 'var(--radius-lg)' }} />
              </div>
            )}
          </div>
        </div>

        <TiptapEditor
          content="<p></p>"
          onUpdate={setContent}
          onMediaAdd={handleMediaAdd}
        />

        <div className="editor-actions">
          <button
            className="publish-btn"
            onClick={handlePublish}
            disabled={publishing}
          >
            <FiSend />
            <span>{publishing ? 'Publishing...' : 'Publish Story'}</span>
          </button>
        </div>
      </div>
    </div>
  );
}
