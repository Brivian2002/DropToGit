'use client';

import { ArrowDown, ArrowUp } from 'lucide-react';
import { useEffect, useState } from 'react';
import { cn } from '@/lib/utils';

interface ScrollControlsProps {
  targetId: string;
  active?: boolean;
  className?: string;
}

export function ScrollControls({ targetId, active = true, className }: ScrollControlsProps) {
  const [canScroll, setCanScroll] = useState(false);
  const [canScrollUp, setCanScrollUp] = useState(false);
  const [canScrollDown, setCanScrollDown] = useState(false);

  useEffect(() => {
    if (!active) {
      const resetFrame = window.requestAnimationFrame(() => {
        setCanScroll(false);
        setCanScrollUp(false);
        setCanScrollDown(false);
      });
      return () => window.cancelAnimationFrame(resetFrame);
    }

    let frame = 0;
    let target: HTMLElement | null = null;
    let resizeObserver: ResizeObserver | null = null;
    let mutationObserver: MutationObserver | null = null;

    const update = () => {
      if (!target) return;
      const maxScroll = Math.max(0, target.scrollHeight - target.clientHeight);
      setCanScroll(maxScroll > 8);
      setCanScrollUp(target.scrollTop > 8);
      setCanScrollDown(target.scrollTop < maxScroll - 8);
    };

    const attach = () => {
      target = document.getElementById(targetId);
      if (!target) {
        frame = window.requestAnimationFrame(attach);
        return;
      }

      update();
      target.addEventListener('scroll', update, { passive: true });
      window.addEventListener('resize', update);
      resizeObserver = new ResizeObserver(update);
      resizeObserver.observe(target);
      if (target.firstElementChild) resizeObserver.observe(target.firstElementChild);
      mutationObserver = new MutationObserver(update);
      mutationObserver.observe(target, { childList: true, subtree: true, characterData: true });
    };

    attach();

    return () => {
      window.cancelAnimationFrame(frame);
      target?.removeEventListener('scroll', update);
      window.removeEventListener('resize', update);
      resizeObserver?.disconnect();
      mutationObserver?.disconnect();
    };
  }, [active, targetId]);

  if (!active || !canScroll) return null;

  const target = () => document.getElementById(targetId);
  const scrollBy = (amount: number) => target()?.scrollBy({ top: amount, behavior: 'smooth' });
  const scrollTo = (top: number) => target()?.scrollTo({ top, behavior: 'smooth' });

  return (
    <div
      className={cn(
        'pointer-events-none absolute bottom-4 right-4 z-20 flex flex-col gap-1 rounded-full border border-border/80 bg-card/95 p-1 shadow-lg shadow-black/15 backdrop-blur',
        className,
      )}
      aria-label="Reader scroll controls"
    >
      <button
        type="button"
        onClick={() => scrollBy(-Math.max(240, window.innerHeight * 0.65))}
        disabled={!canScrollUp}
        aria-label="Scroll up"
        title="Scroll up"
        className="pointer-events-auto inline-flex h-9 w-9 items-center justify-center rounded-full text-foreground transition hover:bg-muted hover:text-primary disabled:pointer-events-none disabled:opacity-30 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
      >
        <ArrowUp className="h-4 w-4" />
      </button>
      <button
        type="button"
        onClick={() => scrollBy(Math.max(240, window.innerHeight * 0.65))}
        disabled={!canScrollDown}
        aria-label="Scroll down"
        title="Scroll down"
        className="pointer-events-auto inline-flex h-9 w-9 items-center justify-center rounded-full text-foreground transition hover:bg-muted hover:text-primary disabled:pointer-events-none disabled:opacity-30 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
      >
        <ArrowDown className="h-4 w-4" />
      </button>
      <button
        type="button"
        onClick={() => scrollTo(0)}
        aria-label="Back to top"
        title="Back to top"
        className="pointer-events-auto sr-only"
      >
        Back to top
      </button>
    </div>
  );
}
