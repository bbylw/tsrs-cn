import { useState } from 'react';
import { ERROR_DIFFS } from '../data/bench';
import { Reveal } from '../Reveal';

export function CopyButton({ text, label = '复制' }: { text: string; label?: string }) {
  const [done, setDone] = useState(false);
  return (
    <button
      type="button"
      className="copy"
      onClick={() => {
        navigator.clipboard?.writeText(text).then(
          () => {
            setDone(true);
            window.setTimeout(() => setDone(false), 1600);
          },
          () => setDone(false),
        );
      }}
    >
      {done ? '已复制' : label}
    </button>
  );
}

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
  { code: 'TS2322', where: 'sample.ts（1,7）', text: "Type 'string' is not assignable to type 'number'." },
  { code: 'TS2322', where: 'sample.ts（4,19）', text: "Type 'number' is not assignable to type 'string'." },
  { code: 'TS2339', where: 'sample.ts（7,18）', text: "Property 'nmae' does not exist on type 'User'." },
];

export function Intro() {
  return (
    <Reveal as="section" className="sec wrap">
      <p className="lead">
        tsrs 是 microsoft/TypeScript 的移植版本：语义照旧，实现换成 Rust。它以 TypeScript 的 main 分支为目标，计划在 7.1
        发布一个 100% 一致的稳定版；在那之前，你可以直接把它放进现有项目，比对输出。
      </p>
      <div className="intro-grid">
        <p>
          <b>它是替代品。</b>同一条命令、同一份 tsconfig，把可执行文件换成 tsrs。<code className="inline-code">--noEmit</code>
          、<code className="inline-code">-p</code>、<code className="inline-code">--watch</code> 都在，编辑器里通过 LSP 接上。
        </p>
        <p>
          <b>快在并行。</b>检查器按核心切分：默认最多 16 个线程，超过之后用一半核心、上限 32。线程加上去，时间掉下来，内存基本不涨。
        </p>
        <p>
          <b>一致性是硬指标。</b>目标是 microsoft/TypeScript 的 main。17 个项目里 9 个的错误数与 tsgo 逐项相同，其余 8
          个的差异可以用同一份 7.1-dev 复现。
        </p>
        <p>
          <b>还没做完。</b>
          <code className="inline-code">--init</code> 与 <code className="inline-code">--showConfig</code>{' '}
          暂不支持；并行解析带来的顺序不确定性，需要{' '}
          <code className="inline-code">--checkerAssignment go --noLazyMembers</code> 才能对齐。
        </p>
      </div>
    </Reveal>
  );
}

const STATS = [
  { n: '16.87', cap: <><b>最大加速</b>：mui-docs，12.66 s 压到 0.75 s（默认设置）</> },
  { n: '8.23', cap: <><b>最大内存优势</b>：mui-docs，13.22 GiB 压到 1.61 GiB（16 线程）</> },
  { n: '53.36', cap: <><b>增量编辑</b>：vscode watch，1.76 s 压到 33 ms</> },
  { n: '3.70', cap: <><b>最小加速</b>：Compiler，0.27 s 压到 0.07 s（16 线程）</> },
  { n: '2.05', cap: <><b>最小内存优势</b>：Compiler，272 MiB 压到 133 MiB（16 线程）</> },
  { n: '0', cap: <><b>至今发现的正确性错误</b>：在现有项目的测试里一个也没有</> },
];

export function Stats() {
  return (
    <Reveal as="section" className="sec wrap" id="bench">
      <div className="stats-grid">
        <h2 className="h2 stats-head">
          <span className="soft">同一条命令，</span>
          <br />
          两份时间。
        </h2>
        <div className="stats-list">
          {STATS.map((s, i) => {
            const [int, dec] = s.n.split('.');
            return (
              <div className="stat" key={i}>
                <span className="fig num">
                  <span className="int">{int}</span>
                  <span className="dec">{dec ? `.${dec}` : ''}</span>
                </span>
                <span className="cap">{s.cap}</span>
              </div>
            );
          })}
        </div>
        <p className="note stats-note">
          仓库 README 里那张图是另一轮测量：8 vCPU，七个项目，1/2/4/8 线程。
          <br />
          上面这组数字来自 16 vCPU 上的完整跑分，17 个项目。
        </p>
      </div>
    </Reveal>
  );
}

