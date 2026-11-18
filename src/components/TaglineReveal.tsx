import { useEffect, useRef, useState } from 'react';
import { prefersReducedMotion } from '../lib/hooks';

const SEGMENTS: { text: string; accent?: boolean; br?: boolean }[] = [
  { text: '同一套 ' },
  { text: 'TypeScript 语义，' },
  { text: '零改配置直替。', br: true },
  { text: '13,700 条编译基线与千仓验证，', accent: true },
  { text: '把分钟级全量检查，' },
  { text: '压进毫秒与秒级响应。', accent: true },
];

/**
 * Scroll-driven tagline reveal (landing-page-design B11):
 * segments illuminate smoothly in reading order as the section crosses the viewport.
 */
export function TaglineReveal() {
  const ref = useRef<HTMLElement | null>(null);
  const [litCount, setLitCount] = useState(() => (prefersReducedMotion() ? SEGMENTS.length : 1));

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (prefersReducedMotion()) {
      setLitCount(SEGMENTS.length);
      return;
    }

    const ac = new AbortController();
    let raf = 0;

    const update = () => {
      raf = 0;
      const rect = el.getBoundingClientRect();
      const vh = window.innerHeight || 800;
      // Progress from 0 when section enters lower 82% of viewport to 1 at upper 36%
      const progress = Math.min(Math.max((vh * 0.82 - rect.top) / (vh * 0.46), 0), 1);
      const next = Math.max(1, Math.ceil(progress * SEGMENTS.length));
      setLitCount((prev) => (prev === next ? prev : next));
    };

    const schedule = () => {
      if (!raf) raf = requestAnimationFrame(update);
    };

    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) schedule();
      },
      { threshold: [0, 0.2, 0.5, 0.8, 1] },
    );
    io.observe(el);

    window.addEventListener('scroll', schedule, { passive: true, signal: ac.signal });
    update();

    return () => {
      io.disconnect();
      ac.abort();
      cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <section
      ref={ref}
      className="deferred-section relative border-y border-seam/70 bg-soot/40 py-20 md:py-28"
    >
      <div className="mx-auto max-w-5xl px-5 md:px-8">
        <p className="tag mb-6">Drop-in Promise</p>
        <p className="max-w-[680px] text-3xl leading-[1.32] font-bold tracking-tight md:text-5xl md:leading-[1.24]">
          {SEGMENTS.map((seg, i) => (
            <span key={seg.text}>
              <span
                className={`tagline-word ${i < litCount ? 'lit' : ''} ${seg.accent ? 'accent' : ''}`}
              >
                {seg.text}
              </span>
              {seg.br && <br className="hidden sm:inline" />}
            </span>
          ))}
        </p>
      </div>
    </section>
  );
}
