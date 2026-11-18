import { useEffect, useId, useRef, useState } from 'react';
import { Nav } from '../components/Nav';
import { closeDialogWithMotion, prefersReducedMotion } from '../lib/hooks';
import { docHref } from '../lib/router';
import { DOC_GROUPS, PAGES, SYNC_DATE } from './registry';

function SidebarLinks({
  slug,
  query,
  onNavigate,
}: {
  slug: string;
  query: string;
  onNavigate?: () => void;
}) {
  const q = query.trim().toLowerCase();
  const match = (title: string, keywords: string) =>
    !q || title.toLowerCase().includes(q) || keywords.toLowerCase().includes(q);
  const groups = DOC_GROUPS.map((g) => ({
    ...g,
    pages: g.pages.filter((p) => match(p.title, p.keywords)),
  })).filter((g) => g.pages.length > 0);

  if (groups.length === 0) {
    return <p className="px-3 py-6 text-sm text-ash">没有匹配「{query}」的页面。</p>;
  }
  return (
    <>
      {groups.map((g) => (
        <div key={g.name} className="mb-5">
          <p className={`num mb-2 px-3 text-[11px] tracking-[0.18em] uppercase ${g.accent}`}>
            {g.name}
          </p>
          <ul className="space-y-0.5">
            {g.pages.map((p) => (
              <li key={p.slug}>
                <a
                  href={docHref(p.slug)}
                  onClick={onNavigate}
                  aria-current={p.slug === slug ? 'page' : undefined}
                  className={`flex min-h-9 items-center rounded-lg border-l-2 px-3 py-2 text-[13.5px] font-semibold transition-colors ${
                    p.slug === slug
                      ? 'border-ember bg-ember/12 text-flare'
                      : 'border-transparent text-fog hover:bg-slab hover:text-bone'
                  }`}
                >
                  {p.title}
                </a>
              </li>
            ))}
          </ul>
        </div>
      ))}
    </>
  );
}

