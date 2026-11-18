import { useEffect, useRef, useState, type CSSProperties } from 'react';
import { PROJECTS, SETTINGS, fmtRatio, fmtTime } from '../data/bench';
import type { SettingId } from '../data/bench';
import { prefersReducedMotion, useInView, useRace } from '../lib/hooks';
import { CopyButton } from './ui';

const RACE_IDS = [
  'mui-docs',
  'vscode',
  'next-packages-next',
  't3code-server',
  'storybook',
  'webpack',
];
const RACE_PROJECTS = RACE_IDS.map((id) => PROJECTS.find((p) => p.id === id)!);

/** Ember sparks drifting up through the hero. Pauses off-screen, capped DPR. */
function Sparks() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || prefersReducedMotion()) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    let w = 0;
    let h = 0;
    let raf = 0;
    let visible = true;

    const resize = () => {
      const rect = canvas.getBoundingClientRect();
      w = rect.width;
      h = rect.height;
      canvas.width = Math.round(w * dpr);
      canvas.height = Math.round(h * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    resize();

    const COLORS = ['255,90,31', '255,179,71', '77,166,255', '155,236,78'];
    const parts = Array.from({ length: 54 }, () => ({
      x: Math.random(),
      y: Math.random(),
      r: 0.7 + Math.random() * 1.8,
      vy: 0.008 + Math.random() * 0.028,
      vx: (Math.random() - 0.5) * 0.012,
      c: COLORS[Math.floor(Math.random() * COLORS.length)],
      a: 0.15 + Math.random() * 0.5,
      tw: Math.random() * Math.PI * 2,
    }));

    let last = performance.now();
    const tick = (now: number) => {
      raf = requestAnimationFrame(tick);
      const dt = Math.min((now - last) / 1000, 0.05);
      last = now;
      if (!visible) return;
      ctx.clearRect(0, 0, w, h);
      for (const p of parts) {
        p.y -= p.vy * dt * 6;
        p.x += p.vx * dt * 6;
        p.tw += dt * 2;
        if (p.y < -0.02) {
          p.y = 1.02;
          p.x = Math.random();
        }
        if (p.x < -0.02) p.x = 1.02;
        if (p.x > 1.02) p.x = -0.02;
        const alpha = p.a * (0.6 + 0.4 * Math.sin(p.tw));
        ctx.beginPath();
        ctx.arc(p.x * w, p.y * h, p.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${p.c},${alpha.toFixed(3)})`;
        ctx.fill();
      }
    };
    raf = requestAnimationFrame(tick);

    const io = new IntersectionObserver(([e]) => {
      visible = e.isIntersecting;
    });
    io.observe(canvas);
    window.addEventListener('resize', resize);
    return () => {
      cancelAnimationFrame(raf);
      io.disconnect();
      window.removeEventListener('resize', resize);
    };
  }, []);
  return (
    <canvas
      ref={canvasRef}
      className="pointer-events-none absolute inset-0 h-full w-full"
      aria-hidden="true"
    />
  );
}

function RaceTerminal() {
  const [projIdx, setProjIdx] = useState(0);
  const [setting, setSetting] = useState<SettingId>('default');
  const project = RACE_PROJECTS[projIdx];
  const run = project.runs[setting];
  const race = useRace(run.tsgo.t, run.tsrs.t, 4.2);
  const { ref, inView } = useInView<HTMLDivElement>();
  const started = useRef(false);
  const replayRef = useRef(race.replay);
  replayRef.current = race.replay;

  useEffect(() => {
    if (inView && !started.current) {
      started.current = true;
      replayRef.current();
    }
  }, [inView]);

  const change = (idx: number, s: SettingId) => {
    setProjIdx(idx);
    setSetting(s);
    // data changed; replay on next paint with fresh durations
    requestAnimationFrame(() => replayRef.current());
  };

  const shownGo = Math.min(race.elapsed, run.tsgo.t);
  const shownRs = Math.min(race.elapsed, run.tsrs.t);

  return (
    <div ref={ref} className="panel panel-glow overflow-hidden">
      <div className="flex flex-wrap items-center gap-3 border-b border-seam px-4 py-3">
        <span className="term-dot bg-danger/80" />
        <span className="term-dot bg-warn/80" />
        <span className="term-dot bg-acid/80" />
        <span className="num ml-2 text-xs text-ash">bench · 按真实基准比例回放</span>
        <button
          type="button"
          onClick={() => race.replay()}
          className="num ml-auto cursor-pointer rounded-md border border-seam px-3 py-1 text-xs text-fog transition-colors hover:border-flare hover:text-flare"
        >
          {race.running ? '⟳ 重跑' : '▶ 重跑'}
        </button>
      </div>

      <div className="flex flex-wrap items-center gap-x-4 gap-y-2 px-4 pt-4">
        <label className="num flex items-center gap-2 text-xs text-ash">
          项目
          <select
            value={projIdx}
            onChange={(e) => change(Number(e.target.value), setting)}
            aria-label="选择项目"
          >
            {RACE_PROJECTS.map((p, i) => (
              <option key={p.id} value={i}>
                {p.name}
              </option>
            ))}
          </select>
        </label>
        <div className="seg" role="group" aria-label="checker 线程数">
          {SETTINGS.map((s) => (
            <button
              key={s.id}
              type="button"
              aria-pressed={setting === s.id}
              title={s.note}
              onClick={() => change(projIdx, s.id)}
            >
              {s.rail}
            </button>
          ))}
        </div>
      </div>

      <div className="space-y-5 px-4 py-5 md:px-6">
        <p className="num text-xs text-ash">
          <span className="text-ember">$</span> tsrs --noEmit -p {project.name}
          {!race.goDone && <span className="caret ml-1" />}
        </p>

        {(
          [
            {
              name: 'tsgo',
              cls: 'go',
              pct: race.goPct,
              done: race.goDone,
              t: run.tsgo.t,
              shown: shownGo,
              color: 'text-tsgo',
            },
            {
              name: 'tsrs',
              cls: 'rs',
              pct: race.rsPct,
              done: race.rsDone,
              t: run.tsrs.t,
              shown: shownRs,
              color: 'text-flare',
            },
          ] as const
        ).map((lane) => (
          <div key={lane.name}>
            <div className="num mb-1.5 flex items-baseline justify-between text-sm">
              <span className={`font-bold ${lane.color}`}>{lane.name}</span>
              <span
                className={lane.done ? (lane.cls === 'rs' ? 'text-acid' : 'text-fog') : 'text-ash'}
              >
                {lane.done ? `✓ 完成 · ${fmtTime(lane.t)}` : `${fmtTime(lane.shown)} …`}
              </span>
            </div>
            <div className="lane h-4">
              <div
                className={`lane-fill ${lane.cls} ${!lane.done && race.running ? 'live' : ''}`}
                style={{ width: `${lane.pct}%` }}
              />
            </div>
          </div>
        ))}

        <div className="flex flex-wrap items-center justify-between gap-3 border-t border-seam pt-4">
          <p className="num text-xs text-ash">{SETTINGS.find((s) => s.id === setting)?.note}</p>
          <p
            className={`num rounded-lg px-3 py-1.5 text-sm font-bold transition-all ${
              race.rsDone ? 'bg-ember/15 text-molten opacity-100' : 'opacity-40 text-ash'
            }`}
          >
            快 {fmtRatio(run.tsrs.rt)}
          </p>
        </div>
      </div>
    </div>
  );
}

export function Hero() {
  const marqueeNames = PROJECTS.map((p) => p.name);
  return (
    <section id="top" className="relative overflow-hidden pt-32 pb-14 md:pt-40 md:pb-20">
      <div className="blueprint absolute inset-0" aria-hidden="true" />
      <div
        className="aurora aurora-ember -top-40 -left-32 h-[560px] w-[560px]"
        aria-hidden="true"
      />
      <div className="aurora aurora-blue top-24 -right-40 h-[520px] w-[520px]" aria-hidden="true" />
      <Sparks />

      <div className="relative mx-auto grid grid-cols-1 max-w-7xl items-center gap-12 px-5 md:px-8 lg:grid-cols-[minmax(0,11fr)_minmax(0,9fr)]">
        <div>
          <p className="stage-in tag mb-6" style={{ '--sd': '0ms' } as CSSProperties}>
            microsoft/TypeScript → Rust
          </p>
          <h1 className="hero-h stage-in" style={{ '--sd': '90ms' } as CSSProperties}>
            同一份语义，
            <br />
            <span className="fire-text">Rust 的速度。</span>
          </h1>
          <p
            className="stage-in mt-6 max-w-xl text-[15px] leading-relaxed text-fog md:text-lg"
            style={{ '--sd': '200ms' } as CSSProperties}
          >
            tsrs 是 TypeScript 编译器与语言服务的 Rust 移植。命令行、配置、诊断都与{' '}
            <b className="text-bone">tsc</b> 相同——默认设置下的 17 个大型项目：快{' '}
            <b className="num nw text-molten">4.20×–16.87×</b>，峰值内存少{' '}
            <b className="num text-molten">2.17×–4.61×</b>。
          </p>

          <div
            className="stage-in mt-8 flex flex-wrap items-center gap-4"
            style={{ '--sd': '320ms' } as CSSProperties}
          >
            <a className="btn-fire" href="#start">
              三步跑通
              <svg
                width="15"
                height="15"
                viewBox="0 0 16 16"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.2"
                aria-hidden="true"
              >
                <path d="M8 2v11M3.5 8.5 8 13l4.5-4.5" />
              </svg>
            </a>
            <a
              className="btn-ghost"
              href="https://tsrs-playground.void.app"
              rel="noreferrer"
              target="_blank"
            >
              浏览器 playground ↗
            </a>
          </div>

          <div
            className="stage-in mt-8 flex max-w-md items-center gap-3 rounded-lg border border-seam bg-soot/80 px-4 py-3"
            style={{ '--sd': '430ms' } as CSSProperties}
          >
            <span className="num select-none text-ember">$</span>
            <code className="num flex-1 text-sm text-bone">pnpm add -D tsrs</code>
            <CopyButton text="pnpm add -D tsrs" />
          </div>

          <p
            className="stage-in num mt-6 text-xs text-ash"
            style={{ '--sd': '520ms' } as CSSProperties}
          >
            Apache-2.0 · 目标 TypeScript 7.1 · 100% 一致性路线
          </p>
        </div>

        <div className="stage-in" style={{ '--sd': '300ms' } as CSSProperties}>
          <RaceTerminal />
        </div>
      </div>

      <div className="relative mx-auto mt-14 max-w-7xl px-5 md:mt-20 md:px-8">
        <p className="num mb-3 text-[11px] tracking-[0.2em] text-ash uppercase">
          已在这些项目上验证
        </p>
        <div className="marquee border-y border-seam/60 py-3">
          <div className="marquee-track num text-sm text-ash">
            {[...marqueeNames, ...marqueeNames].map((n, i) => (
              <span key={i} className="flex items-center gap-3">
                <span className="text-ember/70">◆</span>
                {n}
              </span>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
