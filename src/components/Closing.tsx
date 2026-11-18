import { Cmd, Reveal } from './ui';

export function Credits() {
  return (
    <section className="deferred-section relative py-14 md:py-20">
      <div className="mx-auto max-w-7xl px-5 md:px-8">
        <Reveal className="flex flex-wrap items-baseline gap-x-10 gap-y-4">
          <p className="tag">赞助与致谢</p>
          <div className="flex flex-wrap items-baseline gap-x-8 gap-y-2 text-lg font-semibold text-fog md:text-xl">
            <span>Depot CI</span>
            <span>Owner.com</span>
            <span>Max Schwenk</span>
            <span>@walkerdb</span>
            <span>@JiangWeixian</span>
            <span>TypeScript 团队</span>
          </div>
        </Reveal>
        <Reveal delay={100}>
          <p className="lead-pretty mt-6 max-w-xl text-sm leading-relaxed text-ash">
            Depot 为持续集成提供机器；Owner.com 赞助了项目的初期工作。我们不收 Pull
            Request——没有足够精力审查，但 issue 是开的。
          </p>
        </Reveal>
      </div>
    </section>
  );
}

export function FinalCta() {
  return (
    <section
      id="install"
      tabIndex={-1}
      className="deferred-section relative overflow-hidden py-20 md:py-28"
    >
      <div
        className="absolute inset-0 bg-gradient-to-br from-ember/18 via-coal to-cobalt/15"
        aria-hidden="true"
      />
      <div className="blueprint absolute inset-0 opacity-60" aria-hidden="true" />
      <div
        className="aurora aurora-ember -bottom-40 left-1/4 h-[420px] w-[560px]"
        aria-hidden="true"
      />
      <div className="relative mx-auto grid grid-cols-1 max-w-7xl items-center gap-10 px-5 md:px-8 lg:grid-cols-2">
        <Reveal>
          <h2 className="hero-h">
            先跑一遍，
            <br />
            <span className="fire-text">再决定。</span>
          </h2>
        </Reveal>
        <Reveal delay={120}>
          <div className="space-y-3">
            <Cmd text="pnpm add -D tsrs@next" />
            <Cmd text="pnpm exec tsrs --noEmit --fast" />
          </div>
          <p className="mt-5 max-w-md text-sm leading-relaxed text-fog">
            不想装也行，
            <a
              className="link-u"
              href="https://tsrs-playground.void.app"
              rel="noreferrer"
              target="_blank"
            >
              浏览器 playground
            </a>{' '}
            里可以直接检查并生成代码。没有预编译二进制的平台，用{' '}
            <b className="text-bone">@tsrs/wasm</b>（wasm32-wasip1）。
          </p>
        </Reveal>
      </div>
    </section>
  );
}

export function Foot() {
  return (
    <footer className="deferred-section border-t border-seam bg-soot/60">
      <div className="mx-auto grid grid-cols-1 max-w-7xl gap-4 px-5 py-10 md:grid-cols-2 md:px-8 lg:grid-cols-4">
        <Reveal className="panel p-5">
          <p className="num mb-3 text-[11px] tracking-wider text-ash uppercase">许可证</p>
          <p className="text-[13px] leading-relaxed text-ash">
            tsrs 是 TypeScript（版权归 Microsoft Corporation 所有）的衍生品，基于 Apache-2.0
            发布。随附的 <code className="num text-fog">lib.*.d.ts</code> 来自 TypeScript，署名见
            NOTICE。本项目与 Microsoft 无隶属关系，也未获其背书。
          </p>
        </Reveal>
        <Reveal delay={60} className="panel p-5">
          <p className="num mb-3 text-[11px] tracking-wider text-ash uppercase">页面</p>
          <nav className="grid grid-cols-2 gap-2 text-[13px] font-semibold" aria-label="页脚">
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
          <p className="num mt-4 border-t border-seam pt-3 text-xs text-ash">
            7.1.0-beta.tsrs2
            <br />
            2026-11-16 发布 · 2026-11-18 同步
          </p>
        </Reveal>
        <Reveal delay={120} className="panel p-5">
          <p className="num mb-3 text-[11px] tracking-wider text-ash uppercase">反馈</p>
          <p className="text-[13px] leading-relaxed text-ash">附一个最小复现，比描述一百句有用。</p>
          <a
            className="mt-3 inline-block font-bold text-flare hover:text-molten"
            href="https://github.com/oxc-project/tsrs/issues"
            rel="noreferrer"
            target="_blank"
          >
            issues <span aria-hidden="true">→</span>
          </a>
          <p className="num mt-4 border-t border-seam pt-3 text-xs text-ash">
            本站由 Vite+ 构建
            <br />
            类型检查由 tsrs 完成
          </p>
        </Reveal>
        <Reveal delay={180} className="flex flex-col gap-4">
          <a
            href="https://github.com/oxc-project/tsrs/issues"
            rel="noreferrer"
            target="_blank"
            className="group flex flex-1 items-center justify-between rounded-xl bg-gradient-to-br from-[#df450d] via-[#c63406] to-[#a82903] p-5 text-white transition-transform hover:-translate-y-1"
          >
            <span className="text-lg leading-snug font-extrabold">
              报 bug，
              <br />
              不发 PR。
            </span>
            <svg
              width="36"
              height="36"
              viewBox="0 0 44 44"
              fill="none"
              stroke="currentColor"
              strokeWidth="4"
              aria-hidden="true"
              className="transition-transform group-hover:translate-x-1 group-hover:-translate-y-1"
            >
              <path d="M10 34 L34 10" />
              <path d="M16 10 H34 V28" />
            </svg>
          </a>
          <p className="num text-center text-[11px] text-ash">
            tsrs · Apache-2.0 · 与 Microsoft 无隶属关系
          </p>
        </Reveal>
      </div>
    </footer>
  );
}
