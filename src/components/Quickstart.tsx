import { useEffect, useRef, useState, type CSSProperties } from 'react';
import { Cmd, CopyButton, Reveal, SectionHead } from './ui';

const PMS = ['pnpm', 'npm', 'bun', 'yarn'] as const;
type Pm = (typeof PMS)[number];

const addCmd = (pm: Pm) =>
  pm === 'npm' ? 'npm i -D tsrs' : pm === 'yarn' ? 'yarn add -D tsrs' : `${pm} add -D tsrs`;
const runCmd = (pm: Pm) =>
  pm === 'bun'
    ? 'bunx tsrs --noEmit'
    : pm === 'yarn'
      ? 'yarn tsrs --noEmit'
      : `${pm} exec tsrs --noEmit`;

const FLAGS: { code: string; desc: string; ok: boolean }[] = [
  { code: '--noEmit', desc: '只检查不产物', ok: true },
  { code: '-p', desc: '指定项目', ok: true },
  { code: '--watch', desc: '增量监视', ok: true },
  { code: '--checkers N', desc: '线程数', ok: true },
  { code: '--checkerAssignment go', desc: '对齐诊断顺序', ok: true },
  { code: '--noLazyMembers', desc: '关闭惰性成员', ok: true },
  { code: '--init', desc: '暂不支持', ok: false },
  { code: '--showConfig', desc: '暂不支持', ok: false },
];

const SAMPLE = [
  'const port: number = "8080";',
  '',
  'type User = { id: string; name: string };',
  'const u: User = { id: 1 };',
  '',
  'export function greet(u: User) {',
  '  return `hi ${u.nmae}`;',
  '}',
];

const DIAGNOSTICS = [
  {
    code: 'TS2322',
    where: 'sample.ts(1,7)',
    text: "Type 'string' is not assignable to type 'number'.",
  },
  {
    code: 'TS2322',
    where: 'sample.ts(4,19)',
    text: "Type 'number' is not assignable to type 'string'.",
  },
  {
    code: 'TS2339',
    where: 'sample.ts(7,18)',
    text: "Property 'nmae' does not exist on type 'User'.",
  },
];

function SplitDemo() {
  const [phase, setPhase] = useState<'idle' | 'running' | 'done'>('idle');
  const timers = useRef<number[]>([]);

  useEffect(() => () => timers.current.forEach((t) => window.clearTimeout(t)), []);

  const run = () => {
    timers.current.forEach((t) => window.clearTimeout(t));
    timers.current = [];
    setPhase('running');
    timers.current.push(window.setTimeout(() => setPhase('done'), 1500));
  };

  return (
    <Reveal className="panel panel-glow mt-12 overflow-hidden">
      <div className="grid grid-cols-1 md:grid-cols-2">
        <div className="border-b border-seam bg-coal/60 p-5 md:border-r md:border-b-0 md:p-7">
          <div className="mb-4 flex items-center justify-between gap-3">
            <h3 className="text-lg font-bold text-bone">输入一半</h3>
            <span className="chip">sample.ts · strict · noEmit</span>
          </div>
          <pre className="num overflow-x-auto text-[13px] leading-7 text-fog">
            {SAMPLE.map((line, i) => (
              <span key={i} className="block">
                <span className="inline-block w-8 select-none text-seam2">{i + 1}</span>
                <span className={i === 0 || i === 3 || i === 6 ? 'text-bone' : undefined}>
                  {line || ' '}
                </span>
              </span>
            ))}
          </pre>
        </div>

        <div className="p-5 md:p-7">
          <div className="mb-4 flex items-center justify-between gap-3">
            <h3 className="text-lg font-bold text-bone">输出一半</h3>
            <button
              type="button"
              className="btn-fire !px-4 !py-2 text-xs"
              onClick={run}
              disabled={phase === 'running'}
            >
              {phase === 'running' ? '检查中…' : phase === 'done' ? '⟳ 再跑一遍' : '▶ 运行 tsrs'}
            </button>
          </div>

          {phase === 'idle' && (
            <p className="num py-8 text-center text-sm text-ash">
              按下「运行 tsrs」，看它报出和 tsc 逐字相同的三行诊断。
            </p>
          )}

          {phase !== 'idle' && (
            <div className="space-y-3" aria-live="polite">
              {DIAGNOSTICS.map((d, i) => (
                <div
                  key={d.where}
                  className="diag-in flex items-start gap-3 rounded-lg border border-seam bg-coal/60 p-3"
                  style={{ '--dd': `${300 + i * 320}ms` } as CSSProperties}
                >
                  <span className="num shrink-0 rounded bg-danger/15 px-1.5 py-0.5 text-[11px] font-bold text-danger">
                    {d.code}
                  </span>
                  <span className="num min-w-0 text-[12.5px] leading-relaxed">
                    <span className="text-ash">{d.where}</span>
                    <br />
                    <span className="text-fog">{d.text}</span>
                  </span>
                </div>
              ))}

              {phase === 'done' && (
                <div
                  className="diag-in flex items-center gap-3 rounded-lg border border-acid/40 bg-acid/10 p-3.5"
                  style={{ '--dd': '150ms' } as CSSProperties}
                >
                  <span className="num rounded bg-acid/20 px-2 py-0.5 text-[11px] font-bold text-acid">
                    diff
                  </span>
                  <p className="text-sm font-semibold text-acid">
                    空的。三行输出与 tsc 7.0.2 逐字相同。
                  </p>
                </div>
              )}
            </div>
          )}

          <p className="mt-4 text-xs leading-relaxed text-ash">
            同一份 sample.ts、同一份 tsconfig，分别由 tsc 7.0.2 与 tsrs 0.18.0 跑出来。
          </p>
        </div>
      </div>
    </Reveal>
  );
}

