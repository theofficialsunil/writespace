import { BlogFeed } from "@/components/blogs/blog-feed";
import { mockBlogs } from "@/lib/mock-data";

export default function BlogsPage() {
  return <BlogFeed blogs={mockBlogs} />;
}