function Toc({ slug }: { slug: string }) {
  const [heads, setHeads] = useState<{ id: string; text: string }[]>([]);
  const [active, setActive] = useState('');

  useEffect(() => {
    const t = window.setTimeout(() => {
      const els = Array.from(document.querySelectorAll<HTMLElement>('.doc-body h2[id]'));
      const list = els.map((e) => ({ id: e.id, text: e.textContent ?? '' }));
      setHeads(list);
      setActive(list[0]?.id ?? '');
    }, 60);
    return () => window.clearTimeout(t);
  }, [slug]);

  useEffect(() => {
    if (heads.length < 2 || !('IntersectionObserver' in window)) return;
    const visible = new Set<string>();
    const io = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) visible.add(entry.target.id);
          else visible.delete(entry.target.id);
        }
        const firstVisible = heads.find((h) => visible.has(h.id));
        if (firstVisible) setActive(firstVisible.id);
      },
      { rootMargin: '-18% 0px -65% 0px', threshold: 0 },
    );
    for (const h of heads) {
      const el = document.getElementById(h.id);
      if (el) io.observe(el);
    }
    return () => io.disconnect();
  }, [heads]);

  if (heads.length < 2) return null;
  return (
    <nav
      className="sticky top-24 hidden max-h-[calc(100dvh-120px)] overflow-y-auto xl:block"
      aria-label="本页目录"
    >
      <p className="num mb-3 text-[11px] tracking-[0.18em] text-ash uppercase">本页目录</p>
      <ul className="space-y-1 border-l border-seam">
        {heads.map((h) => (
          <li key={h.id}>
            <a
              href={`#/docs/${slug}`}
              aria-current={active === h.id ? 'location' : undefined}
              onClick={(e) => {
                e.preventDefault();
                const target = document.getElementById(h.id);
                if (!target) return;
                target.scrollIntoView({
                  behavior: prefersReducedMotion() ? 'auto' : 'smooth',
                });
                target.focus({ preventScroll: true });
                setActive(h.id);
              }}
              className={`-ml-px block border-l-2 py-1 pl-3 text-xs leading-snug transition-colors ${
                active === h.id
                  ? 'border-ember font-semibold text-flare'
                  : 'border-transparent text-ash hover:text-fog'
              }`}
            >
              {h.text}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
}

export function DocsApp({ route }: { route: string }) {
  const slug = route.replace(/^docs\/?/, '') || PAGES[0].slug;
  const page = PAGES.find((p) => p.slug === slug);
  const [query, setQuery] = useState('');
  const [drawerOpen, setDrawerOpen] = useState(false);
  const bodyRef = useRef<HTMLDivElement>(null);
  const drawerRef = useRef<HTMLDialogElement | null>(null);
  const drawerId = useId();
  const desktopSearchId = useId();
  const mobileSearchId = useId();

  useEffect(() => {
    if (drawerRef.current?.open) {
      drawerRef.current.removeAttribute('data-closing');
      drawerRef.current.close();
    }
    setDrawerOpen(false);
    document.title = page ? `${page.title} · tsrs 文档` : 'tsrs · TypeScript 编译器的 Rust 实现';
    return () => {
      document.title = 'tsrs · TypeScript 编译器的 Rust 实现';
    };
  }, [slug, page]);

  useEffect(() => {
    const mq = window.matchMedia('(min-width: 1024px)');
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
    setDrawerOpen(true);
  };

  const closeDrawer = () => {
    const dlg = drawerRef.current;
    if (!dlg || !dlg.open) return;
    void closeDialogWithMotion(dlg);
  };

  const idx = page ? PAGES.indexOf(page) : -1;
  const prev = idx > 0 ? PAGES[idx - 1] : undefined;
  const next = idx >= 0 && idx < PAGES.length - 1 ? PAGES[idx + 1] : undefined;
  const group = DOC_GROUPS.find((g) => g.pages.some((p) => p.slug === slug));

  return (
    <>
      <a href="#main-content" className="skip-link visually-hidden">
        跳到文档正文
      </a>
      <div className="grain-wrap" aria-hidden="true">
        <div className="grain" />
      </div>
      <Nav docs />

      {/* 移动端目录触发条 */}
      <div className="sticky top-16 z-40 mt-16 border-b border-seam bg-coal/90 backdrop-blur-md lg:hidden">
        <button
          type="button"
          className="flex w-full cursor-pointer items-center justify-between px-5 py-3 text-sm font-semibold text-fog"
          aria-expanded={drawerOpen}
          aria-controls={drawerId}
          onClick={() => (drawerOpen ? closeDrawer() : openDrawer())}
        >
          <span>
            <span className="text-ash">文档 / </span>
            {page?.title ?? '未找到'}
          </span>
          <span className="num text-xs text-flare">
            {drawerOpen ? '收起' : '目录'} <span aria-hidden="true">{drawerOpen ? '▲' : '▼'}</span>
          </span>
        </button>
      </div>

      {/* 移动端文档抽屉（原生 top-layer dialog） */}
      <dialog
        ref={drawerRef}
        id={drawerId}
        className="nav-drawer lg:hidden"
        aria-label="文档目录"
        onClose={() => {
          drawerRef.current?.removeAttribute('data-closing');
          setDrawerOpen(false);
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
        <div className="mb-4 flex items-center justify-between border-b border-seam pb-3">
          <span className="num text-xs tracking-wider text-ash uppercase">文档目录</span>
          <button
            type="button"
            autoFocus
            onClick={closeDrawer}
            aria-label="关闭文档目录"
            className="num inline-flex h-11 min-w-11 cursor-pointer items-center justify-center rounded-lg border border-edge px-3 text-xs font-semibold text-fog hover:border-flare hover:text-flare"
          >
            关闭{' '}
            <span aria-hidden="true" className="ml-1">
              ×
            </span>
          </button>
        </div>
        <search className="mb-4 block">
          <label htmlFor={mobileSearchId} className="visually-hidden">
            搜索文档
          </label>
          <input
            id={mobileSearchId}
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="搜索文档…"
            className="w-full"
          />
        </search>
        <nav aria-label="文档导航（移动端）">
          <SidebarLinks slug={slug} query={query} onNavigate={closeDrawer} />
        </nav>
      </dialog>

      <div className="relative mx-auto grid w-full max-w-[1440px] grid-cols-1 gap-x-10 px-5 md:px-8 lg:grid-cols-[248px_minmax(0,1fr)] lg:pt-16">
        {/* 桌面侧栏 */}
        <aside
          className="sticky top-16 hidden max-h-[calc(100dvh-64px)] overflow-y-auto pt-8 pb-10 lg:block"
          aria-label="文档侧栏"
        >
          <search className="mb-5 block">
            <label htmlFor={desktopSearchId} className="visually-hidden">
              搜索文档
            </label>
            <input
              id={desktopSearchId}
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="搜索文档…"
              className="w-full"
            />
          </search>
          <nav aria-label="文档导航">
            <SidebarLinks slug={slug} query={query} />
          </nav>
          <div className="mt-2 border-t border-seam px-3 pt-4">
            <p className="num text-[11px] leading-relaxed text-ash">
              跟随上游同步 · {SYNC_DATE}
              <br />
              <a
                className="text-tsgo hover:text-info"
                href="https://github.com/oxc-project/tsrs"
                rel="noreferrer"
                target="_blank"
              >
                oxc-project/tsrs <span aria-hidden="true">↗</span>
              </a>
            </p>
          </div>
        </aside>

        <div
          className={`grid min-w-0 grid-cols-1 gap-x-10 ${page?.wide ? '' : 'xl:grid-cols-[minmax(0,1fr)_190px]'}`}
        >
          <main
            id="main-content"
            tabIndex={-1}
            className="doc-body min-w-0 pt-8 pb-16"
            ref={bodyRef}
          >
            {page ? (
              <>
                <nav
                  aria-label="面包屑"
                  className="num mb-4 flex flex-wrap items-center gap-x-2 gap-y-1 text-xs text-ash"
                >
                  <a className="hover:text-flare" href="#/">
                    首页
                  </a>
                  <span aria-hidden="true">/</span>
                  <span>{group?.name}</span>
                  <span aria-hidden="true">/</span>
                  <span className="text-fog" aria-current="page">
                    {page.title}
                  </span>
                </nav>
                {!page.bare && (
                  <header className="mb-8">
                    <h1 className="h2" tabIndex={-1}>
                      {page.title}
                    </h1>
                    {page.lead && (
                      <p className="lead-pretty mt-4 max-w-2xl text-[15px] leading-relaxed text-ash">
                        {page.lead}
                      </p>
                    )}
                    {page.source && (
                      <p className="num mt-4 text-xs text-ash">
                        上游来源：
                        <a
                          className="text-tsgo hover:text-info"
                          href={page.source}
                          rel="noreferrer"
                          target="_blank"
                        >
                          {page.source.replace(
                            'https://github.com/oxc-project/tsrs/blob/main/',
                            '',
                          )}{' '}
                          <span aria-hidden="true">↗</span>
                        </a>
                        <span className="mx-2 text-seam2" aria-hidden="true">
                          ·
                        </span>
                        同步于 {SYNC_DATE}
                      </p>
                    )}
                  </header>
                )}
                <div className={page.bare ? '' : 'prose-tsrs'}>
                  <page.Component />
                </div>
                <nav
                  className="mt-14 grid grid-cols-1 gap-3 border-t border-seam pt-6 sm:grid-cols-2"
                  aria-label="上一页 / 下一页"
                >
                  {prev ? (
                    <a
                      href={docHref(prev.slug)}
                      className="panel group p-4 transition-transform hover:-translate-y-0.5"
                    >
                      <span className="num text-[11px] text-ash">
                        <span aria-hidden="true">← </span>上一页
                      </span>
                      <span className="mt-1 block font-bold text-fog group-hover:text-flare">
                        {prev.title}
                      </span>
                    </a>
                  ) : (
                    <span />
                  )}
                  {next && (
                    <a
                      href={docHref(next.slug)}
                      className="panel group p-4 text-right transition-transform hover:-translate-y-0.5"
                    >
                      <span className="num text-[11px] text-ash">
                        下一页 <span aria-hidden="true">→</span>
                      </span>
                      <span className="mt-1 block font-bold text-fog group-hover:text-flare">
                        {next.title}
                      </span>
                    </a>
                  )}
                </nav>
              </>
            ) : (
              <div className="py-20 text-center">
                <p className="num text-6xl font-extrabold text-seam2" aria-hidden="true">
                  404
                </p>
                <h1 className="mt-4 text-lg font-bold text-bone" tabIndex={-1}>
                  这一页不存在。
                </h1>
                <p className="mt-2 text-sm text-ash">地址可能拼错了，或者上游还没有这份文档。</p>
                <a className="btn-fire mt-8 inline-flex" href={docHref(PAGES[0].slug)}>
                  回到文档首页
                </a>
              </div>
            )}
          </main>
          {page && !page.wide && <Toc slug={slug} />}
        </div>
      </div>
    </>
  );
}
