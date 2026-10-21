import { useMemo, useState } from 'react';
import { ERROR_DIFFS, PROJECTS, SETTINGS, fmtMem, fmtRatio, fmtTime } from '../data/bench';
import type { Project, SettingId } from '../data/bench';

const THREADS = ['t4', 't8', 't16'] as const;

function MemoryCurve({ project, setting }: { project: Project; setting: SettingId }) {
  const W = 272;
  const H = 82;
  const LABEL = 26;
  const max = Math.max(...THREADS.map((s) => project.runs[s].tsgo.m)) * 1.14;
  const px = (i: number) => 10 + (i * (W - 26)) / 2;
  const py = (v: number) => H - 4 - (v / max) * (H - 12);
  const line = (pick: (s: (typeof THREADS)[number]) => number) =>
    THREADS.map((s, i) => `${i === 0 ? 'M' : 'L'}${px(i).toFixed(1)} ${py(pick(s)).toFixed(1)}`).join(' ');

  const goLine = line((s) => project.runs[s].tsgo.m);
  const rsLine = line((s) => project.runs[s].tsrs.m);
  const markIndex = setting === 'default' ? -1 : THREADS.indexOf(setting);

  return (
    <svg viewBox={`0 0 ${W} ${H + LABEL}`} role="img" aria-label={`${project.name} 的峰值内存随线程数变化：tsgo 上升，tsrs 基本持平`}>
      <path d={goLine} fill="none" stroke="var(--ink)" strokeWidth="2" />
      <path d={rsLine} fill="none" stroke="var(--muted)" strokeWidth="2" />
      {THREADS.map((s, i) => (
        <g key={s}>
          <circle cx={px(i)} cy={py(project.runs[s].tsgo.m)} r={markIndex === i ? 4 : 2.6} fill="var(--ink)" />
          <circle cx={px(i)} cy={py(project.runs[s].tsrs.m)} r={markIndex === i ? 4 : 2.6} fill="var(--muted)" />
          <text x={px(i)} y={H + LABEL - 8} fontSize="13" fill="var(--muted)" textAnchor={i === 0 ? 'start' : i === 2 ? 'end' : 'middle'}>
            {s === 't4' ? '4' : s === 't8' ? '8' : '16'}
          </text>
        </g>
      ))}
    </svg>
  );
}

export function Hero() {
  const [setting, setSetting] = useState<SettingId>('default');
  const [sel, setSel] = useState('mui-docs');

  const rows = useMemo(
    () => [...PROJECTS].sort((a, b) => b.runs[setting].tsrs.rt - a.runs[setting].tsrs.rt),
    [setting],
  );
  const active = PROJECTS.find((p) => p.id === sel) ?? PROJECTS[0];
  const run = active.runs[setting];
  const current = SETTINGS.find((s) => s.id === setting) ?? SETTINGS[0];
  const diff = ERROR_DIFFS[setting].find((e) => e.project === active.name);

  return (
    <section className="hero wrap" id="top">
      <h1>
        TypeScript 编译器，
        <br />
        换成了 Rust。
      </h1>
      <p className="sub">
        命令行、配置、诊断都与 <b>tsc</b> 相同。默认设置下的 17 个大型项目：快 <b className="nw">4.20× – 16.87×</b>
        ，峰值内存少 <b className="nw">2.17× – 4.61×</b>。
      </p>

      <div className="frame">
        <div className="rail" role="group" aria-label="checker 线程数">
          <span className="lbl" aria-hidden="true">
            线程
          </span>
          {SETTINGS.map((s) => (
            <button
              key={s.id}
              type="button"
              aria-pressed={setting === s.id}
              onClick={() => setSetting(s.id)}
              title={s.note}
            >
              {s.rail}
            </button>
          ))}
        </div>

        <div className="stage" data-ui>
          <div className="row row--head" aria-hidden="true">
            <span>项目</span>
            <span>tsgo</span>
            <span>tsrs</span>
            <span>时间</span>
            <span>峰值内存</span>
          </div>
          {rows.map((p) => {
            const r = p.runs[setting];
            return (
              <button
                key={p.id}
                type="button"
                className="row row--body num"
                data-sel={sel === p.id ? 'true' : 'false'}
                aria-pressed={sel === p.id}
                onClick={() => setSel(p.id)}
                aria-label={`${p.name}：tsgo ${fmtTime(r.tsgo.t)}，tsrs ${fmtTime(r.tsrs.t)}，快 ${fmtRatio(r.tsrs.rt)}`}
              >
                <span className="name">{p.name}</span>
                <span className="t">{fmtTime(r.tsgo.t)}</span>
                <span className="t">{fmtTime(r.tsrs.t)}</span>
                <span className="t t-pair">
                  {fmtTime(r.tsgo.t)} → {fmtTime(r.tsrs.t)}
                </span>
                <span className="x x-time">{fmtRatio(r.tsrs.rt)}</span>
                <span className="x x-mem">{fmtRatio(r.tsrs.rm)}</span>
              </button>
            );
          })}
          <p className="prov">
            16 vCPU · 63 GB · Linux x86_64 · 2026-10-16 · {current.note} · 交错运行取中位数（tsrs 10 次，tsgo 3 次）
          </p>
        </div>

        <aside className="insp" data-ui aria-live="polite">
          <h2>{active.name}</h2>
          <dl className="kv num">
            <dt>tsgo 耗时</dt>
            <dd>{fmtTime(run.tsgo.t)}</dd>
            <dt>tsrs 耗时</dt>
            <dd>{fmtTime(run.tsrs.t)}</dd>
            <dt>时间</dt>
            <dd className="big">{fmtRatio(run.tsrs.rt)}</dd>
            <dt>tsgo 峰值内存</dt>
            <dd>{fmtMem(run.tsgo.m)}</dd>
            <dt>tsrs 峰值内存</dt>
            <dd>{fmtMem(run.tsrs.m)}</dd>
            <dt>内存</dt>
            <dd className="big">{fmtRatio(run.tsrs.rm)}</dd>
            <dt>错误数</dt>
            <dd>{diff ? `${diff.tsgo.toLocaleString('en-US')} → ${diff.tsrs.toLocaleString('en-US')}` : '与 tsgo 相同'}</dd>
          </dl>
          <div className="chart">
            <p className="cap">峰值内存随线程数</p>
            <MemoryCurve project={active} setting={setting} />
            <p className="legend">
              <span>
                <i style={{ background: 'var(--ink)' }} />
                tsgo
              </span>
              <span>
                <i style={{ background: 'var(--muted)' }} />
                tsrs
              </span>
            </p>
          </div>
        </aside>
      </div>
    </section>
  );
}
