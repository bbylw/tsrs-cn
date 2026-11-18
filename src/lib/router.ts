import { useEffect, useRef, useState } from 'react';
import { flushSync } from 'react-dom';
import { prefersReducedMotion } from './hooks';

/** '#/docs/cli' -> 'docs/cli'; anything else (anchors, '', '#/') -> ''. */
const parse = () => {
  const h = window.location.hash;
  return h.startsWith('#/') ? h.slice(2).replace(/\/+$/, '') : '';
};

export function useRoute() {
  const [route, setRoute] = useState(parse);
  const routeRef = useRef(route);
  routeRef.current = route;

  useEffect(() => {
    const ac = new AbortController();
    const onHash = () => {
      const next = parse();
      if (next === routeRef.current) return;
      routeRef.current = next;

      if (
        typeof document !== 'undefined' &&
        'startViewTransition' in document &&
        !prefersReducedMotion()
      ) {
        (
          document as Document & { startViewTransition: (cb: () => void) => unknown }
        ).startViewTransition(() => {
          flushSync(() => setRoute(next));
        });
      } else {
        setRoute(next);
      }
    };

    window.addEventListener('hashchange', onHash, { signal: ac.signal });
    return () => ac.abort();
  }, []);

  return route;
}

export const docHref = (slug: string) => `#/docs/${slug}`;

/** Scroll & focus management on route change: docs pages start at top and route focus to the new heading. */
export function useRouteScroll(route: string) {
  const isFirst = useRef(true);

  useEffect(() => {
    const wasFirst = isFirst.current;
    isFirst.current = false;

    if (route) {
      window.scrollTo({ top: 0, behavior: 'instant' as ScrollBehavior });
      if (!wasFirst) {
        requestAnimationFrame(() => {
          const target = document.querySelector<HTMLElement>(
            'main h1[tabindex="-1"], main h1, #main-content',
          );
          target?.focus({ preventScroll: true });
        });
      }
      return;
    }

    const anchor = window.location.hash.slice(1);
    if (anchor && !anchor.startsWith('/')) {
      requestAnimationFrame(() => {
        const el = document.getElementById(anchor);
        el?.scrollIntoView();
        if (!wasFirst) el?.focus({ preventScroll: true });
      });
    } else {
      window.scrollTo({ top: 0, behavior: 'instant' as ScrollBehavior });
      if (!wasFirst) {
        requestAnimationFrame(() => {
          const target = document.querySelector<HTMLElement>(
            'main h1[tabindex="-1"], main h1, #main-content',
          );
          target?.focus({ preventScroll: true });
        });
      }
    }
  }, [route]);
}
