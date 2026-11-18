import { useEffect, useState } from 'react';

/** '#/docs/cli' -> 'docs/cli'; anything else (anchors, '', '#/') -> ''. */
const parse = () => {
  const h = window.location.hash;
  return h.startsWith('#/') ? h.slice(2).replace(/\/+$/, '') : '';
};

export function useRoute() {
  const [route, setRoute] = useState(parse);
  useEffect(() => {
    const onHash = () => setRoute(parse());
    window.addEventListener('hashchange', onHash);
    return () => window.removeEventListener('hashchange', onHash);
  }, []);
  return route;
}

export const docHref = (slug: string) => `#/docs/${slug}`;

/** Scroll management on route change: docs pages start at top; landing anchors land below the nav. */
export function useRouteScroll(route: string) {
  useEffect(() => {
    if (route) {
      window.scrollTo({ top: 0, behavior: 'instant' as ScrollBehavior });
      return;
    }
    const anchor = window.location.hash.slice(1);
    if (anchor && !anchor.startsWith('/')) {
      requestAnimationFrame(() => {
        document.getElementById(anchor)?.scrollIntoView();
      });
    } else {
      window.scrollTo({ top: 0, behavior: 'instant' as ScrollBehavior });
    }
  }, [route]);
}
