import { useId } from 'react';
import { LINT_META, LINT_ROWS, fmtTime } from '../data/bench';
import { docHref } from '../lib/router';
import { Cmd, Reveal, SectionHead } from './ui';

const PRESET_ROWS: { what: string; def: string; fast: string }[] = [
  { what: 'checker 数量', def: '固定 4 个', fast: '自适应 · 每核一个 · 上限 32' },
  { what: '文件分配', def: 'Go 分配顺序', fast: '目录局部性 + work stealing' },
  { what: 'checker 历史', def: 'Go 历史', fast: '规范化历史' },
  { what: '类型成员', def: 'eager', fast: '惰性解析与实例化' },
  { what: '额外缓存', def: '无', fast: 'union-front · indexed-access · inference-walk' },
  { what: '.d.ts 解析', def: 'eager', fast: '惰性（需 skipLibCheck / noCheck）' },
];

const LINT_LANES = [
  { key: 'one', name: 'tsrs 一次运行', cls: 'fast', color: 'text-molten' },
  { key: 'go', name: 'tsgolint + tsgo', cls: 'go', color: 'text-tsgo' },
  { key: 'eslint', name: 'ESLint + tsc', cls: '', color: 'text-ash' },
] as const;

const width = (v: number, max: number) => (Math.log1p(v) / Math.log1p(max)) * 100;

export function FastLint() {
  const tableCaptionId = useId();
  return (
    <section id="fast" tabIndex={-1} className="deferred-section relative py-16 md:py-24">
      <div className="relative mx-auto max-w-7xl px-5 md:px-8">
        <SectionHead
          tag="--fast · tsrs-lint"
          title={
            <>
              默认对齐，<span className="fire-text">--fast 全速。</span>
            </>
          }
          lead={
            <>
              0.20.0 起默认模式刻意保持 TypeScript 的行为；加一个 --fast（或 TSRS_FAST=1），自适应
              checker、局部性调度、三类缓存与惰性成员全部打开。同一个引擎还接上了 Oxlint：type-aware
              lint 与类型检查，一次运行做完。
            </>
          }
        />

        <div className="grid grid-cols-1 items-stretch gap-5 lg:grid-cols-2">
          <Reveal className="panel flex flex-col justify-between overflow-hidden">
            <div>
              <div className="flex items-center justify-between gap-3 border-b border-seam bg-coal/40 px-5 py-3.5">
                <h3 className="font-semibold text-bone">一个开关，两类默认值</h3>
                <a className="link-u num text-xs font-semibold" href={docHref('fast')}>
                  完整对照 <span aria-hidden="true">→</span>
                </a>
              </div>
              <div
                tabIndex={0}
                role="region"
                aria-labelledby={tableCaptionId}
                className="overflow-x-auto"
              >
                <table className="num w-full min-w-[440px] border-separate border-spacing-0 text-[12.5px]">
                  <caption id={tableCaptionId} className="visually-hidden">
                    tsrs 默认模式与 --fast 性能预设配置项对照表
                  </caption>
                  <thead>
                    <tr className="text-left text-[11px] text-ash">
                      <th
                        scope="col"
                        className="sticky-col px-5 py-3 font-normal whitespace-nowrap"
                      >
                        配置项
                      </th>
                      <th scope="col" className="py-3 pr-4 font-normal whitespace-nowrap text-tsgo">
                        默认 (= TS)
                      </th>
                      <th
                        scope="col"
                        className="py-3 pr-5 font-normal whitespace-nowrap text-molten"
                      >
                        --fast
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {PRESET_ROWS.map((r) => (
                      <tr key={r.what} className="hover:bg-slab/40">
                        <th
                          scope="row"
                          className="sticky-col border-t border-seam/60 px-5 py-3 text-left font-normal whitespace-nowrap text-fog"
                        >
                          {r.what}
                        </th>
                        <td className="border-t border-seam/60 py-3 pr-4 text-ash">{r.def}</td>
                        <td className="border-t border-seam/60 py-3 pr-5 text-bone">{r.fast}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
            <p className="lead-pretty border-t border-seam bg-coal/30 px-5 py-4 text-[13px] leading-relaxed text-ash">
              19 个项目上 --fast 快 1.71×–6.62×，诊断与 TypeScript 逐项相同。少数依赖 checker
              历史的场景有已知边界，文档里逐个记录。
            </p>
          </Reveal>

          <Reveal
            delay={80}
            className="panel panel-glow flex flex-col justify-between overflow-hidden"
          >
            <div>
              <div className="flex items-center justify-between gap-3 border-b border-seam bg-coal/40 px-5 py-3.5">
                <h3 className="font-semibold text-bone">lint + 类型检查，一次跑完</h3>
                <a className="link-u num text-xs font-semibold" href={docHref('lint')}>
                  接入 Oxlint <span aria-hidden="true">→</span>
                </a>
              </div>
              <div className="px-5 py-4">
                <Cmd compact wrap text="TSRS_FAST=1 pnpm exec oxlint --type-aware --type-check" />
                <p className="lead-pretty mt-3 text-[13px] leading-relaxed text-ash">
                  tsrs-lint 实现 tsgolint 的全部 62 条规则，Oxlint ≥ 1.92.0 自动发现它。下面是
                  Outline 的 7 条规则、8 核下的墙钟时间：
                </p>

                <div className="mt-5 space-y-5">
                  {LINT_ROWS.map((row) => {
                    const max = row.eslint;
                    return (
                      <div key={row.project}>
                        <div className="mb-2 flex items-baseline justify-between">
                          <span className="text-sm font-semibold text-bone">{row.project}</span>
                          <span className="num text-xs font-semibold text-acid">
                            {Math.round(row.eslint / row.one)}× vs ESLint + tsc
                          </span>
                        </div>
                        <div className="space-y-1.5">
                          {LINT_LANES.map((lane) => {
                            const v = row[lane.key];
                            return (
                              <div key={lane.key} className="flex items-center gap-2.5">
                                <span className={`num w-32 shrink-0 text-[11px] ${lane.color}`}>
                                  {lane.name}
                                </span>
                                <div className="lane h-2.5 min-w-0 flex-1">
                                  <div
                                    className={`lane-fill ${lane.cls}`}
                                    style={
                                      lane.cls
                                        ? { width: `${width(v, max)}%` }
                                        : {
                                            width: `${width(v, max)}%`,
                                            background: 'linear-gradient(90deg,#3a4152,#5a6478)',
                                          }
                                    }
                                  />
                                </div>
                                <span className="num w-16 shrink-0 text-right text-[11px] text-fog">
                                  {fmtTime(v)}
                                </span>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            <p className="num border-t border-seam bg-coal/30 px-5 py-4 text-[11px] leading-relaxed text-ash">
              {LINT_META.machine} · {LINT_META.caveat}{' '}
              <a className="link-u" href={LINT_META.source} rel="noreferrer" target="_blank">
                来源 <span aria-hidden="true">↗</span>
              </a>
            </p>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
