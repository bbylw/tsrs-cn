import type { ComponentType } from 'react';
import { Introduction } from './pages/Introduction';
import { Installation } from './pages/Installation';
import { Cli } from './pages/Cli';
import { FastMode } from './pages/FastMode';
import { Editors } from './pages/Editors';
import { NodeApi } from './pages/NodeApi';
import { Wasm } from './pages/Wasm';
import { Lint } from './pages/Lint';
import { Status } from './pages/Status';
import { Contributing } from './pages/Contributing';
import { Playground } from './pages/Playground';
import { BenchDoc, ConsistencyDoc, WatchDoc } from './pages/Evidence';

export const SYNC_DATE = '2026-11-18';

const blob = (path: string) => `https://github.com/oxc-project/tsrs/blob/main/${path}`;

export type DocPage = {
  slug: string;
  title: string;
  keywords: string;
  lead?: string;
  source?: string;
  /** evidence pages bring their own full-width interactive layout */
  wide?: boolean;
  /** skip the docs header/prose wrapper (page renders its own section) */
  bare?: boolean;
  Component: ComponentType;
};

export const PAGES: DocPage[] = [
  {
    slug: 'introduction',
    title: 'tsrs 是什么',
    keywords: '介绍 定位 rust typescript 7 直替 drop-in 一致性 apache',
    lead: 'TypeScript 7 编译器与语言服务器的 Rust 直替：定位、现状与边界。',
    source: blob('README.md'),
    Component: Introduction,
  },
  {
    slug: 'install',
    title: '安装与第一次运行',
    keywords: '安装 install pnpm npm bun yarn next 版本 平台 二进制 dlx',
    lead: '四种包管理器、版本号怎么读、八个原生平台包与 WASM 兜底。',
    source: blob('docs/USAGE.md'),
    Component: Installation,
  },
  {
    slug: 'cli',
    title: 'CLI 用法',
    keywords: 'cli 命令 标志 flags noEmit build watch checkers singleThreaded maxMemory 退出码',
    lead: '与 tsc 相同的命令行，加上 tsrs 自己的性能与内存开关。',
    source: blob('docs/USAGE.md'),
    Component: Cli,
  },
  {
    slug: 'fast',
    title: '--fast 性能预设',
    keywords: 'fast TSRS_FAST 预设 自适应 checker locality work stealing 缓存 lazy 惰性 内存',
    lead: '一个开关替换五类默认值：checker 数量、调度、历史、缓存与内存策略。',
    source: blob('docs/DEFAULTS.md'),
    Component: FastMode,
  },
  {
    slug: 'benchmarks',
    title: '性能基准',
    keywords: '基准 benchmark 19 项目 时间 内存 hyperfine m3 max 比例',
    wide: true,
    bare: true,
    Component: BenchDoc,
  },
  {
    slug: 'consistency',
    title: '一致性证据',
    keywords: '一致性 conformance 诊断 diff 基线 fourslash 确定性 千仓 wasm',
    wide: true,
    bare: true,
    Component: ConsistencyDoc,
  },
  {
    slug: 'watch',
    title: '增量编辑（--watch）',
    keywords: 'watch 增量 编辑 延迟 内存 rss fsevents inotify kqueue vscode',
    wide: true,
    bare: true,
    Component: WatchDoc,
  },
  {
    slug: 'editors',
    title: '编辑器与 LSP',
    keywords: '编辑器 lsp vs code vscode neovim tsdk 语言服务器 vue svelte astro',
    lead: '把编辑器的 TypeScript 语言服务器换成 tsrs --lsp。',
    source: blob('docs/LSP.md'),
    Component: Editors,
  },
  {
    slug: 'api',
    title: 'Node API',
    keywords: 'node api sdk program compiler host 接口 968 测试',
    lead: '在 Node 里驱动编译器：接口形状、验证规模与仍在变动的部分。',
    source: blob('docs/NODE_API.md'),
    Component: NodeApi,
  },
  {
    slug: 'wasm',
    title: 'WebAssembly',
    keywords: 'wasm wasi 浏览器 playground 单线程 字节一致 兜底',
    lead: 'wasm32-wasip1 构建：没有原生二进制的平台用它顶上，输出与原生单线程字节一致。',
    source: blob('docs/COMPATIBILITY.md'),
    Component: Wasm,
  },
  {
    slug: 'lint',
    title: 'Type-aware lint',
    keywords: 'lint oxlint tsrs-lint tsgolint 规则 type-aware type-check 61',
    lead: 'tsrs-lint 替代 tsgolint 接入 Oxlint：61 条规则，lint 与类型检查一次跑完。',
    source: blob('tools/tsgolint/README.md'),
    Component: Lint,
  },
  {
    slug: 'status',
    title: '状态与发布',
    keywords: '状态 路线图 roadmap 发布 release 版本 dist-tag next latest 限制',
    lead: '发布节奏、版本号策略与已知限制，跟随上游 releases 同步。',
    source: blob('docs/STATUS.md'),
    Component: Status,
  },
  {
    slug: 'contributing',
    title: '参与贡献',
    keywords: '贡献 contributing issue bug pr 行为准则 复现',
    lead: 'issue 是开的，PR 是关的：怎么报一个有用的 bug。',
    source: blob('CONTRIBUTING.md'),
    Component: Contributing,
  },
  {
    slug: 'play',
    title: '浏览器 playground',
    keywords: 'playground 浏览器 在线 试用 wasm 编辑',
    lead: '不装任何东西，在浏览器里检查并生成代码。',
    source: blob('README.md'),
    Component: Playground,
  },
];

export type DocGroup = {
  name: string;
  accent: string;
  pages: DocPage[];
};

const pick = (...slugs: string[]) =>
  slugs.map((s) => {
    const p = PAGES.find((x) => x.slug === s);
    if (!p) throw new Error(`unknown doc slug: ${s}`);
    return p;
  });

export const DOC_GROUPS: DocGroup[] = [
  { name: '入门', accent: 'text-flare', pages: pick('introduction', 'install', 'cli', 'fast') },
  { name: '证据', accent: 'text-acid', pages: pick('benchmarks', 'consistency', 'watch') },
  { name: '集成', accent: 'text-tsgo', pages: pick('editors', 'api', 'wasm', 'lint') },
  { name: '项目', accent: 'text-info', pages: pick('status', 'contributing', 'play') },
];
