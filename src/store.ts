'use client';

import { create } from 'zustand';
import type { GitHubRepo } from '@/lib/github';
import type { ProjectFile } from '@/lib/zip';
import type { ProgressStage } from '@/components/ProgressBar';

export type AppStage =
  | 'credentials'
  | 'upload'
  | 'configure'
  | 'pushing'
  | 'success';

export type PushMode = 'replace' | 'smart';

interface AppState {
  // Stage
  stage: AppStage;
  setStage: (stage: AppStage) => void;

  // GitHub credentials
  token: string;
  setToken: (token: string) => void;

  // Repository
  repos: GitHubRepo[];
  setRepos: (repos: GitHubRepo[]) => void;
  selectedRepo: GitHubRepo | null;
  setSelectedRepo: (repo: GitHubRepo | null) => void;

  // Files
  files: ProjectFile[];
  setFiles: (files: ProjectFile[], totalSize: number, errors: string[]) => void;
  totalSize: number;
  uploadErrors: string[];
  fileName: string;
  setFileName: (name: string) => void;

  // File preview
  previewFile: ProjectFile | null;
  setPreviewFile: (file: ProjectFile | null) => void;

  // Push config
  mode: PushMode;
  setMode: (mode: PushMode) => void;
  destination: string;
  setDestination: (dest: string) => void;
  commitMessage: string;
  setCommitMessage: (msg: string) => void;

  // Branch management
  branch: string;
  setBranch: (branch: string) => void;
  branches: string[];
  setBranches: (branches: string[]) => void;

  // Progress
  progressStages: ProgressStage[];
  currentProgressStage: number;
  setProgress: (stages: ProgressStage[], current: number) => void;
  pushError: string;
  setPushError: (error: string) => void;

  // Success
  successData: {
    commitSha: string;
    commitUrl: string;
    repoUrl: string;
    filesUploaded: number;
    filesChanged: number;
    commitMessage: string;
  } | null;
  setSuccessData: (data: AppState['successData']) => void;

  // Reset
  resetPush: () => void;
  resetAll: () => void;
}

export const useAppStore = create<AppState>((set, get) => ({
  stage: 'credentials',
  setStage: (stage) => set({ stage }),

  token: '',
  setToken: (token) => set({ token, selectedRepo: null, repos: [], branch: '' }),

  repos: [],
  setRepos: (repos) => set({ repos }),
  selectedRepo: null,
  setSelectedRepo: (repo) => set({ selectedRepo: repo, branch: '' }),

  files: [],
  setFiles: (files, totalSize, errors) =>
    set({
      files,
      totalSize,
      uploadErrors: errors,
    }),
  totalSize: 0,
  uploadErrors: [],
  fileName: '',
  setFileName: (name) => set({ fileName: name }),

  // File preview
  previewFile: null,
  setPreviewFile: (file) => set({ previewFile: file }),

  // Push config
  mode: 'replace',
  setMode: (mode) => set({ mode }),
  destination: '',
  setDestination: (destination) => set({ destination }),
  commitMessage: '',
  setCommitMessage: (commitMessage) => set({ commitMessage }),

  // Branch management
  branch: '',
  setBranch: (branch) => set({ branch }),
  branches: [],
  setBranches: (branches) => set({ branches }),

  // Progress
  progressStages: [],
  currentProgressStage: 0,
  setProgress: (progressStages, currentProgressStage) => set({ progressStages, currentProgressStage }),
  pushError: '',
  setPushError: (pushError) => set({ pushError }),

  // Success
  successData: null,
  setSuccessData: (successData) => set({ successData }),

  resetPush: () =>
    set({
      files: [],
      totalSize: 0,
      uploadErrors: [],
      fileName: '',
      previewFile: null,
      mode: 'replace',
      destination: '',
      commitMessage: '',
      branch: '',
      branches: [],
      progressStages: [],
      currentProgressStage: 0,
      pushError: '',
      successData: null,
      stage: 'credentials',
    }),

  resetAll: () =>
    set({
      stage: 'credentials',
      token: '',
      repos: [],
      selectedRepo: null,
      files: [],
      totalSize: 0,
      uploadErrors: [],
      fileName: '',
      previewFile: null,
      mode: 'replace',
      destination: '',
      commitMessage: '',
      branch: '',
      branches: [],
      progressStages: [],
      currentProgressStage: 0,
      pushError: '',
      successData: null,
    }),
}));