export function Steps() {
  return (
    <Reveal as="section" className="sec wrap">
      <h2 className="h2">
        <span className="soft">从装上，</span>
        <br />
        到跑通。
      </h2>
      <div className="steps" style={{ marginTop: 'clamp(32px, 4vw, 56px)' }}>
        <div className="step">
          <h3>先装上它。</h3>
          <div className="cmd">
            <code>pnpm add -D tsrs</code>
            <CopyButton text="pnpm add -D tsrs" />
          </div>
          <div className="resp">
            <p>
              包本身只是一个入口，真正的二进制按平台分发：darwin-arm64、linux-x64、linux-arm64，各带 gnu 与 musl
              两版。没有预编译二进制的平台，可以用 <b>@tsrs/wasm</b> 顶上去。
            </p>
          </div>
        </div>

        <div className="step">
          <h3>再把 tsc 换掉。</h3>
          <div className="cmd">
            <code>pnpm exec tsrs --noEmit</code>
            <CopyButton text="pnpm exec tsrs --noEmit" />
          </div>
          <div className="resp">
            <p style={{ marginBottom: '12px' }}>参数沿用 tsc 的那一套，能用与不能用的都在这里：</p>
            <div className="flaglist">
              <span>
                <code>--noEmit</code> 只检查不产物
              </span>
              <span>
                <code>-p</code> 指定项目
              </span>
              <span>
                <code>--watch</code> 增量监视
              </span>
              <span>
                <code>--checkers N</code> 线程数
              </span>
              <span>
                <code>--checkerAssignment go</code> 对齐诊断顺序
              </span>
              <span>
                <code>--noLazyMembers</code> 关闭惰性成员
              </span>
              <span className="no">
                <code>--init</code> 暂不支持
              </span>
              <span className="no">
                <code>--showConfig</code> 暂不支持
              </span>
            </div>
          </div>
        </div>

        <div className="step">
          <h3>然后比对输出。</h3>
          <div className="cmd">
            <code>diff &lt;(tsc --noEmit) &lt;(tsrs --noEmit)</code>
            <CopyButton text="diff <(tsc --noEmit) <(tsrs --noEmit)" />
          </div>
          <div className="resp" style={{ maxWidth: '760px' }}>
            <p>
              默认设置下，<b>9 个项目的 diff 是空的</b>。另外 8 个也不是“哪里算错了”，而是移植目标与对照版本的差别，下面一节把它们逐条列出来。
              想在自己机器上跑，浏览器 playground 里也能直接检查并生成代码。
            </p>
          </div>
        </div>
      </div>
    </Reveal>
  );
}

export function Split() {
  return (
    <Reveal as="section" className="split" id="output">
      <div className="in">
        <h2>输入一半，输出一半。</h2>
        <p className="cap">sample.ts · strict · noEmit</p>
        <pre className="codeblock">
          <code>
            {SAMPLE.map((line, i) => (
              <span className="cl" key={i}>
                <span className="ln">{String(i + 1).padStart(2, ' ')}</span>
                {line || ' '}
                {'\n'}
              </span>
            ))}
          </code>
        </pre>
      </div>
      <div className="out" data-ui>
        <div className="diags">
          {DIAGNOSTICS.map((d) => (
            <div className="diag" key={d.where}>
              <span className="code">{d.code}</span>
              <span>
                <span className="where">{d.where}</span>
                <br />
                {d.text}
              </span>
            </div>
          ))}
        </div>
        <p className="cap">同一份 sample.ts、同一份 tsconfig，分别由 tsc 7.0.2 与 tsrs 0.18.0 跑出来。</p>
        <div className="diffout">
          <span className="dlabel">diff</span>
          <span className="dtext">
            空的。
            <br />
            三行输出逐字相同。
          </span>
        </div>
      </div>
    </Reveal>
  );
}

export function Differ() {
  const rows = ERROR_DIFFS.default;
  return (
    <Reveal as="section" className="sec wrap" id="consistency">
      <h2 className="h2">
        <span className="soft">九个相同，</span>
        <br />
        八个有解释。
      </h2>

      <div className="lineup" data-ui>
        <div className="lh h-name" aria-hidden="true">
          项目
        </div>
        <div className="lh h-go" aria-hidden="true">
          tsgo 错误数
        </div>
        <div className="lh h-rs" aria-hidden="true">
          tsrs 错误数
        </div>
        <div className="lh h-delta" aria-hidden="true">
          差
        </div>
        {rows.map((r) => {
          const delta = r.tsrs - r.tsgo;
          return (
            <div className="lr num" key={r.project} data-kind={r.kind}>
              <span>{r.project}</span>
              <span>{r.tsgo.toLocaleString('en-US')}</span>
              <span>{r.tsrs.toLocaleString('en-US')}</span>
              <span className="delta">{delta > 0 ? `+${delta}` : delta}</span>
            </div>
          );
        })}
      </div>

      <div className="differ-notes">
        <p>
          <b>差在版本，不在语义。</b>tsrs 移植的是 TypeScript 7.1 开发线上的提交，而这轮对照跑的是 tsgo 7.0.2。用{' '}
          <code>typescript@7.1.0-dev.20260930.4</code> 构建，可以把 tsrs 的这批错误逐条复现。
        </p>
        <p>
          <b>还有一处顺序问题。</b>固定的 Go 编译器会按解析、模块解析与检查的并行顺序，给出不同的诊断与调用栈；tsrs
          默认对部分检查器历史做了规范化。要最接近的对照，用{' '}
          <code>--checkerAssignment go --noLazyMembers</code>。
        </p>
        <p>
          <b>一个真 bug。</b>16 线程下，17 个项目有 10 个完全相同；drizzle-orm 的错误数同为 10,846，但位置不同。这一条记在
          tsrs 名下，没有别的解释。
        </p>
        <p>
          <b>证据在仓库里。</b>哪些功能已支持、哪些还有差距，写在{' '}
          <a className="link" href="https://github.com/oxc-project/tsrs/blob/main/docs/COMPATIBILITY.md">
            兼容性与证据
          </a>{' '}
          里，每次发布都跟着改。
        </p>
      </div>
    </Reveal>
  );
}
