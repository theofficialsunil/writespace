// @/components/editor/tiptap-editor.tsx
"use client";

import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Underline from "@tiptap/extension-underline";
import Link from "@tiptap/extension-link";
import Placeholder from "@tiptap/extension-placeholder";
import CodeBlockLowlight from "@tiptap/extension-code-block-lowlight";
import Typography from "@tiptap/extension-typography";
import BubbleMenuExtension from "@tiptap/extension-bubble-menu"; 
import { common, createLowlight } from "lowlight";
import { useState, useEffect } from "react";

import { EditorToolbar } from "@/components/editor/editor-toolbar";
import { InlineBubbleMenu } from "@/components/editor/inline-bubble-menu";

const lowlight = createLowlight(common);

interface TiptapEditorProps {
  name: string;
  initialContent?: string;
}

export function TiptapEditor({ name, initialContent = "" }: TiptapEditorProps) {
  const [html, setHtml] = useState(initialContent);

  const editor = useEditor({
    immediatelyRender: false,
    extensions: [
      StarterKit.configure({
        heading: { levels: [1, 2, 3] },
        codeBlock: false,
      }),
      Underline,
      Typography,
      // FIX: Configure layout animation logic inside the extension parameters safely
      BubbleMenuExtension.configure({
        pluginKey: "inlineBubbleMenu",
      }),
      CodeBlockLowlight.configure({
        lowlight,
        HTMLAttributes: {
          class: "rounded-lg bg-muted p-4 font-mono text-sm overflow-x-auto my-4",
        },
      }),
      Link.configure({
        openOnClick: false,
        autolink: true,
        defaultProtocol: "https",
        HTMLAttributes: {
          class: "text-primary underline underline-offset-4 cursor-pointer",
        },
      }),
      Placeholder.configure({
        placeholder: "Highlight your text to access quick formatting options...",
      }),
    ],
    content: initialContent,
    editorProps: {
      attributes: {
        class: "prose prose-stone dark:prose-invert max-w-none min-h-[420px] px-6 py-5 outline-none text-base leading-8 transition-all",
      },
      transformPastedHTML(html) {
        return html
          .replace(/<span[^>]*style="[^"]*font-weight:\s*700[^"]*"[^>]*>(.*?)<\/span>/gi, "<strong>$1</strong>")
          .replace(/<span[^>]*style="[^"]*font-style:\s*italic[^"]*"[^>]*>(.*?)<\/span>/gi, "<em>$1</em>");
      },
    },
    onUpdate({ editor }) {
      setHtml(editor.getHTML());
    },
  });

  useEffect(() => {
    if (editor && initialContent !== editor.getHTML()) {
      editor.commands.setContent(initialContent);
    }
  }, [initialContent, editor]);

  return (
    <div className="relative overflow-hidden rounded-xl border bg-background shadow-sm focus-within:ring-1 focus-within:ring-ring">
      <div className="sticky top-0 z-10 border-b bg-background/95 backdrop-blur">
        <EditorToolbar editor={editor} />
      </div>

      {editor && <InlineBubbleMenu editor={editor} />}

      <EditorContent editor={editor} />

      <input type="hidden" name={name} value={html} />
    </div>
  );
}