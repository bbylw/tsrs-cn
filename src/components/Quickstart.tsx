import { useEffect, useRef, useState, type CSSProperties } from 'react';
import { docHref } from '../lib/router';
import { Cmd, CopyButton, Reveal, SectionHead } from './ui';

const PMS = ['pnpm', 'npm', 'bun', 'yarn'] as const;
type Pm = (typeof PMS)[number];

const addCmd = (pm: Pm) =>
  pm === 'npm'
    ? 'npm i -D tsrs@next'
    : pm === 'yarn'
      ? 'yarn add -D tsrs@next'
      : `${pm} add -D tsrs@next`;
const runCmd = (pm: Pm) =>
  pm === 'bun'
    ? 'bunx tsrs --noEmit --fast'
    : pm === 'yarn'
      ? 'yarn tsrs --noEmit --fast'
      : `${pm} exec tsrs --noEmit --fast`;

const FLAGS: { code: string; desc: string; ok: boolean }[] = [
  { code: '--fast', desc: '性能预设（或 TSRS_FAST=1）', ok: true },
  { code: '--checkers N', desc: 'checker 线程数 · 默认 4', ok: true },
  { code: '--singleThreaded', desc: '单线程 · 最严格对照', ok: true },
  { code: '--checkerAssignment locality', desc: '局部性分配 + 工作窃取', ok: true },
  { code: '--checkerCostCache <file>', desc: '记住每个文件的耗时', ok: true },
  { code: '--maxMemory 12G', desc: '内存上限（--noEmit）', ok: true },
  { code: '--lazyMembers / --noLazyMembers', desc: '惰性成员单独开关', ok: true },
  { code: 'TSRS_LAZY_DTS=1', desc: '惰性 .d.ts 解析', ok: true },
  { code: '--init / --showConfig', desc: '暂不支持 · 退出码 5', ok: false },
  { code: '--watch（Windows）', desc: '暂不支持', ok: false },
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
              按下「运行 tsrs」，看它报出和 TypeScript 逐字相同的三行诊断。
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
                    空的。三行输出与 TypeScript 7.1 beta 逐项相同。
                  </p>
                </div>
              )}
            </div>
          )}

          <p className="mt-4 text-xs leading-relaxed text-ash">
            同一份 sample.ts、同一份 tsconfig。最新基准的 19 个项目上，三份编译器的诊断全部一致。
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
          lead="它是替代品，不是新工具：同一条命令、同一份 tsconfig，把可执行文件换成 tsrs。默认行为对齐 TypeScript；加 --fast 打开性能预设。编辑器里通过 LSP 接上。"
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
              <code className="num text-molten">@next</code> 指向 7.1.0-beta.tsrs2。包本身只是入口，
              二进制按平台分发：macOS arm64/x64、Linux x64/arm64（gnu 与 musl）、Windows
              x64/arm64，共八个原生包。没有预编译二进制的平台，用{' '}
              <b className="text-fog">@tsrs/wasm</b> 顶上去。
            </p>
          </Reveal>

          <Reveal delay={90} className="panel flex flex-col p-5">
            <p className="num mb-1 text-4xl font-bold text-seam2">02</p>
            <h3 className="mb-3 text-lg font-bold text-bone">再把 tsc 换掉。</h3>
            <Cmd text={runCmd(pm)} />
            <p className="mt-4 mb-2 text-sm leading-relaxed text-ash">
              参数沿用 tsc 的那一套，另有 tsrs 自己的开关：
            </p>
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
              最新一轮基准里，<b className="text-fog">19 个项目的 diff 全是空的</b>
              ——包括 webpack 的 840 条、vscode 的 371 条真实错误，文件、位置、错误码逐项相同。
            </p>
            <p className="mt-3 text-sm leading-relaxed text-ash">
              还跑 Oxlint？tsrs-lint 让 type-aware lint 与类型检查一次跑完，
              <a className="link-u font-semibold" href={docHref('lint')}>
                看快速模式与 lint
              </a>
              。
            </p>
          </Reveal>
        </div>

        <SplitDemo />
      </div>
    </section>
  );
}
