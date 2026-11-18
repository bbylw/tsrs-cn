import { H2, Callout, CodeBlock, DocTable } from '../bits';

export function FastMode() {
  return (
    <>
      <H2 id="fast-what">--fast 是什么</H2>
      <p>
        <code>--fast</code> 是 tsrs 的<strong>性能预设</strong>，自 <strong>0.20.0</strong>{' '}
        起可用，与 <code>TSRS_FAST=1</code> 完全等价。它不改变 <code>strict</code>、
        <code>skipLibCheck</code>、<code>noCheck</code> 等检查选项，只替换 checker
        数量、调度、历史、缓存与内存策略这五类默认值；默认模式则刻意保持与被钉住的 TypeScript 一致。
      </p>
      <CodeBlock
        lang="sh"
        code={`pnpm exec tsrs --noEmit --fast
# 或用环境变量启用同一预设：
TSRS_FAST=1 pnpm exec tsrs --noEmit
# 显式值优先于环境：
TSRS_FAST=1 pnpm exec tsrs -p . --fast false`}
      />

      <H2 id="fast-checkers">自适应 checker 数量</H2>
      <p>
        默认模式固定 4 个 checker（按文件数封顶）。fast 模式下：16 核以内每核一个，之后取 16
        与核数一半的较大值， 上限 <strong>32</strong>；若平均每个 checker 分到的待检查文件少于 32
        个，数量会递减，最少 4， 且永远不会超过文件数。<code>--build</code> 在两种模式下都是每个项目
        4 个。两种编译器最终都把数量夹在 1–256 与文件数之间。
      </p>

      <H2 id="fast-scheduling">目录局部性与 work stealing</H2>
      <p>
        默认沿用 Go 的文件分配与访问顺序；fast 模式改用<strong>目录子树分组</strong>
        （相关的工作放在一起）， 加上 <strong>work stealing</strong>
        ，并在条件满足时启用文件拆分与模块亲和。同时把 checker 历史换成对选定历史依赖案例的{' '}
        <strong>规范化处理</strong>。显式指定 <code>--checkerAssignment go</code> 或{' '}
        <code>locality</code> 会覆盖预设并关闭 work stealing。
      </p>

      <H2 id="fast-caches">三类额外缓存</H2>
      <DocTable
        head={['缓存', '默认', 'fast']}
        rows={[
          ['union-front 缓存', '关闭', '开启'],
          ['indexed-access 缓存', '关闭', '开启'],
          ['inference-walk 缓存', '关闭', '开启'],
        ]}
      />

      <H2 id="fast-memory">内存优化</H2>
      <ul>
        <li>
          <strong>惰性类型成员</strong>：类型成员的解析与实例化改为惰性，覆盖元组、条件/推理 mapper
          以及属性缓存优化； <code>--noLazyMembers</code> 或 <code>TSRS_LAZY_MEMBERS=0</code> 可在
          fast 模式下单独关掉。
        </li>
        <li>
          <strong>
            惰性 <code>.d.ts</code> 成员解析
          </strong>
          ：仅适用于批量/增量编译以及跳过声明检查的非 watch 构建， 因此需要{' '}
          <code>skipLibCheck</code> 或 <code>noCheck</code>；<code>--build</code>{' '}
          时每个被构建的项目都要满足条件。 由 <code>TSRS_LAZY_DTS=1</code> / <code>0</code>{' '}
          单独控制，watch、LSP 与 API 模式不可用。
        </li>
        <li>
          <strong>释放已完成的叶子文件</strong>：条件较严格——需要带压缩指针的 Unix
          构建、规范化历史，且是非增量、非 watch、 不输出声明、未加 <code>--explainFiles</code> 的{' '}
          <code>--noEmit</code> 运行；加载文件前算出的 checker 上界须不超过 16，
          之后因项目小而降计数并不启用它。<code>TSRS_FREE_LEAVES=1</code> 只绕过这个数量上限。
        </li>
        <li>
          另有显式内存目标 <code>--fast --maxMemory &lt;size&gt;</code>：超过后用一个新 checker
          替换最大的 checker，以 CPU 换内存， 诊断不变。
        </li>
      </ul>

      <H2 id="fast-bench">基准收益</H2>
      <p>
        上游公开的发布对比测于 2026-10-28，机器为 Apple M3 Max（14 核、36 GB、Darwin
        arm64），二进制为 tsrs <code>0.20.1-ts7.1.0-beta</code> 与 TypeScript 7.1.0-beta，命令为{' '}
        <code>-p &lt;project&gt; --noEmit --incremental false --pretty false</code>（fast 列另加{' '}
        <code>--fast</code>）， 取交错运行的中位数（tsrs 10 次、TypeScript 5 次，Hyperfine 2.0.0）：
      </p>
      <DocTable
        head={['项目', 'TypeScript 7.1 beta', 'tsrs', 'tsrs --fast', 'fast 相对 TypeScript']}
        rows={[
          ['mikro-orm 检查耗时', '4.63 s', '1.38 s', '0.70 s', '6.62x faster'],
          ['vscode 检查耗时', '5.27 s', '2.01 s', '0.91 s', '5.80x faster'],
          ['vscode 峰值内存', '5.46 GiB', '2.36 GiB', '1.99 GiB', '2.75x less'],
          ['t3code-server 峰值内存', '4.36 GiB', '1.82 GiB', '1.95 GiB', '2.24x less'],
        ]}
      />
      <p>
        19 个项目中 <code>--fast</code> 的最好墙钟收益是 6.62×（mikro-orm），默认模式为
        1.77×–4.17×； 内存最好 2.75×
        less（vscode）。三种配置报告的诊断（文件、位置与错误码）在全部项目上一致。 方法与更多数据见{' '}
        <a href="#/docs/benchmarks">基准</a> 页。
      </p>

      <H2 id="fast-side-effects">副作用</H2>
      <Callout kind="warn">
        <p>
          fast 模式改动调度、checker
          历史与惰性实例化，在已知的检查顺序、递归类型与实例化上限案例中可能增减诊断、
          改变其位置或消息文本，并改变退出码；更多 checker 线程与缓存也可能抵消内存收益。
          切换历史或惰性成员设置会让不兼容的 <code>.tsbuildinfo</code>{' '}
          缓存失效，下一次增量编译或构建可能需要全新检查。
          需要与参考编译器逐字节对齐时请留在默认模式，或用 <code>--fast false</code>{' '}
          并清除单项覆盖。
        </p>
      </Callout>
      <p>
        单项开关、优先级与作用域见 <a href="#/docs/cli">CLI</a> 页；<code>--lsp</code>、
        <code>--api</code> 与 linter 对 <code>TSRS_FAST</code> 的读取方式也列在那里。
      </p>
    </>
  );
}
