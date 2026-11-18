import { useEffect, useRef, useState } from 'react';

export const prefersReducedMotion = () =>
  typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

/** Adds `.on` when the element scrolls into view (once). */
export function useReveal<T extends HTMLElement>() {
  const ref = useRef<T | null>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (!('IntersectionObserver' in window) || prefersReducedMotion()) {
      el.classList.add('on');
      return;
    }
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting) {
            el.classList.add('on');
            io.disconnect();
          }
        }
      },
      { rootMargin: '0px 0px -8% 0px', threshold: 0.08 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);
  return ref;
}

/** Counts from 0 to `target` when `start` becomes true. */
export function useCountUp(target: number, start: boolean, decimals: number, duration = 1400) {
  const [value, setValue] = useState(0);
  useEffect(() => {
    if (!start) return;
    if (prefersReducedMotion()) {
      setValue(target);
      return;
    }
    let raf = 0;
    const t0 = performance.now();
    const tick = (now: number) => {
      const p = Math.min((now - t0) / duration, 1);
      const eased = 1 - Math.pow(1 - p, 3);
      setValue(target * eased);
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [target, start, duration]);
  return value.toFixed(decimals);
}

/** True once the element has been on screen. */
export function useInView<T extends HTMLElement>(rootMargin = '0px') {
  const ref = useRef<T | null>(null);
  const [inView, setInView] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (!('IntersectionObserver' in window)) {
      setInView(true);
      return;
    }
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting) {
            setInView(true);
            io.disconnect();
          }
        }
      },
      { rootMargin },
    );
    io.observe(el);
    return () => io.disconnect();
  }, [rootMargin]);
  return { ref, inView };
}

/**
 * Replays an N-lane compiler race on a compressed clock: the slowest lane always
 * finishes in `wallSeconds` of real time, every other lane finishes proportionally
 * earlier, exactly matching the published ratios.
 */
export function useRace(lanes: number[], wallSeconds = 4) {
  const [elapsed, setElapsed] = useState(0);
  const [running, setRunning] = useState(false);
  const rafRef = useRef(0);
  const lanesRef = useRef(lanes);
  lanesRef.current = lanes;
  const slowest = Math.max(...lanes);

  const stop = () => {
    cancelAnimationFrame(rafRef.current);
    rafRef.current = 0;
  };

  const replay = () => {
    stop();
    const total = Math.max(...lanesRef.current);
    if (prefersReducedMotion()) {
      setElapsed(total);
      setRunning(false);
      return;
    }
    setElapsed(0);
    setRunning(true);
    const speed = total / wallSeconds;
    let last = performance.now();
    let sim = 0;
    const tick = (now: number) => {
      sim += ((now - last) / 1000) * speed;
      last = now;
      if (sim >= total) {
        setElapsed(total);
        setRunning(false);
        rafRef.current = 0;
        return;
      }
      setElapsed(sim);
      rafRef.current = requestAnimationFrame(tick);
    };
    rafRef.current = requestAnimationFrame(tick);
  };

  useEffect(() => stop, []);

  return {
    elapsed,
    running,
    replay,
    done: lanes.map((s) => elapsed >= s),
    pct: lanes.map((s) => Math.min(elapsed / s, 1) * 100),
    allDone: elapsed >= slowest,
  };
}

/** Tracks which section id is currently nearest the top of the viewport. */
export function useScrollSpy(ids: string[]) {
  const [active, setActive] = useState('');
  useEffect(() => {
    const onScroll = () => {
      let current = '';
      for (const id of ids) {
        const el = document.getElementById(id);
        if (el && el.getBoundingClientRect().top <= 120) current = id;
      }
      setActive(current);
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, [ids]);
  return active;
}
