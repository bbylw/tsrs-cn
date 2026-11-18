// Every figure on this page comes from these tables.
// Source: oxc-project/tsrs · bench/RESULTS.md (2026-10-16, commit d57703ab5f07, PGO release build)
// Times are wall-clock seconds; memory is peak RSS in GiB. Ratios are the published ones, computed
// there from unrounded measurements, so they are stored rather than re-derived from the rounded values.

export type SettingId = 'default' | 't4' | 't8' | 't16';

export type Setting = {
  id: SettingId;
  label: string;
  rail: string;
  note: string;
};

export const SETTINGS: Setting[] = [
  { id: 'default', label: '默认', rail: '默认', note: 'tsrs 走默认设置，开了 16 个 checker 线程' },
  { id: 't4', label: '4 线程', rail: '4', note: 'tsgo 与 tsrs 各 4 个 checker 线程' },
  { id: 't8', label: '8 线程', rail: '8', note: 'tsgo 与 tsrs 各 8 个 checker 线程' },
  { id: 't16', label: '16 线程', rail: '16', note: 'tsgo 与 tsrs 各 16 个 checker 线程' },
];

export type Cell = {
  /** wall time, seconds */
  t: number;
  /** peak RSS, GiB */
  m: number;
  /** published ratio against the same run of tsgo */
  rt: number;
  rm: number;
};

export type Project = {
  id: string;
  name: string;
  runs: Record<SettingId, { tsgo: Cell; tsrs: Cell }>;
};

