"use client";

import React from "react";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Link from "@tiptap/extension-link";

const EditorComponent: React.FC<{ onUpdate: (html: string) => void; initialContent: string }> = ({ onUpdate, initialContent }) => {
  const editor = useEditor({
    extensions: [StarterKit, Link],
    content: initialContent,
    immediatelyRender: false,
    onUpdate: ({ editor }) => onUpdate(editor.getHTML()),
  });

  return editor ? <EditorContent editor={editor} /> : null;
};

export default EditorComponent;