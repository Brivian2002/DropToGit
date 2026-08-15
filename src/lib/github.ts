export interface GitHubRepo {
  id: number;
  name: string;
  full_name: string;
  html_url: string;
  description: string | null;
  private: boolean;
  default_branch: string;
}

export interface GitHubTreeEntry {
  path: string;
  mode: string;
  type: 'blob' | 'tree';
  sha?: string | null;
  size?: number;
  content?: string;
}

export interface GitHubCommitResult {
  sha: string;
  url: string;
  html_url: string;
  message: string;
  tree: {
    sha: string;
  };
}

async function githubFetch(
  token: string,
  endpoint: string,
  options: RequestInit = {}
) {
  const res = await fetch(`https://api.github.com${endpoint}`, {
    ...options,
    headers: {
      Authorization: `Bearer ${token}`,
      Accept: 'application/vnd.github+json',
      'X-GitHub-Api-Version': '2022-11-28',
      'User-Agent': 'DropToGit',
      ...(options.headers as Record<string, string>),
    },
  });

  if (!res.ok) {
    const body = await res.text().catch(() => '');
    let message = `GitHub API error (${res.status})`;
    try {
      const parsed = JSON.parse(body);
      if (parsed.message) {
        // Sanitize: never expose token info
        message = parsed.message.replace(/token[\s:=].*/gi, '[REDACTED]');
      }
    } catch {
      // ignore parse errors
    }
    throw new Error(message);
  }

  // Handle 204 No Content
  if (res.status === 204) return null;

  return res.json();
}

export async function listRepos(token: string): Promise<GitHubRepo[]> {
  let repos: GitHubRepo[] = [];
  let page = 1;
  const perPage = 100;

  while (true) {
    const data = await githubFetch(
      token,
      `/user/repos?sort=updated&per_page=${perPage}&page=${page}&type=owner`
    );
    if (!Array.isArray(data) || data.length === 0) break;
    repos = repos.concat(data);
    if (data.length < perPage) break;
    page++;

    // Safety: max 10 pages
    if (page > 10) break;
  }

  return repos;
}

export async function createRepo(
  token: string,
  name: string,
  description: string,
  isPrivate: boolean
): Promise<GitHubRepo> {
  return githubFetch(token, '/user/repos', {
    method: 'POST',
    body: JSON.stringify({
      name: name.trim(),
      description: description.trim() || undefined,
      private: isPrivate,
      auto_init: false,
    }),
  });
}

export async function getRepoBranches(
  token: string,
  owner: string,
  repo: string
): Promise<{ name: string; commit: { sha: string } }[]> {
  const data = await githubFetch(
    token,
    `/repos/${owner}/${repo}/branches?per_page=100`
  );
  return Array.isArray(data) ? data : [];
}

export async function getDefaultBranch(
  token: string,
  owner: string,
  repo: string
): Promise<string> {
  try {
    const data = await githubFetch(
      token,
      `/repos/${owner}/${repo}`
    );
    return data.default_branch || 'main';
  } catch {
    return 'main';
  }
}

export async function getRefSha(
  token: string,
  owner: string,
  repo: string,
  branch: string
): Promise<string> {
  const data = await githubFetch(
    token,
    `/repos/${owner}/${repo}/git/ref/heads/${branch}`
  );
  return data.object.sha;
}

export async function getCommitTreeSha(
  token: string,
  owner: string,
  repo: string,
  commitSha: string
): Promise<string> {
  const data = await githubFetch(
    token,
    `/repos/${owner}/${repo}/git/commits/${commitSha}`
  );
  return data.tree.sha;
}

export async function getTreeRecursive(
  token: string,
  owner: string,
  repo: string,
  treeSha: string
): Promise<GitHubTreeEntry[]> {
  const data = await githubFetch(
    token,
    `/repos/${owner}/${repo}/git/trees/${treeSha}?recursive=1`
  );
  return (data.tree || []).filter((e: GitHubTreeEntry) => e.type === 'blob');
}

export async function getFileContent(
  token: string,
  owner: string,
  repo: string,
  path: string,
  branch: string
): Promise<string> {
  const data = await githubFetch(
    token,
    `/repos/${owner}/${repo}/contents/${path}?ref=${branch}`,
  );
  // data might be an array for directories, or an object for files
  if (Array.isArray(data)) {
    throw new Error(`Path "${path}" is a directory, not a file`);
  }
  return data.content; // base64 encoded
}

