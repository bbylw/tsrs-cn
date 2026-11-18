import { H2, Callout, CodeBlock, DocTable, Ext } from '../bits';
import { Cmd } from '../../components/ui';

export function NodeApi() {
  return (
    <>
      <H2 id="api-install">安装与元信息</H2>
      <p>
        Node API 随主包一起发布，服务端是同一个 <code>tsrs</code> 二进制的 <code>--api</code> 模式。
        客户端代码来自 TypeScript 7 的 <code>packages/typescript</code>，按上游相同的子路径导出，
        编译器与 SDK 都跟随 <code>3e9236361fa9</code>（TypeScript 7.1 beta）。
      </p>
      <Cmd text="pnpm add -D tsrs@7.1.0-beta.tsrs2" />
      <p>
        <code>require("tsrs")</code> 导出 <code>version</code>、<code>typescriptVersion</code> 和{' '}
        <code>typescriptCommit</code>。
      </p>

      <H2 id="api-subpaths">主要入口</H2>
      <DocTable
        head={['子路径', '内容']}
        rows={[
          ['tsrs/sync', '同步调用的 API（MessagePack 走服务端 stdio）'],
          ['tsrs/async', '返回 Promise 的 API（JSON-RPC）'],
          [
            'tsrs/ast（/is、/factory、/utils、/scanner、/visitor、/clone）',
            'AST 类型、类型守卫、factory 与遍历',
          ],
          ['tsrs/fs、tsrs/proto', '文件系统回调 / 请求文件系统、协议类型'],
          ['tsrs/path', '强类型路径构造器与辅助函数'],
          [
            'tsrs/vscode',
            'createTypeScriptModuleLoader 与上游编辑器 SDK 类型；tsrs 不打包 VS Code 扩展',
          ],
        ]}
      />
      <p>最小示例（同步 API）：</p>
      <CodeBlock
        lang="js"
        code={`import { API } from "tsrs/sync";

const api = new API({ cwd: process.cwd() });            // 启动 \`tsrs --api\`；tsserverPath 可覆盖二进制
const snapshot = api.createSnapshot({ openProjects: ["/abs/path/tsconfig.json"] });
const project = snapshot.getConfiguredProject("/abs/path/tsconfig.json");
console.log(project.program.getSemanticDiagnostics("/abs/path/src/index.ts"));
project.program.emit();                                  // 按项目的编译器选项输出
api.close();`}
      />

      <H2 id="api-contract">接口要点</H2>
      <ul>
        <li>
          <code>createSnapshot</code> 与 <code>updateSnapshot</code> 接受{' '}
          <code>userPreferences</code> 和带目标文件的 <code>prepareAutoImports</code>
          ；需要自动导入时，必须先请求该准备，再调用带 <code>includeSymbol: true</code> 的{' '}
          <code>getCompletionsAtPosition</code>，未准备的 snapshot 会报客户端错误。
        </li>
        <li>
          同步与异步 API 都暴露 <code>getSymbol(declaration)</code>，两个包另外导出独立{' '}
          <code>getSymbol</code>；它取回缓存源文件里的 binder
          symbol，合成/配置声明与被释放的文件没有可查结果。
        </li>
        <li>
          <code>initialize</code> 响应里的 <code>caseSensitivity</code> 是 TypeScript
          的枚举；推断项目不带 <code>configFileName</code>；snapshot 的 program 与 transpile
          请求接受原始编译器选项，相对路径按 API 服务进程当前目录解析。
        </li>
        <li>
          同步 generator 实例在 <code>API.batch</code> 调用之间只能使用一次，重复使用抛{' '}
          <code>Cannot execute the same generator instance more than once</code>；
          <code>TS_API_TIMING_DIR</code> 指向非空目录时启用计时，关闭时各客户端写一份 JSON 快照。
        </li>
        <li>
          声明使用 <code>Symbol.dispose</code> / <code>Symbol.asyncDispose</code>，消费方需要{' '}
          <code>esnext.disposable</code> 或更新的 lib；异步的 <code>Snapshot</code>、
          <code>Program</code>、<code>BuildOrchestrator</code> 用 <code>await using</code>{' '}
          等待清理完成。JS API 支持到包的最低 Node（16.20，在 16.20、18、20、22、24 上验证过）；{' '}
          缺少 disposal symbol 时请显式调用 <code>close()</code> / <code>dispose()</code>。
        </li>
        <li>
          与上游有意的一处差异：服务端进程死亡后，异步 API 会让所有在途与后续请求以{' '}
          <code>API server connection lost: </code> 开头的错误被拒绝，而不是一直挂起。
        </li>
      </ul>

      <H2 id="api-status">覆盖度与稳定性</H2>
      <Callout kind="warn">
        <p>
          接口仍在变动：0.20.0 起移除已废弃的 <code>openProject</code>、
          <code>Project.rootFiles</code> / <code>.compilerOptions</code> 与{' '}
          <code>Snapshot.internal</code> 格式化别名，改用 <code>openProjects</code>、
          <code>project.parsedCommandLine</code> 和{' '}
          <code>project.languageService.formatNodeForInsertion</code>。<code>tsrs --api</code>{' '}
          对协议中 177 个方法的覆盖还不完整 （记录在案的 SDK 套件在两个编译器上 968/968 通过，其中
          170 个方法有成功响应），未实现的方法返回显式的 <code>api: unsupported: ...</code>{' '}
          错误而非假成功；profiling 相关请求未实现。API 构建强制 <code>singleThreaded</code>，因此{' '}
          <code>--builders</code> 与 checker 并行不会加速 API 构建。
        </p>
      </Callout>
      <p>
        <code>--api</code> 进程没有 <code>--fast</code> 选项，但读取 <code>TSRS_FAST</code>：继承{' '}
        <code>TSRS_FAST=1</code> 时使用惰性成员、规范化 checker 历史与额外缓存，声明解析仍是 eager。
        完整的实现说明、方法清单与已知缺口见{' '}
        <Ext href="https://github.com/oxc-project/tsrs/blob/main/docs/NODE_API.md">
          docs/NODE_API.md
        </Ext>
        。
      </p>
    </>
  );
}
