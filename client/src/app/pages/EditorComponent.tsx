"use client";

import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Link from "@tiptap/extension-link";
import { useEffect } from "react";

type EditorComponentProps = {
  initialContent: string;
  onUpdate: (content: string) => void;
};

const EditorComponent: React.FC<EditorComponentProps> = ({
  initialContent,
  onUpdate,
}) => {
  const editor = useEditor({
    extensions: [StarterKit, Link],
    content: initialContent,
    onUpdate: ({ editor }) => {
      onUpdate(editor.getHTML());
    },
    immediatelyRender: false,
  });

  useEffect(() => {
    if (editor && initialContent) {
      editor.commands.setContent(initialContent);
    }
  }, [editor, initialContent]);

  if (!editor) return null;

  return (
    <div className="border rounded p-2 min-h-[200px]">
      <div className="flex gap-2 mb-2">
        <button
          onClick={() => editor.chain().focus().toggleBold().run()}
          className="px-2 py-1 border rounded"
        >
          B
        </button>
        <button
          onClick={() => editor.chain().focus().toggleItalic().run()}
          className="px-2 py-1 border rounded"
        >
          I
        </button>
        <button
          onClick={() => editor.chain().focus().toggleUnderline().run()}
          className="px-2 py-1 border rounded"
        >
          U
        </button>
        {/* <button
          onClick={() => editor.chain().focus().toggleBulletList().run()}
          className="px-2 py-1 border rounded"
        >
          *
        </button> */}
        {/* <button
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
          className="px-2 py-1 border rounded"
        >
          123
        </button> */}
      </div>

      <EditorContent
        editor={editor}
        className="prose prose-sm focus:outline-none w-full"
      />
    </div>
  );
};

export default EditorComponent;
