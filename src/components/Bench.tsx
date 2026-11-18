import { useMemo, useState } from 'react';
import { ERROR_DIFFS, PROJECTS, SETTINGS, fmtMem, fmtRatio, fmtTime } from '../data/bench';
import type { Project, SettingId } from '../data/bench';
import { Legend, Reveal, SectionHead } from './ui';

type Metric = 'time' | 'mem';
type Scale = 'linear' | 'log';
type Sort = 'ratio' | 'tsgo' | 'tsrs' | 'name';
type View = 'race' | 'table';

const THREADS = ['t4', 't8', 't16'] as const;

function MemoryCurve({ project, setting }: { project: Project; setting: SettingId }) {
  const W = 280;
  const H = 84;
  const LABEL = 24;
  const max = Math.max(...THREADS.map((s) => project.runs[s].tsgo.m)) * 1.14;
  const px = (i: number) => 12 + (i * (W - 28)) / 2;
  const py = (v: number) => H - 4 - (v / max) * (H - 14);
  const line = (pick: (s: (typeof THREADS)[number]) => number) =>
    THREADS.map(
      (s, i) => `${i === 0 ? 'M' : 'L'}${px(i).toFixed(1)} ${py(pick(s)).toFixed(1)}`,
    ).join(' ');
  const markIndex = setting === 'default' ? -1 : THREADS.indexOf(setting);

  return (
    <svg
      viewBox={`0 0 ${W} ${H + LABEL}`}
      className="w-full"
      role="img"
      aria-label={`${project.name} 的峰值内存随线程数变化：tsgo 上升，tsrs 基本持平`}
    >
      {[0.25, 0.5, 0.75].map((f) => (
        <line
          key={f}
          x1={8}
          x2={W - 8}
          y1={py(max * f)}
          y2={py(max * f)}
          stroke="var(--color-seam)"
          strokeDasharray="3 4"
          strokeWidth="1"
        />
      ))}
      <path
        d={line((s) => project.runs[s].tsgo.m)}
        fill="none"
        stroke="var(--color-tsgo)"
        strokeWidth="2.2"
      />
      <path
        d={line((s) => project.runs[s].tsrs.m)}
        fill="none"
        stroke="var(--color-ember)"
        strokeWidth="2.2"
      />
      {THREADS.map((s, i) => (
        <g key={s}>
          <circle
            cx={px(i)}
            cy={py(project.runs[s].tsgo.m)}
            r={markIndex === i ? 4.5 : 2.8}
            fill="var(--color-tsgo)"
          />
          <circle
            cx={px(i)}
            cy={py(project.runs[s].tsrs.m)}
            r={markIndex === i ? 4.5 : 2.8}
            fill="var(--color-ember)"
          />
          <text
            x={px(i)}
            y={H + LABEL - 7}
            fontSize="12"
            fill="var(--color-ash)"
            textAnchor={i === 0 ? 'start' : i === 2 ? 'end' : 'middle'}
            fontFamily="var(--font-mono)"
          >
            {s === 't4' ? '4 线程' : s === 't8' ? '8 线程' : '16 线程'}
          </text>
        </g>
      ))}
    </svg>
  );
}

