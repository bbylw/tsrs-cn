import { useRef, useState, type CSSProperties, type ReactNode } from 'react';
import { useReveal } from '../lib/hooks';

export function Reveal({
  children,
  className = '',
  delay = 0,
  as: Tag = 'div',
  id,
}: {
  children: ReactNode;
  className?: string;
  delay?: number;
  as?: 'div' | 'section' | 'article' | 'li' | 'figure';
  id?: string;
}) {
  const ref = useReveal<HTMLElement>();
  return (
    <Tag
      id={id}
      ref={ref as never}
      className={`reveal ${className}`}
      style={{ '--rd': `${delay}ms` } as CSSProperties}
    >
      {children}
    </Tag>
  );
}

export function CopyButton({ text, label = '复制' }: { text: string; label?: string }) {
  const [done, setDone] = useState(false);
  const timer = useRef(0);
  return (
    <button
      type="button"
      className={`num shrink-0 cursor-pointer rounded-md border px-2.5 py-1 text-xs transition-all ${
        done
          ? 'border-acid/60 bg-acid/10 text-acid'
          : 'border-seam text-ash hover:border-flare hover:text-flare'
      }`}
      onClick={() => {
        navigator.clipboard?.writeText(text).then(
          () => {
            setDone(true);
            window.clearTimeout(timer.current);
            timer.current = window.setTimeout(() => setDone(false), 1600);
          },
          () => setDone(false),
        );
      }}
    >
      {done ? '✓ 已复制' : label}
    </button>
  );
}

export function Cmd({ text }: { text: string }) {
  return (
    <div className="flex items-center gap-3 rounded-lg border border-seam bg-coal/80 px-4 py-3">
      <span className="num select-none text-ember">$</span>
      <code className="num min-w-0 flex-1 overflow-x-auto text-sm whitespace-nowrap text-bone">
        {text}
      </code>
      <CopyButton text={text} />
    </div>
  );
}

export function SectionHead({
  tag,
  title,
  lead,
}: {
  tag: string;
  title: ReactNode;
  lead?: ReactNode;
}) {
  return (
    <Reveal className="mb-10 md:mb-14">
      <p className="tag mb-4">{tag}</p>
      <h2 className="h2 max-w-3xl">{title}</h2>
      {lead && (
        <p className="mt-5 max-w-2xl text-[15px] leading-relaxed text-ash md:text-base">{lead}</p>
      )}
    </Reveal>
  );
}

export function Legend() {
  return (
    <p className="num flex items-center gap-5 text-xs text-ash">
      <span className="flex items-center gap-2">
        <i className="inline-block h-[3px] w-4 rounded-full bg-gradient-to-r from-cobalt to-tsgo" />
        tsgo
      </span>
      <span className="flex items-center gap-2">
        <i className="inline-block h-[3px] w-4 rounded-full bg-gradient-to-r from-ember to-molten" />
        tsrs
      </span>
    </p>
  );
}
