import type { ReactNode } from 'react';
import { useCountUp, useInView } from '../lib/hooks';
import { Reveal } from './ui';

type Stat = {
  n: number;
  decimals: number;
  unit: string;
  accent: string;
  cap: ReactNode;
};

const STATS: Stat[] = [
  {
    n: 6.62,
    decimals: 2,
    unit: '×',
    accent: 'fire-text',
    cap: (
      <>
        <b className="text-bone">最大加速</b>：mikro-orm，4.63 s 压到 0.70 s（tsrs --fast）
      </>
    ),
  },
  {
    n: 4.17,
    decimals: 2,
    unit: '×',
    accent: 'fire-text',
    cap: (
      <>
        <b className="text-bone">默认模式最大加速</b>：t3code-server，7.20 s 压到 1.73 s，不开
        --fast
      </>
    ),
  },
  {
    n: 2.75,
    decimals: 2,
    unit: '×',
    accent: 'fire-text',
    cap: (
      <>
        <b className="text-bone">最大内存优势</b>：vscode，5.46 GiB 压到 1.99 GiB（tsrs --fast）
      </>
    ),
  },
  {
    n: 19,
    decimals: 0,
    unit: '/19',
    accent: 'text-acid',
    cap: (
      <>
        <b className="text-bone">诊断逐项相同</b>：TypeScript、tsrs、tsrs --fast
        在每个项目上文件、位置、错误码全一致
      </>
    ),
  },
  {
    n: 59,
    decimals: 0,
    unit: ' ms',
    accent: 'ice-text',
    cap: (
      <>
        <b className="text-bone">增量编辑</b>：vscode watch 重复改注释，tsgo 要 1.49 s（macOS M3
        Max）
      </>
    ),
  },
  {
    n: 61,
    decimals: 0,
    unit: '×',
    accent: 'ice-text',
    cap: (
      <>
        <b className="text-bone">lint + 类型检查一次跑完</b>：VS Code 上 4.8 s，ESLint + tsc 要 293
        s（8 核，0.24.0）
      </>
    ),
  },
];

function StatCard({ stat, start, delay }: { stat: Stat; start: boolean; delay: number }) {
  const value = useCountUp(stat.n, start, stat.decimals);
  return (
    <Reveal delay={delay} className="panel group p-6 transition-colors hover:border-seam2">
      <p className={`num text-5xl font-bold tracking-tight md:text-6xl ${stat.accent}`}>
        {value}
        <span className="text-3xl md:text-4xl">{stat.unit}</span>
      </p>
      <p className="mt-4 text-sm leading-relaxed text-ash">{stat.cap}</p>
    </Reveal>
  );
}

export function Stats() {
  const { ref, inView } = useInView<HTMLDivElement>('0px 0px -15% 0px');
  return (
    <section className="relative py-16 md:py-24">
      <div className="mx-auto max-w-7xl px-5 md:px-8">
        <Reveal className="mb-10 flex flex-wrap items-end justify-between gap-6 md:mb-14">
          <h2 className="h2">
            <span className="text-ash">同一条命令，</span>
            <br />
            三份时间。
          </h2>
          <p className="max-w-sm text-sm leading-relaxed text-ash">
            前四个数字来自上游发布记分牌：2026-10-28，Apple M3 Max（14 核 / 36 GB），19 个项目，npm
            发布二进制。watch 与 lint 数字各有出处，页内逐条标注。
          </p>
        </Reveal>
        <div ref={ref} className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {STATS.map((s, i) => (
            <StatCard key={i} stat={s} start={inView} delay={i * 70} />
          ))}
        </div>
      </div>
    </section>
  );
}
