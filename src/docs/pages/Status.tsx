import { H2, Callout, CodeBlock, DocTable, Ext } from '../bits';

export function Status() {
  return (
    <>
      <H2 id="status-now">当前状态</H2>
      <p>
        最新发布是 <strong>7.1.0-beta.tsrs5</strong>（2026-11-23）。TypeScript 对齐版本从{' '}
        <strong>7.1.0-beta.tsrs3</strong>（2026-11-18）起直接发布到 npm 的 <code>latest</code>{' '}
        标签， 取代 <code>0.25.0-ts7.1.0-beta</code> 成为默认安装；更早的 tsrs1 只到达
        crates.io，tsrs2 是首个 TypeScript 对齐版本的 npm 发布（当时仍在 <code>next</code> 通道）。
        Cargo crate 与十个 npm 包（主包、八个原生平台包、 WebAssembly）共享同一版本号。
      </p>
      <DocTable
        head={['npm 标签', '当前指向', '说明']}
        rows={[
          [
            'latest',
            '7.1.0-beta.tsrs5',
            'TypeScript 对齐版本，裸装默认得到；tsrs3 起直接发布到这里',
          ],
          ['next', '不再发布', '旧通道，主包最后指向 7.1.0-beta.tsrs2，tsrs3 起不再维护'],
        ]}
      />
      <Callout kind="info">
        <p>
          <code>ci(release): publish npm packages to latest (#1014)</code> 于 2026-11-17
          落地，随后发布的 tsrs3 直接进入 <code>latest</code>，tsrs4、tsrs5
          跟进。需要确定版本时仍建议写精确 版本号，不要把标签走向写进脚本或文档断言里。
        </p>
      </Callout>
      <p>
        TypeScript 对齐版本的构建把 <code>tsrs -p . --fast</code> 也纳入 PGO 与 Linux BOLT 训练，
        快路径的代码不再被排布为冷代码；发布二进制用 Rust 1.100.0 构建，已发布的 crates 也把最低
        Rust 版本提到 1.100（#990）。
      </p>

      <H2 id="status-versioning">版本号规则</H2>
      <p>
        版本保留 TypeScript 的数字版本，并追加一个不补零的 tsrs 修订号作为 SemVer
        预发布标识（#961）：
      </p>
      <DocTable
        head={['TypeScript 参考版本', '首个 tsrs 发布', '下一个 tsrs 修复']}
        rows={[
          ['7.0.2', '7.0.2-tsrs1', '7.0.2-tsrs2'],
          ['7.1.0', '7.1.0-tsrs1', '7.1.0-tsrs2'],
          ['7.1.0-beta', '7.1.0-beta.tsrs1', '7.1.0-beta.tsrs2'],
          ['7.1.0-dev.20261112', '7.1.0-alpha.20261112.tsrs1', '7.1.0-alpha.20261112.tsrs2'],
        ]}
      />
      <CodeBlock
        lang="text"
        code="7.1.0-alpha.20261112.tsrs1 < 7.1.0-beta.tsrs1 < 7.1.0-tsrs1 < 7.1.0-tsrs2"
      />
      <p>
        同一上游版本出修复时递增修订号，换上游版本时重置为 1；nightly 的 <code>dev</code> 标签映射成{' '}
        <code>alpha</code>，以便排在 beta、rc 与稳定版之前。SemVer 禁止数字段前导零，因此{' '}
        <code>7.1.0-beta.0001</code> 无效；构建元数据 <code>+tsrs1</code>{' '}
        也不能替代预发布标识，因为排序时会被忽略。
      </p>
      <Callout kind="warn">
        <p>
          SemVer 把 <code>tsrsN</code> 当作文本比较，所以 <code>tsrs10</code> 排在{' '}
          <code>tsrs9</code> 之前。 同一 TypeScript 版本上的连续修订只能从 <code>tsrs1</code> 走到{' '}
          <code>tsrs9</code>，再往下就必须换一个 TypeScript 版本；发布检查会拒绝任何在 SemVer
          上倒退的迁移（包括 <code>tsrs9</code> 到 <code>tsrs10</code>）。
        </p>
      </Callout>

      <H2 id="status-timeline">近期发布时间线</H2>
      <DocTable
        head={['版本', '日期', '要点']}
        rows={[
          [
            '0.20.0',
            '2026-10 下旬',
            '默认值翻回 TypeScript（4 checker、Go 分配与历史、eager 成员），新增可选 --fast 预设；Intel macOS 与 Windows x64 进入平台集',
          ],
          [
            '0.21.0',
            '2026-11-03',
            '为 Oxlint 提供 type-aware linter：tsrs --lint 与 npm tsrs-lint 命令',
          ],
          [
            '0.22.0',
            '2026-11-05',
            'fast 预设下一次运行同时完成 type-aware lint 与类型检查；content mapper 进入 LSP、Node API 与 linter',
          ],
          [
            '0.23.0',
            '2026-11-07',
            'oxlint --type-aware --type-check 在默认与 fast 两种模式下都检查整个 tsconfig program',
          ],
          [
            '0.24.0',
            '2026-11-10',
            '语言服务器在保留 import 的编辑后复用 program；lint 侧减少每程序驻留数据并复用解析工作',
          ],
          [
            '0.25.0',
            '2026-11-12',
            'Windows ARM64 原生包 @tsrs/win32-arm64；headless lint 并发检查多个 tsconfig program',
          ],
          ['7.1.0-beta.tsrs1', '2026-11-16', '新 scheme 的首个版本，仅发布到 crates.io'],
          [
            '7.1.0-beta.tsrs2',
            '2026-11-16',
            '首个 TypeScript 对齐版本的 npm 发布；linter 默认启用 fast；--type-check 只报告被 lint 的文件',
          ],
          [
            '7.1.0-beta.tsrs3',
            '2026-11-18',
            '首个发布到 npm latest 的 TypeScript 对齐版本；suggestion 不再让 --type-check 失败；lint 类型错误带消息链；六个编译器修复对齐 tsgo',
          ],
          [
            '7.1.0-beta.tsrs4',
            '2026-11-20',
            '支持 --showConfig（21 个 showConfig 场景基线逐字节一致）；--type-check 恢复报告全局与声明诊断；模块解析、增量与构建/watch 的一批 panic 与路径修复',
          ],
          [
            '7.1.0-beta.tsrs5',
            '2026-11-23',
            '新增 no-unsafe-class-instance-assignment 规则（共 62 条 type-aware 规则）；修复一批 API/CLI/build/LSP 路径解析与 source map mapRoot 问题；修复两条 lint 规则边界行为',
          ],
        ]}
      />

      <H2 id="status-evidence">一致性与证据</H2>
      <p>
        目标是对 TypeScript 7.1 稳定版做到 100% 一致：以 <code>3e9236361fa9</code> 的 Go
        实现为规格， 诊断内容、顺序、文本或退出码的差异都算 bug。记录在案的 beta 验证匹配全部{' '}
        <strong>13,700</strong> 条错误基线、各 <strong>12,998</strong> 条 <code>.types</code> 与{' '}
        <code>.symbols</code> 基线、<strong>13,626</strong> 条 JavaScript/声明基线、
        <strong>149</strong> 条 JavaScript map 与 <strong>156</strong> 条 source map 记录，且在 Go
        历史与规范化历史两种模式下都成立； Fourslash 门限要求至少 4,149
        个被执行的分组且不接受任何失败分组（4,149 / 4,562）。 确定性对比覆盖 19 个基准项目的 456
        组比较。上游质量门还包含 1,000 个热门仓库的对照运行。
      </p>

      <H2 id="status-gaps">已知限制入口</H2>
      <ul>
        <li>
          不支持的命令：<code>--init</code>；Windows 上 <code>--watch</code> 未移植。
        </li>
        <li>语言服务器未移植自动类型获取、性能/项目遥测与 profiling 请求。</li>
        <li>
          fast 预设在已知历史/深度上限案例中可能改变诊断与退出码；<code>--lsp</code> /{' '}
          <code>--api</code> 与 linter 读取 <code>TSRS_FAST</code> 的方式不同。
        </li>
        <li>
          逐项支持状态见{' '}
          <Ext href="https://github.com/oxc-project/tsrs/blob/main/docs/COMPATIBILITY.md">
            COMPATIBILITY
          </Ext>
          ， 与钉住 TypeScript 的默认值差异见{' '}
          <Ext href="https://github.com/oxc-project/tsrs/blob/main/docs/DEFAULTS.md">DEFAULTS</Ext>
          ， 发布流程与 nightly 排序见{' '}
          <Ext href="https://github.com/oxc-project/tsrs/blob/main/docs/RELEASING_CRATES.md">
            RELEASING_CRATES
          </Ext>
          。
        </li>
      </ul>
      <p>
        完整发布说明按版本收录在{' '}
        <Ext href="https://github.com/oxc-project/tsrs/blob/main/docs/STATUS.md">
          docs/STATUS.md
        </Ext>
        ， 本站 <a href="#/docs/install">安装</a> 页给出各版本的安装命令。
      </p>
    </>
  );
}
