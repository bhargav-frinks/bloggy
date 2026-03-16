import { useState, useRef } from 'react';
import {
  FiBold,
  FiItalic,
  FiUnderline,
  FiAlignLeft,
  FiAlignCenter,
  FiAlignRight,
  FiList,
  FiImage,
  FiVideo,
  FiCode,
  FiMinus,
  FiGrid
} from 'react-icons/fi';

import {
  LuHeading1,
  LuHeading2,
  LuHeading3,
  LuListOrdered,
  LuQuote,
  LuStrikethrough
} from 'react-icons/lu';

import { uploadMediaForEditor } from '../shared/utils/uploadMedia';
import { getCDNUrl } from '../utils/cdn';

import '../styles/editor.css';

export default function EditorToolbar({ editor }) {

  const imageInputRef = useRef(null);
  const videoInputRef = useRef(null);

  const [uploading, setUploading] = useState(false);

  if (!editor) return null;

  const handleImageUpload = async (e) => {

    const file = e.target.files?.[0];
    if (!file) return;

    try {

      setUploading(true);

      const s3Url = await uploadMediaForEditor(file);

      let finalUrl = s3Url;

      try {

        const parsedUrl = new URL(s3Url);

        const pathParts = parsedUrl.pathname
          .split('/')
          .filter(Boolean);

        const fileName = pathParts.pop();
        const typePath = pathParts.join('/');

        finalUrl = getCDNUrl(typePath, fileName);

      } catch (err) {

        finalUrl = s3Url;

      }

      editor.chain().focus().setImage({ src: finalUrl }).run();

    } catch (err) {

      console.error('Image upload failed:', err);
      alert('Failed to upload image');

    } finally {

      setUploading(false);

      if (imageInputRef.current) {
        imageInputRef.current.value = '';
      }

    }

  };


  const handleVideoUpload = async (e) => {

    const file = e.target.files?.[0];
    if (!file) return;

    try {

      setUploading(true);

      const s3Url = await uploadMediaForEditor(file);

      let finalUrl = s3Url;

      try {

        const parsedUrl = new URL(s3Url);

        const pathParts = parsedUrl.pathname
          .split('/')
          .filter(Boolean);

        const fileName = pathParts.pop();
        const typePath = pathParts.join('/');

        finalUrl = getCDNUrl(typePath, fileName);

      } catch {

        finalUrl = s3Url;

      }

      editor
        .chain()
        .focus()
        .insertContent({
          type: 'video',
          attrs: { src: finalUrl }
        })
        .run();

    } catch (err) {

      console.error('Video upload failed:', err);
      alert('Video upload failed');

    } finally {

      setUploading(false);

      if (videoInputRef.current) {
        videoInputRef.current.value = '';
      }

    }

  };


  const ToolBtn = ({ onClick, isActive, title, children }) => (

    <button
      type="button"
      onClick={onClick}
      title={title}
      className={`toolbar-btn ${isActive ? 'is-active' : ''}`}
    >
      {children}
    </button>

  );


  return (

    <div className="editor-toolbar">

      {/* TEXT FORMATTING */}

      <div className="toolbar-group">

        <ToolBtn
          onClick={() => editor.chain().focus().toggleBold().run()}
          isActive={editor.isActive('bold')}
          title="Bold"
        >
          <FiBold />
        </ToolBtn>

        <ToolBtn
          onClick={() => editor.chain().focus().toggleItalic().run()}
          isActive={editor.isActive('italic')}
          title="Italic"
        >
          <FiItalic />
        </ToolBtn>

        <ToolBtn
          onClick={() => editor.chain().focus().toggleUnderline().run()}
          isActive={editor.isActive('underline')}
          title="Underline"
        >
          <FiUnderline />
        </ToolBtn>

        <ToolBtn
          onClick={() => editor.chain().focus().toggleStrike().run()}
          isActive={editor.isActive('strike')}
          title="Strike"
        >
          <LuStrikethrough />
        </ToolBtn>

      </div>


      <div className="toolbar-divider" />


      {/* HEADINGS */}

      <div className="toolbar-group">

        <ToolBtn
          onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
          isActive={editor.isActive('heading', { level: 1 })}
          title="Heading 1"
        >
          <LuHeading1 />
        </ToolBtn>

        <ToolBtn
          onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
          isActive={editor.isActive('heading', { level: 2 })}
          title="Heading 2"
        >
          <LuHeading2 />
        </ToolBtn>

        <ToolBtn
          onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
          isActive={editor.isActive('heading', { level: 3 })}
          title="Heading 3"
        >
          <LuHeading3 />
        </ToolBtn>

      </div>


      <div className="toolbar-divider" />


      {/* LISTS */}

      <div className="toolbar-group">

        <ToolBtn
          onClick={() => editor.chain().focus().toggleBulletList().run()}
          isActive={editor.isActive('bulletList')}
          title="Bullet List"
        >
          <FiList />
        </ToolBtn>

        <ToolBtn
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
          isActive={editor.isActive('orderedList')}
          title="Ordered List"
        >
          <LuListOrdered />
        </ToolBtn>

        <ToolBtn
          onClick={() => editor.chain().focus().toggleBlockquote().run()}
          isActive={editor.isActive('blockquote')}
          title="Quote"
        >
          <LuQuote />
        </ToolBtn>

      </div>


      <div className="toolbar-divider" />


      {/* ALIGNMENT */}

      <div className="toolbar-group">

        <ToolBtn
          onClick={() => editor.chain().focus().setTextAlign('left').run()}
          isActive={editor.isActive({ textAlign: 'left' })}
          title="Align Left"
        >
          <FiAlignLeft />
        </ToolBtn>

        <ToolBtn
          onClick={() => editor.chain().focus().setTextAlign('center').run()}
          isActive={editor.isActive({ textAlign: 'center' })}
          title="Align Center"
        >
          <FiAlignCenter />
        </ToolBtn>

        <ToolBtn
          onClick={() => editor.chain().focus().setTextAlign('right').run()}
          isActive={editor.isActive({ textAlign: 'right' })}
          title="Align Right"
        >
          <FiAlignRight />
        </ToolBtn>

      </div>


      <div className="toolbar-divider" />


      {/* MEDIA + CODE + TABLE */}

      <div className="toolbar-group">

        <input
          type="file"
          accept="image/*"
          ref={imageInputRef}
          style={{ display: 'none' }}
          onChange={handleImageUpload}
        />

        <input
          type="file"
          accept="video/*"
          ref={videoInputRef}
          style={{ display: 'none' }}
          onChange={handleVideoUpload}
        />

        <ToolBtn
          onClick={() => imageInputRef.current?.click()}
          title="Insert Image"
        >
          <FiImage />
        </ToolBtn>

        <ToolBtn
          onClick={() => videoInputRef.current?.click()}
          title="Insert Video"
        >
          <FiVideo />
        </ToolBtn>

        <ToolBtn
          onClick={() => editor.chain().focus().toggleCodeBlock().run()}
          isActive={editor.isActive('codeBlock')}
          title="Code Block"
        >
          <FiCode />
        </ToolBtn>

        <ToolBtn
          onClick={() => editor.chain().focus().setHorizontalRule().run()}
          title="Horizontal Rule"
        >
          <FiMinus />
        </ToolBtn>

        <ToolBtn
          onClick={() =>
            editor
              .chain()
              .focus()
              .insertTable({
                rows: 3,
                cols: 3,
                withHeaderRow: true,
              })
              .run()
          }
          title="Insert Table"
        >
          <FiGrid />
        </ToolBtn>

      </div>

    </div>

  );

}