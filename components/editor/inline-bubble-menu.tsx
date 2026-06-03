// @/components/editor/inline-bubble-menu.tsx
"use client";

import type { Editor } from "@tiptap/react";
import { BubbleMenu } from "@tiptap/react/menus"; 
import { Bold, Italic, UnderlineIcon, Strikethrough, LinkIcon } from "lucide-react";
import { Toggle } from "@/components/ui/toggle";

interface InlineBubbleMenuProps {
  editor: Editor;
}

export function InlineBubbleMenu({ editor }: InlineBubbleMenuProps) {
  function handleLinkPrompt() {
    const previousUrl = editor.getAttributes("link").href;
    const url = window.prompt("Enter URL", previousUrl);
    if (url === null) return;
    if (url === "") {
      editor.chain().focus().extendMarkRange("link").unsetLink().run();
      return;
    }
    editor.chain().focus().extendMarkRange("link").setLink({ href: url }).run();
  }

  return (
    <BubbleMenu
      editor={editor}
      className="flex items-center gap-1 rounded-lg border bg-popover p-1 shadow-lg backdrop-blur-md"
    >
      <Toggle
        size="sm"
        pressed={editor.isActive("bold")}
        onPressedChange={() => editor.chain().focus().toggleBold().run()}
      >
        <Bold className="h-4 w-4" />
      </Toggle>

      <Toggle
        size="sm"
        pressed={editor.isActive("italic")}
        onPressedChange={() => editor.chain().focus().toggleItalic().run()}
      >
        <Italic className="h-4 w-4" />
      </Toggle>

      <Toggle
        size="sm"
        pressed={editor.isActive("underline")}
        onPressedChange={() => editor.chain().focus().toggleUnderline().run()}
      >
        <UnderlineIcon className="h-4 w-4" />
      </Toggle>

      <Toggle
        size="sm"
        pressed={editor.isActive("strike")}
        onPressedChange={() => editor.chain().focus().toggleStrike().run()}
      >
        <Strikethrough className="h-4 w-4" />
      </Toggle>

      <div className="mx-1 h-4 w-[1px] bg-border" />

      <Toggle
        size="sm"
        pressed={editor.isActive("link")}
        onPressedChange={handleLinkPrompt}
      >
        <LinkIcon className="h-4 w-4" />
      </Toggle>
    </BubbleMenu>
  );
}