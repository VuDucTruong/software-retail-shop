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
import Youtube from '@tiptap/extension-youtube';
import Image from "@tiptap/extension-image";
import "./rich_text.css"
import { Skeleton } from "../ui/skeleton";
import Code from "@tiptap/extension-code";





interface RichTextEditorProps {
  content: string;
  onChange: (content: string) => void;
}
export default function RichTextEditor({
  content,
  onChange,
}: RichTextEditorProps) {
  const [mounted, setMounted] = React.useState(false);
  React.useEffect(() => {
    setMounted(true);
  }, []);

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
        openOnClick: true,
        autolink: true,
        defaultProtocol: 'https',
        protocols: ['http', 'https'],
        linkOnPaste: true,
        HTMLAttributes: {
          class: "text-blue-500 underline cursor-pointer hover:text-blue-700",
        }
      }),
      Table.configure({
        resizable: true,
      }),
      TableRow,
      TableHeader,
      TableCell,
      Youtube.configure({
        HTMLAttributes: {
          class: "w-3/4 aspect-video mx-auto",
        }
      }),
      Image.configure({
        allowBase64: true,
      }),
      Code
    ],
    content: content,
    editorProps: {
      attributes: {
        class: "min-h-[400px] border rounded-md bg-slate-50 py-2 px-3",
      },
    },
    onBlur: ({ editor }) => {
      if (editor.isEmpty) {
        {
          onChange("");
        }
      } else {
        onChange(editor.getHTML());
      }
    },
    immediatelyRender: false,

  });
  React.useEffect(() => {
    if (editor && content !== editor.getHTML()) {
      editor.commands.setContent(content, false);
    }
  }, [content, editor]);

  if (!mounted) {
    return <Skeleton className="h-40 w-full" />;
  }


  return (
    <div>
      <MenuBar editor={editor} />
      <EditorContent editor={editor} />
    </div>
  );
}
