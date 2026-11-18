import { Reveal, SectionHead } from './ui';
import { docHref } from '../lib/router';

const GROUPS = [
  {
    group: '入门',
    accent: 'text-flare',
    desc: '从零到第一次类型检查。',
    rows: [
      { name: 'tsrs 是什么', sub: '定位、现状与边界', slug: 'introduction' },
      { name: '安装与第一次运行', sub: '四种包管理器 + 版本策略', slug: 'install' },
      { name: 'CLI 用法', sub: '标志、内存调优、退出码', slug: 'cli' },
      { name: '--fast 性能预设', sub: '一个开关，五类默认值', slug: 'fast' },
    ],
  },
  {
    group: '证据',
    accent: 'text-acid',
    desc: '每个数字都可以交互复验。',
    rows: [
      { name: '性能基准', sub: '19 个项目 × 3 份编译器', slug: 'benchmarks' },
      { name: '一致性', sub: '19/19 诊断逐项相同', slug: 'consistency' },
      { name: '增量编辑', sub: '--watch 的毫秒级回路', slug: 'watch' },
    ],
  },
  {
    group: '集成',
    accent: 'text-tsgo',
    desc: '编辑器、Node、浏览器与 lint。',
    rows: [
      { name: '编辑器（LSP）', sub: 'VS Code / Neovim', slug: 'editors' },
      { name: 'Node API', sub: '968/968 测试通过', slug: 'api' },
      { name: 'WebAssembly', sub: 'wasm32-wasip1，无二进制平台', slug: 'wasm' },
      { name: 'Type-aware lint', sub: 'tsrs-lint × Oxlint · 61 条规则', slug: 'lint' },
    ],
  },
  {
    group: '项目',
    accent: 'text-info',
    desc: '路线、发布与参与方式。',
    rows: [
      { name: '状态与发布', sub: '发布节奏与已知限制', slug: 'status' },
      { name: '参与贡献', sub: '报 bug 不发 PR · 行为准则', slug: 'contributing' },
      { name: '浏览器 playground', sub: '不装也能跑', slug: 'play' },
    ],
  },
];

const UPSTREAM = [
  { name: '上游仓库', href: 'https://github.com/oxc-project/tsrs' },
  { name: 'issue 追踪器', href: 'https://github.com/oxc-project/tsrs/issues' },
  { name: '上游文档目录', href: 'https://github.com/oxc-project/tsrs/tree/main/docs' },
  { name: '基准方法论', href: 'https://github.com/oxc-project/tsrs/blob/main/bench/README.md' },
];

export function Docs() {
  return (
    <section id="docs" tabIndex={-1} className="deferred-section relative py-16 md:py-24">
      <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden="true">
        <div className="aurora aurora-acid bottom-0 -right-48 h-[420px] w-[420px]" />
      </div>
      <div className="relative mx-auto max-w-7xl px-5 md:px-8">
        <SectionHead
          tag="Docs"
          title={
            <>
              文档，<span className="ice-text">就在站内。</span>
            </>
          }
          lead="跟随上游 oxc-project/tsrs 同步整理的中文文档：入门、证据、集成与项目四组，侧栏检索、逐页互链，每个数字都标注上游来源。"
        />
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          {GROUPS.map((g, gi) => (
            <Reveal key={g.group} delay={gi * 70} className="panel p-5">
              <div className="mb-3 flex items-baseline justify-between gap-3">
                <p className={`num text-[11px] tracking-[0.2em] uppercase ${g.accent}`}>
                  {g.group}
                </p>
                <p className="text-xs text-ash">{g.desc}</p>
              </div>
              <div className="divide-y divide-seam/60">
                {g.rows.map((r) => (
                  <a
                    key={r.slug}
                    href={docHref(r.slug)}
                    className="group flex items-baseline justify-between gap-4 py-3 transition-transform hover:translate-x-1"
                  >
                    <span className="min-w-0">
                      <span className="text-[15px] font-semibold text-bone group-hover:text-flare">
                        {r.name}
                      </span>
                      <span className="block text-xs text-ash">{r.sub}</span>
                    </span>
                    <span
                      className="num shrink-0 text-ash transition-colors group-hover:text-flare"
                      aria-hidden="true"
                    >
                      →
                    </span>
                  </a>
                ))}
              </div>
            </Reveal>
          ))}
        </div>
        <Reveal delay={120} className="mt-6 flex flex-wrap items-center gap-x-6 gap-y-2">
          <span className="num text-[11px] tracking-[0.2em] text-ash uppercase">上游直达</span>
          {UPSTREAM.map((u) => (
            <a
              key={u.name}
              className="link-u text-sm font-semibold"
              href={u.href}
              rel="noreferrer"
              target="_blank"
            >
              {u.name} <span aria-hidden="true">↗</span>
            </a>
          ))}
          <a className="btn-ghost ml-auto !px-4 !py-2 text-sm" href={docHref('introduction')}>
            打开文档 <span aria-hidden="true">→</span>
          </a>
        </Reveal>
      </div>
    </section>
  );
}
