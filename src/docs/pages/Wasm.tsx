import { H2, Callout, CodeBlock, Ext } from '../bits';

export function Wasm() {
  return (
    <>
      <H2 id="wasm-what">@tsrs/wasm 是什么</H2>
      <p>
        <code>@tsrs/wasm</code> 是 tsrs 的 WebAssembly 构建，目标三元组 <code>wasm32-wasip1</code>
        （WASI Preview 1）， <strong>单线程</strong>。它提供一个 <code>tsrs-wasm</code> 命令和一个{' '}
        <code>tsc()</code> API， 面向 Node 22+ 与浏览器，不附带任何平台包。版本与 <code>tsrs</code>{' '}
        主包严格对齐：Cargo 与十个 npm 包共享同一个 TypeScript 对齐版本号。
      </p>
      <CodeBlock
        lang="sh"
        code={`pnpm add @tsrs/wasm@7.1.0-beta.tsrs5
# 或者不带 tag，从 latest 安装同一版本：
pnpm add @tsrs/wasm`}
      />

      <H2 id="wasm-node">在 Node 中使用</H2>
      <p>
        命令行直接跑真实文件系统；<code>tsrs-wasm --version</code> 与 <code>tsrs --version</code>{' '}
        一样同时报告 TypeScript 兼容版本与 tsrs 包版本。
      </p>
      <CodeBlock
        lang="sh"
        code={`# 在真实文件系统上跑（pnpm dlx 不需要先安装）
pnpm dlx @tsrs/wasm -p .

# 命令名与版本输出
pnpm exec tsrs-wasm --version`}
      />
      <p>
        内存文件上的编程接口是 <code>tsc(args, {'{ files }'})</code>：<code>args</code>{' '}
        为命令行参数数组， <code>{'{ files }'}</code> 为内存文件表，诊断以 JSON
        返回；上游记录的就是这一形式（{' '}
        <Ext href="https://github.com/oxc-project/tsrs/blob/main/docs/STATUS.md">STATUS</Ext>
        ），完整的导入名与返回结构以 <code>@tsrs/wasm</code> 包内 README 为准。
      </p>

      <H2 id="wasm-browser">在浏览器中使用</H2>
      <p>
        浏览器一侧通过 Web Worker 在内存文件上运行；官方 playground 就是这样部署的：{' '}
        <Ext href="https://tsrs-playground.void.app">tsrs playground</Ext>（基于{' '}
        <a href="#/docs/play">playground 页</a>可查看能力与限制）。0.9.0 引入该构建时模块大小为 9.15
        MB， gzip 2.58 MB、brotli 1.74 MB。宿主路径大于 128 MiB 时使用直接内存视图（#718）， 0.20.1
        起把宿主与 WASI 中 ≥2 GiB 的指针按无符号处理（#812）。
      </p>

      <H2 id="wasm-limits">限制</H2>
      <ul>
        <li>
          单线程：<code>--checkers</code> 会被接受，但所有工作都在一个线程上；fast
          预设里的自适应多线程 checker 在这里没有意义，其余内存与缓存类优化按原条件生效。
        </li>
        <li>
          0.9.0 发布说明列出的不支持项：<code>--watch</code>、<code>--lsp</code>、<code>--api</code>
          、 <code>--build</code> 的 JSON 诊断、<code>--checkerCostCache</code>，以及超过 4 GiB
          的程序。
        </li>
        <li>
          热运行的墙钟时间约为原生单线程的 1.8–2.3
          倍（基准项目），因此它适合交互与受限环境，不适合替代 CI 里的原生 CLI。
        </li>
        <li>
          与原生 <code>tsrs --singleThreaded</code> 逐字节一致：2,000
          例一致性样本的差异门（1,998/1,998 可运行用例通过， 内存文件上 1,993/1,993）。
        </li>
      </ul>
      <Callout kind="info">
        <p>
          想自己构建 WASM 模块：需要 <code>wasm32-wasip1</code> target 与 <code>wasm-opt</code>， 用{' '}
          <code>tools/wasm/build.sh</code>；只做编译检查是{' '}
          <code>cargo check -p tsrs_wasm --target wasm32-wasip1</code>。发布流水线用 binaryen 133
          构建该模块， 在安装前跑包内测试与 tarball 冒烟。
        </p>
      </Callout>
      <p>
        上游对 WebAssembly 构建的记录见{' '}
        <Ext href="https://github.com/oxc-project/tsrs/blob/main/npm/tsrs-wasm/README.md">
          @tsrs/wasm README
        </Ext>
        。
      </p>
    </>
  );
}
