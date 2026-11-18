import { useMemo, useState } from 'react';
import { BENCH_META, PROJECTS, fmtMem, fmtRatio, fmtTime } from '../data/bench';
import type { Project } from '../data/bench';
import { Legend, Reveal, SectionHead } from './ui';

type Metric = 'time' | 'mem';
type Scale = 'linear' | 'log';
type Sort = 'fast' | 'rs' | 'ts' | 'name';
type View = 'race' | 'table';

const LANES = [
  { key: 'ts', name: 'TypeScript', cls: 'go', color: 'text-tsgo' },
  { key: 'rs', name: 'tsrs', cls: 'rs', color: 'text-flare' },
  { key: 'fast', name: '--fast', cls: 'fast', color: 'text-molten' },
] as const;

function DetailBars({ project, metric }: { project: Project; metric: Metric }) {
  const vals = LANES.map((l) => project[l.key][metric === 'time' ? 't' : 'm']);
  const max = Math.max(...vals);
  const fmt = metric === 'time' ? fmtTime : fmtMem;
  return (
    <div className="space-y-2">
      {LANES.map((l, i) => (
        <div key={l.key} className="flex items-center gap-2">
          <span className={`num w-[76px] shrink-0 text-[11px] ${l.color}`}>{l.name}</span>
          <span className="lane h-[10px] flex-1">
            <span
              className={`lane-fill ${l.cls} block`}
              style={{ width: `${(vals[i] / max) * 100}%` }}
            />
          </span>
          <span className="num w-[70px] shrink-0 text-right text-[11px] text-fog">
            {fmt(vals[i])}
          </span>
        </div>
      ))}
    </div>
  );
}

function Detail({ project }: { project: Project }) {
  return (
    <aside className="panel panel-glow sticky top-24 p-5" aria-live="polite">
      <div className="mb-4 flex items-center justify-between gap-3">
        <h3 className="num text-lg font-bold text-bone">{project.name}</h3>
        <span className="chip">默认设置</span>
      </div>

      <div className="mb-4 grid grid-cols-1 gap-3 sm:grid-cols-3 xl:grid-cols-1">
        <div className="rounded-lg border border-ember/30 bg-ember/8 p-3">
          <p className="num text-[11px] text-ash">--fast 时间优势</p>
          <p className="num mt-1 text-3xl font-bold text-molten">{fmtRatio(project.rtf)}</p>
        </div>
        <div className="rounded-lg border border-seam2 bg-soot p-3">
          <p className="num text-[11px] text-ash">默认模式时间优势</p>
          <p className="num mt-1 text-3xl font-bold text-flare">{fmtRatio(project.rt)}</p>
        </div>
        <div className="rounded-lg border border-tsgo/30 bg-tsgo/8 p-3">
          <p className="num text-[11px] text-ash">--fast 内存优势</p>
          <p className="num mt-1 text-3xl font-bold text-tsgo">{fmtRatio(project.rmf)}</p>
        </div>
      </div>

      <dl className="num grid grid-cols-[1fr_auto] gap-x-4 gap-y-2 text-[13px]">
        <dt className="text-ash">TypeScript 耗时</dt>
        <dd className="text-right text-fog">{fmtTime(project.ts.t)}</dd>
        <dt className="text-ash">tsrs 耗时</dt>
        <dd className="text-right font-bold text-flare">{fmtTime(project.rs.t)}</dd>
        <dt className="text-ash">tsrs --fast 耗时</dt>
        <dd className="text-right font-bold text-molten">{fmtTime(project.fast.t)}</dd>
        <dt className="text-ash">TypeScript 峰值内存</dt>
        <dd className="text-right text-fog">{fmtMem(project.ts.m)}</dd>
        <dt className="text-ash">tsrs 峰值内存</dt>
        <dd className="text-right font-bold text-flare">{fmtMem(project.rs.m)}</dd>
        <dt className="text-ash">tsrs --fast 峰值内存</dt>
        <dd className="text-right font-bold text-molten">{fmtMem(project.fast.m)}</dd>
        <dt className="text-ash">错误数</dt>
        <dd className="text-right text-acid">{project.errors} · 三者相同</dd>
      </dl>

      <div className="mt-5 space-y-4 border-t border-seam pt-4">
        <div>
          <p className="num mb-2 text-[11px] tracking-wider text-ash uppercase">耗时对比</p>
          <DetailBars project={project} metric="time" />
        </div>
        <div>
          <p className="num mb-2 text-[11px] tracking-wider text-ash uppercase">峰值内存对比</p>
          <DetailBars project={project} metric="mem" />
        </div>
        <Legend />
      </div>
    </aside>
  );
}

