import { H2, Callout, DocTable, Ext } from '../bits';
import { Cmd } from '../../components/ui';

export function Playground() {
  return (
    <>
      <H2 id="play-open">在线 playground</H2>
      <p>
        <a
          className="btn-fire"
          href="https://tsrs-playground.void.app"
          target="_blank"
          rel="noreferrer"
          style={{ textDecoration: 'none' }}
        >
          打开 tsrs playground ↗
        </a>
      </p>
      <p>
        这是官方托管在 Void 上的浏览器版本，每次发布部署成功之后自动更新。它跑的就是{' '}
        <a href="#/docs/wasm">@tsrs/wasm</a> 构建，因此是<strong>单线程</strong>的，与本地原生 CLI
        不同；也可以按 上游的 <code>playground/README.md</code> 做本地 / 静态构建，它带官方
        TypeScript Playground 的页面与样式。
      </p>

      <H2 id="play-does">能做什么</H2>
      <ul>
        <li>类型检查与代码生成（checking 与 emit）由 tsrs 的 WASM 模块完成，诊断以 JSON 返回。</li>
        <li>
          虚拟多文件编辑器、错误列表、JavaScript 与声明输出、示例项目、Run / Logs 面板，可分享链接，
          并兼容官方 playground 的插件。
        </li>
        <li>
          上游为这个托管版本做了视觉源固定校验、与原生等价性的集成检查，以及本地与托管环境的生产浏览器检查。
        </li>
      </ul>

      <H2 id="play-scenarios">适合的场景</H2>
      <ul>
        <li>快速验证一个行为或一条诊断，不必装包、不必等构建。</li>
        <li>
          报 bug 前把复现缩到最小：上游要求 issue 附最小复现、tsrs
          与参考编译器版本、运行的命令与期望 / 实际输出，playground
          里的文件树与分享链接正适合产出这样的复现。
        </li>
        <li>
          向别人演示编译器行为差异，例如 <a href="#/docs/fast">fast 预设</a>
          在已知历史依赖案例中的诊断变化。
        </li>
      </ul>

      <H2 id="play-diff">与本地 CLI 的差异</H2>
      <DocTable
        head={['维度', 'playground / @tsrs/wasm', '本地原生 CLI']}
        rows={[
          [
            '线程模型',
            '单线程；--checkers 会被接受，但一切都跑在一个线程上',
            '默认 4 个 checker，fast 预设自适应更多',
          ],
          [
            '诊断结果',
            <>
              与原生 tsrs --singleThreaded 逐字节一致（CI 每个 PR 都跑的 2,000 例一致性抽样差分门）
            </>,
            '与 pinned TypeScript 的行为保持一致',
          ],
          [
            '速度',
            'warm 运行约为原生单线程 wall 的 1.8–2.3 倍',
            <>
              数字见 <a href="#/docs/benchmarks">基准</a>
            </>,
          ],
          [
            '不支持的部分',
            <>
              <code>--watch</code>、<code>--lsp</code>、<code>--api</code>、<code>--build</code>{' '}
              下的 JSON 诊断、<code>--checkerCostCache</code>，以及超过 4 GiB 的程序
            </>,
            <>
              除 <code>--init</code> 之外均可用，见 <a href="#/docs/cli">CLI</a>
            </>,
          ],
          [
            '编辑器能力',
            '只做基础编辑，没有语义补全 / hover、AST 与类型查看、inlay hints、自动类型获取',
            <>
              由 <code>--lsp</code> 提供，见 <a href="#/docs/editors">编辑器与 LSP</a>
            </>,
          ],
        ]}
      />
      <Callout kind="warn">
        <p>
          playground 适合验证与演示，不能替代真实项目里的检查。要在自己的代码库上跑，请在本地安装
          CLI：
        </p>
      </Callout>
      <Cmd text="pnpm add -D tsrs" />
      <p>
        WASM 构建在 Node 与浏览器里的用法见 <a href="#/docs/wasm">WebAssembly</a>；也可以按上游的{' '}
        <Ext href="https://github.com/oxc-project/tsrs/blob/main/playground/README.md">
          playground/README.md
        </Ext>{' '}
        做本地 / 静态构建。
      </p>
    </>
  );
}
