import type { MetadataRoute } from "next";

import { db } from "@/lib/db";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl =
    process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000";

  const staticRoutes: MetadataRoute.Sitemap = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 1,
    },
    {
      url: `${baseUrl}/blogs`,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 0.9,
    },
    {
      url: `${baseUrl}/tags`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.7,
    },
  ];

  const blogs = await db.blog.findMany({
    where: {
      status: "PUBLISHED",
    },
    select: {
      slug: true,
      updatedAt: true,
    },
  });

  const blogRoutes: MetadataRoute.Sitemap = blogs.map((blog) => ({
    url: `${baseUrl}/blogs/${blog.slug}`,
    lastModified: blog.updatedAt,
    changeFrequency: "weekly",
    priority: 0.8,
  }));

  const tags = await db.tag.findMany({
    select: {
      name: true,
    },
  });

  const tagRoutes: MetadataRoute.Sitemap = tags.map((tag) => ({
    url: `${baseUrl}/tags/${encodeURIComponent(tag.name)}`,
    lastModified: new Date(),
    changeFrequency: "weekly",
    priority: 0.6,
  }));

  const users = await db.user.findMany({
    where: {
      username: {
        not: null,
      },
    },
    select: {
      username: true,
      updatedAt: true,
    },
  });

  const profileRoutes: MetadataRoute.Sitemap = users.map((user) => ({
    url: `${baseUrl}/profile/${user.username}`,
    lastModified: user.updatedAt,
    changeFrequency: "weekly",
    priority: 0.6,
  }));

  return [...staticRoutes, ...blogRoutes, ...tagRoutes, ...profileRoutes];
}