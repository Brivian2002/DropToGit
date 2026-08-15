import { NextResponse } from "next/server";

export const revalidate = 300;

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const apiKey = process.env.BLOGGER_API_KEY;
  const blogId = process.env.BLOGGER_BLOG_ID;
  const { id } = await params;

  if (!apiKey || !blogId) {
    return NextResponse.json(
      {
        post: null,
        message: "Blogger API not configured. Set BLOGGER_API_KEY and BLOGGER_BLOG_ID environment variables.",
      },
      { status: 200 }
    );
  }

  try {
    const url = `https://www.googleapis.com/blogger/v3/blogs/${blogId}/posts/${id}?key=${apiKey}`;
    const res = await fetch(url, {
      next: { revalidate: 300 },
    });

    if (!res.ok) {
      const errorBody = await res.text();
      console.error(`Blogger API error for post ${id} (${res.status}): ${errorBody}`);
      return NextResponse.json(
        { post: null, message: `Blogger API returned status ${res.status}` },
        { status: 200 }
      );
    }

    const post = await res.json();

    return NextResponse.json({ post, message: "Post fetched successfully." });
  } catch (error) {
    console.error(`Error fetching Blogger post ${id}:`, error);
    return NextResponse.json(
      { post: null, message: "Failed to fetch post from Blogger API." },
      { status: 200 }
    );
  }
}
