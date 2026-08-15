// Blogger labels are the blog's fixed category taxonomy.
// These strings must match the labels typed in Blogger exactly.
export const BLOG_LABELS = [
  { label: 'News', icon: 'newspaper' },
  { label: 'Tech', icon: 'cpu' },
  { label: 'How To', icon: 'wrench' },
  { label: 'Teachings', icon: 'book-open' },
  { label: 'Did You Know?', icon: 'lightbulb' },
  { label: 'Tutorials', icon: 'book-open' },
  { label: 'Open Source', icon: 'globe' },
  { label: 'DevOps', icon: 'rocket' },
  { label: 'Updates', icon: 'sparkles' },
] as const;

export type BlogLabel = (typeof BLOG_LABELS)[number];

const BLOG_LABEL_DESCRIPTIONS: Record<string, string> = {
  News: 'Announcements and breaking updates',
  Tech: 'Technology deep-dives and analysis',
  'How To': 'Step-by-step guides and practical help',
  Teachings: 'Lessons, principles, and practical wisdom',
  'Did You Know?': 'Interesting facts and useful tips',
  Tutorials: 'In-depth walkthroughs',
  'Open Source': 'Open source projects and contributions',
  DevOps: 'Deployment, CI/CD, and infrastructure',
  Updates: 'Product updates and changelogs',
};

export interface BlogCategory {
  key: string;
  label: string;
  hashtag: string;
  icon: string;
  description: string;
}

export const BLOG_CATEGORIES: BlogCategory[] = [
  {
    key: 'all',
    label: 'All posts',
    hashtag: '',
    icon: 'layout-grid',
    description: 'Everything from the DropToGit blog',
  },
  ...BLOG_LABELS.map(({ label, icon }) => ({
    key: labelToKey(label),
    label,
    hashtag: label,
    icon,
    description: BLOG_LABEL_DESCRIPTIONS[label],
  })),
];

const UNCATEGORIZED_CATEGORY: BlogCategory = {
  key: 'uncategorized',
  label: 'Uncategorized',
  hashtag: '',
  icon: 'tag',
  description: 'Posts without one of the published blog labels',
};

export function labelToKey(label: string): string {
  return label.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
}

export function getLabelByValue(label: string | null | undefined): BlogLabel | undefined {
  return BLOG_LABELS.find((entry) => entry.label === label);
}

/** Return every configured menu label that exactly matches a Blogger label. */
export function getMatchingLabels(labels?: string[]): BlogLabel[] {
  const exactLabels = new Set((labels || []).map((label) => label.trim()));
  return BLOG_LABELS.filter((entry) => exactLabels.has(entry.label));
}

export function getMatchingCategoryKeys(labels?: string[]): string[] {
  return getMatchingLabels(labels).map((entry) => labelToKey(entry.label));
}

export function getCategoryByKey(key: string): BlogCategory {
  return BLOG_CATEGORIES.find((category) => category.key === key) || UNCATEGORIZED_CATEGORY;
}

export function getCategoryByLabel(label: string | null | undefined): BlogCategory | undefined {
  const match = getLabelByValue(label);
  return match ? getCategoryByKey(labelToKey(match.label)) : undefined;
}

export function categorizePost(labels?: string[]): string {
  return getMatchingCategoryKeys(labels)[0] || UNCATEGORIZED_CATEGORY.key;
}

export interface BloggerPost {
  id: string;
  slug: string;
  title: string;
  content: string;
  published: string;
  updated: string;
  url: string;
  author?: {
    displayName: string;
    url?: string;
    image?: { url: string };
  };
  labels?: string[];
  replies?: { totalItems: string };
  featuredImage?: string;
  category: string;
  categories: string[];
}

type BloggerApiPost = Omit<BloggerPost, 'slug' | 'featuredImage' | 'category' | 'categories'>;

export interface BloggerListResponse {
  items?: BloggerApiPost[];
  nextPageToken?: string;
  totalItems?: number;
}

export type BlogFetchError = 'missing-config' | 'api-error';

type BlogListResult = {
  posts: BloggerPost[];
  nextPageToken?: string;
  totalItems?: number;
  error?: BlogFetchError;
};

const BLOG_REVALIDATE_SECONDS = 60;

function stripHtml(html: string): string {
  return html.replace(/<[^>]*>/g, '').trim();
}

export function extractSlug(url: string): string {
  const match = url.match(/\/([\w-]+)(?:\.html)?$/);
  return match ? match[1] : '';
}

