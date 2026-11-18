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
    n: 16.87,
    decimals: 2,
    unit: '×',
    accent: 'fire-text',
    cap: (
      <>
        <b className="text-bone">最大加速</b>：mui-docs，12.66 s 压到 0.75 s（默认设置）
      </>
    ),
  },
  {
    n: 8.23,
    decimals: 2,
    unit: '×',
    accent: 'fire-text',
    cap: (
      <>
        <b className="text-bone">最大内存优势</b>：mui-docs，13.22 GiB 压到 1.61 GiB（16 线程）
      </>
    ),
  },
  {
    n: 53.36,
    decimals: 2,
    unit: '×',
    accent: 'fire-text',
    cap: (
      <>
        <b className="text-bone">增量编辑</b>：vscode watch，1.76 s 压到 33 ms
      </>
    ),
  },
  {
    n: 3.7,
    decimals: 2,
    unit: '×',
    accent: 'ice-text',
    cap: (
      <>
        <b className="text-bone">最小加速</b>：Compiler，0.27 s 压到 0.07 s（16 线程）
      </>
    ),
  },
  {
    n: 2.05,
    decimals: 2,
    unit: '×',
    accent: 'ice-text',
    cap: (
      <>
        <b className="text-bone">最小内存优势</b>：Compiler，272 MiB 压到 133 MiB（16 线程）
      </>
    ),
  },
  {
    n: 0,
    decimals: 0,
    unit: '',
    accent: 'text-acid',
    cap: (
      <>
        <b className="text-bone">至今发现的正确性错误</b>：在现有项目的测试里一个也没有
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
            两份时间。
          </h2>
          <p className="max-w-sm text-sm leading-relaxed text-ash">
            仓库 README 里那张图是另一轮测量：8 vCPU，七个项目，1/2/4/8 线程。 这里这组数字来自 16
            vCPU 上的完整跑分，17 个项目。
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
