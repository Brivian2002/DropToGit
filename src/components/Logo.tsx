import Image from 'next/image';

interface LogoProps {
  size?: 'sm' | 'md' | 'lg';
  showText?: boolean;
}

const SIZE_STYLES = {
  sm: { mark: 'h-8 w-8', text: 'text-lg', sizes: '32px' },
  md: { mark: 'h-10 w-10', text: 'text-2xl', sizes: '40px' },
  lg: { mark: 'h-12 w-12', text: 'text-3xl', sizes: '48px' },
} as const;

export function Logo({ size = 'md', showText = true }: LogoProps) {
  const styles = SIZE_STYLES[size];

  return (
    <span className="inline-flex items-center gap-2 select-none" aria-label="DropToGit">
      <Image
        src="/logo-mark.svg"
        alt=""
        width={48}
        height={48}
        sizes={styles.sizes}
        className={`${styles.mark} shrink-0 object-contain`}
        aria-hidden="true"
      />
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
