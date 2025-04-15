"use client";

import { EditorContent, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import React from "react";
import MenuBar from "./MenuBar";
import TextAlign from "@tiptap/extension-text-align";
import Highlight from "@tiptap/extension-highlight";
import Underline from "@tiptap/extension-underline";
import Link from "@tiptap/extension-link";
import Table from "@tiptap/extension-table";
import TableRow from "@tiptap/extension-table-row";
import TableHeader from "@tiptap/extension-table-header";
import TableCell from "@tiptap/extension-table-cell";
import "./rich_text.css"



interface RichTextEditorProps {
  content: string;
  onChange: (content: string) => void;
}
export default function RichTextEditor({
  content,
  onChange,
}: RichTextEditorProps) {

  const ref = React.useRef<HTMLDivElement>(null);
  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        bulletList: {
          HTMLAttributes: {
            class: "list-disc ml-3",
          },
        },
        orderedList: {
          HTMLAttributes: {
            class: "list-decimal ml-3",
          },
        },
      }),
      TextAlign.configure({
        types: ["heading", "paragraph"],
      }),
      Highlight,
      Underline,
      Link.configure({
        openOnClick: false,
        autolink: true,
        defaultProtocol: 'https',
        protocols: ['http', 'https'],
      }),
      Table.configure({
        resizable: true,
      }),
      TableRow,
      TableHeader,
      TableCell,
    ],
    content: content,
    editorProps: {
      attributes: {
        class: "min-h-[156px] border rounded-md bg-slate-50 py-2 px-3",
      },
    },
    onUpdate: ({ editor }) => {
      // console.log(editor.getHTML());
      onChange(editor.getHTML());
    },
  });
  
  return (
    <div>
      <MenuBar editor={editor} />
      <EditorContent ref={ref} editor={editor} />
    </div>
  );
}
