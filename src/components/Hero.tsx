import { useEffect, useId, useRef, useState, type CSSProperties } from 'react';
import { PROJECTS, fmtRatio, fmtTime } from '../data/bench';
import { prefersReducedMotion, useInView, useRace } from '../lib/hooks';
import { CopyButton } from './ui';

const RACE_IDS = [
  'mikro-orm',
  't3code-server',
  'vscode',
  'next-packages-next',
  'mui-docs',
  'webpack',
];
const RACE_PROJECTS = RACE_IDS.map((id) => PROJECTS.find((p) => p.id === id)!);

/** Subtle ember dust drifting through the hero. Stops RAF off-screen or when tab is hidden. */
function Sparks() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const ac = new AbortController();
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    let w = 0;
    let h = 0;
    let raf = 0;
    let inView = true;
    let last = performance.now();

    const resize = () => {
      const rect = canvas.getBoundingClientRect();
      w = rect.width;
      h = rect.height;
      if (w === 0 || h === 0) return;
      canvas.width = Math.round(w * dpr);
      canvas.height = Math.round(h * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    const COLORS = ['255,90,31', '255,179,71', '77,166,255'];
    const parts = Array.from({ length: 34 }, () => ({
      x: Math.random(),
      y: Math.random(),
      r: 0.6 + Math.random() * 1.4,
      vy: 0.006 + Math.random() * 0.02,
      vx: (Math.random() - 0.5) * 0.008,
      c: COLORS[Math.floor(Math.random() * COLORS.length)],
      a: 0.1 + Math.random() * 0.35,
      tw: Math.random() * Math.PI * 2,
    }));

    const stop = () => {
      cancelAnimationFrame(raf);
      raf = 0;
    };

    const shouldRun = () =>
      inView && document.visibilityState === 'visible' && !prefersReducedMotion();

    const tick = (now: number) => {
      raf = 0;
      if (!shouldRun()) return;
      const dt = Math.min((now - last) / 1000, 0.05);
      last = now;
      if (w > 0 && h > 0) {
        ctx.clearRect(0, 0, w, h);
        for (const p of parts) {
          p.y -= p.vy * dt * 5;
          p.x += p.vx * dt * 5;
          p.tw += dt * 1.8;
          if (p.y < -0.02) {
            p.y = 1.02;
            p.x = Math.random();
          }
          if (p.x < -0.02) p.x = 1.02;
          if (p.x > 1.02) p.x = -0.02;
          const alpha = p.a * (0.55 + 0.45 * Math.sin(p.tw));
          ctx.beginPath();
          ctx.arc(p.x * w, p.y * h, p.r, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(${p.c},${alpha.toFixed(3)})`;
          ctx.fill();
        }
      }
      raf = requestAnimationFrame(tick);
    };

    const syncPlayback = () => {
      if (shouldRun()) {
        if (!raf) {
          last = performance.now();
          raf = requestAnimationFrame(tick);
        }
      } else {
        stop();
        if (prefersReducedMotion() && w > 0 && h > 0) {
          ctx.clearRect(0, 0, w, h);
        }
      }
    };

    resize();
    syncPlayback();

    const io = new IntersectionObserver(([e]) => {
      inView = e.isIntersecting;
      syncPlayback();
    });
    io.observe(canvas);

    const ro = new ResizeObserver(resize);
    ro.observe(canvas);

    const motionMq = window.matchMedia('(prefers-reduced-motion: reduce)');
    motionMq.addEventListener('change', syncPlayback, { signal: ac.signal });
    document.addEventListener('visibilitychange', syncPlayback, { signal: ac.signal });

    return () => {
      stop();
      io.disconnect();
      ro.disconnect();
      ac.abort();
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
  const selectId = useId();
  const project = RACE_PROJECTS[projIdx];
  const race = useRace([project.ts.t, project.rs.t, project.fast.t], 4.2);
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

  const change = (idx: number) => {
    setProjIdx(idx);
    requestAnimationFrame(() => replayRef.current());
  };

  const lanes = [
    { name: 'TypeScript 7.1 beta', cls: 'go', t: project.ts.t, color: 'text-tsgo', i: 0 },
    { name: 'tsrs', cls: 'rs', t: project.rs.t, color: 'text-flare', i: 1 },
    { name: 'tsrs --fast', cls: 'fast', t: project.fast.t, color: 'text-molten', i: 2 },
  ];

  return (
    <div ref={ref} className="panel panel-glow overflow-hidden">
      <div className="flex flex-wrap items-center gap-2.5 border-b border-seam bg-coal/50 px-4 py-3">
        <span className="term-dot bg-danger/75" aria-hidden="true" />
        <span className="term-dot bg-warn/75" aria-hidden="true" />
        <span className="term-dot bg-acid/75" aria-hidden="true" />
        <span className="num ml-1.5 text-xs text-ash">bench · 实测比例回放</span>
        <button
          type="button"
          onClick={() => race.replay()}
          className="num ml-auto cursor-pointer rounded-md border border-seam2 bg-slab/60 px-3 py-1 text-xs font-medium text-fog transition-colors hover:border-flare hover:text-flare"
        >
          <span aria-hidden="true">{race.running ? '⟳ ' : '▶ '}</span>重跑
        </button>
      </div>

      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-seam/60 bg-soot px-4 py-3 md:px-5">
        <div className="num flex items-center gap-2.5 text-xs text-ash">
          <label htmlFor={selectId}>项目</label>
          <select
            id={selectId}
            className="brand-select"
            value={projIdx}
            onChange={(e) => change(Number(e.target.value))}
          >
            {RACE_PROJECTS.map((p, i) => (
              <option key={p.id} value={i}>
                {p.name}
              </option>
            ))}
          </select>
        </div>
        <span className="num text-[11px] text-ash">Apple M3 Max · 14 核</span>
      </div>

      <div className="space-y-4 px-4 py-5 md:px-5">
        <p className="num rounded-lg border border-seam/80 bg-coal/80 px-3 py-2 text-xs text-ash">
          <span className="text-ember" aria-hidden="true">
            $
          </span>{' '}
          <span className="text-fog">tsrs --noEmit --fast -p {project.name}</span>
          {!race.allDone && <span className="caret ml-1" aria-hidden="true" />}
        </p>

        {lanes.map((lane) => {
          const done = race.done[lane.i];
          const shown = Math.min(race.elapsed, lane.t);
          return (
            <div key={lane.name}>
              <div className="num mb-1.5 flex items-baseline justify-between gap-2 text-xs md:text-sm">
                <span className={`font-semibold ${lane.color}`}>{lane.name}</span>
                <span
                  className={done ? (lane.cls === 'go' ? 'text-fog' : 'text-acid') : 'text-ash'}
                >
                  {done ? (
                    <>
                      <span aria-hidden="true">✓ </span>
                      {fmtTime(lane.t)}
                    </>
                  ) : (
                    `${fmtTime(shown)} …`
                  )}
                </span>
              </div>
              <div className="lane h-3.5">
                <div
                  className={`lane-fill ${lane.cls} ${!done && race.running ? 'live' : ''}`}
                  style={{ width: `${race.pct[lane.i]}%` }}
                />
              </div>
            </div>
          );
        })}

        <div className="flex flex-wrap items-center justify-between gap-3 border-t border-seam pt-4">
          <p className="num text-xs text-ash">{project.errors} 条错误 · 诊断逐项相同</p>
          <p
            className={`num rounded-lg border px-2.5 py-1 text-xs font-semibold transition-opacity ${
              race.done[2]
                ? 'border-ember/40 bg-ember/12 text-molten opacity-100'
                : 'border-seam bg-coal text-ash opacity-40'
            }`}
          >
            --fast 快 {fmtRatio(project.rtf)}
          </p>
        </div>
      </div>
    </div>
  );
}

export function Hero() {
  const marqueeNames = PROJECTS.map((p) => p.name);
  const [paused, setPaused] = useState(false);

  return (
    <section id="top" className="relative overflow-hidden pt-28 pb-14 md:pt-36 md:pb-20">
      <div className="blueprint absolute inset-0" aria-hidden="true" />
      <Sparks />

      <div className="relative mx-auto grid max-w-7xl grid-cols-1 items-center gap-10 px-5 md:px-8 lg:grid-cols-[minmax(0,11fr)_minmax(0,9fr)] lg:gap-12">
        <div className="min-w-0 max-w-[680px]">
          <p className="stage-in tag mb-5" style={{ '--sd': '0ms' } as CSSProperties}>
            TypeScript 7 · Rust 直替
          </p>
          <h1
            id="hero-heading"
            tabIndex={-1}
            className="hero-h stage-in"
            style={{ '--sd': '80ms' } as CSSProperties}
          >
            同一份语义，
            <br />
            <span className="fire-text">Rust 的速度。</span>
          </h1>
          <p
            className="lead-pretty stage-in mt-5 max-w-[58ch] text-base leading-relaxed text-fog md:text-lg"
            style={{ '--sd': '160ms' } as CSSProperties}
          >
            tsrs 是 TypeScript 7 编译器与语言服务器的 Rust 直替。默认模式与官方行为逐项对齐；开启{' '}
            <code className="num rounded bg-slab px-1.5 py-0.5 text-sm text-bone">--fast</code> 后在
            19 个大型项目上提速 <span className="num font-semibold text-bone">1.71×–6.62×</span>
            ，峰值内存降低 <span className="num font-semibold text-bone">1.70×–2.75×</span>。
          </p>

          <div
            className="stage-in mt-8 flex flex-wrap items-center gap-5"
            style={{ '--sd': '240ms' } as CSSProperties}
          >
            <a className="btn-fire text-base" href="#start">
              三步跑通
              <svg
                width="15"
                height="15"
                viewBox="0 0 16 16"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                aria-hidden="true"
              >
                <path d="M8 2v11M3.5 8.5 8 13l4.5-4.5" />
              </svg>
            </a>
            <a
              className="link-u inline-flex items-center gap-1.5 text-sm font-semibold text-fog hover:text-bone"
              href="https://tsrs-playground.void.app"
              rel="noreferrer"
              target="_blank"
            >
              浏览器 playground <span aria-hidden="true">↗</span>
            </a>
          </div>

          <div
            className="stage-in mt-7 flex max-w-md items-center gap-3 rounded-xl border border-seam bg-soot px-3.5 py-2.5"
            style={{ '--sd': '320ms' } as CSSProperties}
          >
            <span className="num select-none text-ember" aria-hidden="true">
              $
            </span>
            <code className="num min-w-0 flex-1 overflow-x-auto text-[13px] whitespace-nowrap text-bone">
              pnpm add -D tsrs
            </code>
            <CopyButton text="pnpm add -D tsrs" targetLabel="安装命令" />
          </div>

          <p
            className="stage-in num mt-5 text-xs text-ash"
            style={{ '--sd': '400ms' } as CSSProperties}
          >
            7.1.0-beta.tsrs4 · Apache-2.0 · 目标 TypeScript 7.1 · 19/19 基准零差异
          </p>
        </div>

        <div className="stage-in min-w-0" style={{ '--sd': '220ms' } as CSSProperties}>
          <RaceTerminal />
        </div>
      </div>

      <div className="relative mx-auto mt-14 max-w-7xl px-5 md:mt-20 md:px-8">
        <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
          <p className="num text-[11px] tracking-[0.18em] text-ash uppercase">已在这些项目上验证</p>
          <button
            type="button"
            onClick={() => setPaused((p) => !p)}
            className="num cursor-pointer rounded-md px-2 py-1 text-[11px] text-ash transition-colors hover:bg-slab hover:text-bone"
          >
            {paused ? '继续滚动' : '暂停滚动'}
          </button>
        </div>
        <div
          className="marquee border-y border-seam/70 py-3"
          data-paused={paused ? 'true' : undefined}
        >
          <div className="marquee-track num text-sm text-ash">
            {marqueeNames.map((n) => (
              <span key={n} className="flex items-center gap-3">
                <span className="text-ember/60" aria-hidden="true">
                  ◆
                </span>
                {n}
              </span>
            ))}
            <span className="marquee-dupe" aria-hidden="true">
              {marqueeNames.map((n) => (
                <span key={`dup-${n}`} className="flex items-center gap-3">
                  <span className="text-ember/60">◆</span>
                  {n}
                </span>
              ))}
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}