export const PROJECTS: Project[] = [
  {
    id: 'mui-docs',
    name: 'mui-docs',
    runs: {
      default: {
        tsgo: { t: 12.66, m: 7.39, rt: 16.87, rm: 4.61 },
        tsrs: { t: 0.75, m: 1.6, rt: 16.87, rm: 4.61 },
      },
      t4: {
        tsgo: { t: 12.69, m: 7.61, rt: 11.81, rm: 7.24 },
        tsrs: { t: 1.07, m: 1.05, rt: 11.81, rm: 7.24 },
      },
      t8: {
        tsgo: { t: 12.83, m: 11.8, rt: 13.65, rm: 8.92 },
        tsrs: { t: 0.94, m: 1.32, rt: 13.65, rm: 8.92 },
      },
      t16: {
        tsgo: { t: 12.36, m: 13.22, rt: 16.07, rm: 8.23 },
        tsrs: { t: 0.77, m: 1.61, rt: 16.07, rm: 8.23 },
      },
    },
  },
  {
    id: 'mikro-orm',
    name: 'mikro-orm',
    runs: {
      default: {
        tsgo: { t: 11.16, m: 6.71, rt: 15.16, rm: 3.41 },
        tsrs: { t: 0.74, m: 1.97, rt: 15.16, rm: 3.41 },
      },
      t4: {
        tsgo: { t: 11.11, m: 6.45, rt: 6.87, rm: 4.61 },
        tsrs: { t: 1.62, m: 1.4, rt: 6.87, rm: 4.61 },
      },
      t8: {
        tsgo: { t: 8.62, m: 8.76, rt: 8.43, rm: 5.38 },
        tsrs: { t: 1.02, m: 1.63, rt: 8.43, rm: 5.38 },
      },
      t16: {
        tsgo: { t: 9.24, m: 11.94, rt: 12.82, rm: 6.06 },
        tsrs: { t: 0.72, m: 1.97, rt: 12.82, rm: 6.06 },
      },
    },
  },
  {
    id: 'next-packages-next',
    name: 'next-packages-next',
    runs: {
      default: {
        tsgo: { t: 3.05, m: 1.73, rt: 14.75, rm: 2.55 },
        tsrs: { t: 0.21, m: 0.6787, rt: 14.75, rm: 2.55 },
      },
      t4: {
        tsgo: { t: 3.1, m: 1.76, rt: 6.73, rm: 3.22 },
        tsrs: { t: 0.46, m: 0.5479, rt: 6.73, rm: 3.22 },
      },
      t8: {
        tsgo: { t: 2.7, m: 2.03, rt: 9.2, rm: 3.38 },
        tsrs: { t: 0.29, m: 0.6006, rt: 9.2, rm: 3.38 },
      },
      t16: {
        tsgo: { t: 2.59, m: 2.49, rt: 12.59, rm: 3.65 },
        tsrs: { t: 0.21, m: 0.6807, rt: 12.59, rm: 3.65 },
      },
    },
  },
  {
    id: 'vscode',
    name: 'vscode',
    runs: {
      default: {
        tsgo: { t: 11.1, m: 7.48, rt: 13.55, rm: 3.57 },
        tsrs: { t: 0.82, m: 2.1, rt: 13.55, rm: 3.57 },
      },
      t4: {
        tsgo: { t: 10.94, m: 7.49, rt: 4.95, rm: 4.16 },
        tsrs: { t: 2.21, m: 1.8, rt: 4.95, rm: 4.16 },
      },
      t8: {
        tsgo: { t: 7.71, m: 8.17, rt: 5.92, rm: 4.23 },
        tsrs: { t: 1.3, m: 1.93, rt: 5.92, rm: 4.23 },
      },
      t16: {
        tsgo: { t: 6.73, m: 9.42, rt: 8.32, rm: 4.49 },
        tsrs: { t: 0.81, m: 2.1, rt: 8.32, rm: 4.49 },
      },
    },
  },
  {
    id: 'storybook',
    name: 'storybook',
    runs: {
      default: {
        tsgo: { t: 1.87, m: 1.37, rt: 11.71, rm: 2.71 },
        tsrs: { t: 0.16, m: 0.5068, rt: 11.71, rm: 2.71 },
      },
      t4: {
        tsgo: { t: 1.8, m: 1.45, rt: 5.81, rm: 3.67 },
        tsrs: { t: 0.31, m: 0.3945, rt: 5.81, rm: 3.67 },
      },
      t8: {
        tsgo: { t: 1.63, m: 1.73, rt: 7.68, rm: 3.88 },
        tsrs: { t: 0.21, m: 0.4453, rt: 7.68, rm: 3.88 },
      },
      t16: {
        tsgo: { t: 1.52, m: 2.2, rt: 9.55, rm: 4.34 },
        tsrs: { t: 0.16, m: 0.5068, rt: 9.55, rm: 4.34 },
      },
    },
  },
  {
    id: 'formbricks-web',
    name: 'formbricks-web',
    runs: {
      default: {
        tsgo: { t: 6.99, m: 5.8, rt: 11.06, rm: 2.91 },
        tsrs: { t: 0.63, m: 2.0, rt: 11.06, rm: 2.91 },
      },
      t4: {
        tsgo: { t: 6.95, m: 5.48, rt: 5.93, rm: 3.79 },
        tsrs: { t: 1.17, m: 1.45, rt: 5.93, rm: 3.79 },
      },
      t8: {
        tsgo: { t: 6.04, m: 7.21, rt: 7.93, rm: 4.26 },
        tsrs: { t: 0.76, m: 1.69, rt: 7.93, rm: 4.26 },
      },
      t16: {
        tsgo: { t: 6.16, m: 9.55, rt: 9.76, rm: 4.78 },
        tsrs: { t: 0.63, m: 2.0, rt: 9.76, rm: 4.78 },
      },
    },
  },
  {
    id: 'supabase-studio',
    name: 'supabase-studio',
    runs: {
      default: {
        tsgo: { t: 7.16, m: 4.43, rt: 10.8, rm: 2.62 },
        tsrs: { t: 0.66, m: 1.69, rt: 10.8, rm: 2.62 },
      },
      t4: {
        tsgo: { t: 7.24, m: 4.87, rt: 5.53, rm: 4.11 },
        tsrs: { t: 1.31, m: 1.19, rt: 5.53, rm: 4.11 },
      },
      t8: {
        tsgo: { t: 6.23, m: 6.33, rt: 6.99, rm: 4.52 },
        tsrs: { t: 0.89, m: 1.4, rt: 6.99, rm: 4.52 },
      },
      t16: {
        tsgo: { t: 6.77, m: 9.09, rt: 10.27, rm: 5.38 },
        tsrs: { t: 0.66, m: 1.69, rt: 10.27, rm: 5.38 },
      },
    },
  },
  {
    id: 't3code-server',
    name: 't3code-server',
    runs: {
      default: {
        tsgo: { t: 14.35, m: 6.17, rt: 10.33, rm: 2.92 },
        tsrs: { t: 1.39, m: 2.11, rt: 10.33, rm: 2.92 },
      },
      t4: {
        tsgo: { t: 14.73, m: 6.17, rt: 8.96, rm: 5.26 },
        tsrs: { t: 1.64, m: 1.17, rt: 8.96, rm: 5.26 },
      },
      t8: {
        tsgo: { t: 14.52, m: 8.12, rt: 9.27, rm: 5.31 },
        tsrs: { t: 1.57, m: 1.53, rt: 9.27, rm: 5.31 },
      },
      t16: {
        tsgo: { t: 14.26, m: 10.72, rt: 10.2, rm: 5.08 },
        tsrs: { t: 1.4, m: 2.11, rt: 10.2, rm: 5.08 },
      },
    },
  },
  {
    id: 'webpack',
    name: 'webpack',
    runs: {
      default: {
        tsgo: { t: 1.48, m: 1.15, rt: 10.28, rm: 2.21 },
        tsrs: { t: 0.14, m: 0.5234, rt: 10.28, rm: 2.21 },
      },
      t4: {
        tsgo: { t: 1.46, m: 1.19, rt: 5.1, rm: 3.0 },
        tsrs: { t: 0.29, m: 0.3955, rt: 5.1, rm: 3.0 },
      },
      t8: {
        tsgo: { t: 1.18, m: 1.4, rt: 6.09, rm: 3.15 },
        tsrs: { t: 0.19, m: 0.4434, rt: 6.09, rm: 3.15 },
      },
      t16: {
        tsgo: { t: 1.13, m: 1.7, rt: 7.94, rm: 3.26 },
        tsrs: { t: 0.14, m: 0.5205, rt: 7.94, rm: 3.26 },
      },
    },
  },
  {
    id: 'drizzle-orm',
    name: 'drizzle-orm',
    runs: {
      default: {
        tsgo: { t: 1.92, m: 1.75, rt: 9.64, rm: 2.21 },
        tsrs: { t: 0.2, m: 0.79, rt: 9.64, rm: 2.21 },
      },
      t4: {
        tsgo: { t: 1.99, m: 1.75, rt: 6.5, rm: 3.49 },
        tsrs: { t: 0.31, m: 0.5, rt: 6.5, rm: 3.49 },
      },
      t8: {
        tsgo: { t: 1.76, m: 2.12, rt: 8.01, rm: 3.69 },
        tsrs: { t: 0.22, m: 0.5742, rt: 8.01, rm: 3.69 },
      },
      t16: {
        tsgo: { t: 1.83, m: 2.67, rt: 9.15, rm: 3.35 },
        tsrs: { t: 0.2, m: 0.7969, rt: 9.15, rm: 3.35 },
      },
    },
  },
  {
    id: 'cal-diy',
    name: 'cal-diy',
    runs: {
      default: {
        tsgo: { t: 5.65, m: 4.34, rt: 9.24, rm: 2.32 },
        tsrs: { t: 0.61, m: 1.87, rt: 9.24, rm: 2.32 },
      },
      t4: {
        tsgo: { t: 5.76, m: 4.36, rt: 5.79, rm: 3.81 },
        tsrs: { t: 0.99, m: 1.14, rt: 5.79, rm: 3.81 },
      },
      t8: {
        tsgo: { t: 5.53, m: 5.85, rt: 7.31, rm: 4.06 },
        tsrs: { t: 0.76, m: 1.44, rt: 7.31, rm: 4.06 },
      },
      t16: {
        tsgo: { t: 5.82, m: 8.21, rt: 9.56, rm: 4.36 },
        tsrs: { t: 0.61, m: 1.88, rt: 9.56, rm: 4.36 },
      },
    },
  },
  {
    id: 'next-root',
    name: 'next-root',
    runs: {
      default: {
        tsgo: { t: 1.58, m: 1.31, rt: 9.11, rm: 2.75 },
        tsrs: { t: 0.17, m: 0.4756, rt: 9.11, rm: 2.75 },
      },
      t4: {
        tsgo: { t: 1.6, m: 1.3, rt: 5.4, rm: 3.25 },
        tsrs: { t: 0.3, m: 0.3994, rt: 5.4, rm: 3.25 },
      },
      t8: {
        tsgo: { t: 1.3, m: 1.5, rt: 6.45, rm: 3.5 },
        tsrs: { t: 0.2, m: 0.4277, rt: 6.45, rm: 3.5 },
      },
      t16: {
        tsgo: { t: 1.17, m: 1.62, rt: 6.79, rm: 3.41 },
        tsrs: { t: 0.17, m: 0.4746, rt: 6.79, rm: 3.41 },
      },
    },
  },
  {
    id: 'playwright',
    name: 'playwright',
    runs: {
      default: {
        tsgo: { t: 1.24, m: 1.08, rt: 9.07, rm: 2.23 },
        tsrs: { t: 0.14, m: 0.4854, rt: 9.07, rm: 2.23 },
      },
      t4: {
        tsgo: { t: 1.23, m: 1.05, rt: 5.06, rm: 3.16 },
        tsrs: { t: 0.24, m: 0.333, rt: 5.06, rm: 3.16 },
      },
      t8: {
        tsgo: { t: 1.07, m: 1.42, rt: 6.11, rm: 3.56 },
        tsrs: { t: 0.17, m: 0.3984, rt: 6.11, rm: 3.56 },
      },
      t16: {
        tsgo: { t: 1.18, m: 1.89, rt: 8.62, rm: 3.88 },
        tsrs: { t: 0.14, m: 0.4873, rt: 8.62, rm: 3.88 },
      },
    },
  },
  {
    id: 'nuxt',
    name: 'nuxt',
    runs: {
      default: {
        tsgo: { t: 1.33, m: 1.16, rt: 7.73, rm: 2.28 },
        tsrs: { t: 0.17, m: 0.5059, rt: 7.73, rm: 2.28 },
      },
      t4: {
        tsgo: { t: 1.34, m: 1.16, rt: 4.92, rm: 3.08 },
        tsrs: { t: 0.27, m: 0.378, rt: 4.92, rm: 3.08 },
      },
      t8: {
        tsgo: { t: 1.12, m: 1.39, rt: 5.25, rm: 3.26 },
        tsrs: { t: 0.21, m: 0.4268, rt: 5.25, rm: 3.26 },
      },
      t16: {
        tsgo: { t: 1.14, m: 1.73, rt: 6.45, rm: 3.43 },
        tsrs: { t: 0.18, m: 0.5049, rt: 6.45, rm: 3.43 },
      },
    },
  },
  {
    id: 'xstate-main',
    name: 'xstate-main',
    runs: {
      default: {
        tsgo: { t: 0.84, m: 0.7236, rt: 7.32, rm: 2.67 },
        tsrs: { t: 0.11, m: 0.2715, rt: 7.32, rm: 2.67 },
      },
      t4: {
        tsgo: { t: 0.82, m: 0.7188, rt: 5.29, rm: 2.93 },
        tsrs: { t: 0.16, m: 0.2451, rt: 5.29, rm: 2.93 },
      },
      t8: {
        tsgo: { t: 0.68, m: 0.8682, rt: 6.44, rm: 3.1 },
        tsrs: { t: 0.11, m: 0.2803, rt: 6.44, rm: 3.1 },
      },
      t16: {
        tsgo: { t: 0.72, m: 1.11, rt: 8.43, rm: 3.31 },
        tsrs: { t: 0.09, m: 0.335, rt: 8.43, rm: 3.31 },
      },
    },
  },
  {
    id: 'compiler-unions',
    name: 'Compiler-Unions',
    runs: {
      default: {
        tsgo: { t: 0.52, m: 0.2383, rt: 5.81, rm: 2.44 },
        tsrs: { t: 0.09, m: 0.0977, rt: 5.81, rm: 2.44 },
      },
      t4: {
        tsgo: { t: 0.53, m: 0.2393, rt: 5.8, rm: 2.44 },
        tsrs: { t: 0.09, m: 0.0977, rt: 5.8, rm: 2.44 },
      },
      t8: {
        tsgo: { t: 0.41, m: 0.2598, rt: 4.39, rm: 2.35 },
        tsrs: { t: 0.09, m: 0.1104, rt: 4.39, rm: 2.35 },
      },
      t16: {
        tsgo: { t: 0.41, m: 0.2881, rt: 4.25, rm: 2.23 },
        tsrs: { t: 0.1, m: 0.1299, rt: 4.25, rm: 2.23 },
      },
    },
  },
  {
    id: 'compiler',
    name: 'Compiler',
    runs: {
      default: {
        tsgo: { t: 0.29, m: 0.2119, rt: 4.2, rm: 2.17 },
        tsrs: { t: 0.07, m: 0.0977, rt: 4.2, rm: 2.17 },
      },
      t4: {
        tsgo: { t: 0.29, m: 0.2139, rt: 4.37, rm: 2.19 },
        tsrs: { t: 0.07, m: 0.0977, rt: 4.37, rm: 2.19 },
      },
      t8: {
        tsgo: { t: 0.26, m: 0.2383, rt: 3.74, rm: 2.17 },
        tsrs: { t: 0.07, m: 0.1104, rt: 3.74, rm: 2.17 },
      },
      t16: {
        tsgo: { t: 0.27, m: 0.2656, rt: 3.7, rm: 2.05 },
        tsrs: { t: 0.07, m: 0.1299, rt: 3.7, rm: 2.05 },
      },
    },
  },
];

