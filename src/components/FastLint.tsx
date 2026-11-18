import { LINT_META, LINT_ROWS, fmtTime } from '../data/bench';
import { docHref } from '../lib/router';
import { CopyButton, Reveal, SectionHead } from './ui';

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
  return (
    <section id="fast" className="relative py-16 md:py-24">
      <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden="true">
        <div className="aurora aurora-acid top-10 -right-48 h-[440px] w-[440px]" />
      </div>
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
              0.20.0 起默认模式刻意保持 TypeScript 的行为；加一个 --fast（或 TSRS_FAST=1）， 自适应
              checker、局部性调度、三类缓存与惰性成员全部打开。同一个引擎还接上了 Oxlint：type-aware
              lint 与类型检查，一次运行做完。
            </>
          }
        />

        <div className="grid grid-cols-1 items-start gap-5 lg:grid-cols-2">
          <Reveal className="panel overflow-hidden">
            <div className="flex items-center justify-between gap-3 border-b border-seam px-5 py-3.5">
              <h3 className="font-bold text-bone">一个开关，两类默认值</h3>
              <a className="link-u num text-xs font-semibold" href={docHref('fast')}>
                完整对照 →
              </a>
            </div>
            <div className="doc-scroll overflow-x-auto">
              <table className="num w-full min-w-[440px] text-[12.5px]">
                <thead>
                  <tr className="text-left text-[11px] text-ash">
                    <th className="px-5 py-2.5 font-normal"> </th>
                    <th className="py-2.5 pr-4 font-normal text-tsgo">默认（= TypeScript）</th>
                    <th className="py-2.5 pr-5 font-normal text-molten">--fast</th>
                  </tr>
                </thead>
                <tbody>
                  {PRESET_ROWS.map((r) => (
                    <tr key={r.what} className="border-t border-seam/50">
                      <td className="px-5 py-2.5 whitespace-nowrap text-fog">{r.what}</td>
                      <td className="py-2.5 pr-4 text-ash">{r.def}</td>
                      <td className="py-2.5 pr-5 text-bone">{r.fast}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <p className="border-t border-seam px-5 py-3.5 text-[13px] leading-relaxed text-ash">
              19 个项目上 --fast 快 1.71×–6.62×，诊断与 TypeScript 逐项相同。少数依赖 checker
              历史的场景有已知边界，文档里逐个记录。
            </p>
          </Reveal>

          <Reveal delay={100} className="panel panel-glow overflow-hidden">
            <div className="flex items-center justify-between gap-3 border-b border-seam px-5 py-3.5">
              <h3 className="font-bold text-bone">lint + 类型检查，一次跑完</h3>
              <a className="link-u num text-xs font-semibold" href={docHref('lint')}>
                接入 Oxlint →
              </a>
            </div>
            <div className="px-5 py-4">
              <div className="flex items-center gap-3 rounded-lg border border-seam bg-coal/80 px-4 py-3">
                <span className="num select-none text-ember">$</span>
                <code className="num min-w-0 flex-1 overflow-x-auto text-xs whitespace-nowrap text-bone">
                  TSRS_FAST=1 pnpm exec oxlint --type-aware --type-check
                </code>
                <CopyButton text="TSRS_FAST=1 pnpm exec oxlint --type-aware --type-check" />
              </div>
              <p className="mt-3 text-[13px] leading-relaxed text-ash">
                tsrs-lint 实现 tsgolint 的全部 61 条规则，Oxlint ≥ 1.92.0 自动发现它。 下面是
                Outline 的 7 条规则、8 核下的墙钟时间：
              </p>

              <div className="mt-4 space-y-5">
                {LINT_ROWS.map((row) => {
                  const max = row.eslint;
                  return (
                    <div key={row.project}>
                      <div className="mb-2 flex items-baseline justify-between">
                        <span className="text-sm font-bold text-bone">{row.project}</span>
                        <span className="num text-xs font-bold text-acid">
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
                              <div className="lane h-3 min-w-0 flex-1">
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

              <p className="num mt-4 border-t border-seam pt-3 text-[11px] leading-relaxed text-ash">
                {LINT_META.machine}
                <br />
                {LINT_META.caveat}{' '}
                <a className="link-u" href={LINT_META.source} rel="noreferrer" target="_blank">
                  来源 ↗
                </a>
              </p>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
