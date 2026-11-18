import { H2, Callout, CodeBlock, Ext } from '../bits';

export function Contributing() {
  return (
    <>
      <H2 id="contrib-issues">提 issue，不提 PR</H2>
      <p>
        <Ext href="https://github.com/oxc-project/tsrs/issues">issue 跟踪</Ext>是开放的，欢迎报
        bug； 请附上<strong>最小复现</strong>、tsrs
        与参考编译器的版本、你运行的命令、期望输出与实际输出。 <strong>PR 保持关闭</strong>
        ——团队没有精力审查外部提交。上游说明该移植主要由 AI 编码代理撰写、 由 Max Schwenk
        指导与审阅，其正确性依赖一致性测试结果而非人工 review。
      </p>
      <Callout kind="info">
        <p>
          保真规则：<code>Cargo.toml</code> 里钉住的 Go 实现（
          <code>[workspace.metadata.typescript]</code>）就是规格。 与同 commit 的 tsgo
          在诊断、顺序、消息文本或退出码上的差异都是 tsrs 的 bug，即使 tsrs 的输出看起来更合理；
          修复要让 tsrs 做 Go 代码做的事。TypeScript 本身在 checker
          数量或文件顺序变化时存在已知诊断差异， 默认模式保留这一行为，比较时请匹配相同条件。
        </p>
      </Callout>

      <H2 id="contrib-build">从源码构建</H2>
      <p>
        需要 rustup（安装 <code>rust-toolchain.toml</code> 钉住的 Rust 版本）、{' '}
        <Ext href="https://viteplus.dev/guide/global-cli">Vite+</Ext>（管理{' '}
        <code>.node-version</code> 指定的 Node.js 24 与 <code>package.json</code> 指定的 pnpm
        12.15.0）和 git。Fourslash 套件另外需要 Node.js 24+ 以及带 <code>GOTOOLCHAIN=auto</code> 的
        Go。
      </p>
      <CodeBlock
        lang="sh"
        code={`vp install --frozen-lockfile
cargo build --profile dev -p tsrs_cli -p tsrs_testrunner
./target/debug/tsrs -p path/to/project             # 类似 tsc（会输出；只要类型检查时加 --noEmit）
cargo check                                        # 必须 0 error、0 warning（CI 设 build.warnings=deny）
cargo check -p tsrs_wasm --target wasm32-wasip1    # WebAssembly 构建仍可编译
cargo clippy --all-targets --config 'build.warnings="deny"'
tools/lint/source.mjs                              # unsafe Send/Sync 清单、原子顺序弱化的注释
tools/gen-check.sh                                 # 生成代码与其生成器一致（改生成器后用 --write）`}
      />
      <p>
        编辑与测试时用 <code>dev</code> profile；CI 用关闭 LTO、带 debug assertion 与 overflow check
        的优化 <code>ci</code> profile；性能测量要 <code>--release</code>（fat LTO、单一 codegen
        unit，与发布产物一致）。 语言服务器测试服务器与 WebAssembly 模块有独立构建：
      </p>
      <CodeBlock
        lang="sh"
        code={`cargo build --profile dev -p tsrs_fourslash_server
tools/wasm/build.sh  # 需要 wasm32-wasip1 target 与 wasm-opt`}
      />

      <H2 id="contrib-reference">参考编译器工作流</H2>
      <p>
        复现 bug 或验证修复前，先按钉住的 commit 准备 microsoft/TypeScript 的检出（
        <code>ts-ref/</code>，已被 gitignore）：
      </p>
      <CodeBlock
        lang="sh"
        code={`commit=$(node npm/build.mjs --print-typescript-commit)
git clone --filter=blob:none --sparse https://github.com/microsoft/TypeScript ts-ref
git -C ts-ref sparse-checkout set tsc packages/typescript/src \\
  packages/typescript/lib packages/typescript/vendor tools/scripts/tsc
git -C ts-ref checkout --detach "$commit"`}
      />
      <p>再校验源码 pin 并解析出对应的已发布 Go 编译器，两项源码检查都通过后才开始复现：</p>
      <CodeBlock
        lang="sh"
        code={`commit=$(node npm/build.mjs --print-typescript-commit)
test "$(git -C ts-ref rev-parse HEAD)" = "$commit"
git -C ts-ref diff --exit-code HEAD -- tsc packages/typescript
vp install --frozen-lockfile
reference_bin=$(node tools/lib/typescript-reference.mjs --binary)
"$reference_bin" --version`}
      />
      <p>
        需要插桩的内部 oracle 仍从校验过的 Go 检出构建（
        <code>
          cd ts-ref/tsc &amp;&amp; GOTOOLCHAIN=auto GOWORK=off go build -o
          "$PWD/target/reference/tsgo" ./cmd/tsc
        </code>
        ）；pin 变化后要重新构建参考编译器，仅凭版本字符串无法识别 commit。
      </p>

      <H2 id="contrib-tests">跑测试</H2>
      <CodeBlock
        lang="sh"
        code={`cargo run --profile dev -p tsrs_determinism -- conformance        # 两种 checker 模式与调度扫描
./target/debug/tsrs-test run --suite all --baselines all          # 仅 Go 历史；结果在 target/test-results/
./target/debug/tsrs-test run --filter <substring>                 # 单个测试或一组
./target/debug/tsrs-test show <suite/name>                        # 期望 vs 实际
./target/debug/tsrs-test run --suite all --baselines types,symbols # 类型与符号基线
.github/scripts/go-fourslash-gate.sh                              # 语言服务器套件（Go 断言，Rust LSP）
tools/regressions.sh target/debug/tsrs                            # testdata/regressions（CI 同样运行）
cargo run --profile dev -p tsrs_determinism -- check --tsrs target/debug/tsrs  # 与已提交的 tsgo 快照比对
cargo test --locked                                               # 各 crate 的集成测试二进制`}
      />
      <p>
        改动不能丢掉已通过测试：比较前后 <code>target/test-results/pass.txt</code>（
        <code>comm -23 &lt;(sort before.txt) &lt;(sort target/test-results/pass.txt)</code>{' '}
        必须无输出）。套件覆盖不到的 bug，请在 <code>testdata/regressions/&lt;name&gt;/</code> 下加{' '}
        <code>a.ts</code>、<code>tsconfig.json</code> 与 <code>expected.txt</code>
        ，并在该目录用钉住的参考二进制跑 <code>-p . --pretty false --singleThreaded</code>{' '}
        收集输出。Rust 测试只放在每个 crate 唯一的 <code>tests/integration/main.rs</code>，不要在{' '}
        <code>src</code> 里加单元测试。
      </p>

      <H2 id="contrib-landing">变更如何落地</H2>
      <ul>
        <li>
          变更目标分支是 <code>main</code>；CI 必须通过，fork 的 PR 用只读 token
          运行且拿不到仓库密钥。
        </li>
        <li>
          提交信息格式 <code>&lt;area&gt;: &lt;what and why&gt;</code>
          ，一致性总数变化时一并写明；贡献按 Apache-2.0 （<code>LICENSE</code> 第 5 节）授权。
        </li>
        <li>
          参与即同意{' '}
          <Ext href="https://github.com/oxc-project/tsrs/blob/main/CODE_OF_CONDUCT.md">
            行为准则
          </Ext>
          ； 漏洞报告见{' '}
          <Ext href="https://github.com/oxc-project/tsrs/blob/main/SECURITY.md">安全策略</Ext>。
        </li>
      </ul>

      <H2 id="contrib-thanks">致谢</H2>
      <ul>
        <li>
          <Ext href="https://depot.dev">Depot CI</Ext> 赞助持续集成。
        </li>
        <li>
          <Ext href="https://www.owner.com">Owner.com</Ext> 赞助了最初的工作。
        </li>
        <li>
          <Ext href="https://github.com/maschwenk">Max Schwenk</Ext> 完成移植；{' '}
          <Ext href="https://github.com/walkerdb">@walkerdb</Ext> 改进项目；{' '}
          <Ext href="https://github.com/JiangWeixian">@JiangWeixian</Ext> 转让了 <code>tsrs</code>{' '}
          的 npm 包名。
        </li>
        <li>
          特别感谢 <Ext href="https://www.typescriptlang.org/">TypeScript 团队</Ext>的支持。
        </li>
      </ul>
      <p>
        完整构建与验证流程见{' '}
        <Ext href="https://github.com/oxc-project/tsrs/blob/main/CONTRIBUTING.md">
          CONTRIBUTING.md
        </Ext>
        。
      </p>
    </>
  );
}