export function Bench() {
  const [metric, setMetric] = useState<Metric>('time');
  const [scale, setScale] = useState<Scale>('linear');
  const [sort, setSort] = useState<Sort>('fast');
  const [view, setView] = useState<View>('race');
  const [query, setQuery] = useState('');
  const [sel, setSel] = useState('mikro-orm');
  const [showRs, setShowRs] = useState(true);
  const [showFast, setShowFast] = useState(true);

  const rows = useMemo(() => {
    const q = query.trim().toLowerCase();
    const filtered = PROJECTS.filter((p) => p.name.toLowerCase().includes(q));
    const val = (p: Project, who: 'ts' | 'rs' | 'fast') =>
      metric === 'time' ? p[who].t : p[who].m;
    return filtered.sort((a, b) => {
      switch (sort) {
        case 'fast':
          return (metric === 'time' ? b.rtf : b.rmf) - (metric === 'time' ? a.rtf : a.rmf);
        case 'rs':
          return (metric === 'time' ? b.rt : b.rm) - (metric === 'time' ? a.rt : a.rm);
        case 'ts':
          return val(b, 'ts') - val(a, 'ts');
        case 'name':
          return a.name.localeCompare(b.name);
      }
    });
  }, [metric, sort, query]);

  const max = useMemo(() => {
    const pick = (p: Project) => (metric === 'time' ? p.ts.t : p.ts.m);
    return Math.max(...PROJECTS.map(pick));
  }, [metric]);

  const width = (v: number) =>
    scale === 'linear' ? (v / max) * 100 : (Math.log1p(v * 100) / Math.log1p(max * 100)) * 100;

  const active = PROJECTS.find((p) => p.id === sel) ?? PROJECTS[0];
  const fmt = metric === 'time' ? fmtTime : fmtMem;
  const visible = LANES.filter(
    (l) => l.key === 'ts' || (l.key === 'rs' && showRs) || (l.key === 'fast' && showFast),
  );

  const reset = () => {
    setMetric('time');
    setScale('linear');
    setSort('fast');
    setView('race');
    setQuery('');
    setSel('mikro-orm');
    setShowRs(true);
    setShowFast(true);
  };

  return (
    <section id="bench" className="relative py-16 md:py-24">
      <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden="true">
        <div className="aurora aurora-acid top-40 -left-48 h-[480px] w-[480px]" />
      </div>
      <div className="relative mx-auto max-w-7xl px-5 md:px-8">
        <SectionHead
          tag="Benchmarks · 19 projects"
          title={
            <>
              十九个项目，<span className="fire-text">三方对跑。</span>
            </>
          }
          lead={
            <>
              TypeScript 7.1 beta、tsrs 默认模式、tsrs <code className="num text-fog">--fast</code>
              ，同一台机器、同一份 tsconfig、
              <code className="num text-fog">--noEmit</code>
              。切换指标与刻度，点任意一行看完整读数。
            </>
          }
        />

        <Reveal className="panel mb-5 flex flex-wrap items-center gap-x-5 gap-y-3 px-4 py-3.5">
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
              <option value="fast">按 --fast 优势</option>
              <option value="rs">按默认模式优势</option>
              <option value="ts">按 TypeScript 读数</option>
              <option value="name">按名称</option>
            </select>
          </label>

          <div className="flex items-center gap-2">
            <span className="num text-xs text-ash">赛道</span>
            <div className="seg" role="group" aria-label="显示哪些编译器">
              <button type="button" aria-pressed={showRs} onClick={() => setShowRs((v) => !v)}>
                tsrs
              </button>
              <button type="button" aria-pressed={showFast} onClick={() => setShowFast((v) => !v)}>
                --fast
              </button>
            </div>
          </div>

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
                  const ratio = showFast
                    ? metric === 'time'
                      ? p.rtf
                      : p.rmf
                    : showRs
                      ? metric === 'time'
                        ? p.rt
                        : p.rm
                      : null;
                  const selected = sel === p.id;
                  return (
                    <li key={p.id}>
                      <button
                        type="button"
                        onClick={() => setSel(p.id)}
                        aria-pressed={selected}
                        aria-label={`${p.name}：TypeScript ${fmt(p.ts[metric === 'time' ? 't' : 'm'])}，tsrs ${fmt(p.rs[metric === 'time' ? 't' : 'm'])}，--fast ${fmt(p.fast[metric === 'time' ? 't' : 'm'])}`}
                        className={`grid w-full cursor-pointer grid-cols-[minmax(0,1fr)_64px] gap-x-3 gap-y-1.5 rounded-lg px-2 py-2 text-left transition-colors md:grid-cols-[minmax(120px,180px)_minmax(0,1fr)_76px] md:items-center ${
                          selected ? 'bg-ember/10 ring-1 ring-ember/40' : 'hover:bg-slab'
                        }`}
                      >
                        <span className="num truncate text-[13px] font-semibold text-bone">
                          {p.name}
                        </span>
                        <span className="col-span-2 col-start-1 row-start-2 min-w-0 space-y-1 md:col-span-1 md:col-start-2 md:row-start-1">
                          {visible.map((l) => {
                            const v = p[l.key][metric === 'time' ? 't' : 'm'];
                            return (
                              <span key={l.key} className="flex items-center gap-2">
                                <span className="lane h-[9px] flex-1">
                                  <span
                                    className={`lane-fill ${l.cls} block`}
                                    style={{ width: `${width(v)}%` }}
                                  />
                                </span>
                                <span
                                  className={`num w-[74px] shrink-0 text-right text-[11px] ${l.color}`}
                                >
                                  {fmt(v)}
                                </span>
                              </span>
                            );
                          })}
                        </span>
                        <span
                          className={`num col-start-2 row-start-1 self-center rounded-md px-1.5 py-1 text-center text-[13px] font-bold md:col-start-3 ${
                            selected ? 'bg-ember/20 text-molten' : 'bg-soot text-fog'
                          }`}
                        >
                          {ratio === null ? '—' : fmtRatio(ratio)}
                        </span>
                      </button>
                    </li>
                  );
                })}
              </ol>
            ) : (
              <div className="overflow-x-auto">
                <table className="num w-full min-w-[720px] text-[13px]">
                  <thead>
                    <tr className="border-b border-seam text-left text-[11px] tracking-wider text-ash uppercase">
                      <th className="px-2 py-2.5 font-normal">项目</th>
                      <th className="px-2 py-2.5 text-right font-normal">TS 时间</th>
                      <th className="px-2 py-2.5 text-right font-normal">tsrs 时间</th>
                      <th className="px-2 py-2.5 text-right font-normal">--fast 时间</th>
                      <th className="px-2 py-2.5 text-right font-normal">TS 内存</th>
                      <th className="px-2 py-2.5 text-right font-normal">tsrs 内存</th>
                      <th className="px-2 py-2.5 text-right font-normal">--fast 内存</th>
                      <th className="px-2 py-2.5 text-right font-normal">快（fast）</th>
                      <th className="px-2 py-2.5 text-right font-normal">错误</th>
                    </tr>
                  </thead>
                  <tbody>
                    {rows.map((p) => {
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
                          <td className="px-2 py-2.5 text-right text-tsgo">{fmtTime(p.ts.t)}</td>
                          <td className="px-2 py-2.5 text-right text-flare">{fmtTime(p.rs.t)}</td>
                          <td className="px-2 py-2.5 text-right text-molten">
                            {fmtTime(p.fast.t)}
                          </td>
                          <td className="px-2 py-2.5 text-right text-tsgo">{fmtMem(p.ts.m)}</td>
                          <td className="px-2 py-2.5 text-right text-flare">{fmtMem(p.rs.m)}</td>
                          <td className="px-2 py-2.5 text-right text-molten">{fmtMem(p.fast.m)}</td>
                          <td className="px-2 py-2.5 text-right font-bold text-molten">
                            {fmtRatio(p.rtf)}
                          </td>
                          <td className="px-2 py-2.5 text-right text-acid">{p.errors}</td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}

            <p className="num mt-4 border-t border-seam px-1 pt-3 text-[11px] leading-relaxed text-ash">
              {BENCH_META.machine} · {BENCH_META.date} · {BENCH_META.versions} · {BENCH_META.method}
            </p>
          </Reveal>

          <Reveal delay={120} className="min-w-0">
            <Detail project={active} />
          </Reveal>
        </div>
      </div>
    </section>
  );
}
