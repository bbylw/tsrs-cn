import { useState } from 'react';
import { BENCH_META, CONFORMANCE, PROJECTS } from '../data/bench';
import { Reveal, SectionHead } from './ui';

export function Consistency({ docPage = false }: { docPage?: boolean }) {
  const [open, setOpen] = useState<string | null>(null);
  const openProject = PROJECTS.find((p) => p.id === open);
  const totalErrors = PROJECTS.reduce((n, p) => n + p.errors, 0);
  const CardHeading = docPage ? 'h2' : 'h3';

  return (
    <section
      id="consistency"
      tabIndex={-1}
      className={`${docPage ? '' : 'deferred-section '}relative py-16 md:py-24`}
    >
      <div className="relative mx-auto max-w-7xl px-5 md:px-8">
        <SectionHead
          tag="Conformance"
          headingLevel={docPage ? 'h1' : 'h2'}
          title={
            <>
              <span className="text-acid">19 / 19</span>，诊断逐项相同。
            </>
          }
          lead={
            <>
              最新一轮基准里，TypeScript、tsrs 与 tsrs --fast
              在每个项目上报出的诊断——文件、位置、错误码——逐项一致，包括{' '}
              {totalErrors.toLocaleString('en-US')} 条真实错误。点击任意项目卡片查看三方读数。
            </>
          }
        />

        <div className="grid grid-cols-1 items-start gap-8 lg:grid-cols-[minmax(0,7fr)_minmax(0,5fr)]">
          <div>
            <Reveal className="mb-4 flex flex-wrap items-center justify-between gap-x-5 gap-y-2">
              <p className="num flex items-center gap-2 text-xs text-ash">
                <i className="inline-block h-2 w-2 rounded-full bg-acid" aria-hidden="true" />
                全部相同 · 数字为实测报错数
              </p>
              <p className="num text-xs text-ash">TypeScript = tsrs = tsrs --fast</p>
            </Reveal>

            <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-3 md:grid-cols-4">
              {PROJECTS.map((p, i) => {
                const expanded = open === p.id;
                return (
                  <Reveal key={p.id} delay={i * 18}>
                    <button
                      type="button"
                      onClick={() => setOpen(expanded ? null : p.id)}
                      aria-expanded={expanded}
                      className={`flex w-full cursor-pointer flex-col gap-1.5 rounded-xl border p-3 text-left transition-colors ${
                        expanded
                          ? 'border-acid bg-acid/10 ring-1 ring-acid/50'
                          : 'border-seam bg-soot hover:border-seam2 hover:bg-slab'
                      }`}
                    >
                      <span className="flex w-full items-center justify-between gap-2">
                        <span className="num truncate text-[12px] font-semibold text-bone">
                          {p.name}
                        </span>
                        <span
                          className="h-1.5 w-1.5 shrink-0 rounded-full bg-acid"
                          aria-hidden="true"
                        />
                      </span>
                      <span className="num text-[11px] text-ash">
                        {p.errors === 0 ? (
                          <span className="text-acid/90">0 错误 · 干净</span>
                        ) : (
                          <span>
                            <span className="text-acid">{p.errors}</span> 条一致
                          </span>
                        )}
                      </span>
                    </button>
                  </Reveal>
                );
              })}
            </div>

            <div className="panel mt-4 p-4" aria-live="polite">
              {openProject ? (
                <div className="num flex flex-wrap items-center gap-x-6 gap-y-2 text-sm">
                  <span className="font-bold text-bone">{openProject.name}</span>
                  <span className="text-tsgo">TypeScript {openProject.errors}</span>
                  <span className="text-flare">tsrs {openProject.errors}</span>
                  <span className="text-molten">--fast {openProject.errors}</span>
                  <span className="font-semibold text-acid">
                    {openProject.errors === 0
                      ? '三者都干净，无诊断。'
                      : '文件 · 位置 · 错误码逐项相同。'}
                  </span>
                </div>
              ) : (
                <p className="num text-sm text-ash">
                  点任意一个项目，看三份编译器各自的错误读数。数据来自 {BENCH_META.date}{' '}
                  的同一轮基准。
                </p>
              )}
            </div>
          </div>

          <div className="space-y-4">
            <Reveal delay={60} className="panel p-5">
              <CardHeading className="mb-2 font-semibold text-bone">
                默认模式就是 TypeScript 的行为
              </CardHeading>
              <p className="lead-pretty text-sm leading-relaxed text-ash">
                0.20.0 起，默认沿用 pinned TypeScript 的 4 个 checker、Go 分配与 checker 历史、eager
                members。TypeScript 本身对 checker 数量与文件顺序敏感的地方，tsrs
                原样保留——一致性优先，加速靠 Rust 本身。
              </p>
            </Reveal>
            <Reveal delay={110} className="panel p-5">
              <div className="mb-2 flex items-center justify-between gap-2">
                <CardHeading className="font-semibold text-bone">--fast 的已知边界</CardHeading>
                <span className="chip !border-warn/30 !text-warn">可核验边界</span>
              </div>
              <p className="lead-pretty text-sm leading-relaxed text-ash">
                激进的 checker 分配与 lazy members 在少数依赖 checker
                历史或推导深度的场景可能改变诊断，上游在{' '}
                <a
                  className="link-u"
                  href="https://github.com/oxc-project/tsrs/blob/main/notes/open-history-dependence.md"
                  rel="noreferrer"
                  target="_blank"
                >
                  history-dependence 笔记
                </a>{' '}
                里逐个记录。本轮 19 个项目上 --fast 的诊断与 TypeScript 完全一致。
              </p>
            </Reveal>
            <Reveal delay={160} className="panel p-5">
              <CardHeading className="mb-2 font-semibold text-bone">证据在仓库里</CardHeading>
              <p className="lead-pretty text-sm leading-relaxed text-ash">
                哪些功能已支持、哪些还有差距，写在{' '}
                <a
                  className="link-u"
                  href="https://github.com/oxc-project/tsrs/blob/main/docs/COMPATIBILITY.md"
                  rel="noreferrer"
                  target="_blank"
                >
                  兼容性与证据
                </a>{' '}
                里，每次发布都跟着改。
                <code className="num rounded bg-coal px-1.5 py-0.5 text-[12px] text-fog">
                  --init
                </code>{' '}
                暂不支持（退出码 5），Windows 上{' '}
                <code className="num rounded bg-coal px-1.5 py-0.5 text-[12px] text-fog">
                  --watch
                </code>{' '}
                也还没有。
              </p>
            </Reveal>
          </div>
        </div>

        <Reveal className="mt-12">
          <p className="tag mb-5">仓库里的六份证据</p>
        </Reveal>
        <div className="grid grid-cols-1 gap-px overflow-hidden rounded-2xl border border-seam bg-seam sm:grid-cols-2 lg:grid-cols-3">
          {CONFORMANCE.map((c) => (
            <div key={c.id} className="flex flex-col justify-between bg-soot p-5 md:p-6">
              <div>
                <p className="num mb-2 text-[11px] tracking-wider text-ash uppercase">{c.label}</p>
                <p className="num mb-2 text-3xl font-bold text-bone">
                  {c.big}
                  <span className="ml-2 text-sm font-normal text-molten">{c.unit}</span>
                </p>
              </div>
              <p className="lead-pretty text-[13px] leading-relaxed text-ash">{c.detail}</p>
            </div>
          ))}
        </div>
        <Reveal className="mt-6">
          <p className="num text-xs leading-relaxed text-ash">
            来源：
            <a className="link-u" href={BENCH_META.source} rel="noreferrer" target="_blank">
              bench/RESULTS.md
            </a>{' '}
            ·{' '}
            <a
              className="link-u"
              href="https://github.com/oxc-project/tsrs/blob/main/docs/COMPATIBILITY.md"
              rel="noreferrer"
              target="_blank"
            >
              docs/COMPATIBILITY.md
            </a>{' '}
            ·{' '}
            <a
              className="link-u"
              href="https://github.com/oxc-project/tsrs/blob/main/tasks/determinism/README.md"
              rel="noreferrer"
              target="_blank"
            >
              tasks/determinism
            </a>
          </p>
        </Reveal>
      </div>
    </section>
  );
}
