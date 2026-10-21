import { useEffect, useRef, useState, type ElementType, type ReactNode } from 'react';

type RevealProps = {
  as?: ElementType;
  className?: string;
  id?: string;
  children: ReactNode;
};

/** Adds data-in once the block reaches the viewport; the CSS does the stagger. */
export function Reveal({ as: Tag = 'div', className = '', id, children }: RevealProps) {
  const ref = useRef<HTMLElement | null>(null);
  const [seen, setSeen] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el || seen) return;
    if (!('IntersectionObserver' in window)) {
      setSeen(true);
      return;
    }
    const io = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setSeen(true);
            io.disconnect();
          }
        }
      },
      { rootMargin: '0px 0px -12% 0px', threshold: 0.08 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, [seen]);

  return (
    <Tag ref={ref} id={id} className={'reveal ' + className} data-in={seen ? 'true' : 'false'}>
      {children}
    </Tag>
  );
}