function Detail({ project, setting }: { project: Project; setting: SettingId }) {
  const run = project.runs[setting];
  const diff = ERROR_DIFFS[setting].find((e) => e.project === project.name);
  return (
    <aside className="panel panel-glow sticky top-24 p-5" aria-live="polite">
      <div className="mb-4 flex items-center justify-between gap-3">
        <h3 className="num text-lg font-bold text-bone">{project.name}</h3>
        <span className="chip">{SETTINGS.find((s) => s.id === setting)?.label}</span>
      </div>

      <div className="mb-4 grid grid-cols-2 gap-3">
        <div className="rounded-lg border border-ember/30 bg-ember/8 p-3">
          <p className="num text-[11px] text-ash">时间</p>
          <p className="num mt-1 text-3xl font-bold text-molten">{fmtRatio(run.tsrs.rt)}</p>
        </div>
        <div className="rounded-lg border border-tsgo/30 bg-tsgo/8 p-3">
          <p className="num text-[11px] text-ash">内存</p>
          <p className="num mt-1 text-3xl font-bold text-tsgo">{fmtRatio(run.tsrs.rm)}</p>
        </div>
      </div>

      <dl className="num grid grid-cols-[1fr_auto] gap-x-4 gap-y-2 text-[13px]">
        <dt className="text-ash">tsgo 耗时</dt>
        <dd className="text-right text-fog">{fmtTime(run.tsgo.t)}</dd>
        <dt className="text-ash">tsrs 耗时</dt>
        <dd className="text-right font-bold text-flare">{fmtTime(run.tsrs.t)}</dd>
        <dt className="text-ash">tsgo 峰值内存</dt>
        <dd className="text-right text-fog">{fmtMem(run.tsgo.m)}</dd>
        <dt className="text-ash">tsrs 峰值内存</dt>
        <dd className="text-right font-bold text-flare">{fmtMem(run.tsrs.m)}</dd>
        <dt className="text-ash">错误数</dt>
        <dd className="text-right text-fog">
          {diff
            ? `${diff.tsgo.toLocaleString('en-US')} → ${diff.tsrs.toLocaleString('en-US')}`
            : '与 tsgo 相同'}
        </dd>
      </dl>

      <div className="mt-5 border-t border-seam pt-4">
        <p className="num mb-1 text-[11px] tracking-wider text-ash uppercase">峰值内存随线程数</p>
        <MemoryCurve project={project} setting={setting} />
        <Legend />
      </div>
    </aside>
  );
}

