"use client";

import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Link from "@tiptap/extension-link";
import { useEffect, useRef } from "react";

type EditorComponentProps = {
  initialContent: string;
  onUpdate: (content: string) => void;
};

const EditorComponent: React.FC<EditorComponentProps> = ({
  initialContent,
  onUpdate,
}) => {
  const isInitialContentSet = useRef(false);

  const editor = useEditor({
    extensions: [StarterKit, Link],
    content: initialContent,
    onUpdate: ({ editor }) => {
      onUpdate(editor.getHTML());
    },
    immediatelyRender: false,
    editorProps: {
      attributes: {
        class: "prose prose-sm focus:outline-none w-full min-h-[150px] p-2",
      },
    },
  });

  useEffect(() => {
    if (editor && initialContent && !isInitialContentSet.current) {
      editor.commands.setContent(initialContent);
      isInitialContentSet.current = true;
    }
  }, [editor, initialContent]);

  // Reset the ref when initialContent changes from non-empty to empty
  useEffect(() => {
    if (!initialContent) {
      isInitialContentSet.current = false;
    }
  }, [initialContent]);

  if (!editor) return null;

  return (
    <div className="border border-gray-300 rounded min-h-[200px] focus-within:border-blue-500 transition-colors">
      <div className="flex gap-1 p-2 border-b border-gray-200 bg-gray-50">
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleBold().run()}
          className={`px-3 py-1 text-sm border rounded hover:bg-gray-100 transition-colors ${
            editor.isActive("bold") ? "bg-gray-200 font-bold" : ""
          }`}
        >
          B
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleItalic().run()}
          className={`px-3 py-1 text-sm border rounded hover:bg-gray-100 transition-colors italic ${
            editor.isActive("italic") ? "bg-gray-200" : ""
          }`}
        >
          I
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleStrike().run()}
          className={`px-3 py-1 text-sm border rounded hover:bg-gray-100 transition-colors ${
            editor.isActive("strike") ? "bg-gray-200 line-through" : ""
          }`}
        >
          S
        </button>
      </div>

      <div className="p-2">
        <EditorContent
          editor={editor}
          className="focus:outline-none w-full min-h-[150px]"
        />
      </div>
    </div>
  );
};

export default EditorComponent;
