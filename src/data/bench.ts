// Every figure on this page comes from these tables.
// Source: oxc-project/tsrs · bench/RESULTS.md (measured 2026-10-28, npm release binaries:
// TypeScript 7.1.0-beta + tsrs 0.20.1-ts7.1.0-beta, Apple M3 Max 14 cores / 36 GB / Darwin arm64,
// Hyperfine 2.0.0, medians of 10 interleaved runs — 5 for TypeScript; 0 of 475 runs contended).
// Times are wall-clock seconds; memory is peak RSS in GiB (MiB values converted /1024).
// Ratios are the published ones, computed upstream from unrounded measurements.

export type Cell = {
  /** wall time, seconds */
  t: number;
  /** peak RSS, GiB */
  m: number;
};

export type Project = {
  id: string;
  name: string;
  /** TypeScript 7.1 beta (the Go compiler, npm @typescript/typescript-*) */
  ts: Cell;
  /** tsrs, default mode: pinned TypeScript's 4 checkers, Go assignment/history, eager members */
  rs: Cell;
  /** tsrs --fast: adaptive checkers, locality + work stealing, caches, lazy members */
  fast: Cell;
  /** published ratios vs TypeScript: time (rs / fast) and memory (rs / fast) */
  rt: number;
  rtf: number;
  rm: number;
  rmf: number;
  /** error count — identical across all three compilers */
  errors: number;
};

export const BENCH_META = {
  date: '2026-10-28',
  machine: 'Apple M3 Max · 14 核 · 36 GB · Darwin arm64',
  versions: 'TypeScript 7.1.0-beta · tsrs 0.20.1-ts7.1.0-beta（npm 发布二进制）',
  method: 'Hyperfine 2.0.0 · 10 次交错取中位（TypeScript 5 次）· 475 次运行 0 次争用',
  cmd: '-p <project> --noEmit --incremental false --pretty false',
  source: 'https://github.com/oxc-project/tsrs/blob/main/bench/RESULTS.md',
};

