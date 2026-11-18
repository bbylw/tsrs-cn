import { useCountUp, useInView } from '../lib/hooks';
import { Reveal } from './ui';

function CountMetric({
  target,
  decimals,
  unit,
  start,
}: {
  target: number;
  decimals: number;
  unit: string;
  start: boolean;
}) {
  const value = useCountUp(target, start, decimals);
  return (
    <>
      {value}
      <span className="ml-0.5 text-2xl font-semibold md:text-3xl">{unit}</span>
    </>
  );
}

const COMPACT_STATS = [
  {
    n: 4.17,
    decimals: 2,
    unit: '×',
    tone: 'text-bone',
    label: '默认模式最大加速',
    detail: 't3code-server，7.20 s 压到 1.73 s，保持默认检查器历史。',
  },
  {
    n: 2.75,
    decimals: 2,
    unit: '×',
    tone: 'text-bone',
    label: '最大内存优势',
    detail: 'vscode，峰值 RSS 从 5.46 GiB 降至 1.99 GiB（--fast）。',
  },
  {
    n: 59,
    decimals: 0,
    unit: ' ms',
    tone: 'text-tsgo',
    label: '增量编辑响应',
    detail: 'vscode watch 重复修改注释，tsgo 耗时 1.49 s（M3 Max）。',
  },
  {
    n: 61,
    decimals: 0,
    unit: '×',
    tone: 'text-tsgo',
    label: 'lint + 类型检查',
    detail: 'VS Code 一次运行 4.8 s，对比 ESLint + tsc 的 293 s（8 核）。',
  },
];

export function Stats() {
  const { ref, inView } = useInView<HTMLDivElement>('0px 0px -15% 0px');

  return (
    <section className="deferred-section relative py-16 md:py-24">
      <div className="mx-auto max-w-7xl px-5 md:px-8">
        <Reveal className="mb-10 flex flex-wrap items-end justify-between gap-6 md:mb-12">
          <div>
            <p className="tag mb-3">Scoreboard</p>
            <h2 className="h2">
              <span className="text-ash">同一条命令，</span>
              <br />
              三份时间。
            </h2>
          </div>
          <p className="lead-pretty max-w-sm text-sm leading-relaxed text-ash">
            前四项来自上游公开基准（2026-10-28，Apple M3 Max 14 核 / 36 GB，19 个项目）；watch 与
            lint 数据各自在对应区块标注环境。
          </p>
        </Reveal>

        <div ref={ref} className="space-y-4">
          {/* 头号两项主卡片：非对称对比重点 */}
          <div className="grid grid-cols-1 gap-4 lg:grid-cols-12">
            <Reveal className="panel-raised flex flex-col justify-between p-6 md:p-8 lg:col-span-7">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <span className="num text-xs font-medium text-flare">
                  最大单项目加速 · tsrs --fast
                </span>
                <span className="chip">mikro-orm</span>
              </div>
              <div className="my-6 flex flex-wrap items-baseline justify-between gap-6">
                <p className="num text-5xl font-bold tracking-tight text-bone md:text-6xl">
                  <CountMetric target={6.62} decimals={2} unit="×" start={inView} />
                </p>
                <div className="min-w-[200px] flex-1 space-y-2 sm:max-w-xs">
                  <div className="num flex items-center justify-between text-xs text-tsgo">
                    <span>TypeScript 7.1 beta</span>
                    <span>4.63 s</span>
                  </div>
                  <div className="lane h-2">
                    <div className="lane-fill go" style={{ width: '100%' }} />
                  </div>
                  <div className="num flex items-center justify-between text-xs text-molten">
                    <span>tsrs --fast</span>
                    <span>0.70 s</span>
                  </div>
                  <div className="lane h-2">
                    <div className="lane-fill fast" style={{ width: '15.1%' }} />
                  </div>
                </div>
              </div>
              <p className="lead-pretty text-sm text-ash">
                同一份 tsconfig 与全量诊断校验，从 4.63 s 缩短至 0.70 s。
              </p>
            </Reveal>

            <Reveal
              delay={80}
              className="panel flex flex-col justify-between p-6 md:p-8 lg:col-span-5"
            >
              <div className="flex items-center justify-between gap-2">
                <span className="num text-xs font-medium text-acid">诊断一致性通过率</span>
                <span className="chip">TypeScript = tsrs</span>
              </div>
              <div className="my-6">
                <p className="num text-5xl font-bold tracking-tight text-acid md:text-6xl">
                  <CountMetric target={19} decimals={0} unit="/19" start={inView} />
                </p>
                <div className="mt-4 flex flex-wrap gap-1.5" aria-hidden="true">
                  {Array.from({ length: 19 }, (_, idx) => (
                    <span
                      key={idx}
                      className="h-2.5 w-2.5 rounded-[3px] border border-acid/45 bg-acid/30"
                    />
                  ))}
                </div>
              </div>
              <p className="lead-pretty text-sm text-ash">
                全部 19 个大型测试项目中，文件路径、行列位置与错误码逐项完全一致。
              </p>
            </Reveal>
          </div>

          {/* 次级四项：Hairline 1px 细线矩阵 */}
          <Reveal
            delay={140}
            className="grid grid-cols-1 gap-px overflow-hidden rounded-2xl border border-seam bg-seam sm:grid-cols-2 lg:grid-cols-4"
          >
            {COMPACT_STATS.map((s) => (
              <div key={s.label} className="flex flex-col justify-between bg-soot p-5 md:p-6">
                <div>
                  <p className={`num text-3xl font-bold tracking-tight md:text-4xl ${s.tone}`}>
                    <CountMetric target={s.n} decimals={s.decimals} unit={s.unit} start={inView} />
                  </p>
                  <p className="mt-2 text-sm font-semibold text-bone">{s.label}</p>
                </div>
                <p className="lead-pretty mt-3 text-xs leading-relaxed text-ash">{s.detail}</p>
              </div>
            ))}
          </Reveal>
        </div>
      </div>
    </section>
  );
}
