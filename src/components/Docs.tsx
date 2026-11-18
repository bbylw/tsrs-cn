import { Reveal, SectionHead } from './ui';

const DOCS = [
  {
    group: '命令行',
    accent: 'text-flare',
    rows: [
      {
        name: 'CLI 用法与内存调优',
        val: 'docs/USAGE.md',
        href: 'https://github.com/oxc-project/tsrs/blob/main/docs/USAGE.md',
      },
      {
        name: '发布说明',
        val: 'docs/STATUS.md',
        href: 'https://github.com/oxc-project/tsrs/blob/main/docs/STATUS.md',
      },
    ],
  },
  {
    group: '编辑器与 API',
    accent: 'text-tsgo',
    rows: [
      {
        name: '编辑器配置',
        val: 'docs/LSP.md',
        href: 'https://github.com/oxc-project/tsrs/blob/main/docs/LSP.md#editor-setup',
      },
      {
        name: 'Node API',
        sub: '接口仍在变动',
        val: 'docs/NODE_API.md',
        href: 'https://github.com/oxc-project/tsrs/blob/main/docs/NODE_API.md',
      },
      {
        name: 'WebAssembly',
        sub: 'Node 与浏览器，wasm32-wasip1',
        val: '@tsrs/wasm',
        href: 'https://github.com/oxc-project/tsrs/blob/main/npm/tsrs-wasm/README.md',
      },
    ],
  },
  {
    group: '研究与证据',
    accent: 'text-acid',
    rows: [
      {
        name: '基准测试与方法论',
        val: 'bench/README.md',
        href: 'https://github.com/oxc-project/tsrs/blob/main/bench/README.md',
      },
      {
        name: '工程笔记',
        val: 'notes/README.md',
        href: 'https://github.com/oxc-project/tsrs/blob/main/notes/README.md',
      },
      {
        name: '兼容性与证据',
        val: 'COMPATIBILITY.md',
        href: 'https://github.com/oxc-project/tsrs/blob/main/docs/COMPATIBILITY.md',
      },
    ],
  },
  {
    group: '参与',
    accent: 'text-info',
    rows: [
      {
        name: 'issue 追踪器',
        sub: '附一个最小可复现示例',
        val: 'github.com/oxc-project/tsrs',
        href: 'https://github.com/oxc-project/tsrs/issues',
      },
      {
        name: '贡献指南',
        sub: '从源码构建、跑测试套件',
        val: 'CONTRIBUTING.md',
        href: 'https://github.com/oxc-project/tsrs/blob/main/CONTRIBUTING.md',
      },
      {
        name: '行为准则',
        val: 'CODE_OF_CONDUCT.md',
        href: 'https://github.com/oxc-project/tsrs/blob/main/CODE_OF_CONDUCT.md',
      },
      {
        name: '安全策略',
        sub: '报告漏洞走这条线',
        val: 'SECURITY.md',
        href: 'https://github.com/oxc-project/tsrs/blob/main/SECURITY.md',
      },
      {
        name: '浏览器 playground',
        sub: '不装也能检查、也能生成代码',
        val: 'tsrs-playground.void.app',
        href: 'https://tsrs-playground.void.app',
      },
    ],
  },
];

export function Docs() {
  return (
    <section id="docs" className="relative py-16 md:py-24">
      <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden="true">
        <div className="aurora aurora-acid bottom-0 -right-48 h-[420px] w-[420px]" />
      </div>
      <div className="relative mx-auto max-w-7xl px-5 md:px-8">
        <SectionHead
          tag="Docs & Links"
          title={
            <>
              文档与<span className="ice-text">入口。</span>
            </>
          }
        />
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          {DOCS.map((g, gi) => (
            <Reveal key={g.group} delay={gi * 70} className="panel p-5">
              <p className={`num mb-3 text-[11px] tracking-[0.2em] uppercase ${g.accent}`}>
                {g.group}
              </p>
              <div className="divide-y divide-seam/60">
                {g.rows.map((r) => (
                  <a
                    key={r.name}
                    href={r.href}
                    rel="noreferrer"
                    target="_blank"
                    className="group flex items-baseline justify-between gap-4 py-3 transition-transform hover:translate-x-1"
                  >
                    <span className="min-w-0">
                      <span className="text-[15px] font-semibold text-bone group-hover:text-flare">
                        {r.name}
                      </span>
                      {r.sub && <span className="block text-xs text-ash">{r.sub}</span>}
                    </span>
                    <span className="num shrink-0 text-right text-xs text-ash group-hover:text-fog">
                      {r.val} ↗
                    </span>
                  </a>
                ))}
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