export const PROJECTS: Project[] = [
  {
    id: 't3code-server',
    name: 't3code-server',
    ts: { t: 7.2, m: 4.36 },
    rs: { t: 1.73, m: 1.82 },
    fast: { t: 1.19, m: 1.95 },
    rt: 4.17,
    rtf: 6.05,
    rm: 2.4,
    rmf: 2.24,
    errors: 6,
  },
  {
    id: 'vscode',
    name: 'vscode',
    ts: { t: 5.27, m: 5.46 },
    rs: { t: 2.01, m: 2.36 },
    fast: { t: 0.91, m: 1.99 },
    rt: 2.63,
    rtf: 5.8,
    rm: 2.32,
    rmf: 2.75,
    errors: 371,
  },
  {
    id: 'mikro-orm',
    name: 'mikro-orm',
    ts: { t: 4.63, m: 4.2 },
    rs: { t: 1.38, m: 1.59 },
    fast: { t: 0.7, m: 1.81 },
    rt: 3.36,
    rtf: 6.62,
    rm: 2.64,
    rmf: 2.33,
    errors: 11,
  },
  {
    id: 'mui-docs',
    name: 'mui-docs',
    ts: { t: 4.06, m: 3.26 },
    rs: { t: 1.45, m: 1.28 },
    fast: { t: 1.09, m: 1.47 },
    rt: 2.8,
    rtf: 3.71,
    rm: 2.54,
    rmf: 2.22,
    errors: 0,
  },
  {
    id: 'supabase-studio',
    name: 'supabase-studio',
    ts: { t: 4.01, m: 3.2 },
    rs: { t: 1.47, m: 1.37 },
    fast: { t: 0.79, m: 1.54 },
    rt: 2.72,
    rtf: 5.05,
    rm: 2.33,
    rmf: 2.08,
    errors: 9,
  },
  {
    id: 'formbricks-web',
    name: 'formbricks-web',
    ts: { t: 3.34, m: 4.11 },
    rs: { t: 1.19, m: 1.92 },
    fast: { t: 0.72, m: 1.82 },
    rt: 2.8,
    rtf: 4.64,
    rm: 2.14,
    rmf: 2.26,
    errors: 0,
  },
  {
    id: 'cal-diy',
    name: 'cal-diy',
    ts: { t: 2.84, m: 3.1 },
    rs: { t: 1.03, m: 1.31 },
    fast: { t: 0.73, m: 1.71 },
    rt: 2.76,
    rtf: 3.89,
    rm: 2.37,
    rmf: 1.81,
    errors: 136,
  },
  {
    id: 'next-packages-next',
    name: 'next-packages-next',
    ts: { t: 1.47, m: 1.36 },
    rs: { t: 0.53, m: 0.6074 },
    fast: { t: 0.25, m: 0.6201 },
    rt: 2.8,
    rtf: 5.98,
    rm: 2.24,
    rmf: 2.2,
    errors: 3,
  },
  {
    id: 'next-root',
    name: 'next-root',
    ts: { t: 1.24, m: 1.05 },
    rs: { t: 0.55, m: 0.4932 },
    fast: { t: 0.4, m: 0.4805 },
    rt: 2.26,
    rtf: 3.11,
    rm: 2.13,
    rmf: 2.18,
    errors: 4,
  },
  {
    id: 'webpack',
    name: 'webpack',
    ts: { t: 0.74, m: 0.8242 },
    rs: { t: 0.28, m: 0.3955 },
    fast: { t: 0.16, m: 0.4668 },
    rt: 2.6,
    rtf: 4.69,
    rm: 2.08,
    rmf: 1.77,
    errors: 840,
  },
  {
    id: 'storybook',
    name: 'storybook',
    ts: { t: 0.72, m: 0.9033 },
    rs: { t: 0.29, m: 0.4355 },
    fast: { t: 0.2, m: 0.458 },
    rt: 2.51,
    rtf: 3.62,
    rm: 2.08,
    rmf: 1.97,
    errors: 94,
  },
  {
    id: 'nuxt',
    name: 'nuxt',
    ts: { t: 0.71, m: 0.9189 },
    rs: { t: 0.31, m: 0.4141 },
    fast: { t: 0.24, m: 0.4746 },
    rt: 2.28,
    rtf: 3.0,
    rm: 2.22,
    rmf: 1.94,
    errors: 1,
  },
  {
    id: 'drizzle-orm',
    name: 'drizzle-orm',
    ts: { t: 0.71, m: 0.875 },
    rs: { t: 0.25, m: 0.4053 },
    fast: { t: 0.17, m: 0.5127 },
    rt: 2.87,
    rtf: 4.1,
    rm: 2.16,
    rmf: 1.7,
    errors: 32,
  },
  {
    id: 'playwright',
    name: 'playwright',
    ts: { t: 0.61, m: 0.7402 },
    rs: { t: 0.24, m: 0.3525 },
    fast: { t: 0.15, m: 0.4365 },
    rt: 2.57,
    rtf: 4.03,
    rm: 2.1,
    rmf: 1.7,
    errors: 0,
  },
  {
    id: 'typeorm',
    name: 'typeorm',
    ts: { t: 0.48, m: 0.4531 },
    rs: { t: 0.25, m: 0.2275 },
    fast: { t: 0.19, m: 0.2402 },
    rt: 1.92,
    rtf: 2.48,
    rm: 1.99,
    rmf: 1.88,
    errors: 31,
  },
  {
    id: 'xstate-main',
    name: 'xstate-main',
    ts: { t: 0.46, m: 0.5488 },
    rs: { t: 0.19, m: 0.2588 },
    fast: { t: 0.14, m: 0.2402 },
    rt: 2.38,
    rtf: 3.22,
    rm: 2.12,
    rmf: 2.29,
    errors: 0,
  },
  {
    id: 'date-fns',
    name: 'date-fns',
    ts: { t: 0.32, m: 0.377 },
    rs: { t: 0.17, m: 0.1719 },
    fast: { t: 0.14, m: 0.1787 },
    rt: 1.87,
    rtf: 2.23,
    rm: 2.19,
    rmf: 2.12,
    errors: 0,
  },
  {
    id: 'compiler-unions',
    name: 'Compiler-Unions',
    ts: { t: 0.29, m: 0.1523 },
    rs: { t: 0.12, m: 0.0791 },
    fast: { t: 0.12, m: 0.0791 },
    rt: 2.44,
    rtf: 2.41,
    rm: 1.93,
    rmf: 1.93,
    errors: 41,
  },
  {
    id: 'compiler',
    name: 'Compiler',
    ts: { t: 0.16, m: 0.1357 },
    rs: { t: 0.09, m: 0.0752 },
    fast: { t: 0.09, m: 0.0732 },
    rt: 1.77,
    rtf: 1.71,
    rm: 1.81,
    rmf: 1.85,
    errors: 43,
  },
];

/**
 * Watch mode, vscode (9.4k files under src/), Apple M3 Max 14 cores / 96 GB, macOS 26.6.2.
 * Comparison: tsgo nightly 7.0.0-dev.20260707.2 (@typescript/native-preview), not a pinned build.
 * Source: notes/watch-macos.md. Edit latency measured from write to the reported cycle.
 */
export const WATCH_META = {
  machine: 'Apple M3 Max · 14 核 · 96 GB · macOS 26.6.2',
  project: 'vscode @ 9cf0128b · src/ 下 9.4k 文件',
  reference: 'tsgo nightly 7.0.0-dev.20260707.2（非 pinned 构建）',
  source: 'https://github.com/oxc-project/tsrs/blob/main/notes/watch-macos.md',
};