export async function createBlob(
  token: string,
  owner: string,
  repo: string,
  content: string,
  encoding: 'utf-8' | 'base64' = 'utf-8'
): Promise<{ sha: string; url: string }> {
  return githubFetch(token, `/repos/${owner}/${repo}/git/blobs`, {
    method: 'POST',
    body: JSON.stringify({ content, encoding }),
  });
}

export async function createTree(
  token: string,
  owner: string,
  repo: string,
  baseTreeSha: string | null,
  tree: { path: string; mode: string; type: 'blob' | 'tree'; sha?: string | null }[]
): Promise<{ sha: string; url: string; tree: object[] }> {
  const body: Record<string, unknown> = { tree };
  if (baseTreeSha) {
    body.base_tree = baseTreeSha;
  }
  return githubFetch(token, `/repos/${owner}/${repo}/git/trees`, {
    method: 'POST',
    body: JSON.stringify(body),
  });
}

export async function createCommit(
  token: string,
  owner: string,
  repo: string,
  message: string,
  treeSha: string,
  parentSha: string | string[]
): Promise<GitHubCommitResult> {
  const parents = Array.isArray(parentSha) ? parentSha : [parentSha];
  return githubFetch(token, `/repos/${owner}/${repo}/git/commits`, {
    method: 'POST',
    body: JSON.stringify({ message, tree: treeSha, parents }),
  });
}

export async function createCommitOnBranchWithDeletions(
  token: string,
  owner: string,
  repo: string,
  branch: string,
  expectedHeadOid: string,
  message: string,
  paths: string[],
): Promise<{ sha: string; url: string }> {
  const query = `mutation($input: CreateCommitOnBranchInput!) {
    createCommitOnBranch(input: $input) {
      commit { oid url }
    }
  }`;
  const variables = {
    input: {
      branch: { repositoryNameWithOwner: `${owner}/${repo}`, branchName: branch },
      message: { headline: message },
      expectedHeadOid,
      fileChanges: { deletions: paths.map((path) => ({ path })) },
    },
  };

  const response = await fetch('https://api.github.com/graphql', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
      Accept: 'application/vnd.github+json',
      'X-GitHub-Api-Version': '2022-11-28',
      'User-Agent': 'DropToGit',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ query, variables }),
  });

  const data = await response.json().catch(() => ({}));
  if (!response.ok || data.errors?.length) {
    const messageText = data.errors?.[0]?.message || `GitHub GraphQL error (${response.status})`;
    throw new Error(String(messageText).replace(/token[\s:=].*/gi, '[REDACTED]'));
  }

  const commit = data.data?.createCommitOnBranch?.commit;
  if (!commit?.oid || !commit?.url) throw new Error('GitHub did not return the deletion commit');
  return { sha: commit.oid, url: commit.url };
}

export async function updateRef(
  token: string,
  owner: string,
  repo: string,
  branch: string,
  sha: string
): Promise<{ ref: string; object: { sha: string; type: string; url: string } }> {
  return githubFetch(
    token,
    `/repos/${owner}/${repo}/git/refs/heads/${branch}`,
    {
      method: 'PATCH',
      body: JSON.stringify({ sha, force: false }),
    }
  );
}

export async function deleteRepo(
  token: string,
  owner: string,
  repo: string
): Promise<void> {
  await githubFetch(token, `/repos/${owner}/${repo}`, {
    method: 'DELETE',
  });
}

export async function getOwnerFromToken(token: string): Promise<string> {
  const data = await githubFetch(token, '/user');
  return data.login;
}

export function sanitizePath(path: string): string {
  // Remove leading/trailing slashes and whitespace
  let clean = path.trim().replace(/^\/+|\/+$/g, '');
  // Block path traversal
  if (clean.includes('..') || clean.includes('\0')) {
    throw new Error('Invalid path: path traversal detected');
  }
  return clean;
}

export function validateRepoName(name: string): string {
  const clean = name.trim().toLowerCase();
  if (!clean) throw new Error('Repository name is required');
  if (!/^[a-z0-9][a-z0-9._-]*$/.test(clean)) {
    throw new Error(
      'Repository name can only contain lowercase letters, numbers, hyphens, dots, and underscores, and must start with a letter or number'
    );
  }
  if (clean.length > 100) {
    throw new Error('Repository name is too long (max 100 characters)');
  }
  return clean;
}
