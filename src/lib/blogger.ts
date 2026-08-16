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

interface BloggerListResponse {
  items?: BloggerApiPost[];
  nextPageToken?: string;
  totalItems?: number;
}

interface BloggerFeedEntry {
  id?: { $t?: string };
  title?: { $t?: string };
  content?: { $t?: string };
  summary?: { $t?: string };
  published?: { $t?: string };
  updated?: { $t?: string };
  category?: { term?: string }[];
  author?: { name?: { $t?: string }; uri?: { $t?: string }; 'gd$image'?: { src?: string } }[];
  link?: { rel?: string; href?: string }[];
  'thr$total'?: { $t?: string };
}

interface BloggerFeedResponse {
  feed?: {
    entry?: BloggerFeedEntry[];
    'openSearch$totalResults'?: { $t?: string };
  };
}

export type BlogFetchError = 'missing-config' | 'api-error';

type BlogListResult = {
  posts: BloggerPost[];
  nextPageToken?: string;
  totalItems?: number;
  error?: BlogFetchError;
};

const BLOG_REVALIDATE_SECONDS = 60;

function decodeHtmlEntities(text: string): string {
  return text
    .replace(/&nbsp;|&#160;/gi, ' ')
    .replace(/&amp;/gi, '&')
    .replace(/&quot;/gi, '"')
    .replace(/&#39;|&apos;/gi, "'")
    .replace(/&lt;/gi, '<')
    .replace(/&gt;/gi, '>')
    .replace(/&#(x?)([0-9a-f]+);/gi, (_match, hex, value) => {
      const codePoint = Number.parseInt(value, hex ? 16 : 10);
      return Number.isNaN(codePoint) ? '' : String.fromCodePoint(codePoint);
    });
}

function stripHtml(html: string): string {
  return decodeHtmlEntities(
    html
      .replace(/<br\s*\/?>/gi, '\n')
      .replace(/<\/(?:p|div|h[1-6]|li|blockquote|pre|tr|td|th|section|article|ul|ol)[^>]*>/gi, '\n')
      .replace(/<[^>]*>/g, '')
      .replace(/\s+/g, ' '),
  ).trim();
}

function escapeRegExp(value: string): string {
  return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

export function removeLeadingPostTitle(html: string, title: string): string {
  const normalizedTitle = title.trim();
  if (!normalizedTitle) return html;

  const readable = stripHtml(html).toLowerCase();
  const titleIndex = readable.indexOf(normalizedTitle.toLowerCase());
  if (titleIndex < 0 || titleIndex > 400) return html;

  const titlePattern = normalizedTitle
    .split(/\s+/)
    .map(escapeRegExp)
    .join('(?:\\s|&nbsp;|&#160;|<[^>]*>)*');
  const match = new RegExp(titlePattern, 'i').exec(html.slice(0, 3000));
  if (!match || match.index === undefined) return html;
  return html.slice(0, match.index) + html.slice(match.index + match[0].length);
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

function getFeedLink(entry: BloggerFeedEntry, rel: string): string | undefined {
  return entry.link?.find((link) => link.rel === rel)?.href;
}

function extractFeedPostId(entry: BloggerFeedEntry): string {
  const id = entry.id?.$t || '';
  return id.match(/post-(\d+)$/)?.[1] || id;
}

function normalizeFeedEntry(entry: BloggerFeedEntry, blogId: string): BloggerPost {
  const labels = (entry.category || [])
    .map((category) => category.term?.trim())
    .filter((label): label is string => Boolean(label));
  const url = getFeedLink(entry, 'alternate') || `https://www.blogger.com/feeds/${blogId}/posts/default/${extractFeedPostId(entry)}`;
  const item: BloggerApiPost = {
    id: extractFeedPostId(entry),
    title: entry.title?.$t || 'Untitled post',
    content: entry.content?.$t || entry.summary?.$t || '',
    published: entry.published?.$t || '',
    updated: entry.updated?.$t || entry.published?.$t || '',
    url,
    author: entry.author?.[0]
      ? {
          displayName: entry.author[0].name?.$t || 'Unknown author',
          url: entry.author[0].uri?.$t,
          image: entry.author[0]['gd$image']?.src ? { url: entry.author[0]['gd$image'].src } : undefined,
        }
      : undefined,
    labels,
    replies: entry['thr$total']?.$t ? { totalItems: entry['thr$total'].$t } : undefined,
  };
  return normalizePost(item);
}

async function fetchPublicBloggerFeed(maxResults: number, tag: string | undefined, blogId: string): Promise<BlogListResult> {
  const labelPath = tag?.trim() ? `/-/${encodeURIComponent(tag.trim())}` : '';
  const url = `https://www.blogger.com/feeds/${blogId}/posts/default${labelPath}?alt=json&max-results=${maxResults}`;

  try {
    const res = await fetch(url, { next: { revalidate: BLOG_REVALIDATE_SECONDS } });
    if (!res.ok) return { posts: [], error: 'api-error' };
    const data: BloggerFeedResponse = await res.json();
    const entries = data.feed?.entry || [];
    return {
      posts: entries.map((entry) => normalizeFeedEntry(entry, blogId)),
      totalItems: Number(data.feed?.['openSearch$totalResults']?.$t || entries.length),
    };
  } catch {
    return { posts: [], error: 'api-error' };
  }
}

export async function fetchBlogPosts(
  maxResults = 50,
  pageToken?: string,
  tag?: string,
): Promise<BlogListResult> {
  const { apiKey, blogId } = getBloggerConfig();
  if (!blogId) return { posts: [], error: 'missing-config' };

  if (!apiKey) return fetchPublicBloggerFeed(maxResults, tag, blogId);

  const params = new URLSearchParams({
    key: apiKey,
    maxResults: String(maxResults),
    fields: 'items(id,title,content,published,updated,url,author,labels,replies/totalItems),nextPageToken,totalItems',
  });
  if (pageToken) params.set('pageToken', pageToken);
  if (tag?.trim()) params.set('labels', tag.trim());

  try {
    const res = await fetch(
      `https://www.googleapis.com/blogger/v3/blogs/${blogId}/posts?${params.toString()}`,
      { next: { revalidate: BLOG_REVALIDATE_SECONDS } },
    );

    if (res.ok) {
      const data: BloggerListResponse = await res.json();
      return {
        posts: (data.items || []).map(normalizePost),
        nextPageToken: data.nextPageToken,
        totalItems: data.totalItems,
      };
    }
  } catch {
    // Fall through to the public Blogger feed.
  }

  return fetchPublicBloggerFeed(maxResults, tag, blogId);
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
  if (!blogId) return null;

  if (apiKey && /^\d+$/.test(slug)) {
    const postById = await fetchBlogPostById(slug);
    if (postById) return postById;
  }

  if (apiKey) {
    try {
      const params = new URLSearchParams({
        key: apiKey,
        maxResults: '500',
        fields: 'items(id,title,content,published,updated,url,author,labels,replies/totalItems)',
      });
      const res = await fetch(
        `https://www.googleapis.com/blogger/v3/blogs/${blogId}/posts?${params.toString()}`,
        { next: { revalidate: BLOG_REVALIDATE_SECONDS } },
      );
      if (res.ok) {
        const data: BloggerListResponse = await res.json();
        const item = (data.items || []).find(
          (candidate) => extractSlug(candidate.url) === slug || candidate.id === slug,
        );
        if (item) return normalizePost(item);
      }
    } catch {
      // Fall through to the public feed.
    }
  }

  const posts = await fetchAllBlogPosts();
  return posts.find((post) => post.slug === slug || post.id === slug) || null;
}

export async function fetchBlogPostById(postId: string): Promise<BloggerPost | null> {
  const { apiKey, blogId } = getBloggerConfig();
  if (!blogId) return null;

  if (apiKey) {
    try {
      const params = new URLSearchParams({
        key: apiKey,
        fields: 'id,title,content,published,updated,url,author,labels,replies/totalItems',
      });
      const res = await fetch(
        `https://www.googleapis.com/blogger/v3/blogs/${blogId}/posts/${encodeURIComponent(postId)}?${params.toString()}`,
        { next: { revalidate: BLOG_REVALIDATE_SECONDS } },
      );
      if (res.ok) {
        const item: BloggerApiPost = await res.json();
        return normalizePost(item);
      }
    } catch {
      // Fall through to the public feed.
    }
  }

  const posts = await fetchAllBlogPosts();
  return posts.find((post) => post.id === postId) || null;
}

export function getPostExcerpt(content: string, maxLength = 200, title?: string): string {
  const normalizedTitle = title?.trim() || '';
  let text = stripHtml(removeLeadingPostTitle(content, normalizedTitle))
    .replace(/([a-z])Subtitle:/gi, '$1. Subtitle: ')
    .replace(/^subtitle:\s*/i, '')
    .replace(/\s+/g, ' ')
    .trim();

  if (normalizedTitle) {
    const duplicateIndex = text.toLowerCase().indexOf(normalizedTitle.toLowerCase());
    if (duplicateIndex >= 0 && duplicateIndex < 400) {
      text = `${text.slice(0, duplicateIndex)} ${text.slice(duplicateIndex + normalizedTitle.length)}`
        .replace(/\s+/g, ' ')
        .trim();
    }
  }

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
