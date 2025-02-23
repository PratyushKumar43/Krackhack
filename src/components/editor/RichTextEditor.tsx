'use client';

import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Image from '@tiptap/extension-image';
import {
  Bold,
  Italic,
  Heading2,
  List,
  ListOrdered,
  Quote,
  Undo,
  Redo,
  AlignLeft,
  AlignCenter,
  AlignRight,
} from 'lucide-react';

interface RichTextEditorProps {
  content: string;
  onChange: (content: string) => void;
}

const MenuButton = ({ 
  onClick, 
  isActive = false, 
  disabled = false,
  children 
}: { 
  onClick: () => void; 
  isActive?: boolean; 
  disabled?: boolean;
  children: React.ReactNode;
}) => (
  <button
    onClick={onClick}
    disabled={disabled}
    className={`p-2 rounded hover:bg-memovault-peach/20 transition-colors ${
      isActive ? 'bg-memovault-salmon text-white hover:bg-memovault-salmon/90' : 
      disabled ? 'opacity-50 cursor-not-allowed' : ''
    }`}
  >
    {children}
  </button>
);

const RichTextEditor = ({ content, onChange }: RichTextEditorProps) => {
  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: {
          levels: [1, 2, 3]
        }
      }),
      Image
    ],
    content,
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
    editorProps: {
      attributes: {
        class: 'prose max-w-none focus:outline-none min-h-[300px] px-6 py-4'
      }
    }
  });

  if (!editor) {
    return null;
  }

  const toolbarItems = [
    {
      icon: <Bold size={18} />,
      title: 'Bold (Ctrl+B)',
      action: () => editor.chain().focus().toggleBold().run(),
      isActive: () => editor.isActive('bold')
    },
    {
      icon: <Italic size={18} />,
      title: 'Italic (Ctrl+I)',
      action: () => editor.chain().focus().toggleItalic().run(),
      isActive: () => editor.isActive('italic')
    },
    {
      icon: <Heading2 size={18} />,
      title: 'Heading',
      action: () => editor.chain().focus().toggleHeading({ level: 2 }).run(),
      isActive: () => editor.isActive('heading', { level: 2 })
    },
    {
      type: 'divider'
    },
    {
      icon: <List size={18} />,
      title: 'Bullet List',
      action: () => editor.chain().focus().toggleBulletList().run(),
      isActive: () => editor.isActive('bulletList')
    },
    {
      icon: <ListOrdered size={18} />,
      title: 'Numbered List',
      action: () => editor.chain().focus().toggleOrderedList().run(),
      isActive: () => editor.isActive('orderedList')
    },
    {
      icon: <Quote size={18} />,
      title: 'Blockquote',
      action: () => editor.chain().focus().toggleBlockquote().run(),
      isActive: () => editor.isActive('blockquote')
    },
    {
      type: 'divider'
    },
    {
      icon: <AlignLeft size={18} />,
      title: 'Align Left',
      action: () => editor.chain().focus().setTextAlign('left').run(),
      isActive: () => editor.isActive({ textAlign: 'left' })
    },
    {
      icon: <AlignCenter size={18} />,
      title: 'Align Center',
      action: () => editor.chain().focus().setTextAlign('center').run(),
      isActive: () => editor.isActive({ textAlign: 'center' })
    },
    {
      icon: <AlignRight size={18} />,
      title: 'Align Right',
      action: () => editor.chain().focus().setTextAlign('right').run(),
      isActive: () => editor.isActive({ textAlign: 'right' })
    },
    {
      type: 'divider'
    },
    {
      icon: <Undo size={18} />,
      title: 'Undo',
      action: () => editor.chain().focus().undo().run(),
      disabled: () => !editor.can().undo()
    },
    {
      icon: <Redo size={18} />,
      title: 'Redo',
      action: () => editor.chain().focus().redo().run(),
      disabled: () => !editor.can().redo()
    }
  ];

  return (
    <div className="border border-memovault-salmon rounded-lg overflow-hidden bg-white">
      <div className="border-b border-memovault-salmon p-2 flex flex-wrap gap-1 bg-memovault-peach/5">
        {toolbarItems.map((item, index) => {
          if (item.type === 'divider') {
            return (
              <div
                key={`divider-${index}`}
                className="w-px h-6 bg-memovault-salmon/20 mx-1 self-center"
              />
            );
          }

          return (
            <MenuButton
              key={item.title}
              onClick={item.action}
              isActive={item.isActive?.()}
              disabled={item.disabled?.()}
            >
              <span className="sr-only">{item.title}</span>
              {item.icon}
            </MenuButton>
          );
        })}
      </div>
      <EditorContent editor={editor} />
    </div>
  );
};

export default RichTextEditor;
