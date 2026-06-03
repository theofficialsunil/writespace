import { BlogFeed } from "@/components/blogs/blog-feed";
import { db } from "@/lib/db";

const BLOGS_PER_PAGE = 6;

interface BlogsPageProps {
  searchParams: Promise<{
    query?: string;
    sort?: string;
    page?: string;
  }>;
}

export default async function BlogsPage({ searchParams }: BlogsPageProps) {
  const { query = "", sort = "latest", page = "1" } = await searchParams;

  const currentPage = Math.max(Number(page) || 1, 1);
  const skip = (currentPage - 1) * BLOGS_PER_PAGE;

  const where = {
    status: "PUBLISHED" as const,
    OR: query
      ? [
          {
            title: {
              contains: query,
              mode: "insensitive" as const,
            },
          },
          {
            description: {
              contains: query,
              mode: "insensitive" as const,
            },
          },
          {
            content: {
              contains: query,
              mode: "insensitive" as const,
            },
          },
          {
            tags: {
              some: {
                tag: {
                  name: {
                    contains: query,
                    mode: "insensitive" as const,
                  },
                },
              },
            },
          },
        ]
      : undefined,
  };

  const [blogs, totalBlogs] = await Promise.all([
    db.blog.findMany({
      where,
      skip,
      take: BLOGS_PER_PAGE,
      orderBy:
        sort === "popular"
          ? {
              likes: {
                _count: "desc",
              },
            }
          : {
              publishedAt: "desc",
            },
      include: {
        author: {
          select: {
            name: true,
            username: true,
          },
        },
        likes: true,
        comments: true,
        tags: {
          include: {
            tag: true,
          },
        },
      },
    }),

    db.blog.count({
      where,
    }),
  ]);

  const totalPages = Math.ceil(totalBlogs / BLOGS_PER_PAGE);

  const formattedBlogs = blogs.map((blog) => ({
    id: blog.id,
    title: blog.title,
    slug: blog.slug,
    description: blog.description,
    content: blog.content,
    author: blog.author.name,
    authorUsername: blog.author.username ?? "",
    publishDate: blog.publishedAt
      ? blog.publishedAt.toLocaleDateString()
      : blog.createdAt.toLocaleDateString(),
    thumbnail: blog.thumbnail ?? "",
    tags: blog.tags.map((blogTag) => blogTag.tag.name),
    category: "General",
    likes: blog.likes.length,
    readTime: `${Math.ceil(blog.content.length / 800)} min read`,
    status: blog.status.toLowerCase() as "published" | "draft",
  }));

  return (
    <BlogFeed
      blogs={formattedBlogs}
      query={query}
      sort={sort}
      currentPage={currentPage}
      totalPages={totalPages}
      totalBlogs={totalBlogs}
    />
  );
}