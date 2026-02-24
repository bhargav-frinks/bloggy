import { useEditor, EditorContent, Node, mergeAttributes } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Image from '@tiptap/extension-image';
import Underline from '@tiptap/extension-underline';
import TextAlign from '@tiptap/extension-text-align';
import Placeholder from '@tiptap/extension-placeholder';
import EditorToolbar from './EditorToolbar';
import '../styles/editor.css';

const Video = Node.create({
  name: 'video',
  group: 'block',
  atom: true,

  addAttributes() {
    return {
      src: { default: null },
      controls: { default: true },
      width: { default: '100%' },
    };
  },

  parseHTML() {
    return [{ tag: 'video' }];
  },

  renderHTML({ HTMLAttributes }) {
    return ['video', mergeAttributes(HTMLAttributes, {
      controls: true,
      style: 'width: 100%; border-radius: 8px; margin: 1rem 0;',
    })];
  },
});

export default function TiptapEditor({ content, onUpdate, onMediaAdd, editable = true }) {
  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: { levels: [1, 2, 3] },
      }),
      Image.configure({
        inline: false,
        allowBase64: true,
      }),
      Video,
      Underline,
      TextAlign.configure({
        types: ['heading', 'paragraph'],
      }),
      Placeholder.configure({
        placeholder: 'Start writing your story...',
      }),
    ],
    content: content || '<p></p>',
    editable,
    onUpdate: ({ editor }) => {
      if (onUpdate) {
        onUpdate({
          json: editor.getJSON(),
          html: editor.getHTML(),
        });
      }
    },
  });

  console.log({ editor });

  return (
    <div className="tiptap-wrapper">
      {editable && <EditorToolbar editor={editor} onMediaAdd={onMediaAdd} />}
      <div className="tiptap-editor-container">
        <EditorContent editor={editor} />
      </div>
    </div>
  );
}
