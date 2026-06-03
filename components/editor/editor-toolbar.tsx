// @/components/editor/editor-toolbar.tsx
"use client";

import type { Editor } from "@tiptap/react";
import {
  Bold, Code, Heading1, Heading2, Heading3, Italic,
  LinkIcon, List, ListOrdered, Quote, Redo, Strikethrough,
  UnderlineIcon, Undo
} from "lucide-react";
import { Toggle } from "@/components/ui/toggle";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";

interface EditorToolbarProps {
  editor: Editor | null;
}

export function EditorToolbar({ editor }: EditorToolbarProps) {
  if (!editor) return null;

  const toggleActions = [
    { icon: Heading1, active: "heading", opt: { level: 1 }, cmd: () => editor.chain().focus().toggleHeading({ level: 1 }).run() },
    { icon: Heading2, active: "heading", opt: { level: 2 }, cmd: () => editor.chain().focus().toggleHeading({ level: 2 }).run() },
    { icon: Heading3, active: "heading", opt: { level: 3 }, cmd: () => editor.chain().focus().toggleHeading({ level: 3 }).run() },
    { icon: Bold, active: "bold", opt: {}, cmd: () => editor.chain().focus().toggleBold().run() },
    { icon: Italic, active: "italic", opt: {}, cmd: () => editor.chain().focus().toggleItalic().run() },
    { icon: UnderlineIcon, active: "underline", opt: {}, cmd: () => editor.chain().focus().toggleUnderline().run() },
    { icon: Strikethrough, active: "strike", opt: {}, cmd: () => editor.chain().focus().toggleStrike().run() },
    { icon: List, active: "bulletList", opt: {}, cmd: () => editor.chain().focus().toggleBulletList().run() },
    { icon: ListOrdered, active: "orderedList", opt: {}, cmd: () => editor.chain().focus().toggleOrderedList().run() },
    { icon: Quote, active: "blockquote", opt: {}, cmd: () => editor.chain().focus().toggleBlockquote().run() },
    { icon: Code, active: "codeBlock", opt: {}, cmd: () => editor.chain().focus().toggleCodeBlock().run() },
  ];

  return (
    <div className="flex flex-wrap items-center gap-1 bg-muted/30 p-2 backdrop-blur-sm">
      {toggleActions.map((item, idx) => {
        const Icon = item.icon;
        return (
          <Toggle
            key={idx}
            size="sm"
            pressed={editor.isActive(item.active, item.opt)}
            onPressedChange={item.cmd}
            className="data-[state=on]:bg-secondary data-[state=on]:text-secondary-foreground"
          >
            <Icon className="h-4 w-4" />
          </Toggle>
        );
      })}

      <Separator orientation="vertical" className="mx-1 h-6" />

      <Button
        type="button"
        size="sm"
        variant="ghost"
        onClick={() => editor.chain().focus().undo().run()}
        disabled={!editor.can().undo()}
      >
        <Undo className="h-4 w-4" />
      </Button>

      <Button
        type="button"
        size="sm"
        variant="ghost"
        onClick={() => editor.chain().focus().redo().run()}
        disabled={!editor.can().redo()}
      >
        <Redo className="h-4 w-4" />
      </Button>
    </div>
  );
}