import { H2, Callout, CodeBlock, DocTable, Ext } from '../bits';
import { Cmd } from '../../components/ui';

export function Installation() {
  return (
    <>
      <H2 id="install-pm">按包管理器安装</H2>
      <p>
        npm 的 <code>latest</code> 标签自 <code>7.1.0-beta.tsrs3</code> 起直接指向 TypeScript
        对齐版本，当前为 <code>7.1.0-beta.tsrs5</code>，取代旧的 <code>0.25.0-ts7.1.0-beta</code>{' '}
        成为默认安装；早先的 <code>@next</code> 预发布通道已经退役。裸装得到最新发布，需要可复现
        构建时写完整版本号。
      </p>
      <CodeBlock
        lang="sh"
        code={`# pnpm
pnpm add -D tsrs
pnpm add -D tsrs@7.1.0-beta.tsrs5

# npm
npm i -D tsrs
npm i -D tsrs@7.1.0-beta.tsrs5

# bun
bun add -d tsrs
bun add -d tsrs@7.1.0-beta.tsrs5

# yarn
yarn add -D tsrs
yarn add -D tsrs@7.1.0-beta.tsrs5`}
      />
      <p>上游文档里的命令一律以 pnpm 书写；其他包管理器是同义命令。</p>

      <H2 id="install-first">第一次运行</H2>
      <p>
        <code>tsrs</code> 默认和 <code>tsc</code> 一样按 <code>tsconfig.json</code> 输出 JavaScript
        与声明文件， 只想做类型检查时加上 <code>--noEmit</code>
        。建议先跑一次与参考编译器语义一致的默认模式，再对比 <code>--fast</code> 预设：
      </p>
      <Cmd text="pnpm exec tsrs --noEmit" />
      <Cmd text="pnpm exec tsrs --noEmit --fast" />
      <p>
        不想把 tsrs 装进项目时，可以用 <code>pnpm dlx</code> 直接运行：
      </p>
      <Cmd text="pnpm dlx tsrs@7.1.0-beta.tsrs5 -p ." />

      <H2 id="install-platforms">原生平台包</H2>
      <p>
        主包 <code>tsrs</code> 是一个 Node 启动器，按当前 platform、arch 与 libc 安装对应的可选依赖{' '}
        <code>@tsrs/&lt;os&gt;-&lt;arch&gt;[-&lt;libc&gt;]</code>，与 TypeScript 7 发布{' '}
        <code>typescript@7</code> / <code>@typescript/typescript-&lt;os&gt;-&lt;arch&gt;</code>{' '}
        的方式一致。
      </p>
      <DocTable
        head={['包', '说明']}
        rows={[
          ['@tsrs/darwin-arm64', 'Apple Silicon macOS'],
          ['@tsrs/darwin-x64', 'Intel macOS，0.20.0 起进入平台集'],
          [
            '@tsrs/linux-x64-gnu / @tsrs/linux-arm64-gnu',
            'glibc 构建，GNU Linux 在 Ubuntu 22.04 上编译，最高只需 glibc 2.35',
          ],
          ['@tsrs/linux-x64-musl / @tsrs/linux-arm64-musl', 'musl 静态构建，无 PGO/BOLT'],
          ['@tsrs/win32-x64', 'Windows x64，0.20.0 起'],
          [
            '@tsrs/win32-arm64',
            'Windows ARM64，0.25.0 新增（aarch64-pc-windows-msvc，用 rust-lld 链接）',
          ],
          [
            '@tsrs/wasm',
            <>
              WebAssembly 构建，面向无原生二进制的平台，见 <a href="#/docs/wasm">WebAssembly</a>
            </>,
          ],
        ]}
      />
      <p>
        要让启动器运行本地构建的二进制，设置 <code>TSRS_BINARY</code>：
      </p>
      <Cmd text="TSRS_BINARY=$PWD/target/debug/tsrs pnpm exec tsrs --version" />
      <p>
        <code>tsrs --version</code> 会同时报告 TypeScript 兼容版本与 tsrs 版本，例如{' '}
        <code>Version 7.1.0-beta (tsrs 7.1.0-beta.tsrs5, microsoft/TypeScript@3e9236361fa9)</code>。
      </p>

      <H2 id="install-wasm">没有原生二进制的平台</H2>
      <p>
        平台包覆盖之外的环境使用 <code>@tsrs/wasm</code>（单线程、目标 <code>wasm32-wasip1</code>
        ）， 详见 <a href="#/docs/wasm">WebAssembly</a>。也可以在浏览器 playground 里直接试用：{' '}
        <Ext href="https://tsrs-playground.void.app">tsrs playground</Ext>。
      </p>

      <Callout kind="warn">
        <p>
          pnpm 工作区若设置了 <code>minimumReleaseAge</code>，新发布的 tsrs
          与平台包会被推迟安装，需要等待或把它们列入 <code>minimumReleaseAgeExclude</code>
          。安装后请检查 <code>pnpm-lock.yaml</code> 的差异，非 frozen 安装可能重解析无关条目。
        </p>
      </Callout>
    </>
  );
}
