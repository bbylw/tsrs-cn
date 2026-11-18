import { H2, Callout, CodeBlock, Ext } from '../bits';
import { Cmd } from '../../components/ui';

export function Editors() {
  return (
    <>
      <H2 id="editors-run">启动语言服务器</H2>
      <p>
        tsrs 通过 TypeScript 7
        的语言服务器协议提供诊断、hover、跳转定义、查找引用、重命名、带自动导入的补全、 code fix
        与格式化。命令是：
      </p>
      <Cmd text="tsrs --lsp -stdio" />
      <p>
        它与 <code>tsgo --lsp -stdio</code> 说同一套协议（沿用 Go 的参数解析，<code>-stdio</code> 和{' '}
        <code>--stdio</code> 都可以，且只支持 stdio）。二进制可以来自 npm 包 <code>tsrs</code>，
        也可以本地构建：<code>cargo build --profile dev -p tsrs_cli</code> 得到{' '}
        <code>target/debug/tsrs</code>。
      </p>
      <Callout kind="info">
        <p>
          诊断采用 pull 方式（<code>textDocument/diagnostic</code>，VS Code 与 Neovim
          客户端都支持）， tsconfig 层面的错误仍然推送。自动类型获取（automatic type
          acquisition）与性能/项目遥测未移植。
        </p>
      </Callout>

      <H2 id="editors-vscode">VS Code</H2>
      <p>
        TypeScript 7 扩展（<code>TypeScriptTeam.native-preview</code>）在{' '}
        <code>js/ts.tsdk.path</code> 指向的目录里 发现名为 <code>tsgo</code> 或 <code>tsc</code>{' '}
        的可执行文件时，会启动 <code>&lt;tsdk&gt;/tsgo --lsp --stdio</code>。自 0.20.0 起 npm
        包内自带 <code>tsdk/tsgo</code>（macOS 与 Linux）， 因此安装后提交这份{' '}
        <code>.vscode/settings.json</code>，让每位同事的编辑器都用锁文件里的版本：
      </p>
      <CodeBlock
        lang="jsonc"
        code={`{
  "js/ts.experimental.useTsgo": true,
  "js/ts.tsdk.path": "./node_modules/tsrs/tsdk",
  "js/ts.trace.server": "verbose"   // 可选：在 "TypeScript 7" 输出面板打印协议日志
}`}
      />
      <p>
        在 <strong>Windows</strong> 上应指向原生平台包的根目录。把与 <code>tsrs</code>{' '}
        同版本的平台包加为直接可选依赖， 升级时两者保持同版本：
      </p>
      <Cmd text="pnpm add -O --save-exact @tsrs/win32-x64@7.1.0-beta.tsrs2" />
      <CodeBlock
        lang="jsonc"
        code={`{
  "js/ts.experimental.useTsgo": true,
  "js/ts.tsdk.path": "./node_modules/@tsrs/win32-x64"
}`}
      />
      <p>
        Windows ARM64 请把上面两处换成 <code>@tsrs/win32-arm64</code>（0.25.0
        起提供）。原生平台包根目录同时携带 <code>tsrs[.exe]</code> 与默认库；0.20.1 起 Windows
        包里还附带一份与 <code>tsrs.exe</code> 相同的 <code>tsgo.exe</code>，供 VS Code 的 SDK
        发现逻辑使用。两种布局都不会往 <code>node_modules/.bin</code> 里加 <code>tsgo</code>{' '}
        命令；macOS/Linux 的 <code>tsrs/tsdk</code> 启动器与实际的平台二进制一致。
      </p>
      <p>若使用较旧的 npm 版本或本地构建（macOS/Linux），改为建立符号链接：</p>
      <Cmd text={'mkdir -p ~/.tsrs-tsdk && ln -sf "$PWD/target/debug/tsrs" ~/.tsrs-tsdk/tsgo'} />
      <p>
        再把用户设置里的 <code>js/ts.tsdk.path</code> 指向该目录的绝对路径（如{' '}
        <code>/Users/&lt;you&gt;/.tsrs-tsdk</code>）， 执行 “TypeScript 7: Restart
        Server”（或重载窗口），输出面板会显示它实际启动的可执行文件。 content mapper（
        <code>js/ts.contentMappers.enabled</code>）只在受信任的工作区里运行，与 <code>tsrs -p</code>
        、<code>tsrs -b</code> 相同。
      </p>

      <H2 id="editors-neovim">Neovim（0.11+ 内置客户端）</H2>
      <CodeBlock
        lang="lua"
        code={`vim.lsp.config('tsrs', {
  cmd = { 'tsrs', '--lsp', '-stdio' },          -- 或 target/debug/tsrs 的绝对路径
  filetypes = { 'typescript', 'typescriptreact', 'javascript', 'javascriptreact' },
  root_markers = { 'tsconfig.json', 'jsconfig.json', 'package.json', '.git' },
})
vim.lsp.enable('tsrs')`}
      />
      <p>
        请为同一批 buffer 关掉其他 TypeScript 服务器（如 <code>ts_ls</code>、<code>vtsls</code>
        ），以免结果重复。 上游以 Neovim 0.11.6
        无界面验证过：客户端能挂上、打开文件的类型错误作为诊断到达、hover 返回 quick info；{' '}
        <code>:checkhealth vim.lsp</code> 可查看已连接的客户端，
        <code>vim.lsp.set_log_level('debug')</code> 记录协议。
      </p>

      <H2 id="editors-other">其他编辑器</H2>
      <p>
        上游文档目前只给出 VS Code 与 Neovim 两份配置。任何允许自定义 LSP 启动命令的编辑器，
        使用同一条 <code>tsrs --lsp -stdio</code> 即可。注意 Linux 上的内置文件监视被禁用（与 Go
        相同）， 需要客户端支持 <code>workspace/didChangeWatchedFiles</code> 的动态注册。
      </p>
      <p>
        编辑器扩展还可以经由语言服务器拿到一个 TypeScript 7 Node API 会话：{' '}
        <code>custom/initializeAPISession</code> 返回一个管道（私有 Unix socket 或 Windows
        命名管道）， 再用包内 <code>tsrs/async</code> 客户端的{' '}
        <code>API.fromLSPConnection({'{ pipe }'})</code> 连接， 可查询服务器的项目与已打开文件，详见{' '}
        <a href="#/docs/api">Node API</a>。
      </p>

      <H2 id="editors-fast">TSRS_FAST 对 LSP 的影响</H2>
      <p>
        <code>--lsp</code> 没有 <code>--fast</code> 标志，但会读取 <code>TSRS_FAST</code>：继承{' '}
        <code>TSRS_FAST=1</code> 的语言服务器使用惰性类型成员、规范化 checker 历史与额外的 checker
        缓存；
        <strong>声明解析仍是 eager，已完成的文件也不会被释放</strong>。
      </p>

      <H2 id="editors-editreuse">编辑复用 program</H2>
      <p>
        自 0.24.0 起，保留文件 import 的编辑会复用 program，即使项目启用了{' '}
        <code>importHelpers</code> 或 <code>jsx: react-jsx</code>：为 <code>tslib</code> 与 JSX
        runtime 生成的合成 import 不再在每次普通编辑后强制整体重建。 改变 import
        的编辑仍会触发完整重建。
      </p>
      <p>
        更多实现细节与已知缺口见{' '}
        <Ext href="https://github.com/oxc-project/tsrs/blob/main/docs/LSP.md">docs/LSP.md</Ext>。
      </p>
    </>
  );
}
