import { H2, Callout, CodeBlock, DocTable, Ext } from '../bits';

export function Cli() {
  return (
    <>
      <H2 id="cli-basic">基本用法</H2>
      <p>
        安装 7.1.0-beta.tsrs5 后，用它取代 <code>tsc</code>：
      </p>
      <CodeBlock
        lang="sh"
        code={`pnpm add -D tsrs@7.1.0-beta.tsrs5
pnpm exec tsrs -p path/to/project           # 编译
pnpm exec tsrs -p path/to/project --noEmit  # 只做类型检查
pnpm exec tsrs -p path/to/project --fast    # 启用 tsrs 的性能模式
pnpm exec tsrs -p . --extendedDiagnostics   # 计数器与耗时
pnpm exec tsrs --version`}
      />
      <p>
        已有的 <code>tsconfig.json</code> 决定编译行为：默认按选项输出 JavaScript
        与声明文件，只在需要纯检查时加 <code>--noEmit</code>。<code>--extendedDiagnostics</code>{' '}
        沿用 tsgo 的计数器标签，其中 <code>Memory used</code> 是进程 RSS，<code>Memory allocs</code>{' '}
        恒为 0；计时只在 <code>--diagnostics</code> 或 <code>--extendedDiagnostics</code>{' '}
        开启时收集。
      </p>

      <H2 id="cli-watch">--watch 与 -b --watch</H2>
      <p>
        <code>tsrs --watch -p .</code> 与 <code>tsrs -b --watch</code> 和 <code>tsc</code>{' '}
        一样在文件变化时重建，但触发语义按平台不同：
      </p>
      <ul>
        <li>
          <strong>Linux</strong>（inotify）：编辑器<strong>关闭</strong>
          被保存的文件时才开始重建，因此不会检查写了一半的文件， 也不引入固定延迟。
        </li>
        <li>
          <strong>macOS</strong>（FSEvents）：不报告关闭事件，重建在保存事件到达时开始（约 13 ms
          之后）；文件仍为空
          （保存已截断但尚未写入）或有工具正在批量写多个文件（格式化器、checkout）时会等待。若某个程序分几段、
          段与段之间有停顿地写一个文件，仍可能触发两次重建，第二次结果是正确的。
        </li>
        <li>
          FSEvents 不可用时退回 kqueue，每个被监视文件需要一个文件描述符；tsrs
          会把描述符上限提到系统允许的最大值， 不够时会明确告知。可用{' '}
          <code>TSRS_WATCH_BACKEND=kqueue</code> 强制该回退。
        </li>
        <li>
          <strong>Windows</strong>：watch 后端未移植，<code>--watch</code> 直接以 “not supported”
          退出。
        </li>
      </ul>

      <H2 id="cli-fast-table">性能选项：默认 vs fast 预设</H2>
      <p>
        7.1.0-beta.tsrs5 的默认值就是被钉住的 TypeScript 的四 checker、文件分配与 checker 历史，成员
        eager 实例化； 保持行为不变的内部优化（控制流记忆化、并行解析）在两种模式下都启用。
        <code>--fast</code> 或 <code>TSRS_FAST=1</code> 为编译、watch 与 <code>--build</code>{' '}
        开启预设：
      </p>
      <DocTable
        head={['设置项', '默认', 'fast 预设']}
        rows={[
          [
            'Checker 数量',
            '4，按文件数封顶',
            '随 CPU 与项目规模自适应，最多 32；--build 每个项目仍为 4',
          ],
          [
            '调度',
            'Go 的文件分配与访问顺序',
            '目录局部性、work stealing，条件满足时文件拆分与模块亲和',
          ],
          ['Checker 历史', 'Go 的行为', '对选定的历史依赖案例做规范化处理'],
          [
            '额外 checker 缓存',
            'union-front、indexed-access、inference-walk 缓存关闭',
            '上述三个缓存开启',
          ],
          ['类型成员', 'eager', '惰性解析与实例化，含元组、条件/推理 mapper 与属性缓存优化'],
          [
            '声明解析',
            'eager',
            '在批量/增量编译以及跳过声明检查的非 watch 构建中惰性解析 .d.ts 成员',
          ],
          ['已完成的叶子文件', '保留', '在符合条件的非增量、非 watch 的 --noEmit 运行中释放'],
        ]}
      />
      <p>
        预设不会改动 <code>strict</code>、<code>skipLibCheck</code>、<code>noCheck</code>{' '}
        等编译器选项。惰性声明解析需要 <code>skipLibCheck</code> 或 <code>noCheck</code>
        ，构建模式下每个被构建的项目都要满足；内存目标与持久化成本缓存需要各自的 <code>
          size
        </code> /{' '}
        <code>path</code>。实验性的共享类型图与 <code>TSRS_LAZY_HAS_PROP</code> 仍保持关闭。
      </p>

      <H2 id="cli-side-effects">副作用</H2>
      <ul>
        <li>
          TypeScript 自身对 checker 数量与文件顺序的敏感性同样适用于 tsrs。fast
          模式额外改变调度、checker 历史与惰性实例化， 已知的检查顺序、递归类型与实例化上限案例可能
          <strong>增减诊断、改变位置或消息文本，并改变退出码</strong>。
        </li>
        <li>
          fast 模式通过惰性类型成员、惰性声明解析与释放叶子文件降低内存；更多的 checker
          线程与缓存可能抵消这部分收益， 整体速度与峰值内存取决于工作负载。
        </li>
        <li>
          类型、符号与实例化计数器反映的工作量不同：work stealing
          会让计数器在多次运行之间波动，即使诊断一致。
        </li>
        <li>
          改动 checker 历史或惰性成员设置会拒绝不兼容的 <code>.tsbuildinfo</code>{' '}
          缓存，因此开关预设后，下一次增量编译或 构建可能需要一次全新检查。
        </li>
      </ul>

      <H2 id="cli-precedence">优先级与作用域</H2>
      <ul>
        <li>
          编译、<code>--lsp</code> 与 <code>--api</code> 只有 <code>TSRS_FAST=1</code>{' '}
          才启用环境预设；未设置、
          <code>0</code> 和其他值都视为关闭。显式的 <code>--fast</code> 值覆盖环境。
        </li>
        <li>
          <code>--fast</code> 接受 <code>true</code> / <code>false</code>，可在 response file
          中使用，是 CLI 选项而非 <code>tsconfig.json</code> 编译器选项。
        </li>
        <li>
          <code>--lsp</code> 与 <code>--api</code> 没有 <code>--fast</code> 选项，但会读取{' '}
          <code>TSRS_FAST</code>： <code>TSRS_FAST=1</code> 下的语言服务器或 API
          进程使用惰性成员、规范化历史与额外缓存，声明解析仍是 eager， 也不释放已完成文件。
        </li>
        <li>
          linter（<code>tsrs --lint</code> 与 <code>tsrs-lint</code>）默认启用 fast 预设，除非{' '}
          <code>TSRS_FAST=0</code>； 单项功能的环境变量覆盖仍然生效。
        </li>
      </ul>
      <CodeBlock
        lang="sh"
        code={`TSRS_FAST=1 pnpm exec tsrs -p .                 # 启用预设
TSRS_FAST=1 pnpm exec tsrs -p . --fast false    # 关闭环境预设
pnpm exec tsrs -p . --fast --noLazyMembers      # fast 预设 + eager 类型成员`}
      />
      <p>
        单项标志与其环境覆盖的优先级高于预设，与 <code>--fast</code> 出现的位置无关。
        <code>--fast false</code> 只关闭预设，不会清除显式的 <code>--lazyMembers</code>、
        <code>--checkerAssignment locality</code> 或 <code>TSRS_LAZY_DTS=1</code>
        ；要和参考默认值比较，请保持这些覆盖未设置并使用 <code>--fast false</code>，
        同时在参考编译器上匹配显式的 <code>--checkers</code> 或 <code>--singleThreaded</code>。
      </p>

      <H2 id="cli-controls">单项控制</H2>
      <ul>
        <li>
          <code>--checkers N</code>：checker 线程数（默认 4）。fast 模式下 16 核以内每核一个，之后取
          16 与核数一半的较大值， 上限 32；平均每个 checker 少于 32 个待检查文件时递减，最少
          4，且从不超过文件数。<code>--build</code> 两种模式下都是每项目 4。
        </li>
        <li>
          <code>--singleThreaded</code>：单线程运行，避免在多个 checker 间复制状态。
        </li>
        <li>
          <code>--fast --checkerCostCache &lt;file&gt;</code>
          ：记住每个文件的检查耗时用于下一次负载均衡，重复运行最多约快 15%。
        </li>
        <li>
          <code>--fast --maxMemory &lt;size&gt;</code>（例如 <code>12G</code>，用于{' '}
          <code>--noEmit</code> 检查）：超过目标后用一个新 checker 替换最大的那个，以 CPU
          换内存，诊断不变。
        </li>
        <li>
          <code>--checkerAssignment go | locality</code>：<code>go</code> 选择默认的 tsgo
          文件分配与历史，
          <code>locality</code> 使用静态局部性分配与规范化历史；显式指定会关闭 work stealing。
        </li>
        <li>
          <code>--lazyMembers</code> / <code>--noLazyMembers</code>：只开关惰性 checker
          优化，环境等价写法 <code>TSRS_LAZY_MEMBERS=1</code> / <code>0</code>，显式 CLI 标志优先。
          <code>TSRS_LAZY_DTS=1</code> / <code>0</code> 单独控制惰性声明解析。
        </li>
      </ul>

      <H2 id="cli-build">--build 的限制</H2>
      <p>
        <code>--fast</code>、<code>--checkers</code> 与 <code>--singleThreaded</code> 可与{' '}
        <code>--build</code> 一起使用； 其余 tsrs 独有标志（<code>--checkerAssignment</code>、
        <code>--checkerCostCache</code>、<code>--maxMemory</code>、 <code>--lazyMembers</code>、
        <code>--noLazyMembers</code>）与 <code>--build</code> 同时出现会以 TS5072 被拒绝，
        适用时改用环境变量覆盖。
      </p>

      <H2 id="cli-unsupported">不支持的命令</H2>
      <Callout kind="warn">
        <p>
          <code>--init</code> 仍未移植：向 stderr 打印{' '}
          <code>error: --init is not supported by tsrs.</code> 并以状态码 5 退出，不会写出任何文件。
          <code>--showConfig</code> 自 7.1.0-beta.tsrs4 起支持（#1041）：像 tsgo 一样打印解析后的
          配置，包含隐含选项与 <code>${'{configDir}'}</code> 路径，21 个 <code>tsc/showConfig</code>{' '}
          场景与 <code>configDir-template-showConfig</code> 的基线逐字节一致。<code>--help</code>{' '}
          只给出版本行与简短用法；<code>--locale</code> 被接受但消息始终为英文；{' '}
          <code>--generateTrace</code> 警告 “Failed to start tracing” 后照常检查。详见{' '}
          <Ext href="https://github.com/oxc-project/tsrs/blob/main/docs/DEFAULTS.md">DEFAULTS</Ext>
          。
        </p>
      </Callout>
      <p>
        语言服务器与内存管理细节见{' '}
        <Ext href="https://github.com/oxc-project/tsrs/blob/main/docs/LSP.md">docs/LSP.md</Ext>；
        fast 预设的适用条件与基准收益集中在 <a href="#/docs/fast">fast 模式</a> 页。
      </p>
    </>
  );
}
