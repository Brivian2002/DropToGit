import type { MetadataRoute } from 'next';

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'DropToGit — Ship projects to GitHub without the terminal',
    short_name: 'DropToGit',
    description: 'Move a local project folder into a clean GitHub commit from the browser.',
    start_url: '/',
    display: 'standalone',
    background_color: '#07110d',
    theme_color: '#07110d',
    icons: [
      {
        src: '/logo-mark.svg',
        sizes: 'any',
        type: 'image/svg+xml',
        purpose: 'any',
      },
      {
        src: '/favicon.ico',
        sizes: '64x64',
        type: 'image/x-icon',
      },
    ],
  };
}
