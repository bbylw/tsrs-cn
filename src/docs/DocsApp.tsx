import { useEffect, useRef, useState } from 'react';
import { Nav } from '../components/Nav';
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
                  className={`block rounded-lg border-l-2 px-3 py-2 text-[13.5px] font-semibold transition-colors ${
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
      setHeads(els.map((e) => ({ id: e.id, text: e.textContent ?? '' })));
    }, 60);
    return () => window.clearTimeout(t);
  }, [slug]);

  useEffect(() => {
    if (heads.length === 0) return;
    const onScroll = () => {
      let cur = heads[0]?.id ?? '';
      for (const h of heads) {
        const el = document.getElementById(h.id);
        if (el && el.getBoundingClientRect().top <= 140) cur = h.id;
      }
      setActive(cur);
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, [heads]);

  if (heads.length < 2) return null;
  return (
    <nav
      className="sticky top-24 hidden max-h-[calc(100vh-120px)] overflow-y-auto xl:block"
      aria-label="本页目录"
    >
      <p className="num mb-3 text-[11px] tracking-[0.18em] text-ash uppercase">本页目录</p>
      <ul className="space-y-1 border-l border-seam">
        {heads.map((h) => (
          <li key={h.id}>
            <a
              href={`#/docs/${slug}`}
              onClick={(e) => {
                e.preventDefault();
                document.getElementById(h.id)?.scrollIntoView({ behavior: 'smooth' });
              }}
              className={`-ml-px block border-l-2 py-1 pl-3 text-xs leading-snug transition-colors ${
                active === h.id
                  ? 'border-ember text-flare'
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
  const [drawer, setDrawer] = useState(false);
  const bodyRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setDrawer(false);
    document.title = page ? `${page.title} · tsrs 文档` : 'tsrs · TypeScript 编译器的 Rust 实现';
    return () => {
      document.title = 'tsrs · TypeScript 编译器的 Rust 实现';
    };
  }, [slug, page]);

  const idx = page ? PAGES.indexOf(page) : -1;
  const prev = idx > 0 ? PAGES[idx - 1] : undefined;
  const next = idx >= 0 && idx < PAGES.length - 1 ? PAGES[idx + 1] : undefined;
  const group = DOC_GROUPS.find((g) => g.pages.some((p) => p.slug === slug));

  return (
    <>
      <div className="grain" aria-hidden="true" />
      <Nav docs />
      <div className="pointer-events-none fixed inset-0 overflow-hidden" aria-hidden="true">
        <div className="aurora aurora-blue -top-32 -right-40 h-[460px] w-[460px] opacity-60" />
        <div className="aurora aurora-ember -bottom-48 -left-40 h-[420px] w-[420px] opacity-50" />
      </div>

      {/* 移动端目录栏 */}
      <div className="sticky top-16 z-40 border-b border-seam bg-coal/90 backdrop-blur-md lg:hidden">
        <button
          type="button"
          className="flex w-full cursor-pointer items-center justify-between px-5 py-3 text-sm font-semibold text-fog"
          aria-expanded={drawer}
          onClick={() => setDrawer((v) => !v)}
        >
          <span>
            <span className="text-ash">文档 / </span>
            {page?.title ?? '未找到'}
          </span>
          <span className="num text-xs text-flare">{drawer ? '收起 ▲' : '目录 ▼'}</span>
        </button>
        {drawer && (
          <div className="max-h-[60vh] overflow-y-auto border-t border-seam bg-soot px-3 py-4">
            <input
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="搜索文档…"
              aria-label="搜索文档"
              className="mb-4 w-full"
            />
            <SidebarLinks slug={slug} query={query} onNavigate={() => setDrawer(false)} />
          </div>
        )}
      </div>

      <div className="relative mx-auto grid w-full max-w-[1440px] grid-cols-1 gap-x-10 px-5 md:px-8 lg:grid-cols-[248px_minmax(0,1fr)]">
        {/* 桌面侧栏 */}
        <aside className="sticky top-16 hidden max-h-[calc(100vh-64px)] overflow-y-auto pt-8 pb-10 lg:block">
          <input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="搜索文档…"
            aria-label="搜索文档"
            className="mb-5 w-full"
          />
          <SidebarLinks slug={slug} query={query} />
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
                oxc-project/tsrs ↗
              </a>
            </p>
          </div>
        </aside>

        <div
          className={`grid min-w-0 grid-cols-1 gap-x-10 ${page?.wide ? '' : 'xl:grid-cols-[minmax(0,1fr)_190px]'}`}
        >
          <main className="doc-body min-w-0 pt-8 pb-16" ref={bodyRef}>
            {page ? (
              <>
                <p className="num mb-4 flex flex-wrap items-center gap-x-2 gap-y-1 text-xs text-ash">
                  <a className="hover:text-flare" href="#/">
                    首页
                  </a>
                  <span aria-hidden="true">/</span>
                  <span>{group?.name}</span>
                  <span aria-hidden="true">/</span>
                  <span className="text-fog">{page.title}</span>
                </p>
                {!page.bare && (
                  <header className="mb-8">
                    <h1 className="h2">{page.title}</h1>
                    {page.lead && (
                      <p className="mt-4 max-w-2xl text-[15px] leading-relaxed text-ash">
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
                          ↗
                        </a>
                        <span className="mx-2 text-seam2">·</span>同步于 {SYNC_DATE}
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
                      <span className="num text-[11px] text-ash">← 上一页</span>
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
                      <span className="num text-[11px] text-ash">下一页 →</span>
                      <span className="mt-1 block font-bold text-fog group-hover:text-flare">
                        {next.title}
                      </span>
                    </a>
                  )}
                </nav>
              </>
            ) : (
              <div className="py-20 text-center">
                <p className="num text-6xl font-extrabold text-seam2">404</p>
                <p className="mt-4 text-lg font-bold text-bone">这一页不存在。</p>
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