export type WatchRow = {
  id: string;
  label: string;
  /** seconds; null for non-latency rows */
  tsrs: number | null;
  tsgo: number | null;
  tsrsLabel: string;
  tsgoLabel: string;
  buildTsrs: string;
  buildTsgo: string;
  how: string;
};

export const WATCH: WatchRow[] = [
  {
    id: 'build',
    label: '首次构建',
    tsrs: 2.0,
    tsgo: 9.8,
    tsrsLabel: '2.0 s',
    tsgoLabel: '9.8 s',
    buildTsrs: '3.2 s',
    buildTsgo: '8.9 s',
    how: '整个 src/ 从头检查一遍。-b --watch 走增量构建路径。',
  },
  {
    id: 'first',
    label: '首次改注释',
    tsrs: 0.048,
    tsgo: 13.5,
    tsrsLabel: '48 ms · 1 个周期',
    tsgoLabel: '13.5 s · 1 个周期',
    buildTsrs: '3.2 s',
    buildTsgo: '13.4 s',
    how: '改动落在叶子上，受影响的只有它自己。tsgo 这里重查了整个程序。',
  },
  {
    id: 'repeat',
    label: '重复改注释',
    tsrs: 0.059,
    tsgo: 1.49,
    tsrsLabel: '59 ms',
    tsgoLabel: '1.49 s',
    buildTsrs: '264 ms',
    buildTsgo: '1.48 s',
    how: 'tsrs 取 8 次中位，tsgo 取 4 次。同一会话里越改越快。',
  },
  {
    id: 'hub',
    label: '枢纽文件加一个导出',
    tsrs: 1.3,
    tsgo: 11.7,
    tsrsLabel: '1.3 s',
    tsgoLabel: '11.7 s',
    buildTsrs: '2.8 s',
    buildTsgo: '11.6 s',
    how: '最重的编辑：签名变了，下游都要重查。仍然快一个量级。',
  },
  {
    id: 'error',
    label: '叶子文件里造一个类型错误',
    tsrs: 0.046,
    tsgo: 13.1,
    tsrsLabel: '46 ms',
    tsgoLabel: '13.1 s',
    buildTsrs: '3.2 s',
    buildTsgo: '13.1 s',
    how: '错误要沿 import 链报上去，tsrs 仍然只要 46 毫秒。',
  },
];

export const WATCH_EXTRA = {
  detected: { tsrs: '13–16 ms', tsgo: '14 ms', buildTsrs: '12–16 ms', buildTsgo: '108–137 ms' },
  rss: {
    tsrs: '2.1–3.3 GB',
    tsgo: '10.4–14.8 GB',
    buildTsrs: '2.3–3.4 GB',
    buildTsgo: '10.6–17.3 GB',
  },
  idle: '签名作业完成后，30 秒内 0 次中断唤醒、0 ms CPU。',
  ctrlc: 'Ctrl-C 空闲时 88 ms 退出，周期中 23 ms。',
  suites: 'tscWatch 39/42 · tsbuildWatch 57/65 场景基线通过（与 Linux 相同）。',
  memoryFix:
    '分支往返（4,037 个文件改写）8 轮后 RSS：修复前 2.5→16.6 GB（+1.85 GB/轮），修复后 2.5→6.2 GB（约 0.5 GB/轮）；-b --watch 4 轮 2.3→6.9 GB 降到 2.4→3.8 GB。',
};

/**
 * Type-aware lint + type check, Outline's 7 rules, 8 cores.
 * AWS m8g.4xlarge (16 Graviton4 vCPUs, 64 GiB), Ubuntu 24.04, Node 24; tsrs 0.24.0, oxlint 1.93.0.
 * Caveat printed upstream: releases after 0.25 type-check only the files Oxlint lints.
 * Source: bench/lint-typecheck/RESULTS.md.
 */
export const LINT_META = {
  machine: 'AWS m8g.4xlarge · 16 Graviton4 vCPU · 64 GiB · Ubuntu 24.04 · Node 24',
  versions: 'tsrs 0.24.0 · oxlint 1.93.0 · oxlint-tsgolint 7.0.2006 · typescript-eslint 8.72.2',
  caveat: '此表测于 0.24.0（--type-check 当时检查整个 program）；0.25 之后只检查被 lint 的文件。',
  source: 'https://github.com/oxc-project/tsrs/blob/main/bench/lint-typecheck/RESULTS.md',
};

export type LintRow = {
  project: string;
  /** wall seconds: tsrs one run / tsgolint+tsgo / ESLint+tsc */
  one: number;
  go: number;
  eslint: number;
  /** peak memory GiB, all processes */
  oneMem: number;
  goMem: number;
  eslintMem: number;
};