export function Quickstart() {
  const [pm, setPm] = useState<Pm>('pnpm');

  return (
    <section id="start" className="relative py-16 md:py-24">
      <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden="true">
        <div className="aurora aurora-blue bottom-0 -left-48 h-[420px] w-[420px]" />
      </div>
      <div className="relative mx-auto max-w-7xl px-5 md:px-8">
        <SectionHead
          tag="Quickstart"
          title={
            <>
              从装上，<span className="ice-text">到跑通。</span>
            </>
          }
          lead="它是替代品，不是新工具：同一条命令、同一份 tsconfig，把可执行文件换成 tsrs。编辑器里通过 LSP 接上。"
        />

        <Reveal className="mb-6 flex items-center gap-3">
          <span className="num text-xs text-ash">包管理器</span>
          <div className="seg seg-blue" role="group" aria-label="包管理器">
            {PMS.map((p) => (
              <button key={p} type="button" aria-pressed={pm === p} onClick={() => setPm(p)}>
                {p}
              </button>
            ))}
          </div>
        </Reveal>

        <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
          <Reveal className="panel flex flex-col p-5">
            <p className="num mb-1 text-4xl font-bold text-seam2">01</p>
            <h3 className="mb-3 text-lg font-bold text-bone">先装上它。</h3>
            <Cmd text={addCmd(pm)} />
            <p className="mt-4 text-sm leading-relaxed text-ash">
              包本身只是一个入口，真正的二进制按平台分发：darwin-arm64、linux-x64、linux-arm64，各带
              gnu 与 musl 两版。没有预编译二进制的平台，用 <b className="text-fog">@tsrs/wasm</b>{' '}
              顶上去。
            </p>
          </Reveal>

          <Reveal delay={90} className="panel flex flex-col p-5">
            <p className="num mb-1 text-4xl font-bold text-seam2">02</p>
            <h3 className="mb-3 text-lg font-bold text-bone">再把 tsc 换掉。</h3>
            <Cmd text={runCmd(pm)} />
            <p className="mt-4 mb-2 text-sm leading-relaxed text-ash">参数沿用 tsc 的那一套：</p>
            <ul className="grid grid-cols-1 gap-1.5 text-[12.5px] sm:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2">
              {FLAGS.map((f) => (
                <li key={f.code} className="flex flex-col">
                  <code className={`num ${f.ok ? 'text-molten' : 'text-ash line-through'}`}>
                    {f.code}
                  </code>
                  <span className={f.ok ? 'text-ash' : 'text-danger/80'}>{f.desc}</span>
                </li>
              ))}
            </ul>
          </Reveal>

          <Reveal delay={180} className="panel flex flex-col p-5">
            <p className="num mb-1 text-4xl font-bold text-seam2">03</p>
            <h3 className="mb-3 text-lg font-bold text-bone">然后比对输出。</h3>
            <div className="flex items-center gap-3 rounded-lg border border-seam bg-coal/80 px-4 py-3">
              <span className="num select-none text-ember">$</span>
              <code className="num min-w-0 flex-1 overflow-x-auto text-[12px] whitespace-nowrap text-bone">
                diff &lt;(tsc --noEmit) &lt;(tsrs --noEmit)
              </code>
              <CopyButton text="diff <(tsc --noEmit) <(tsrs --noEmit)" />
            </div>
            <p className="mt-4 text-sm leading-relaxed text-ash">
              默认设置下，<b className="text-fog">9 个项目的 diff 是空的</b>。另外 8
              个也不是「哪里算错了」，而是移植目标与对照版本的差别——上一节把它们逐条列了出来。
            </p>
            <p className="mt-3 text-sm leading-relaxed text-ash">
              检查器按核心切分：默认最多 16 个线程，超过之后用一半核心、上限
              32。线程加上去，时间掉下来，内存基本不涨。
            </p>
          </Reveal>
        </div>

        <SplitDemo />
      </div>
    </section>
  );
}
