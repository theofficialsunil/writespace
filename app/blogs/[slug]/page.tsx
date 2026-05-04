import { notFound } from "next/navigation";

import { BlogView } from "@/components/blogs/blog-view";
import { mockBlogs } from "@/lib/mock-data";

interface BlogPageProps {
  params: Promise<{
    slug: string;
  }>;
}

export default async function BlogPage({ params }: BlogPageProps) {
  const { slug } = await params;

  const blog = mockBlogs.find((blog) => blog.slug === slug);

  if (!blog) {
    notFound();
  }

  return <BlogView blog={blog} />;
}