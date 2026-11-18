import { Cmd, Reveal } from './ui';

export function Credits() {
  return (
    <section className="deferred-section relative border-t border-seam/70 py-14 md:py-16">
      <div className="mx-auto max-w-7xl px-5 md:px-8">
        <Reveal className="flex flex-wrap items-baseline justify-between gap-x-10 gap-y-4">
          <div className="flex flex-wrap items-baseline gap-x-8 gap-y-3">
            <p className="tag">赞助与致谢</p>
            <div className="flex flex-wrap items-baseline gap-x-7 gap-y-2 text-base font-semibold text-fog md:text-lg">
              <span>Depot CI</span>
              <span>Owner.com</span>
              <span>Max Schwenk</span>
              <span>@walkerdb</span>
              <span>@JiangWeixian</span>
              <span>TypeScript 团队</span>
            </div>
          </div>
          <p className="lead-pretty max-w-md text-xs leading-relaxed text-ash">
            Depot 提供 CI 算力支持；Owner.com 赞助初期开发。当前不收外部 PR，欢迎通过 issue
            反馈复现。
          </p>
        </Reveal>
      </div>
    </section>
  );
}

export function FinalCta() {
  return (
    <section id="install" tabIndex={-1} className="deferred-section relative py-16 md:py-24">
      <div className="mx-auto max-w-7xl px-5 md:px-8">
        <Reveal className="panel-raised panel-glow grid grid-cols-1 items-center gap-10 p-8 md:p-12 lg:grid-cols-2">
          <div>
            <p className="tag mb-4">Get Started</p>
            <h2 className="hero-h">
              先跑一遍，
              <br />
              <span className="fire-text">再决定。</span>
            </h2>
          </div>
          <div>
            <div className="space-y-3">
              <Cmd text="pnpm add -D tsrs" />
              <Cmd text="pnpm exec tsrs --noEmit --fast" />
            </div>
            <p className="lead-pretty mt-5 max-w-md text-sm leading-relaxed text-fog">
              不想在本地装包，也可直接在{' '}
              <a
                className="link-u"
                href="https://tsrs-playground.void.app"
                rel="noreferrer"
                target="_blank"
              >
                浏览器 playground
              </a>{' '}
              内运行类型检查与代码生成；无原生二进制的平台可通过{' '}
              <b className="text-bone">@tsrs/wasm</b>（wasm32-wasip1）使用。
            </p>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

export function Foot() {
  return (
    <footer className="deferred-section border-t border-seam bg-soot/70">
      <div className="mx-auto max-w-7xl px-5 py-12 md:px-8">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-[1.4fr_1fr_1fr_1.1fr]">
          <div>
            <p className="text-lg font-bold tracking-tight text-bone">
              ts<span className="fire-text">rs</span>
            </p>
            <p className="lead-pretty mt-3 max-w-sm text-[13px] leading-relaxed text-ash">
              tsrs 是 TypeScript（版权归 Microsoft Corporation 所有）的衍生作品，基于 Apache-2.0
              发布。随附的 <code className="num text-fog">lib.*.d.ts</code> 来自 TypeScript，署名见
              NOTICE。本项目与 Microsoft 无隶属关系，也未获其背书。
            </p>
          </div>

          <div>
            <p className="num mb-3 text-[11px] tracking-wider text-ash uppercase">页面导航</p>
            <nav
              className="grid grid-cols-2 gap-x-4 gap-y-2 text-[13px] font-medium"
              aria-label="页脚"
            >
              <a className="text-fog hover:text-flare" href="#bench">
                基准
              </a>
              <a className="text-fog hover:text-flare" href="#consistency">
                一致性
              </a>
              <a className="text-fog hover:text-flare" href="#watch">
                增量编辑
              </a>
              <a className="text-fog hover:text-flare" href="#fast">
                快速模式
              </a>
              <a className="text-fog hover:text-flare" href="#start">
                上手
              </a>
              <a className="text-fog hover:text-flare" href="#/docs">
                文档
              </a>
            </nav>
          </div>

          <div>
            <p className="num mb-3 text-[11px] tracking-wider text-ash uppercase">版本与构建</p>
            <p className="num text-[13px] leading-relaxed text-fog">7.1.0-beta.tsrs3</p>
            <p className="num mt-1 text-xs leading-relaxed text-ash">
              2026-11-18 发布 · 2026-11-18 同步
            </p>
            <p className="num mt-3 text-xs leading-relaxed text-ash">
              本站由 Vite+ 构建 · 类型检查由 tsrs 完成
            </p>
          </div>

          <div className="flex flex-col justify-between">
            <a
              href="https://github.com/oxc-project/tsrs/issues"
              rel="noreferrer"
              target="_blank"
              className="group flex items-center justify-between rounded-xl bg-[#c83706] p-5 text-white transition-all duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] hover:-translate-y-0.5 hover:bg-[#d93e09]"
            >
              <div>
                <span className="block text-base leading-snug font-semibold">报 bug，不发 PR</span>
                <span className="mt-1 block text-xs text-white/80">
                  附最小复现前往 GitHub Issues
                </span>
              </div>
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.2"
                aria-hidden="true"
                className="shrink-0 transition-transform duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
              >
                <path d="M7 17 L17 7" />
                <path d="M9 7 H17 V15" />
              </svg>
            </a>
          </div>
        </div>

        <div className="mt-10 flex flex-wrap items-center justify-between gap-4 border-t border-seam/70 pt-6 text-xs text-ash">
          <p className="num">tsrs · Apache-2.0 · 与 Microsoft 无隶属关系</p>
          <a
            className="num text-ash hover:text-flare"
            href="https://github.com/oxc-project/tsrs"
            rel="noreferrer"
            target="_blank"
          >
            oxc-project/tsrs <span aria-hidden="true">↗</span>
          </a>
        </div>
      </div>
    </footer>
  );
}
