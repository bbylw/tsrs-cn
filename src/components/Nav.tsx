import { useEffect, useId, useRef, useState } from 'react';
import { closeDialogWithMotion, prefersReducedMotion, useScrollSpy } from '../lib/hooks';

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
  const { active, isNative } = useScrollSpy(docs ? NO_IDS : IDS, !docs);
  const [open, setOpen] = useState(false);
  const drawerId = useId();
  const drawerRef = useRef<HTMLDialogElement | null>(null);
  const progressRef = useRef<HTMLDivElement | null>(null);

  // Fallback for browsers without CSS Scroll-Driven Animations (`animation-timeline: scroll()`)
  useEffect(() => {
    const bar = progressRef.current;
    if (!bar) return;
    const supportsNative =
      typeof CSS !== 'undefined' && CSS.supports('animation-timeline', 'scroll()');
    if (supportsNative || prefersReducedMotion()) {
      bar.style.transform = supportsNative ? '' : 'scaleX(0)';
      return;
    }

    const ac = new AbortController();
    let raf = 0;
    const update = () => {
      raf = 0;
      const max = document.documentElement.scrollHeight - window.innerHeight;
      const ratio = max > 0 ? Math.min(Math.max(window.scrollY / max, 0), 1) : 0;
      bar.style.transform = `scaleX(${ratio})`;
    };
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(update);
    };

    update();
    window.addEventListener('scroll', onScroll, { passive: true, signal: ac.signal });
    window.addEventListener('resize', onScroll, { passive: true, signal: ac.signal });
    return () => {
      ac.abort();
      cancelAnimationFrame(raf);
    };
  }, []);

  // Close mobile drawer automatically if viewport grows to desktop width
  useEffect(() => {
    const mq = window.matchMedia('(min-width: 768px)');
    const ac = new AbortController();
    const onChange = () => {
      if (mq.matches && drawerRef.current?.open) {
        drawerRef.current.removeAttribute('data-closing');
        drawerRef.current.close();
      }
    };
    mq.addEventListener('change', onChange, { signal: ac.signal });
    return () => ac.abort();
  }, []);

  const openDrawer = () => {
    const dlg = drawerRef.current;
    if (!dlg || dlg.open) return;
    dlg.removeAttribute('data-closing');
    dlg.showModal();
    setOpen(true);
  };

  const closeDrawer = () => {
    const dlg = drawerRef.current;
    if (!dlg || !dlg.open) return;
    void closeDialogWithMotion(dlg);
  };

  return (
    <header
      className={
        docs
          ? 'fixed inset-x-0 top-0 z-50 border-b border-seam/80 bg-coal/88 backdrop-blur-xl'
          : 'pointer-events-none fixed inset-x-0 top-0 z-50 px-3 pt-3 md:px-6 md:pt-4'
      }
      style={
        docs
          ? undefined
          : {
              paddingInlineStart: 'max(0.75rem, env(safe-area-inset-left, 0px))',
              paddingInlineEnd: 'max(0.75rem, env(safe-area-inset-right, 0px))',
            }
      }
    >
      {docs && (
        <div
          ref={progressRef}
          className="scroll-progress absolute inset-x-0 top-0 h-[2px] bg-gradient-to-r from-ember via-molten to-tsgo"
          style={{ transform: 'scaleX(0)' }}
          aria-hidden="true"
        />
      )}
      <div
        className={
          docs
            ? 'mx-auto flex h-16 max-w-7xl items-center gap-6 px-5 md:px-8'
            : 'floating-nav pointer-events-auto relative mx-auto flex h-14 max-w-5xl items-center gap-4 overflow-hidden rounded-2xl px-4 backdrop-blur-xl md:px-5'
        }
      >
        {!docs && (
          <div
            ref={progressRef}
            className="scroll-progress absolute inset-x-0 top-0 h-[2px] bg-gradient-to-r from-ember via-molten to-tsgo"
            style={{ transform: 'scaleX(0)' }}
            aria-hidden="true"
          />
        )}

        <a
          href={docs ? '#/' : '#top'}
          className="flex items-baseline gap-2.5 rounded-lg px-1 py-0.5"
          onClick={() => closeDrawer()}
        >
          <span className="text-lg font-bold tracking-tight">
            ts<span className="fire-text">rs</span>
          </span>
          <span className="num hidden text-[11px] text-ash sm:inline">7.1.0-beta.tsrs2</span>
        </a>

        <nav
          className={`ml-auto hidden items-center gap-1 md:flex ${docs ? '' : 'nav-spy'}`}
          aria-label="页面"
        >
          {docs ? (
            <>
              <a
                href="#/"
                className="rounded-lg px-3 py-1.5 text-sm font-medium text-fog transition-colors hover:bg-slab hover:text-bone"
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
                className="rounded-lg px-3 py-1.5 text-sm font-medium text-fog transition-colors hover:bg-slab hover:text-bone"
              >
                GitHub <span aria-hidden="true">↗</span>
              </a>
            </>
          ) : (
            <>
              {LINKS.map((l) => {
                const isActive = active === l.id;
                return (
                  <a
                    key={l.id}
                    href={`#${l.id}`}
                    aria-current={isActive ? 'true' : undefined}
                    className={`rounded-lg px-3 py-1.5 text-sm font-medium transition-colors ${
                      !isNative && isActive
                        ? 'target-current'
                        : 'text-fog hover:bg-slab/80 hover:text-bone'
                    }`}
                  >
                    {l.label}
                  </a>
                );
              })}
              <a
                href="#/docs"
                className="ml-1 rounded-lg px-3 py-1.5 text-sm font-medium text-fog transition-colors hover:bg-slab/80 hover:text-bone"
              >
                文档
              </a>
            </>
          )}
          <a
            className="btn-fire ml-2 !px-3.5 !py-1.5 text-sm"
            href="https://www.npmjs.com/package/tsrs"
            rel="noreferrer"
            target="_blank"
          >
            安装 tsrs
          </a>
        </nav>

        <button
          type="button"
          className="ml-auto flex h-10 w-10 cursor-pointer flex-col items-center justify-center gap-[5px] rounded-xl border border-edge/80 bg-coal/60 md:hidden"
          aria-expanded={open}
          aria-controls={drawerId}
          aria-label={open ? '关闭菜单' : '打开菜单'}
          onClick={() => (open ? closeDrawer() : openDrawer())}
        >
          <span
            aria-hidden="true"
            className={`h-[2px] w-4 rounded-full bg-bone transition-transform duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] ${open ? 'translate-y-[7px] rotate-45' : ''}`}
          />
          <span
            aria-hidden="true"
            className={`h-[2px] w-4 rounded-full bg-bone transition-opacity duration-200 ${open ? 'opacity-0' : ''}`}
          />
          <span
            aria-hidden="true"
            className={`h-[2px] w-4 rounded-full bg-bone transition-transform duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] ${open ? '-translate-y-[7px] -rotate-45' : ''}`}
          />
        </button>
      </div>

      <dialog
        ref={drawerRef}
        id={drawerId}
        className="nav-drawer md:hidden"
        aria-label="页面导航（移动端）"
        onClose={() => {
          drawerRef.current?.removeAttribute('data-closing');
          setOpen(false);
        }}
        onCancel={(e) => {
          if (e.cancelable) {
            e.preventDefault();
            closeDrawer();
          }
        }}
        onClick={(e) => {
          if (e.target === drawerRef.current) closeDrawer();
        }}
      >
        <div className="mb-6 flex items-center justify-between border-b border-seam pb-4">
          <span className="text-lg font-bold tracking-tight">
            ts<span className="fire-text">rs</span>
          </span>
          <button
            type="button"
            autoFocus
            onClick={closeDrawer}
            aria-label="关闭菜单"
            className="num inline-flex h-11 min-w-11 cursor-pointer items-center justify-center rounded-lg border border-edge px-3 text-xs font-semibold text-fog hover:border-flare hover:text-flare"
          >
            关闭{' '}
            <span aria-hidden="true" className="ml-1">
              ×
            </span>
          </button>
        </div>

        <nav aria-label="页面（移动端）">
          <ul className="flex flex-col gap-1.5">
            {docs && (
              <li>
                <a
                  href="#/"
                  className="flex min-h-11 items-center rounded-lg px-3 py-2.5 text-base font-medium text-fog hover:bg-slab hover:text-bone"
                  onClick={closeDrawer}
                >
                  首页
                </a>
              </li>
            )}
            {!docs &&
              LINKS.map((l) => (
                <li key={l.id}>
                  <a
                    href={`#${l.id}`}
                    aria-current={active === l.id ? 'true' : undefined}
                    className={`flex min-h-11 items-center rounded-lg px-3 py-2.5 text-base font-medium ${
                      active === l.id
                        ? 'bg-ember/15 text-flare'
                        : 'text-fog hover:bg-slab hover:text-bone'
                    }`}
                    onClick={closeDrawer}
                  >
                    {l.label}
                  </a>
                </li>
              ))}
            <li>
              <a
                href="#/docs"
                aria-current={docs ? 'page' : undefined}
                className={`flex min-h-11 items-center rounded-lg px-3 py-2.5 text-base font-medium ${
                  docs ? 'bg-ember/15 text-flare' : 'text-fog hover:bg-slab hover:text-bone'
                }`}
                onClick={closeDrawer}
              >
                文档
              </a>
            </li>
          </ul>
          <a
            className="btn-fire mt-6 flex w-full justify-center text-base"
            href="https://www.npmjs.com/package/tsrs"
            rel="noreferrer"
            target="_blank"
          >
            安装 tsrs
          </a>
        </nav>
      </dialog>
    </header>
  );
}
