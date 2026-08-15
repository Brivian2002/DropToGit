import { NextResponse } from "next/server";

export const revalidate = 300;

interface BloggerPost {
  id: string;
  title: string;
  content: string;
  published: string;
  updated: string;
  url: string;
  author: {
    displayName: string;
    url?: string;
    image?: {
      url: string;
    };
  };
  labels?: string[];
  selfLink: string;
}

interface BlogPost {
  id: string;
  title: string;
  snippet: string;
  published: string;
  url: string;
  slug: string;
  author: string;
  labels: string[];
  updated: string;
}

function stripHtml(html: string): string {
  return html
    .replace(/<script[^>]*>[\s\S]*?<\/script>/gi, "")
    .replace(/<style[^>]*>[\s\S]*?<\/style>/gi, "")
    .replace(/<[^>]+>/g, " ")
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/\s+/g, " ")
    .trim();
}

function slugify(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "")
    .replace(/[\s_]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function transformPost(post: BloggerPost): BlogPost {
  const plainContent = stripHtml(post.content);
  return {
    id: post.id,
    title: post.title,
    snippet: plainContent.length > 200 ? plainContent.slice(0, 200).trim() + "..." : plainContent,
    published: post.published,
    url: post.url,
    slug: slugify(post.title),
    author: post.author?.displayName ?? "Unknown",
    labels: post.labels ?? [],
    updated: post.updated,
  };
}

export async function GET() {
  const apiKey = process.env.BLOGGER_API_KEY;
  const blogId = process.env.BLOGGER_BLOG_ID;

  if (!apiKey || !blogId) {
    return NextResponse.json(
      {
        posts: [],
        message: "Blogger API not configured. Set BLOGGER_API_KEY and BLOGGER_BLOG_ID environment variables.",
      },
      { status: 200 }
    );
  }

  try {
    const url = `https://www.googleapis.com/blogger/v3/blogs/${blogId}/posts?key=${apiKey}`;
    const res = await fetch(url, {
      next: { revalidate: 300 },
    });

    if (!res.ok) {
      const errorBody = await res.text();
      console.error(`Blogger API error (${res.status}): ${errorBody}`);
      return NextResponse.json(
        { posts: [], message: `Blogger API returned status ${res.status}` },
        { status: 200 }
      );
    }

    const data = await res.json();

    if (!data.items || !Array.isArray(data.items)) {
      return NextResponse.json(
        { posts: [], message: "No posts found in Blogger response." },
        { status: 200 }
      );
    }

    const posts: BlogPost[] = data.items.map(transformPost);

    return NextResponse.json({ posts, message: "Posts fetched successfully." });
  } catch (error) {
    console.error("Error fetching from Blogger API:", error);
    return NextResponse.json(
      { posts: [], message: "Failed to fetch posts from Blogger API." },
      { status: 200 }
    );
  }
}
