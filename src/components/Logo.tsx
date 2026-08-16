interface LogoProps {
  size?: 'sm' | 'md' | 'lg';
  showText?: boolean;
}

export function Logo({ size = 'md', showText = true }: LogoProps) {
  const textSize = {
    sm: 'text-lg',
    md: 'text-2xl',
    lg: 'text-3xl',
  }[size];

  return (
    <span className="inline-flex items-center select-none" aria-label="DropToGit">
      {showText && (
        <span className={`${textSize} font-bold tracking-tight`}>
          <span className="text-foreground">Drop</span>
          <span className="text-primary">To</span>
          <span className="text-foreground">Git</span>
        </span>
      )}
    </span>
  );
}