export function extractFeaturedImage(content: string): string | undefined {
  const match = content.match(/<img[^>]+src=["']([^"']+)["'][^>]*>/i);
  if (!match?.[1]) return undefined;
  return match[1].replace(/\/s[0-9]+(-[a-z])?\//i, '/s1600/');
}

function normalizePost(item: BloggerApiPost): BloggerPost {
  const categories = getMatchingCategoryKeys(item.labels);
  return {
    ...item,
    slug: extractSlug(item.url) || item.id,
    featuredImage: extractFeaturedImage(item.content),
    category: categories[0] || UNCATEGORIZED_CATEGORY.key,
    categories,
  };
}

function getBloggerConfig() {
  return {
    apiKey: process.env.BLOGGER_API_KEY,
    blogId: process.env.BLOGGER_BLOG_ID,
  };
}

export async function fetchBlogPosts(
  maxResults = 50,
  pageToken?: string,
  tag?: string,
): Promise<BlogListResult> {
  const { apiKey, blogId } = getBloggerConfig();
  if (!apiKey || !blogId) return { posts: [], error: 'missing-config' };

  const params = new URLSearchParams({
    key: apiKey,
    maxResults: String(maxResults),
    fields: 'items(id,title,content,published,updated,url,author,labels,replies/totalItems),nextPageToken,totalItems',
  });
  if (pageToken) params.set('pageToken', pageToken);
  if (tag?.trim()) params.set('labels', tag.trim());

  const res = await fetch(
    `https://www.googleapis.com/blogger/v3/blogs/${blogId}/posts?${params.toString()}`,
    { next: { revalidate: BLOG_REVALIDATE_SECONDS } },
  );

  if (!res.ok) return { posts: [], error: 'api-error' };

  const data: BloggerListResponse = await res.json();
  return {
    posts: (data.items || []).map(normalizePost),
    nextPageToken: data.nextPageToken,
    totalItems: data.totalItems,
  };
}

export async function fetchAllBlogPosts(maxPages = 10): Promise<BloggerPost[]> {
  const allPosts: BloggerPost[] = [];
  let pageToken: string | undefined;

  for (let page = 0; page < maxPages; page += 1) {
    const result = await fetchBlogPosts(500, pageToken);
    allPosts.push(...result.posts);
    if (!result.nextPageToken || result.error) break;
    pageToken = result.nextPageToken;
  }

  return allPosts;
}

export async function fetchBlogPost(slug: string): Promise<BloggerPost | null> {
  const { apiKey, blogId } = getBloggerConfig();
  if (!apiKey || !blogId) return null;

  if (/^\d+$/.test(slug)) {
    const postById = await fetchBlogPostById(slug);
    if (postById) return postById;
  }

  const params = new URLSearchParams({
    key: apiKey,
    maxResults: '500',
    fields: 'items(id,title,content,published,updated,url,author,labels,replies/totalItems)',
  });
  const res = await fetch(
    `https://www.googleapis.com/blogger/v3/blogs/${blogId}/posts?${params.toString()}`,
    { next: { revalidate: BLOG_REVALIDATE_SECONDS } },
  );
  if (!res.ok) return null;

  const data: BloggerListResponse = await res.json();
  const item = (data.items || []).find(
    (candidate) => extractSlug(candidate.url) === slug || candidate.id === slug,
  );
  return item ? normalizePost(item) : null;
}

export async function fetchBlogPostById(postId: string): Promise<BloggerPost | null> {
  const { apiKey, blogId } = getBloggerConfig();
  if (!apiKey || !blogId) return null;

  const params = new URLSearchParams({
    key: apiKey,
    fields: 'id,title,content,published,updated,url,author,labels,replies/totalItems',
  });
  const res = await fetch(
    `https://www.googleapis.com/blogger/v3/blogs/${blogId}/posts/${encodeURIComponent(postId)}?${params.toString()}`,
    { next: { revalidate: BLOG_REVALIDATE_SECONDS } },
  );
  if (!res.ok) return null;

  const item: BloggerApiPost = await res.json();
  return normalizePost(item);
}

export function getPostExcerpt(content: string, maxLength = 200): string {
  const text = stripHtml(content);
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength).replace(/\s+\S*$/, '') + '…';
}

export function formatDate(dateStr: string): string {
  try {
    return new Date(dateStr).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  } catch {
    return dateStr;
  }
}
