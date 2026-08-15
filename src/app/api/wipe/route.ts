import { NextRequest, NextResponse } from 'next/server';
import {
  getCommitTreeSha,
  getDefaultBranch,
  getRefSha,
  getTreeRecursive,
  createCommit,
  createTree,
  updateRef,
} from '@/lib/github';

export async function POST(request: NextRequest) {
  const token = request.headers.get('authorization')?.replace('Bearer ', '');
  if (!token) {
    return NextResponse.json({ error: 'GitHub token is required' }, { status: 401 });
  }

  let body: { owner?: string; repo?: string; confirmRepoName?: string };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: 'Invalid request body' }, { status: 400 });
  }

  const { owner, repo, confirmRepoName } = body;
  if (!owner || !repo) {
    return NextResponse.json({ error: 'Missing required fields: owner, repo' }, { status: 400 });
  }
  if (confirmRepoName !== repo) {
    return NextResponse.json({ error: 'Repository name confirmation does not match' }, { status: 400 });
  }

  try {
    const branch = await getDefaultBranch(token, owner, repo);
    const parentSha = await getRefSha(token, owner, repo, branch);
    const baseTreeSha = await getCommitTreeSha(token, owner, repo, parentSha);
    const existingFiles = await getTreeRecursive(token, owner, repo, baseTreeSha);

    // Explicit null SHA entries remove every tracked blob from the new tree.
    const deleteEntries = existingFiles.map((entry) => ({
      path: entry.path,
      mode: entry.mode || '100644',
      type: 'blob' as const,
      sha: null,
    }));
    const emptyTree = deleteEntries.length > 0
      ? await createTree(token, owner, repo, baseTreeSha, deleteEntries)
      : { sha: '4b825dc642cb6eb9a060e54bf899d15006895fb' };

    const commit = await createCommit(
      token,
      owner,
      repo,
      'Delete all files',
      emptyTree.sha,
      [parentSha],
    );

    await updateRef(token, owner, repo, branch, commit.sha);

    return NextResponse.json({
      success: true,
      branch,
      commitSha: commit.sha,
      filesDeleted: existingFiles.length,
      message: `All files deleted from ${owner}/${repo}`,
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Failed to delete files';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
