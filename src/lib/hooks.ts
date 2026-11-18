import { useEffect, useRef, useState } from 'react';

export const prefersReducedMotion = () =>
  typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

let supportsDisplayTransition: boolean | undefined;

function canTransitionDisplay() {
  if (supportsDisplayTransition !== undefined) return supportsDisplayTransition;
  if (
    typeof window === 'undefined' ||
    !window.CSS?.supports?.('transition-behavior', 'allow-discrete') ||
    !document.body
  ) {
    return false;
  }
  const probe = document.createElement('div');
  probe.style.cssText = 'transition: display 1s allow-discrete !important; display: block;';
  document.body.appendChild(probe);
  if (getComputedStyle(probe).display !== 'block') {
    probe.remove();
    supportsDisplayTransition = false;
    return false;
  }
  probe.style.display = 'none';
  supportsDisplayTransition = getComputedStyle(probe).display === 'block';
  probe.remove();
  return supportsDisplayTransition;
}

/** Detects whether top-layer elements animate out natively via `overlay` + discrete `display`. */
export function supportsTopLayerExit() {
  return (
    typeof window !== 'undefined' &&
    Boolean(window.CSS?.supports?.('overlay', 'auto')) &&
    canTransitionDisplay()
  );
}

/** Closes a modal `<dialog>` with an exit transition fallback when `overlay` is unsupported. */
export async function closeDialogWithMotion(dialog: HTMLDialogElement) {
  if (!dialog.open) return;
  if (prefersReducedMotion() || supportsTopLayerExit()) {
    dialog.close();
    return;
  }
  dialog.setAttribute('data-closing', '');
  const animations = dialog.getAnimations({ subtree: true });
  if (animations.length > 0) {
    await Promise.race([
      Promise.allSettled(animations.map((a) => a.finished)),
      new Promise<void>((resolve) => window.setTimeout(resolve, 400)),
    ]);
  }
  if (!dialog.hasAttribute('data-closing')) return;
  dialog.removeAttribute('data-closing');
  if (dialog.open) dialog.close();
}

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

/**
 * Tracks the currently active section id for scrollspy navigation.
 * Uses CSS `scroll-target-group: auto` + `:target-current` where supported to sync `aria-current`,
 * falling back to `IntersectionObserver` where unsupported.
 */
export function useScrollSpy(ids: string[], enabled = true) {
  const [active, setActive] = useState('');
  const idsKey = ids.join('|');

  useEffect(() => {
    if (!enabled || ids.length === 0) {
      setActive('');
      return;
    }

    const supportsNative = typeof CSS !== 'undefined' && CSS.supports('scroll-target-group: auto');

    if (supportsNative) {
      const ac = new AbortController();
      const syncFromNative = () => {
        const currentLink = document.querySelector<HTMLAnchorElement>('.nav-spy a:target-current');
        const href = currentLink?.getAttribute('href') ?? '';
        setActive(href.startsWith('#') ? href.slice(1) : '');
      };
      const raf = requestAnimationFrame(syncFromNative);
      document.addEventListener('scrollend', syncFromNative, { signal: ac.signal, passive: true });
      return () => {
        cancelAnimationFrame(raf);
        ac.abort();
      };
    }

    if (!('IntersectionObserver' in window)) return;

    const visible = new Set<string>();
    const io = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) visible.add(entry.target.id);
          else visible.delete(entry.target.id);
        }
        let current = '';
        for (let i = ids.length - 1; i >= 0; i--) {
          if (visible.has(ids[i])) {
            current = ids[i];
            break;
          }
        }
        setActive(current);
      },
      { rootMargin: '-25% 0px -60% 0px', threshold: 0 },
    );

    for (const id of ids) {
      const el = document.getElementById(id);
      if (el) io.observe(el);
    }

    return () => io.disconnect();
  }, [idsKey, enabled]);

  return active;
}
