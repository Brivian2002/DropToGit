import { NextRequest, NextResponse } from 'next/server';
import {
  createCommitOnBranchWithDeletions,
  getDefaultBranch,
  getRefSha,
  getTreeRecursive,
  getCommitTreeSha,
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

    if (existingFiles.length === 0) {
      return NextResponse.json({
        success: true,
        branch,
        commitSha: parentSha,
        filesDeleted: 0,
        message: `Repository ${owner}/${repo} is already empty`,
      });
    }

    const deletionCommit = await createCommitOnBranchWithDeletions(
      token,
      owner,
      repo,
      branch,
      parentSha,
      'Delete all files',
      existingFiles.map((entry) => entry.path),
    );

    return NextResponse.json({
      success: true,
      branch,
      commitSha: deletionCommit.sha,
      commitUrl: deletionCommit.url,
      filesDeleted: existingFiles.length,
      message: `All files deleted from ${owner}/${repo}`,
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Failed to delete files';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
