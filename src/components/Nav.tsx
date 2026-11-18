import { useEffect, useState } from 'react';
import { useScrollSpy } from '../lib/hooks';

const LINKS = [
  { id: 'bench', label: '基准' },
  { id: 'consistency', label: '一致性' },
  { id: 'watch', label: '增量编辑' },
  { id: 'fast', label: '快速模式' },
  { id: 'start', label: '上手' },
];
const IDS = LINKS.map((l) => l.id);
const NO_IDS: string[] = [];

export function Nav({ docs = false }: { docs?: boolean }) {
  const active = useScrollSpy(docs ? NO_IDS : IDS);
  const [progress, setProgress] = useState(0);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => {
      const max = document.documentElement.scrollHeight - window.innerHeight;
      setProgress(max > 0 ? window.scrollY / max : 0);
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <header className="fixed inset-x-0 top-0 z-50 border-b border-seam/70 bg-coal/85 backdrop-blur-md">
      <div
        className="absolute inset-x-0 top-0 h-[2px] origin-left bg-gradient-to-r from-ember via-molten to-tsgo"
        style={{ transform: `scaleX(${progress})` }}
        aria-hidden="true"
      />
      <div className="mx-auto flex h-16 max-w-7xl items-center gap-6 px-5 md:px-8">
        <a
          href={docs ? '#/' : '#top'}
          className="flex items-baseline gap-2.5"
          onClick={() => setOpen(false)}
        >
          <span className="text-xl font-extrabold tracking-tighter">
            ts<span className="fire-text">rs</span>
          </span>
          <span className="num hidden text-[11px] text-ash sm:inline">7.1.0-beta.tsrs2</span>
        </a>

        <nav className="ml-auto hidden items-center gap-1 md:flex" aria-label="页面">
          {docs ? (
            <>
              <a
                href="#/"
                className="rounded-lg px-3 py-1.5 text-sm font-semibold text-fog transition-colors hover:bg-slab hover:text-bone"
              >
                首页
              </a>
              <a
                href="#/docs"
                aria-current="page"
                className="rounded-lg bg-ember/15 px-3 py-1.5 text-sm font-semibold text-flare"
              >
                文档
              </a>
              <a
                href="https://github.com/oxc-project/tsrs"
                rel="noreferrer"
                target="_blank"
                className="rounded-lg px-3 py-1.5 text-sm font-semibold text-fog transition-colors hover:bg-slab hover:text-bone"
              >
                GitHub ↗
              </a>
            </>
          ) : (
            <>
              {LINKS.map((l) => (
                <a
                  key={l.id}
                  href={`#${l.id}`}
                  className={`rounded-lg px-3 py-1.5 text-sm font-semibold transition-colors ${
                    active === l.id
                      ? 'bg-ember/15 text-flare'
                      : 'text-fog hover:bg-slab hover:text-bone'
                  }`}
                >
                  {l.label}
                </a>
              ))}
              <a
                href="#/docs"
                className="rounded-lg border border-seam2 px-3 py-1.5 text-sm font-semibold text-bone transition-colors hover:border-tsgo hover:bg-cobalt/15"
              >
                文档
              </a>
            </>
          )}
          <a
            className="btn-fire ml-3 !px-4 !py-2 text-sm"
            href="https://www.npmjs.com/package/tsrs"
            rel="noreferrer"
            target="_blank"
          >
            安装 tsrs
          </a>
        </nav>

        <button
          type="button"
          className="ml-auto flex h-10 w-10 cursor-pointer flex-col items-center justify-center gap-[5px] rounded-lg border border-seam md:hidden"
          aria-expanded={open}
          aria-label={open ? '关闭菜单' : '打开菜单'}
          onClick={() => setOpen((v) => !v)}
        >
          <span
            className={`h-[2px] w-5 bg-bone transition-transform ${open ? 'translate-y-[7px] rotate-45' : ''}`}
          />
          <span className={`h-[2px] w-5 bg-bone transition-opacity ${open ? 'opacity-0' : ''}`} />
          <span
            className={`h-[2px] w-5 bg-bone transition-transform ${open ? '-translate-y-[7px] -rotate-45' : ''}`}
          />
        </button>
      </div>

      {open && (
        <nav
          className="border-t border-seam bg-soot px-5 py-4 md:hidden"
          aria-label="页面（移动端）"
        >
          <div className="flex flex-col gap-1">
            {docs && (
              <a
                href="#/"
                className="rounded-lg px-3 py-2.5 text-[15px] font-semibold text-fog"
                onClick={() => setOpen(false)}
              >
                首页
              </a>
            )}
            {!docs &&
              LINKS.map((l) => (
                <a
                  key={l.id}
                  href={`#${l.id}`}
                  className={`rounded-lg px-3 py-2.5 text-[15px] font-semibold ${
                    active === l.id ? 'bg-ember/15 text-flare' : 'text-fog'
                  }`}
                  onClick={() => setOpen(false)}
                >
                  {l.label}
                </a>
              ))}
            <a
              href="#/docs"
              className={`rounded-lg px-3 py-2.5 text-[15px] font-semibold ${
                docs ? 'bg-ember/15 text-flare' : 'text-fog'
              }`}
              onClick={() => setOpen(false)}
            >
              文档
            </a>
            <a
              className="btn-fire mt-2 justify-center text-sm"
              href="https://www.npmjs.com/package/tsrs"
              rel="noreferrer"
              target="_blank"
            >
              安装 tsrs
            </a>
          </div>
        </nav>
      )}
    </header>
  );
}
