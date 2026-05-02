import { Blog } from "@/lib/types";

export const mockBlogs: Blog[] = [
  {
    id: 1,
    slug: "future-of-web-development",
    title: "The Future of Web Development",
    description: "Explore the latest trends shaping the future of web development.",
    content: "The web development landscape is constantly evolving.",
    author: "Sarah Chen",
    publishDate: "March 15, 2024",
    thumbnail: "https://images.unsplash.com/photo-1695891835400-676533f871aa?q=80&w=1080",
    tags: ["Technology", "Web Development"],
    category: "Technology",
    likes: 124,
    readTime: "8 min read",
    status: "published",
  },
];