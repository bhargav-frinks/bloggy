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
  const [category, setCategory] = useState('');
  
  // File objects for uploading
  const [coverImageFile, setCoverImageFile] = useState(null);
  // Temporary URL for previewing before upload
  const [coverImagePreview, setCoverImagePreview] = useState('');
  
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
      
      // Store the content logic
      formData.append('contentJson', JSON.stringify(content.json));
      formData.append('contentHtml', content.html);

      // Append author information
      if (user) {
         formData.append('authorId', user.id || '');
         formData.append('authorName', user.name || '');
      }

      // Append cover image
      if (coverImageFile) {
        formData.append('coverImage', coverImageFile);
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
      
      // Assume the backend returns the saved blog id
      const newBlogId = response?.data?.id || Date.now().toString();

      // OPTIONAL: Local fallback for dev if no backend is running
      // const existing = JSON.parse(localStorage.getItem('blogs') || '[]');
      // existing.push({...});
      // localStorage.setItem('blogs', JSON.stringify(existing));

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
            <div className="meta-input-group">
              <FiImage className="meta-icon" />
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
                   padding: '12px 12px 12px 38px', // match existing input padding
                }}
              />
            </div>
          </div>

          {coverImagePreview && (
            <div className="cover-preview">
              <img src={coverImagePreview} alt="Cover preview" style={{ objectFit: 'contain' }} />
            </div>
          )}
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
