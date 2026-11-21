import { H2, Callout, CodeBlock, DocTable, Ext } from '../bits';
import { Cmd } from '../../components/ui';

export function Lint() {
  return (
    <>
      <H2 id="lint-what">tsrs-lint 是什么</H2>
      <p>
        <code>tsrs-lint</code> 是 tsgolint 的 Rust 实现，可以取代它成为{' '}
        <Ext href="https://oxc.rs">Oxlint</Ext> type-aware 规则的后端；<code>tsrs --lint</code>{' '}
        运行同一套命令行。linter 随 <strong>0.21.0</strong> 引入，README 把{' '}
        <code>--type-check</code> 标为 <strong>tsrs 0.23.0</strong> 起可用；
        <strong>Oxlint 1.92.0</strong> 起在检测到 <code>tsrs</code> 已安装时自动找到{' '}
        <code>tsrs-lint</code> 并取代 oxlint-tsgolint。
      </p>
      <p>
        规则覆盖：实现钉住的 tsgolint 的 <strong>61/61 条 type-aware 规则</strong>
        ，基线语料以重建后的 tsgolint <strong>v7.0.2005</strong> 为参考，导入的 8,047 个 active case
        输入通过，上游显式 skip 28 个。
      </p>

      <H2 id="lint-setup">接入 Oxlint</H2>
      <Cmd text="pnpm add -D oxlint tsrs" />
      <Cmd text="TSRS_FAST=1 pnpm exec oxlint --type-aware --type-check" />
      <p>
        自 7.1.0-beta.tsrs2 起（#989），<code>tsrs --lint</code> 与 <code>tsrs-lint</code>{' '}
        这两个入口
        <strong>默认启用 fast 预设</strong>，<code>TSRS_FAST=0</code>{' '}
        才退出，单项功能的环境变量覆盖仍然优先； 上面这条 README 命令里的 <code>TSRS_FAST=1</code>{' '}
        因此是冗余的，保留它与旧写法等价。 需要手工指定后端时用 <code>OXLINT_TSGOLINT_PATH</code>
        ，并务必指向 <code>tsrs-lint</code> 而不是 <code>tsrs</code>——oxlint 会以{' '}
        <code>&lt;path&gt; headless ...</code> 调用，裸 <code>tsrs</code> 会把 <code>headless</code>{' '}
        当成根文件：
      </p>
      <Cmd text="OXLINT_TSGOLINT_PATH=node_modules/.bin/tsrs-lint oxlint --type-aware" />

      <H2 id="lint-typecheck">--type-check 的语义</H2>
      <p>
        <code>--type-check</code> 让同一次运行顺带报告编译器类型错误。
        <strong>当前版本（7.1.0-beta.tsrs4）的语义是：只报告 Oxlint 选定用于 lint 的文件</strong>
        ，与 tsgolint 一致——README 的原话是「Oxlint 不 lint 的文件不会被类型检查，
        因此请保留一次单独的 <code>tsrs --noEmit</code> 来检查整个 tsconfig
        program」。范围历史上调整过几次：
      </p>
      <ul>
        <li>
          0.22.0（#930）：在 fast 预设下，每个 tsconfig program 整体检查，报告与{' '}
          <code>tsrs --noEmit</code> 相同的类型错误， 因此可以省掉独立的 typecheck
          步骤（该次运行比「先 <code>tsrs --noEmit</code> 再 lint」少 21–37% 墙钟时间、 少 27–49%
          指令数）；默认模式仍只检查 Oxlint 发来的文件。
        </li>
        <li>0.23.0：两种模式都检查 Oxlint 所选文件映射到的整个 tsconfig program。</li>
        <li>0.24.0：规则运行前先对每个列出的文件做类型检查，错误保持其文件位置。</li>
        <li>
          7.1.0-beta.tsrs2（#998）：<strong>回退到 tsgolint 的语义</strong>——只报告 Oxlint 选定用于
          lint 的文件； program 的其余文件只提供类型而不报告自己的诊断，被 ignore
          规则或命令行路径排除的文件同样不再让 lint 失败，
          没有源文件位置的全局诊断（例如缺失全局类型）也不再报告。
        </li>
        <li>
          7.1.0-beta.tsrs3（#959、#1006）：<code>--type-check</code> 不再报告 suggestion
          诊断——Oxlint 会把 suggestion 当错误，导致 Effect 等插件的语言服务 suggestion 让 lint
          失败；tsc 会失败的 message 诊断（如 TS1450）仍然报告。类型错误的描述 带上与{' '}
          <code>tsc</code> 相同的消息链（每条消息一行），<code>tsconfig-error</code>{' '}
          报告把消息链放进 help 文本。
        </li>
        <li>
          7.1.0-beta.tsrs4（#1056）：每个 program 的全局诊断重新在其 tsconfig 上各报告一次，与
          tsgolint #1270 一致；<code>declaration</code> 或 <code>composite</code>{' '}
          开启时同时报告声明诊断。
        </li>
      </ul>
      <Callout kind="info">
        <p>
          因此 <code>--type-check</code> 不能替代一次全量类型检查：Oxlint 不 lint
          的文件（被忽略的、生成的、声明文件）仍只有 <code>tsrs --noEmit</code> 或{' '}
          <code>tsrs --build</code> 才会检查；整个 program
          的其余文件也只提供类型、不报告自己的诊断。 CI 里请保留一条单独的{' '}
          <code>tsrs --noEmit</code>
          。列表里不属于任何 tsconfig 的文件会在带 linter 默认编译选项的推断 program 中被 lint{' '}
          并检查。
        </p>
      </Callout>

      <H2 id="lint-headless">headless 协议与本地开发</H2>
      <p>
        输入是 stdin 上的 V1 或 V2 JSON 载荷（不配对的 JSON surrogate
        转义会被拒绝），输出沿用上游的二进制帧： 4 字节小端 JSON 长度、1 字节消息类型、随后是 UTF-8
        JSON。诊断与协议错误写 stdout，CLI 错误写 stderr。 支持的标志为 <code>headless</code>、
        <code>-fix</code>、<code>-fix-suggestions</code>、<code>-debug timings</code>
        （双横线别名同样接受）。
      </p>
      <CodeBlock
        lang="sh"
        code={`cargo build --profile dev -p tsrs_lint -p tsrs_cli -p tsrs_testrunner
cargo test -p tsrs_lint
printf '%s' '{"version":2,"configs":[]}' | target/debug/tsrs-lint headless
OXLINT_TSGOLINT_PATH="$PWD/target/debug/tsrs-lint" oxlint --type-aware`}
      />
      <p>
        程序构建与绑定使用原生并行 loader 并遵守 <code>singleThreaded</code>；语义报告与 lint
        规则共用拥有该文件的 checker 及其缓存。content mapper 程序需要{' '}
        <code>--runExternalCode</code> 或 <code>TSRS_LINT_RUN_EXTERNAL_CODE=1</code>。自 tsrs3
        起，headless 诊断直接序列化、不再构建中间 JSON 值树（#1011），
        <code>no-unsafe-enum-assignment</code>{' '}
        在两个受约束类型共享原始包装类型时跳过递归的原型成员比较（#1012）。
      </p>

      <H2 id="lint-bench">基准</H2>
      <p>
        下表来自 <code>bench/lint-typecheck/RESULTS.md</code>：tsrs <strong>0.24.0</strong>、oxlint
        1.93.0、 oxlint-tsgolint 7.0.2006、TypeScript 7.0.2 / 6.0.3、ESLint
        10.14.0、typescript-eslint 8.72.2， 机器为 AWS m8g.4xlarge（16 Graviton4 vCPU、64
        GiB）、Ubuntu 24.04、Node 24， Outline 的 7 条 type-aware 规则、每个进程固定在 8 核。
      </p>
      <DocTable
        head={[
          'VS Code（8 核）',
          'tsrs 一次运行',
          'tsrs + 单独检查',
          'tsgolint 一次运行',
          'tsgolint + tsgo',
          'ESLint + tsc',
        ]}
        rows={[
          [
            'CPU 时间',
            '24.4 s',
            '35.7 s（1.47x 多）',
            '117 s（4.81x 多）',
            '139 s（5.70x 多）',
            '656 s（27x 多）',
          ],
          [
            '墙钟时间',
            '4.8 s',
            '5.8 s（1.21x 慢）',
            '26.1 s（5.43x 慢）',
            '21.3 s（4.44x 慢）',
            '293 s（61x 慢）',
          ],
          [
            '峰值内存（全部进程）',
            '3.6 GiB',
            '4.9 GiB（1.36x 多）',
            '13.3 GiB（3.74x 多）',
            '16.3 GiB（4.57x 多）',
            '28.7 GiB（8.04x 多）',
          ],
        ]}
      />
      <Callout kind="warn">
        <p>
          该图测量于 tsrs <strong>0.24.0</strong>，当时 <code>--type-check</code> 检查整个 tsconfig
          program；README 也为这张图保留了同样的说明。7.1.0-beta.tsrs2（#998）之后{' '}
          <code>--type-check</code> 只报告被 lint 的文件，
          因此「一次运行」不再覆盖完整类型检查，上表数字不能直接外推到当前版本——当前一次运行的覆盖面更小，
          要比较请自行补上 <code>tsrs --noEmit</code> 的开销。
        </p>
      </Callout>
      <p>
        规则基线、oracle 覆盖与导出流程见{' '}
        <Ext href="https://github.com/oxc-project/tsrs/blob/main/tools/tsgolint/README.md">
          tools/tsgolint/README.md
        </Ext>
        。
      </p>
    </>
  );
}
