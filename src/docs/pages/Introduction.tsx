import { H2, Callout, Ext } from '../bits';
import { Cmd } from '../../components/ui';

export function Introduction() {
  return (
    <>
      <H2 id="intro-what">什么是 tsrs</H2>
      <p>
        <code>tsrs</code> 是用 Rust 编写的 <strong>TypeScript 7 编译器与语言服务器的直替</strong>
        （drop-in replacement）。它逐函数移植自 microsoft/TypeScript 中的 Go 实现（
        <code>tsc/internal</code>），保持函数名、结构与控制流， 目标有三条：
        <strong>100% 一致性</strong>、<strong>更低的内存占用</strong>、
        <strong>更快的类型检查</strong>。 Cloudflare 的公告解释了这项工作的背景：
        <Ext href="https://blog.cloudflare.com/typescript-rust-port/">
          TypeScript 的 Rust 移植公告
        </Ext>
        。
      </p>
      <Cmd text="pnpm add -D tsrs@next" />
      <p>
        安装后用 <code>tsrs</code> 取代 <code>tsc</code> 即可，命令行参数不变；已有的{' '}
        <code>tsconfig.json</code> 决定编译行为。
      </p>

      <H2 id="intro-status">当前状态</H2>
      <p>
        截至同步日期（2026-11-18），上游最新发布为 <code>7.1.0-beta.tsrs2</code>
        （2026-11-16），这是第一个使用 TypeScript 对齐版本号的 npm 发布；npm 的 <code>
          latest
        </code>{' '}
        标签仍指向 <code>0.25.0-ts7.1.0-beta</code>， 该预发布版本发布在 <code>next</code>
        （发布流水线已于 2026-11-17 改为面向 <code>latest</code>， 后续发布可能直接落在{' '}
        <code>latest</code>，见 <a href="#/docs/status">状态与发布</a>）。tsrs 目标 TypeScript{' '}
        <code>7.1</code>，源码钉在 <code>microsoft/TypeScript@3e9236361fa9</code>（TypeScript
        7.1.0-beta）。
      </p>

      <H2 id="intro-defaults">默认模式与 --fast</H2>
      <p>
        默认模式下 tsrs 沿用被钉住的 TypeScript 编译器的 checker 行为：<strong>4 个 checker</strong>
        （按文件数封顶）、 Go 的文件分配与 checker 历史、eager
        成员实例化。性能优化不是默认行为，而是可选预设 <code>--fast</code>（等价于{' '}
        <code>TSRS_FAST=1</code>），自 0.20.0 起可用。详见 <a href="#/docs/fast">fast 模式</a>与{' '}
        <a href="#/docs/cli">CLI 用法</a>。
      </p>

      <H2 id="intro-conformance">一致性目标与已知边界</H2>
      <p>
        参考默认值下，与钉住的 Go 编译器在诊断内容、顺序、文本或退出码上的任何差异都被视为 tsrs 的
        bug，即使 tsrs 的输出看起来更合理。TypeScript 自身的诊断在某些情况下会随 checker
        数量或文件顺序变化，默认模式刻意保留这一 上游敏感性；fast
        预设改动了调度、历史与惰性实例化，在已知案例中可能增减诊断或改变退出码。支持范围与已知缺口见{' '}
        <Ext href="https://github.com/oxc-project/tsrs/blob/main/docs/COMPATIBILITY.md">
          COMPATIBILITY
        </Ext>
        ， 与钉住版本的逐项差异见{' '}
        <Ext href="https://github.com/oxc-project/tsrs/blob/main/docs/DEFAULTS.md">DEFAULTS</Ext>。
      </p>

      <H2 id="intro-versioning">版本号语义简述</H2>
      <p>
        版本号由「所支持的 TypeScript 版本 + 不补零的 tsrs 修订号」组成：针对{' '}
        <code>7.1.0-beta</code> 的首个发布是 <code>7.1.0-beta.tsrs1</code>，下一个修复是{' '}
        <code>7.1.0-beta.tsrs2</code>；若针对稳定的 <code>7.1.0</code> 则为 <code>7.1.0-tsrs1</code>
        。这些都属于 SemVer 预发布版本，当前发布在 npm 的 <code>next</code> 标签。完整规则与 坑（
        <code>tsrs10</code> 按文本排序会小于 <code>tsrs9</code>）见{' '}
        <a href="#/docs/status">状态与版本</a>。
      </p>

      <H2 id="intro-license">许可证与归属</H2>
      <Callout kind="info">
        <p>
          tsrs 以 <strong>Apache-2.0</strong> 许可发布，是 TypeScript（Copyright Microsoft
          Corporation）的衍生作品， 打包的 <code>lib.*.d.ts</code> 来自 TypeScript，归属信息见仓库的
          NOTICE。项目与 Microsoft 无隶属关系， 也未获其背书。
        </p>
      </Callout>
    </>
  );
}
