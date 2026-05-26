import { BlogFeed } from "@/components/blogs/blog-feed";
import { db } from "@/lib/db";

export default async function BlogsPage() {
  try {
    const blogs = await db.blog.findMany({
      where: { status: "PUBLISHED" },
      orderBy: { publishedAt: "desc" },
      include: {
        author: { select: { name: true } },
        likes: true,
        comments: true,
      },
    });

    const formattedBlogs = blogs.map((blog) => ({
      id: blog.id,
      title: blog.title,
      slug: blog.slug,
      description: blog.description,
      content: blog.content,
      author: blog.author.name,
      publishDate: blog.publishedAt
        ? blog.publishedAt.toLocaleDateString()
        : blog.createdAt.toLocaleDateString(),
      thumbnail: blog.thumbnail ?? "",
      tags: [],
      category: "General",
      likes: blog.likes.length,
      readTime: `${Math.ceil(blog.content.length / 800)} min read`,
      status: blog.status.toLowerCase() as "published" | "draft",
    }));

    return <BlogFeed blogs={formattedBlogs} />;
  } catch {
    return (
      <main className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold">Blogs unavailable</h1>
        <p className="mt-2 text-muted-foreground">
          Database connection failed. Check Neon connection.
        </p>
      </main>
    );
  }
}