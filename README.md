# `tsrs`

[![npm](https://img.shields.io/npm/v/tsrs)](https://www.npmjs.com/package/tsrs)
[![license](https://img.shields.io/badge/license-Apache--2.0-blue)](https://github.com/oxc-project/tsrs/blob/main/LICENSE)

`tsrs` 是一个用 Rust 编写的、可直接替代 TypeScript 7 编译器与语言服务的实现。
我们的目标是实现 100% 一致性，同时大幅降低内存占用并加快类型检查速度。[阅读公告](https://blog.cloudflare.com/typescript-rust-port/)。

## 快速开始

```sh
pnpm add -D tsrs
pnpm exec tsrs --noEmit
```

你可以现在就试用 `tsrs`，并就性能、内存占用和一致性给我们反馈。
可以在 [浏览器 playground](https://tsrs-playground.void.app) 中尝试检查并生成代码。

## 一致性

`tsrs` 当前以 [microsoft/TypeScript](https://github.com/microsoft/typescript) 的 main 分支为目标。
我们计划针对 TypeScript 7.1 发布一个具备 100% 一致性的稳定版本。在对现有项目的测试中，
我们尚未发现 `tsrs` 存在正确性错误。

存在已知的顺序问题：固定的 Go 编译器会根据并行的解析、模块解析与检查顺序，产生不同的诊断信息与调用栈追踪；
而 `tsrs` 默认会对部分检查器历史进行规范化。为了获得最接近的比较结果，请使用 `--checkerAssignment go --noLazyMembers`；
tsgo 的解析器与模块解析器之间的竞态，仍可能导致每次运行的输出有所不同。

`--init` 与 `--showConfig` 暂不支持。参见 [兼容性与证据](https://github.com/oxc-project/tsrs/blob/main/docs/COMPATIBILITY.md)，
了解已支持的功能与已知差距。

<a href="https://github.com/oxc-project/tsrs/blob/main/bench/RESULTS.md">
  <picture>
    <source media="(prefers-color-scheme: dark)" srcset="https://raw.githubusercontent.com/oxc-project/tsrs/main/bench/large-projects-dark.svg">
    <source media="(prefers-color-scheme: light)" srcset="https://raw.githubusercontent.com/oxc-project/tsrs/main/bench/large-projects.svg">
    <img alt="tsrs vs the TypeScript nightly: times faster against times less peak memory on seven projects at 1, 2, 4 and 8 parallel checker threads" src="https://raw.githubusercontent.com/oxc-project/tsrs/main/bench/large-projects.svg">
  </picture>
</a>

## 额外功能

[`@tsrs/wasm`](https://github.com/oxc-project/tsrs/blob/main/npm/tsrs-wasm/README.md) 提供 WebAssembly 支持，
目标平台为 `wasm32-wasip1`（WASI Preview 1）。

## 了解更多

- [CLI 用法与内存调优](https://github.com/oxc-project/tsrs/blob/main/docs/USAGE.md)
- [编辑器配置](https://github.com/oxc-project/tsrs/blob/main/docs/LSP.md#editor-setup)
- [Node API（不稳定）](https://github.com/oxc-project/tsrs/blob/main/docs/NODE_API.md)
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