/** Error counts where tsgo and tsrs disagree, by run. Same input, same tsconfig, --noEmit. */
export const ERROR_DIFFS: Record<
  SettingId,
  { project: string; tsgo: number; tsrs: number; kind: 'version' | 'bug' }[]
> = {
  default: [
    { project: 'vscode', tsgo: 359, tsrs: 371, kind: 'version' },
    { project: 'webpack', tsgo: 848, tsrs: 840, kind: 'version' },
    { project: 'supabase-studio', tsgo: 0, tsrs: 9, kind: 'version' },
    { project: 't3code-server', tsgo: 5, tsrs: 6, kind: 'version' },
    { project: 'next-packages-next', tsgo: 6, tsrs: 5, kind: 'version' },
    { project: 'next-root', tsgo: 441, tsrs: 438, kind: 'version' },
    { project: 'nuxt', tsgo: 3, tsrs: 4, kind: 'version' },
    { project: 'drizzle-orm', tsgo: 10845, tsrs: 10846, kind: 'version' },
  ],
  t4: [
    { project: 'vscode', tsgo: 359, tsrs: 371, kind: 'version' },
    { project: 'webpack', tsgo: 848, tsrs: 840, kind: 'version' },
    { project: 'supabase-studio', tsgo: 0, tsrs: 9, kind: 'version' },
    { project: 't3code-server', tsgo: 5, tsrs: 6, kind: 'version' },
    { project: 'next-packages-next', tsgo: 6, tsrs: 5, kind: 'version' },
    { project: 'next-root', tsgo: 441, tsrs: 438, kind: 'version' },
    { project: 'nuxt', tsgo: 3, tsrs: 4, kind: 'version' },
    { project: 'drizzle-orm', tsgo: 10846, tsrs: 10846, kind: 'version' },
  ],
  t8: [
    { project: 'vscode', tsgo: 359, tsrs: 371, kind: 'version' },
    { project: 'webpack', tsgo: 848, tsrs: 840, kind: 'version' },
    { project: 'supabase-studio', tsgo: 0, tsrs: 9, kind: 'version' },
    { project: 't3code-server', tsgo: 5, tsrs: 6, kind: 'version' },
    { project: 'next-packages-next', tsgo: 6, tsrs: 5, kind: 'version' },
    { project: 'next-root', tsgo: 441, tsrs: 438, kind: 'version' },
    { project: 'nuxt', tsgo: 3, tsrs: 4, kind: 'version' },
    { project: 'drizzle-orm', tsgo: 10846, tsrs: 10846, kind: 'version' },
  ],
  t16: [
    { project: 'vscode', tsgo: 359, tsrs: 371, kind: 'version' },
    { project: 'webpack', tsgo: 848, tsrs: 840, kind: 'version' },
    { project: 'supabase-studio', tsgo: 0, tsrs: 9, kind: 'version' },
    { project: 't3code-server', tsgo: 5, tsrs: 6, kind: 'version' },
    { project: 'next-packages-next', tsgo: 6, tsrs: 5, kind: 'version' },
    { project: 'next-root', tsgo: 441, tsrs: 438, kind: 'version' },
    { project: 'drizzle-orm', tsgo: 10846, tsrs: 10846, kind: 'bug' },
  ],
};

