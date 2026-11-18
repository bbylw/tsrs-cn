import type { ReactNode } from 'react';
import { CopyButton } from '../components/ui';

export function H2({ id, children }: { id: string; children: ReactNode }) {
  return <h2 id={id}>{children}</h2>;
}

export function Callout({
  kind = 'info',
  children,
}: {
  kind?: 'info' | 'warn' | 'acid' | 'danger';
  children: ReactNode;
}) {
  const ico = { info: 'i', warn: '!', acid: '✓', danger: '×' }[kind];
  return (
    <div className={`callout callout-${kind}`}>
      <span className="callout-ico" aria-hidden="true">
        {ico}
      </span>
      <div className="min-w-0">{children}</div>
    </div>
  );
}

export function CodeBlock({ code, lang = 'sh' }: { code: string; lang?: string }) {
  return (
    <div className="overflow-hidden rounded-xl border border-seam bg-coal/80">
      <div className="flex items-center justify-between border-b border-seam/70 px-4 py-2">
        <span className="num text-[11px] tracking-wider text-ash uppercase">{lang}</span>
        <CopyButton text={code} />
      </div>
      <pre className="num overflow-x-auto px-4 py-3.5 text-[13px] leading-relaxed text-bone">
        <code>{code}</code>
      </pre>
    </div>
  );
}

export function DocTable({ head, rows }: { head: ReactNode[]; rows: ReactNode[][] }) {
  return (
    <div className="doc-scroll">
      <table>
        <thead>
          <tr>
            {head.map((h, i) => (
              <th key={i}>{h}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((r, i) => (
            <tr key={i}>
              {r.map((c, j) => (
                <td key={j}>{c}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export function Ext({ href, children }: { href: string; children: ReactNode }) {
  return (
    <a href={href} rel="noreferrer" target="_blank">
      {children} ↗
    </a>
  );
}
