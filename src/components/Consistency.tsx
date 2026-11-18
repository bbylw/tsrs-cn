import { useState } from 'react';
import { ERROR_DIFFS, PROJECTS, SETTINGS } from '../data/bench';
import type { SettingId } from '../data/bench';
import { Cmd, Reveal, SectionHead } from './ui';

type TileState = 'same' | 'version' | 'bug';

export function Consistency() {
  const [setting, setSetting] = useState<SettingId>('default');
  const [open, setOpen] = useState<string | null>(null);
  const diffs = ERROR_DIFFS[setting];

  const tiles = PROJECTS.map((p) => {
    const d = diffs.find((e) => e.project === p.name);
    const state: TileState = !d ? 'same' : d.kind === 'bug' ? 'bug' : 'version';
    return { project: p.name, state, diff: d };
  });
  const sameCount = tiles.filter((t) => t.state === 'same').length;

  return (
    <section id="consistency" className="relative py-16 md:py-24">
      <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden="true">
        <div className="aurora aurora-blue top-20 -right-48 h-[460px] w-[460px]" />
      </div>
      <div className="relative mx-auto max-w-7xl px-5 md:px-8">
        <SectionHead
          tag="Conformance"
          title={
            <>
              <span className="text-acid">{sameCount} 个逐项相同</span>，其余的
              <span className="text-warn">有解释</span>。
            </>
          }
          lead={
            <>
              目标是 microsoft/TypeScript 的 main 分支，计划在 7.1 发布 100% 一致的稳定版。
              在现有项目的测试中，尚未发现 tsrs 存在正确性错误。点带颜色的格子看差异明细。
            </>
          }
        />

        <div className="grid grid-cols-1 items-start gap-8 lg:grid-cols-[minmax(0,7fr)_minmax(0,5fr)]">
          <div>
            <Reveal className="mb-4 flex flex-wrap items-center gap-4">
              <div className="seg" role="group" aria-label="checker 线程数">
                {SETTINGS.map((s) => (
                  <button
                    key={s.id}
                    type="button"
                    aria-pressed={setting === s.id}
                    title={s.note}
                    onClick={() => {
                      setSetting(s.id);
                      setOpen(null);
                    }}
                  >
                    {s.rail}
                  </button>
                ))}
              </div>
              <p className="num flex flex-wrap gap-x-4 gap-y-1 text-xs text-ash">
                <span>
                  <i className="mr-1.5 inline-block h-2.5 w-2.5 rounded-sm bg-acid align-baseline" />
                  相同
                </span>
                <span>
                  <i className="mr-1.5 inline-block h-2.5 w-2.5 rounded-sm bg-warn align-baseline" />
                  版本差异
                </span>
                <span>
                  <i className="mr-1.5 inline-block h-2.5 w-2.5 rounded-sm bg-danger align-baseline" />
                  真 bug
                </span>
              </p>
            </Reveal>

            <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 md:grid-cols-4">
              {tiles.map((t, i) => {
                const clickable = t.state !== 'same';
                const expanded = open === t.project;
                const palette =
                  t.state === 'same'
                    ? 'border-acid/25 bg-acid/6 text-acid'
                    : t.state === 'bug'
                      ? 'border-danger/50 bg-danger/10 text-danger'
                      : 'border-warn/40 bg-warn/8 text-warn';
                return (
                  <Reveal key={t.project} delay={i * 30}>
                    <button
                      type="button"
                      disabled={!clickable}
                      onClick={() => setOpen(expanded ? null : t.project)}
                      aria-expanded={clickable ? expanded : undefined}
                      className={`flex w-full flex-col gap-1.5 rounded-lg border p-3 text-left transition-all ${palette} ${
                        clickable ? 'cursor-pointer hover:-translate-y-0.5' : 'cursor-default'
                      } ${expanded ? 'ring-2 ring-current' : ''}`}
                    >
                      <span className="num truncate text-[12px] font-semibold text-bone">
                        {t.project}
                      </span>
                      <span className="num text-[11px]">
                        {t.state === 'same' && '✓ diff 为空'}
                        {t.state === 'version' && t.diff && (
                          <>
                            Δ{' '}
                            {t.diff.tsrs - t.diff.tsgo > 0
                              ? `+${t.diff.tsrs - t.diff.tsgo}`
                              : t.diff.tsrs - t.diff.tsgo}{' '}
                            · 版本
                          </>
                        )}
                        {t.state === 'bug' && '⚠ 位置不同 · bug'}
                      </span>
                    </button>
                  </Reveal>
                );
              })}
            </div>

            {open && (
              <div className="panel mt-4 p-4" aria-live="polite">
                {(() => {
                  const d = diffs.find((e) => e.project === open)!;
                  return (
                    <div className="num flex flex-wrap items-center gap-x-6 gap-y-2 text-sm">
                      <span className="font-bold text-bone">{d.project}</span>
                      <span className="text-tsgo">
                        tsgo {d.tsgo.toLocaleString('en-US')} 个错误
                      </span>
                      <span className="text-flare">
                        tsrs {d.tsrs.toLocaleString('en-US')} 个错误
                      </span>
                      <span className={d.kind === 'bug' ? 'font-bold text-danger' : 'text-warn'}>
                        {d.kind === 'bug'
                          ? '错误数同为 10,846，但位置不同——记在 tsrs 名下，没有别的解释。'
                          : '差异来自移植目标（7.1-dev）与对照版本（7.0.2）的差别，可逐条复现。'}
                      </span>
                    </div>
                  );
                })()}
              </div>
            )}
          </div>

          <div className="space-y-5">
            <Reveal delay={80} className="panel p-5">
              <h3 className="mb-2 font-bold text-bone">差在版本，不在语义。</h3>
              <p className="text-sm leading-relaxed text-ash">
                tsrs 移植的是 TypeScript 7.1 开发线上的提交，而这轮对照跑的是 tsgo 7.0.2。用{' '}
                <code className="num rounded bg-coal px-1.5 py-0.5 text-[12px] text-molten">
                  typescript@7.1.0-dev.20260930.4
                </code>{' '}
                构建，可以把 tsrs 的这批错误逐条复现。
              </p>
            </Reveal>
            <Reveal delay={140} className="panel p-5">
              <h3 className="mb-2 font-bold text-bone">还有一处顺序问题。</h3>
              <p className="mb-3 text-sm leading-relaxed text-ash">
                固定的 Go 编译器会按解析、模块解析与检查的并行顺序，给出不同的诊断与调用栈；tsrs
                默认对部分检查器历史做了规范化。要最接近的对照：
              </p>
              <Cmd text="tsrs --checkerAssignment go --noLazyMembers" />
            </Reveal>
            <Reveal delay={200} className="panel border-danger/30 p-5">
              <h3 className="mb-2 font-bold text-danger">一个真 bug。</h3>
              <p className="text-sm leading-relaxed text-ash">
                16 线程下，17 个项目有 10 个完全相同；drizzle-orm 的错误数同为 10,846，但位置不同。
                这一条记在 tsrs 名下，没有别的解释。切到「16」线程可以在左边看到它。
              </p>
            </Reveal>
            <Reveal delay={260} className="panel p-5">
              <h3 className="mb-2 font-bold text-bone">证据在仓库里。</h3>
              <p className="text-sm leading-relaxed text-ash">
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
                与{' '}
                <code className="num rounded bg-coal px-1.5 py-0.5 text-[12px] text-fog">
                  --showConfig
                </code>{' '}
                暂不支持。
              </p>
            </Reveal>
          </div>
        </div>
      </div>
    </section>
  );
}
