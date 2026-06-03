"use client";

import { useEffect, useRef } from "react";
import hljs from "highlight.js/lib/common";
import "highlight.js/styles/github-dark.css";

interface BlogContentProps {
  content: string;
}

export function BlogContent({ content }: BlogContentProps) {
  const contentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!contentRef.current) return;
    const codeBlocks = contentRef.current.querySelectorAll("pre code");
    codeBlocks.forEach((block) => {
      hljs.highlightElement(block as HTMLElement);
    });
  }, [content]);

  return (
    <div
      ref={contentRef}
      className="prose dark:prose-invert mt-10 max-w-none"
      dangerouslySetInnerHTML={{ __html: content }}
    />
  );
}