/** vscode, --watch -p src --noEmit, 8 vCPU. Edit latency measured from write to the reported cycle. */
export const WATCH = [
  {
    id: 'build',
    label: '首次构建',
    tsgo: '12.41 s',
    tsrs: '1.86 s',
    ratio: '6.68×',
    how: '整个仓库从头检查一遍，10,427 个文件。',
  },
  {
    id: 'first',
    label: '首次改注释',
    tsgo: '1.76 s',
    tsrs: '33 ms',
    ratio: '53.36×',
    how: '改动落在没人 import 的测试文件上，受影响的只有它自己。',
  },
  {
    id: 'repeat',
    label: '重复改注释',
    tsgo: '1.18 s',
    tsrs: '31 ms',
    ratio: '38.06×',
    how: '同一会话里的第五次编辑，数字比第一次还低一点。',
  },
  {
    id: 'error',
    label: '叶子文件里造一个类型错误',
    tsgo: '1.65 s',
    tsrs: '34 ms',
    ratio: '48.53×',
    how: '最坏的情况：错误要沿 import 链报上去，仍然只要 34 毫秒。',
  },
  {
    id: 'peak',
    label: '峰值 RSS',
    tsgo: '10.12 GiB',
    tsrs: '2.47 GiB',
    ratio: '4.09×',
    how: '会话全程的内存高点，出现在首次构建结束的那一刻。',
  },
  {
    id: 'after',
    label: '编辑之后的 RSS',
    tsgo: '5.99 GiB',
    tsrs: '1.40 GiB',
    ratio: '4.26×',
    how: '编辑几轮之后的常驻内存，不是峰值。',
  },
];

export const fmtTime = (s: number) =>
  s < 1 ? `${s.toFixed(2).replace(/^0/, '0')} s` : `${s.toFixed(2)} s`;
export const fmtMem = (gib: number) =>
  gib >= 1 ? `${gib.toFixed(2)} GiB` : `${Math.round(gib * 1024)} MiB`;
export const fmtRatio = (n: number) => `${n.toFixed(2)}×`;
