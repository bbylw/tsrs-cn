# `tsrs`

[![npm](https://img.shields.io/npm/v/tsrs)](https://www.npmjs.com/package/tsrs)
[![license](https://img.shields.io/badge/license-Apache--2.0-blue)](https://github.com/oxc-project/tsrs/blob/main/LICENSE)

`tsrs` 是一个用 Rust 编写的、可直接替代 TypeScript 7 编译器与语言服务的实现。
我们的目标是实现 100% 一致性，同时大幅降低内存占用并加快类型检查速度。[阅读公告](https://blog.cloudflare.com/typescript-rust-port/)。

## 快速开始

```sh
pnpm add -D tsrs
pnpm exec tsrs --noEmit --fast
```

`--fast` 打开性能优化，包括自适应 checker 数量与额外缓存。详见下文 [fast 模式](#fast-模式)。

你可以现在就试用 `tsrs`，并就性能、内存占用和一致性给我们反馈。
可以在 [浏览器 playground](https://tsrs-playground.void.app) 中尝试检查并生成代码。

<a href="https://github.com/oxc-project/tsrs/blob/main/bench/RESULTS.md">
  <img alt="tsrs --fast、tsrs 与 TypeScript 7.1 beta：逐项目检查耗时与峰值内存" src="https://raw.githubusercontent.com/oxc-project/tsrs/main/bench/benchmark.svg">
</a>

## 一致性

我们计划针对 TypeScript 7.1 发布一个具备 100% 一致性的稳定版本。
支持的功能与已知缺口见 [兼容性与证据](https://github.com/oxc-project/tsrs/blob/main/docs/COMPATIBILITY.md)。

默认模式保留被钉住的 TypeScript 编译器的 checker 行为，包括 checker 数量或文件顺序变化时已知的诊断差异；
这一敏感性继承自 TypeScript 本身。其余运行时差异与未支持的功能见
[与钉住 TypeScript 的差异](https://github.com/oxc-project/tsrs/blob/main/docs/DEFAULTS.md)。

## 版本号

版本号由「所支持的 TypeScript 版本 + 不补零的 tsrs 修订号」组成。针对 TypeScript `7.1.0-beta`，
`7.1.0-beta.tsrs1` 是首个 tsrs 发布，`7.1.0-beta.tsrs2` 是下一个修复；稳定的 TypeScript `7.1.0`
使用 `7.1.0-tsrs1`。

SemVer 把 `tsrsN` 当作文本比较，所以 `tsrs10` 排在 `tsrs9` 之前；同一 TypeScript 版本上的连续修订
需要换一个 TypeScript 版本。这些版本都是 tsrs 预发布版本（包括面向稳定版 TypeScript 的），
自 `7.1.0-beta.tsrs3` 起发布在 npm 的 `latest` 标签（`pnpm add -D tsrs`）。
编译器的 TypeScript 兼容版本与精确源码提交仍可通过 `tsrs --version` 与 npm 元数据单独获得。
nightly 版本与发布排序见
[版本与发布](https://github.com/oxc-project/tsrs/blob/main/docs/RELEASING_CRATES.md#versioning)。

## fast 模式

以下默认值与可选预设在 **0.20.0** 及以后可用。

默认情况下，tsrs 遵循被钉住的 TypeScript 编译器的 checker 设置：四个 checker（按文件数封顶）、
Go 的文件分配与 checker 历史。用 `--fast` 或 `TSRS_FAST=1` 打开 fast 预设：

```sh
pnpm exec tsrs --noEmit --fast
# 或通过环境变量打开同一预设：
TSRS_FAST=1 pnpm exec tsrs --noEmit
```

fast 模式按机器与项目自适应 checker 数量、把相关的工作分组，并启用额外缓存与内存优化。
它不会改动 `strict`、`skipLibCheck`、`noCheck` 等检查选项。
配置、行为与增量缓存细节见
[性能选项](https://github.com/oxc-project/tsrs/blob/main/docs/USAGE.md#performance-options)。

## Type-aware lint

`tsrs-lint` 可以取代 tsgolint，成为 [Oxlint](https://oxc.rs) type-aware 规则的后端。加上 `--type-check`，
同一次运行还会报告 Oxlint 所 lint 文件的类型错误，与 tsgolint 一致。tsrs **0.23.0** 及以后可用；
Oxlint **1.92.0** 及以后会在检测到 `tsrs` 已安装时找到 `tsrs-lint`，并用它取代 oxlint-tsgolint：

```sh
pnpm add -D oxlint tsrs
TSRS_FAST=1 pnpm exec oxlint --type-aware --type-check
```

Oxlint 不 lint 的文件不会被类型检查，因此请保留一次单独的 `tsrs --noEmit` 来检查整个 tsconfig program。
另见
[lint 运行中的类型检查](https://github.com/oxc-project/tsrs/blob/main/tools/tsgolint/README.md#type-checking-in-the-lint-run)。
下方图表测量于 tsrs 0.24.0，当时 `--type-check` 检查整个 tsconfig program。

<a href="https://github.com/oxc-project/tsrs/blob/main/bench/lint-typecheck/RESULTS.md">
  <img alt="8 核上的 type-aware lint 与类型检查：tsrs 一次 Oxlint 运行、tsrs 加单独检查、tsgolint 加 tsgo、ESLint 加 tsc 的墙钟时间、CPU 时间与峰值内存" src="https://raw.githubusercontent.com/oxc-project/tsrs/main/bench/lint-typecheck/chart.svg">
</a>

## 额外功能

[`@tsrs/wasm`](https://github.com/oxc-project/tsrs/blob/main/npm/tsrs-wasm/README.md) 提供 WebAssembly 支持，
目标平台为 `wasm32-wasip1`（WASI Preview 1）。

## 了解更多

- [CLI 用法与内存调优](https://github.com/oxc-project/tsrs/blob/main/docs/USAGE.md)
- [编辑器配置](https://github.com/oxc-project/tsrs/blob/main/docs/LSP.md#editor-setup)
- [Node API](https://github.com/oxc-project/tsrs/blob/main/docs/NODE_API.md)
- [面向 Node 与浏览器的 WebAssembly](https://github.com/oxc-project/tsrs/blob/main/npm/tsrs-wasm/README.md)
- [基准测试与方法论](https://github.com/oxc-project/tsrs/blob/main/bench/README.md)
- [发布说明](https://github.com/oxc-project/tsrs/blob/main/docs/STATUS.md)
- [工程笔记](https://github.com/oxc-project/tsrs/blob/main/notes/README.md)

## 贡献

[issue 追踪器](https://github.com/oxc-project/tsrs/issues) 已开放用于提交 bug 报告，请附上一个最小可复现示例。
我们暂不接收 Pull Request，因为我们没有足够精力进行审查。

参见 [贡献指南](https://github.com/oxc-project/tsrs/blob/main/CONTRIBUTING.md)，了解如何从源码构建并运行测试套件；
另见 [行为准则](https://github.com/oxc-project/tsrs/blob/main/CODE_OF_CONDUCT.md) 与
[安全策略](https://github.com/oxc-project/tsrs/blob/main/SECURITY.md)，以报告安全漏洞。

## 致谢

我们感谢以下组织与贡献者：

<p>
  <a href="https://depot.dev">
    <picture>
      <source media="(prefers-color-scheme: dark)" srcset="https://raw.githubusercontent.com/oxc-project/tsrs/main/assets/sponsors/depot-dark.svg">
      <img alt="Depot" src="https://raw.githubusercontent.com/oxc-project/tsrs/main/assets/sponsors/depot-light.svg" height="32">
    </picture>
  </a>
  &nbsp;&nbsp;&nbsp;&nbsp;
  <a href="https://www.owner.com">
    <picture>
      <source media="(prefers-color-scheme: dark)" srcset="https://raw.githubusercontent.com/oxc-project/tsrs/main/assets/sponsors/owner-dark.svg">
      <img alt="Owner.com" src="https://raw.githubusercontent.com/oxc-project/tsrs/main/assets/sponsors/owner-light.svg" height="32">
    </picture>
  </a>
</p>

- [Depot CI](https://depot.dev) 为我们的持续集成提供赞助。
- [Owner.com](https://www.owner.com) 赞助了项目的初期工作。
- [Max Schwenk](https://github.com/maschwenk) 完成了整体移植。
- [@walkerdb](https://github.com/walkerdb) 为项目做了改进。
- [@JiangWeixian](https://github.com/JiangWeixian) 转让了 `tsrs` 的 npm 包名。

我们特别感谢 [TypeScript 团队](https://www.typescriptlang.org/) 给予的支持。

## 许可证

`tsrs` 是 TypeScript（版权归 Microsoft Corporation 所有）的衍生品，基于 [Apache-2.0](https://github.com/oxc-project/tsrs/blob/main/LICENSE) 许可发布。
随附的 `lib.*.d.ts` 文件来自 TypeScript，署名信息见 [NOTICE](https://github.com/oxc-project/tsrs/blob/main/NOTICE)。
本项目与 Microsoft 无隶属关系，也未获其背书。
