'use client';

import { useEffect, useState } from 'react';
import { ArrowUp } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ScrollToTopButtonProps {
  targetId?: string;
  className?: string;
}

export function ScrollToTopButton({ targetId, className }: ScrollToTopButtonProps) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const target = targetId ? document.getElementById(targetId) : null;
    const source: Window | HTMLElement = target || window;
    const getOffset = () => (target ? target.scrollTop : window.scrollY);
    const handleScroll = () => setVisible(getOffset() > 260);

    source.addEventListener('scroll', handleScroll, { passive: true });
    return () => source.removeEventListener('scroll', handleScroll);
  }, [targetId]);

  if (!visible) return null;

  const scrollToTop = () => {
    const target = targetId ? document.getElementById(targetId) : null;
    if (target) {
      target.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  return (
    <button
      type="button"
      onClick={scrollToTop}
      aria-label="Scroll to top"
      title="Scroll to top"
      className={cn(
        'fixed bottom-6 right-6 z-50 inline-flex h-10 w-10 items-center justify-center rounded-full border border-border/80 bg-card/95 text-foreground shadow-lg shadow-black/15 backdrop-blur transition hover:-translate-y-0.5 hover:border-primary/50 hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary',
        className,
      )}
    >
      <ArrowUp className="h-4 w-4" />
    </button>
  );
}
