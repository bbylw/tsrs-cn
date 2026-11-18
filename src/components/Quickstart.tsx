import { useEffect, useRef, useState, type CSSProperties } from 'react';
import { docHref } from '../lib/router';
import { Cmd, Reveal, SectionHead } from './ui';

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
const ERROR_LINES = new Set([0, 3, 6]);

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
    timers.current.push(window.setTimeout(() => setPhase('done'), 1400));
  };

  return (
    <Reveal className="panel panel-glow mt-10 overflow-hidden">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-seam bg-coal/50 px-5 py-3">
        <div className="flex items-center gap-2.5">
          <span className="term-dot bg-danger/75" aria-hidden="true" />
          <span className="term-dot bg-warn/75" aria-hidden="true" />
          <span className="term-dot bg-acid/75" aria-hidden="true" />
          <span className="num ml-1.5 text-xs text-fog">diagnostics-diff · sample.ts</span>
        </div>
        <span className="chip">strict · noEmit</span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2">
        <div className="border-b border-seam bg-coal/70 p-5 md:border-r md:border-b-0 md:p-6">
          <div className="mb-3 flex items-center justify-between gap-3">
            <h3 className="text-sm font-semibold text-ash">输入代码</h3>
            <span className="num text-[11px] text-ash">3 处类型错误</span>
          </div>
          <pre
            tabIndex={0}
            role="region"
            aria-label="sample.ts 示例代码"
            className="num overflow-x-auto rounded-lg border border-seam/80 bg-coal p-3 text-[13px] leading-7 text-fog"
          >
            <code>
              {SAMPLE.map((line, i) => {
                const isErr = ERROR_LINES.has(i);
                return (
                  <span
                    key={i}
                    className={`block rounded px-1.5 ${
                      isErr ? 'bg-danger/10 text-bone' : undefined
                    }`}
                  >
                    <span
                      className="mr-3 inline-block w-6 border-r border-seam/80 pr-2 text-right select-none text-seam2"
                      aria-hidden="true"
                    >
                      {i + 1}
                    </span>
                    <span>{line || ' '}</span>
                  </span>
                );
              })}
            </code>
          </pre>
        </div>

        <div className="flex flex-col justify-between p-5 md:p-6">
          <div>
            <div className="mb-3 flex items-center justify-between gap-3">
              <h3 className="text-sm font-semibold text-ash">诊断对比输出</h3>
              <button
                type="button"
                className="btn-fire !px-4 !py-2 text-xs"
                onClick={run}
                disabled={phase === 'running'}
              >
                {phase === 'running' ? (
                  '检查中…'
                ) : phase === 'done' ? (
                  <>
                    <span aria-hidden="true">⟳ </span>再跑一遍
                  </>
                ) : (
                  <>
                    <span aria-hidden="true">▶ </span>运行 tsrs
                  </>
                )}
              </button>
            </div>

            {phase === 'idle' && (
              <div className="rounded-lg border border-dashed border-seam2 bg-coal/50 px-5 py-10 text-center">
                <p className="num text-sm font-medium text-fog">准备就绪</p>
                <p className="mt-1.5 text-xs text-ash">
                  点击右上角「运行 tsrs」，对比它与 TypeScript 7.1 beta 的逐行诊断结果。
                </p>
              </div>
            )}

            {phase !== 'idle' && (
              <div className="space-y-2.5" aria-live="polite">
                {DIAGNOSTICS.map((d, i) => (
                  <div
                    key={d.where}
                    className="diag-in flex items-start gap-3 rounded-lg border border-seam bg-coal/80 p-3"
                    style={{ '--dd': `${240 + i * 280}ms` } as CSSProperties}
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
                    className="diag-in flex items-center gap-3 rounded-lg border border-acid/40 bg-acid/10 p-3"
                    style={{ '--dd': '120ms' } as CSSProperties}
                  >
                    <span className="num rounded bg-acid/20 px-2 py-0.5 text-[11px] font-bold text-acid">
                      diff
                    </span>
                    <p className="text-sm font-semibold text-acid">
                      空输出 · 与 TypeScript 7.1 beta 逐项相同
                    </p>
                  </div>
                )}
              </div>
            )}
          </div>

          <p className="lead-pretty mt-4 text-xs leading-relaxed text-ash">
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
    <section id="start" tabIndex={-1} className="deferred-section relative py-16 md:py-24">
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

        <Reveal className="mb-6 flex flex-wrap items-center gap-3">
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
          <Reveal className="panel flex flex-col p-5 md:p-6">
            <div className="mb-4 flex items-center justify-between border-b border-seam pb-3">
              <span className="num text-xs font-semibold text-flare">STEP 01</span>
              <span className="num text-xs text-ash">安装依赖</span>
            </div>
            <h3 className="mb-3 text-lg font-semibold text-bone">先装上它</h3>
            <Cmd compact text={addCmd(pm)} />
            <p className="lead-pretty mt-4 text-sm leading-relaxed text-ash">
              <code className="num text-molten">@next</code> 指向 7.1.0-beta.tsrs2。包本身只是入口，
              二进制按平台分发：macOS arm64/x64、Linux x64/arm64（gnu 与 musl）、Windows
              x64/arm64，共八个原生包。无原生包平台用 <b className="text-fog">@tsrs/wasm</b> 兜底。
            </p>
          </Reveal>

          <Reveal delay={70} className="panel flex flex-col p-5 md:p-6">
            <div className="mb-4 flex items-center justify-between border-b border-seam pb-3">
              <span className="num text-xs font-semibold text-flare">STEP 02</span>
              <span className="num text-xs text-ash">替换命令</span>
            </div>
            <h3 className="mb-3 text-lg font-semibold text-bone">再把 tsc 换掉</h3>
            <Cmd compact text={runCmd(pm)} />
            <p className="mt-4 mb-2.5 text-sm leading-relaxed text-ash">
              参数沿用 tsc 的那一套，另有 tsrs 自己的开关：
            </p>
            <ul className="grid grid-cols-1 gap-2 text-[12px] sm:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2">
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

          <Reveal delay={140} className="panel flex flex-col p-5 md:p-6">
            <div className="mb-4 flex items-center justify-between border-b border-seam pb-3">
              <span className="num text-xs font-semibold text-flare">STEP 03</span>
              <span className="num text-xs text-ash">一致性核对</span>
            </div>
            <h3 className="mb-3 text-lg font-semibold text-bone">然后比对输出</h3>
            <Cmd compact wrap text="diff <(tsc --noEmit) <(tsrs --noEmit)" />
            <p className="lead-pretty mt-4 text-sm leading-relaxed text-ash">
              最新一轮基准里，<b className="text-fog">19 个项目的 diff 全是空的</b>
              ——包括 webpack 的 840 条、vscode 的 371 条真实错误，文件、位置、错误码逐项相同。
            </p>
            <p className="lead-pretty mt-3 text-sm leading-relaxed text-ash">
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
