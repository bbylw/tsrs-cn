import { useEffect, useRef, useState, type CSSProperties, type ReactNode } from 'react';
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

let lastCopyAnnouncement = '';

function legacyCopy(text: string): boolean {
  const field = Object.assign(document.createElement('textarea'), { value: text });
  field.setAttribute('readonly', '');
  field.style.cssText = 'position:fixed;inset-block-start:0;opacity:0';
  document.body.append(field);
  field.select();
  try {
    return document.execCommand('copy');
  } catch {
    return false;
  } finally {
    field.remove();
  }
}

export function CopyButton({
  text,
  label = '复制',
  targetLabel,
}: {
  text: string;
  label?: string;
  targetLabel?: string;
}) {
  const [status, setStatus] = useState<'idle' | 'done' | 'failed'>('idle');
  const [announcement, setAnnouncement] = useState('');
  const timer = useRef(0);

  useEffect(() => () => window.clearTimeout(timer.current), []);

  const report = (ok: boolean) => {
    window.clearTimeout(timer.current);
    setStatus(ok ? 'done' : 'failed');
    let msg = ok ? '已复制到剪贴板' : '复制失败';
    if (msg === lastCopyAnnouncement) msg += '\u00A0';
    lastCopyAnnouncement = msg;
    setAnnouncement('');
    requestAnimationFrame(() => setAnnouncement(msg));

    timer.current = window.setTimeout(() => {
      setStatus('idle');
      setAnnouncement('');
    }, 1800);
  };

  const handleCopy = async () => {
    try {
      if (navigator.clipboard?.writeText) {
        await navigator.clipboard.writeText(text);
        report(true);
        return;
      }
      report(legacyCopy(text));
    } catch {
      report(legacyCopy(text));
    }
  };

  return (
    <span className="inline-flex shrink-0 items-center">
      <button
        type="button"
        aria-label={`${label}：${targetLabel ?? text}`}
        className={`num shrink-0 cursor-pointer rounded-md border px-2.5 py-1 text-xs transition-colors ${
          status === 'done'
            ? 'border-acid/60 bg-acid/10 text-acid'
            : status === 'failed'
              ? 'border-danger/60 bg-danger/10 text-danger'
              : 'border-edge text-ash hover:border-flare hover:text-flare'
        }`}
        onClick={handleCopy}
      >
        {status === 'done' ? (
          <>
            <span aria-hidden="true">✓ </span>已复制
          </>
        ) : status === 'failed' ? (
          <>
            <span aria-hidden="true">× </span>复制失败
          </>
        ) : (
          label
        )}
      </button>
      <span className="visually-hidden" role="status">
        {announcement}
      </span>
    </span>
  );
}

export function Cmd({ text }: { text: string }) {
  return (
    <div className="flex items-center gap-3 rounded-lg border border-seam bg-coal/80 px-4 py-3">
      <span className="num select-none text-ember" aria-hidden="true">
        $
      </span>
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
  headingLevel = 'h2',
}: {
  tag: string;
  title: ReactNode;
  lead?: ReactNode;
  headingLevel?: 'h1' | 'h2';
}) {
  const Heading = headingLevel;
  return (
    <Reveal className="mb-10 md:mb-14">
      <p className="tag mb-4">{tag}</p>
      <Heading className="h2 max-w-3xl" tabIndex={headingLevel === 'h1' ? -1 : undefined}>
        {title}
      </Heading>
      {lead && (
        <p className="lead-pretty mt-5 max-w-2xl text-[15px] leading-relaxed text-ash md:text-base">
          {lead}
        </p>
      )}
    </Reveal>
  );
}

export function Legend() {
  return (
    <p className="num flex flex-wrap items-center gap-x-5 gap-y-2 text-xs text-ash">
      <span className="flex items-center gap-2">
        <i
          className="inline-block h-[3px] w-4 rounded-full bg-gradient-to-r from-cobalt to-tsgo"
          aria-hidden="true"
        />
        TypeScript 7.1 beta
      </span>
      <span className="flex items-center gap-2">
        <i
          className="inline-block h-[3px] w-4 rounded-full bg-gradient-to-r from-ember to-molten"
          aria-hidden="true"
        />
        tsrs
      </span>
      <span className="flex items-center gap-2">
        <i
          className="inline-block h-[3px] w-4 rounded-full bg-gradient-to-r from-molten to-acid"
          aria-hidden="true"
        />
        tsrs --fast
      </span>
    </p>
  );
}
