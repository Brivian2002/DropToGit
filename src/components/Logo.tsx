interface LogoProps {
  size?: 'sm' | 'md' | 'lg';
  showText?: boolean;
}

const SIZE_STYLES = {
  sm: { mark: 'h-7 w-7 rounded-[9px]', text: 'text-lg' },
  md: { mark: 'h-9 w-9 rounded-[11px]', text: 'text-2xl' },
  lg: { mark: 'h-11 w-11 rounded-[13px]', text: 'text-3xl' },
} as const;

export function Logo({ size = 'md', showText = true }: LogoProps) {
  const styles = SIZE_STYLES[size];

  return (
    <span className="inline-flex items-center gap-2 select-none" aria-label="DropToGit">
      <span
        className={`inline-flex shrink-0 items-center justify-center bg-primary text-primary-foreground shadow-sm shadow-primary/25 ${styles.mark}`}
        aria-hidden="true"
      >
        <svg viewBox="0 0 40 40" className="h-[70%] w-[70%]" fill="none">
          <path
            d="M10 8h8.5c7.18 0 12.5 4.9 12.5 12s-5.32 12-12.5 12H10V8Zm7.5 6H16v12h1.5c3.75 0 6.5-2.1 6.5-6s-2.75-6-6.5-6Z"
            fill="currentColor"
            fillRule="evenodd"
          />
          <path
            d="M24 20h7m-3-3 3 3-3 3"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </span>
      {showText && (
        <span className={`${styles.text} font-bold tracking-tight`}>
          <span className="text-foreground">Drop</span>
          <span className="text-primary">To</span>
          <span className="text-foreground">Git</span>
        </span>
      )}
    </span>
  );
}