export const LINT_ROWS: LintRow[] = [
  {
    project: 'VS Code',
    one: 4.8,
    go: 21.3,
    eslint: 293,
    oneMem: 3.6,
    goMem: 16.3,
    eslintMem: 28.7,
  },
  { project: 'Outline', one: 2.3, go: 9.4, eslint: 53.6, oneMem: 1.2, goMem: 4.9, eslintMem: 8.3 },
  {
    project: 'Vue core',
    one: 0.36,
    go: 1.4,
    eslint: 12.1,
    oneMem: 0.3965,
    goMem: 1.1,
    eslintMem: 2.7,
  },
];

/** Conformance evidence, docs/COMPATIBILITY.md + tasks/determinism + tools/repo-conformance. */
export const CONFORMANCE = [
  {
    id: 'baselines',
    label: '编译器基线',
    big: '13,700',
    unit: '条错误基线全匹配',
    detail:
      '另有 12,998 条 .types 与 .symbols 基线、13,626 条 JS/声明基线、149 条 JS map、156 条 source-map 记录，Go 与 canonical 两种 checker 历史下都匹配。',
  },
  {
    id: 'fourslash',
    label: 'Fourslash',
    big: '4,149',
    unit: '/ 4,562 组通过 · 0 失败',
    detail: '语言服务交互测试门槛：至少 4,149 个被 exercised 的组，且拒绝任何失败组。',
  },
  {
    id: 'nodeapi',
    label: 'Node API',
    big: '968',
    unit: '/ 968 测试通过',
    detail: 'SDK 套件在两个编译器上全过；177 个方法中 170 个有成功响应。',
  },
  {
    id: 'determinism',
    label: '确定性',
    big: '456',
    unit: '项跨配置对照全过',
    detail:
      '19 个项目，4/12 checker、优化与种子随机调度下与 npm tsgo --singleThreaded 快照逐项一致；另有 48 个 fixture 的 912 次回归调用。',
  },
  {
    id: 'repos',
    label: '千仓对照',
    big: '1,000',
    unit: '个热门 TS 仓库',
    detail:
      'qualifying 变更合入 main 后，与 pinned tsgo 对照诊断（默认与严格 --checkers 4 两种模式）；报告含 diff 与覆盖率。通过率在 workflow 报告里，仓库未提交汇总数字。',
  },
  {
    id: 'wasm',
    label: 'WASM',
    big: '2,000',
    unit: '例样本字节级一致',
    detail: '@tsrs/wasm 与原生 --singleThreaded 在 2,000 例一致性样本上输出字节相同。',
  },
];

/** Recent releases (GitHub releases API, fetched 2026-11-18). */
export const RELEASES = [
  {
    v: '7.1.0-beta.tsrs2',
    date: '2026-11-16',
    note: '首个 TypeScript 对齐版本的 npm 发布；十个 npm 包同版本号；linter 默认开 fast（TSRS_FAST=0 退出）；--type-check 只查被 lint 的文件；Rust 1.100。',
  },
  {
    v: '0.25.0',
    date: '2026-11-12',
    note: 'Windows ARM64 原生包 @tsrs/win32-arm64；headless lint 并发处理多 tsconfig（约 40 个 tsconfig 的仓库墙钟时间省约三分之一）。',
  },
  {
    v: '0.24.0',
    date: '2026-11-10',
    note: 'LSP 编辑提速：保留 imports 的编辑复用 program（含 importHelpers / jsx: react-jsx）；lint 内存与解析共享。',
  },
  {
    v: '0.23.0',
    date: '2026-11-07',
    note: 'oxlint --type-aware --type-check 两种模式都检查整个 tsconfig program（后于 tsrs2 回调为只查被 lint 的文件）。',
  },
  {
    v: '0.22.0',
    date: '2026-11-05',
    note: 'fast 预设下一次运行同时完成 type-aware lint 与类型检查；LSP/Node API/linter 支持 .vue / .svelte / .astro 内容映射。',
  },
  {
    v: '0.21.0',
    date: '2026-11-03',
    note: 'Oxlint 的 type-aware linter：实现 tsgolint headless 协议与全部 61 条规则（v7.0.2005），随 tsrs 包发布 tsrs-lint。',
  },
];

export const fmtTime = (s: number) => (s < 1 ? `${Math.round(s * 1000)} ms` : `${s.toFixed(2)} s`);
export const fmtMem = (gib: number) =>
  gib >= 1 ? `${gib.toFixed(2)} GiB` : `${Math.round(gib * 1024)} MiB`;
export const fmtRatio = (n: number) => `${n.toFixed(2)}×`;