export function Bench() {
  const [setting, setSetting] = useState<SettingId>('default');
  const [metric, setMetric] = useState<Metric>('time');
  const [scale, setScale] = useState<Scale>('linear');
  const [sort, setSort] = useState<Sort>('ratio');
  const [view, setView] = useState<View>('race');
  const [query, setQuery] = useState('');
  const [sel, setSel] = useState('mui-docs');

  const rows = useMemo(() => {
    const q = query.trim().toLowerCase();
    const filtered = PROJECTS.filter((p) => p.name.toLowerCase().includes(q));
    const val = (p: Project, who: 'tsgo' | 'tsrs') =>
      metric === 'time' ? p.runs[setting][who].t : p.runs[setting][who].m;
    return filtered.sort((a, b) => {
      switch (sort) {
        case 'ratio':
          return (
            (metric === 'time' ? b.runs[setting].tsrs.rt : b.runs[setting].tsrs.rm) -
            (metric === 'time' ? a.runs[setting].tsrs.rt : a.runs[setting].tsrs.rm)
          );
        case 'tsgo':
          return val(b, 'tsgo') - val(a, 'tsgo');
        case 'tsrs':
          return val(b, 'tsrs') - val(a, 'tsrs');
        case 'name':
          return a.name.localeCompare(b.name);
      }
    });
  }, [setting, metric, sort, query]);

  const max = useMemo(() => {
    const pick = (p: Project) =>
      metric === 'time' ? p.runs[setting].tsgo.t : p.runs[setting].tsgo.m;
    return Math.max(...PROJECTS.map(pick));
  }, [setting, metric]);

  const width = (v: number) =>
    scale === 'linear' ? (v / max) * 100 : (Math.log1p(v * 100) / Math.log1p(max * 100)) * 100;

  const active = PROJECTS.find((p) => p.id === sel) ?? PROJECTS[0];
  const current = SETTINGS.find((s) => s.id === setting)!;
  const fmt = metric === 'time' ? fmtTime : fmtMem;

  const reset = () => {
    setSetting('default');
    setMetric('time');
    setScale('linear');
    setSort('ratio');
    setView('race');
    setQuery('');
    setSel('mui-docs');
  };

  return (
    <section id="bench" className="relative py-16 md:py-24">
      <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden="true">
        <div className="aurora aurora-acid top-40 -left-48 h-[480px] w-[480px]" />
      </div>
      <div className="relative mx-auto max-w-7xl px-5 md:px-8">
        <SectionHead
          tag="Benchmarks · 17 projects"
          title={
            <>
              十七个项目，<span className="fire-text">逐条对跑。</span>
            </>
          }
          lead={
            <>
              同一台机器、同一份 tsconfig、<code className="num text-fog">--noEmit</code>
              。切换线程数与指标，点任意一行看它的完整读数。
            </>
          }
        />

        <Reveal className="panel mb-5 flex flex-wrap items-center gap-x-5 gap-y-3 px-4 py-3.5">
          <div className="flex items-center gap-2">
            <span className="num text-xs text-ash">线程</span>
            <div className="seg" role="group" aria-label="checker 线程数">
              {SETTINGS.map((s) => (
                <button
                  key={s.id}
                  type="button"
                  aria-pressed={setting === s.id}
                  title={s.note}
                  onClick={() => setSetting(s.id)}
                >
                  {s.rail}
                </button>
              ))}
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span className="num text-xs text-ash">指标</span>
            <div className="seg" role="group" aria-label="指标">
              <button
                type="button"
                aria-pressed={metric === 'time'}
                onClick={() => setMetric('time')}
              >
                时间
              </button>
              <button
                type="button"
                aria-pressed={metric === 'mem'}
                onClick={() => setMetric('mem')}
              >
                内存
              </button>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span className="num text-xs text-ash">刻度</span>
            <div className="seg" role="group" aria-label="刻度">
              <button
                type="button"
                aria-pressed={scale === 'linear'}
                onClick={() => setScale('linear')}
              >
                线性
              </button>
              <button type="button" aria-pressed={scale === 'log'} onClick={() => setScale('log')}>
                对数
              </button>
            </div>
          </div>

          <label className="num flex items-center gap-2 text-xs text-ash">
            排序
            <select
              value={sort}
              onChange={(e) => setSort(e.target.value as Sort)}
              aria-label="排序方式"
            >
              <option value="ratio">按优势倍数</option>
              <option value="tsgo">按 tsgo 读数</option>
              <option value="tsrs">按 tsrs 读数</option>
              <option value="name">按名称</option>
            </select>
          </label>

          <input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="搜索项目…"
            aria-label="搜索项目"
            className="num w-36"
          />

          <div className="seg seg-blue ml-auto" role="group" aria-label="视图">
            <button type="button" aria-pressed={view === 'race'} onClick={() => setView('race')}>
              赛道
            </button>
            <button type="button" aria-pressed={view === 'table'} onClick={() => setView('table')}>
              表格
            </button>
          </div>

          <button
            type="button"
            onClick={reset}
            className="num cursor-pointer rounded-md border border-seam px-3 py-1.5 text-xs text-ash transition-colors hover:border-danger hover:text-danger"
          >
            重置
          </button>
        </Reveal>

        <div className="grid grid-cols-1 items-start gap-5 xl:grid-cols-[minmax(0,1fr)_320px]">
          <Reveal className="panel min-w-0 p-4 md:p-5">
            <div className="mb-3 flex flex-wrap items-center justify-between gap-3 px-1">
              <Legend />
              <p className="num text-xs text-ash">
                {rows.length} / {PROJECTS.length} 个项目 ·{' '}
                {metric === 'time' ? 'wall-clock 秒' : '峰值 RSS'}
              </p>
            </div>

            {rows.length === 0 && (
              <p className="num px-1 py-10 text-center text-sm text-ash">
                没有匹配「{query}」的项目。
                <button
                  type="button"
                  className="link-u ml-2 cursor-pointer"
                  onClick={() => setQuery('')}
                >
                  清空搜索
                </button>
              </p>
            )}

            {view === 'race' ? (
              <ol className="space-y-1">
                {rows.map((p) => {
                  const r = p.runs[setting];
                  const go = metric === 'time' ? r.tsgo.t : r.tsgo.m;
                  const rs = metric === 'time' ? r.tsrs.t : r.tsrs.m;
                  const ratio = metric === 'time' ? r.tsrs.rt : r.tsrs.rm;
                  const selected = sel === p.id;
                  return (
                    <li key={p.id}>
                      <button
                        type="button"
                        onClick={() => setSel(p.id)}
                        aria-pressed={selected}
                        aria-label={`${p.name}：tsgo ${fmt(go)}，tsrs ${fmt(rs)}，优势 ${fmtRatio(ratio)}`}
                        className={`grid w-full cursor-pointer grid-cols-[minmax(0,1fr)_64px] gap-x-3 gap-y-1.5 rounded-lg px-2 py-2 text-left transition-colors md:grid-cols-[minmax(120px,180px)_minmax(0,1fr)_76px] md:items-center ${
                          selected ? 'bg-ember/10 ring-1 ring-ember/40' : 'hover:bg-slab'
                        }`}
                      >
                        <span className="num truncate text-[13px] font-semibold text-bone">
                          {p.name}
                        </span>
                        <span className="col-span-2 col-start-1 row-start-2 min-w-0 space-y-1 md:col-span-1 md:col-start-2 md:row-start-1">
                          <span className="flex items-center gap-2">
                            <span className="lane h-[9px] flex-1">
                              <span
                                className="lane-fill go block"
                                style={{ width: `${width(go)}%` }}
                              />
                            </span>
                            <span className="num w-[74px] shrink-0 text-right text-[11px] text-tsgo">
                              {fmt(go)}
                            </span>
                          </span>
                          <span className="flex items-center gap-2">
                            <span className="lane h-[9px] flex-1">
                              <span
                                className="lane-fill rs block"
                                style={{ width: `${width(rs)}%` }}
                              />
                            </span>
                            <span className="num w-[74px] shrink-0 text-right text-[11px] text-flare">
                              {fmt(rs)}
                            </span>
                          </span>
                        </span>
                        <span
                          className={`num col-start-2 row-start-1 self-center rounded-md px-1.5 py-1 text-center text-[13px] font-bold md:col-start-3 ${
                            selected ? 'bg-ember/20 text-molten' : 'bg-soot text-fog'
                          }`}
                        >
                          {fmtRatio(ratio)}
                        </span>
                      </button>
                    </li>
                  );
                })}
              </ol>
            ) : (
              <div className="overflow-x-auto">
                <table className="num w-full min-w-[560px] text-[13px]">
                  <thead>
                    <tr className="border-b border-seam text-left text-[11px] tracking-wider text-ash uppercase">
                      <th className="px-2 py-2.5 font-normal">项目</th>
                      <th className="px-2 py-2.5 text-right font-normal">tsgo 时间</th>
                      <th className="px-2 py-2.5 text-right font-normal">tsrs 时间</th>
                      <th className="px-2 py-2.5 text-right font-normal">tsgo 内存</th>
                      <th className="px-2 py-2.5 text-right font-normal">tsrs 内存</th>
                      <th className="px-2 py-2.5 text-right font-normal">时间</th>
                      <th className="px-2 py-2.5 text-right font-normal">内存</th>
                    </tr>
                  </thead>
                  <tbody>
                    {rows.map((p) => {
                      const r = p.runs[setting];
                      const selected = sel === p.id;
                      return (
                        <tr
                          key={p.id}
                          onClick={() => setSel(p.id)}
                          className={`cursor-pointer border-b border-seam/50 transition-colors ${
                            selected ? 'bg-ember/10' : 'hover:bg-slab'
                          }`}
                        >
                          <td className="px-2 py-2.5 font-semibold text-bone">{p.name}</td>
                          <td className="px-2 py-2.5 text-right text-tsgo">{fmtTime(r.tsgo.t)}</td>
                          <td className="px-2 py-2.5 text-right text-flare">{fmtTime(r.tsrs.t)}</td>
                          <td className="px-2 py-2.5 text-right text-tsgo">{fmtMem(r.tsgo.m)}</td>
                          <td className="px-2 py-2.5 text-right text-flare">{fmtMem(r.tsrs.m)}</td>
                          <td className="px-2 py-2.5 text-right font-bold text-molten">
                            {fmtRatio(r.tsrs.rt)}
                          </td>
                          <td className="px-2 py-2.5 text-right font-bold text-fog">
                            {fmtRatio(r.tsrs.rm)}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}

            <p className="num mt-4 border-t border-seam px-1 pt-3 text-[11px] leading-relaxed text-ash">
              16 vCPU · 63 GB · Linux x86_64 · 2026-10-16 · {current.note} · 交错运行取中位数（tsrs
              10 次，tsgo 3 次）
            </p>
          </Reveal>

          <Reveal delay={120} className="min-w-0">
            <Detail project={active} setting={setting} />
          </Reveal>
        </div>
      </div>
    </section>
  );
}
