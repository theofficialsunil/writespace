export type UserRole = "reader" | "publisher";

export interface Blog {
  id: string;
  title: string;
  slug: string;
  description: string;
  content: string;
  author: string;
  publishDate: string;
  thumbnail: string;
  tags: string[];
  category: string;
  likes?: number;
  readTime?: string;
  status?: "published" | "draft";
}