'use client';

import { useState, useMemo } from 'react';
import { ChevronRight, ChevronDown, File, Folder, FolderOpen } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { formatFileSize } from '@/lib/zip';
import { buildFileTree, type TreeNode } from '@/lib/diff';
import type { ProjectFile } from '@/lib/zip';

interface FileTreePreviewProps {
  files: ProjectFile[];
  diffInfo?: {
    newFiles: string[];
    changedFiles: string[];
    unchangedFiles: string[];
  };
  onFileClick?: (file: ProjectFile) => void;
}

function computeDefaultExpanded(files: ProjectFile[]): Set<string> {
  const dirs = new Set<string>();
  for (const file of files) {
    const parts = file.path.split('/');
    for (let i = 1; i <= parts.length - 1; i += 1) {
      dirs.add(parts.slice(0, i).join('/'));
    }
  }
  return dirs;
}

export function FileTreePreview({ files, diffInfo, onFileClick }: FileTreePreviewProps) {
  const defaultExpanded = useMemo(() => computeDefaultExpanded(files), [files]);
  const filesKey = useMemo(() => files.map((file) => file.path).join('|'), [files]);
  const [state, setState] = useState<{ key: string; expanded: Set<string> }>(() => ({
    key: filesKey,
    expanded: computeDefaultExpanded(files),
  }));

  const expandedDirs = state.key === filesKey ? state.expanded : defaultExpanded;
  const setExpandedDirs = (updater: (previous: Set<string>) => Set<string>) => {
    setState((previous) => {
      if (previous.key !== filesKey) return { key: filesKey, expanded: defaultExpanded };
      return { ...previous, expanded: updater(previous.expanded) };
    });
  };

  if (files.length === 0) return null;

  const tree = buildFileTree(files);
  const totalSize = files.reduce((sum, file) => sum + file.size, 0);
  const folderCount = new Set(files.map((file) => file.path.split('/').slice(0, -1).join('/'))).size;

  const getFileBadge = (path: string) => {
    if (!diffInfo) return null;
    if (diffInfo.newFiles.includes(path)) {
      return <span className="rounded-full bg-primary/15 px-1.5 py-0.5 text-[10px] font-medium text-primary">New</span>;
    }
    if (diffInfo.changedFiles.includes(path)) {
      return <span className="rounded-full bg-sky-accent/15 px-1.5 py-0.5 text-[10px] font-medium text-sky-accent">Changed</span>;
    }
    return null;
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3 text-sm text-muted-foreground">
          <span>{files.length} files approved</span>
          <span>·</span>
          <span>{folderCount} folders</span>
          <span>·</span>
          <span className="text-primary/80">folders first · ordered paths</span>
          <span>·</span>
          <span>{formatFileSize(totalSize)}</span>
        </div>
        <Button
          variant="ghost"
          size="sm"
          className="h-7 text-xs"
          onClick={() => {
            const allDirs = new Set<string>();
            const collectDirs = (node: TreeNode) => {
              if (node.type === 'directory' && node.path) allDirs.add(node.path);
              node.children.forEach(collectDirs);
            };
            collectDirs(tree);
            setExpandedDirs(() => allDirs);
          }}
        >
          Expand all
        </Button>
      </div>

      <div className="max-h-72 overflow-y-auto rounded-lg border bg-card scrollbar-thin">
        <div className="p-2">
          <TreeNodes
            nodes={tree.children}
            expandedDirs={expandedDirs}
            toggleDir={(path) =>
              setExpandedDirs((previous) => {
                const next = new Set(previous);
                if (next.has(path)) next.delete(path);
                else next.add(path);
                return next;
              })
            }
            getBadge={getFileBadge}
            onFileClick={onFileClick}
            filesMap={new Map(files.map((file) => [file.path, file]))}
            depth={0}
          />
        </div>
      </div>
    </div>
  );
}

function TreeNodes({
  nodes,
  expandedDirs,
  toggleDir,
  getBadge,
  onFileClick,
  filesMap,
  depth,
}: {
  nodes: TreeNode[];
  expandedDirs: Set<string>;
  toggleDir: (path: string) => void;
  getBadge: (path: string) => React.ReactNode;
  onFileClick?: (file: ProjectFile) => void;
  filesMap: Map<string, ProjectFile>;
  depth: number;
}) {
  return (
    <>
      {nodes.map((node) => (
        <div key={node.path}>
          <div
            className={`group flex items-center gap-1.5 rounded-md px-1.5 py-1 transition-colors hover:bg-muted/50 ${node.type === 'file' && onFileClick ? 'cursor-pointer' : 'cursor-default'}`}
            style={{ paddingLeft: `${depth * 16 + 6}px` }}
          >
            {node.type === 'directory' ? (
              <button
                className="flex min-w-0 flex-1 items-center gap-1.5 text-left"
                onClick={() => toggleDir(node.path)}
                aria-expanded={expandedDirs.has(node.path)}
              >
                {expandedDirs.has(node.path) ? <ChevronDown className="h-3.5 w-3.5 shrink-0 text-muted-foreground" /> : <ChevronRight className="h-3.5 w-3.5 shrink-0 text-muted-foreground" />}
                {expandedDirs.has(node.path) ? <FolderOpen className="h-4 w-4 shrink-0 text-sky-accent" /> : <Folder className="h-4 w-4 shrink-0 text-sky-accent" />}
                <span className="truncate text-sm">{node.name}</span>
              </button>
            ) : (
              <>
                <span className="w-3.5" />
                <button
                  className="flex min-w-0 flex-1 items-center gap-1.5 text-left"
                  onClick={() => {
                    const file = filesMap.get(node.path);
                    if (file) onFileClick?.(file);
                  }}
                  title="Click to preview"
                >
                  <File className="h-4 w-4 shrink-0 text-muted-foreground" />
                  <span className="truncate text-sm">{node.name}</span>
                </button>
                <span className="shrink-0 text-xs text-muted-foreground/60">{node.size !== undefined && formatFileSize(node.size)}</span>
                {getBadge(node.path)}
              </>
            )}
          </div>
          {node.type === 'directory' && expandedDirs.has(node.path) && node.children.length > 0 && (
            <TreeNodes
              nodes={node.children}
              expandedDirs={expandedDirs}
              toggleDir={toggleDir}
              getBadge={getBadge}
              onFileClick={onFileClick}
              filesMap={filesMap}
              depth={depth + 1}
            />
          )}
        </div>
      ))}
    </>
  );
}
