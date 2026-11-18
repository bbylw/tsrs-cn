import { useEffect, useRef, useState } from 'react';
import { WATCH } from '../data/bench';
import { useRace } from '../lib/hooks';
import { Reveal, SectionHead } from './ui';

const TIME_ROWS = WATCH.filter((w) => w.id !== 'peak' && w.id !== 'after');
const MEM_ROWS = WATCH.filter((w) => w.id === 'peak' || w.id === 'after');

const parseSeconds = (s: string) => (s.endsWith('ms') ? parseFloat(s) / 1000 : parseFloat(s));

const EDIT_SNIPPETS: Record<string, { before: string; after: string }> = {
  build: { before: '// 冷启动：整个仓库从头检查', after: '// 10,427 个文件，全部过一遍' },
  first: {
    before: 'expect(result).toBe(true);',
    after: 'expect(result).toBe(true); // 改这行注释',
  },
  repeat: {
    before: 'expect(result).toBe(true); // 改这行注释',
    after: 'expect(result).toBe(true); // 再改一次',
  },
  error: { before: 'const n: number = count;', after: 'const n: number = "count";' },
};

export function WatchLab() {
  const [idx, setIdx] = useState(1);
  const row = TIME_ROWS[idx];
  const go = parseSeconds(row.tsgo);
  const rs = parseSeconds(row.tsrs);
  const race = useRace(go, rs, 3.2);
  const [edited, setEdited] = useState(false);
  const replayRef = useRef(race.replay);
  replayRef.current = race.replay;
  const editTimer = useRef(0);

  useEffect(() => () => window.clearTimeout(editTimer.current), []);

  const trigger = (nextIdx = idx) => {
    setIdx(nextIdx);
    setEdited(false);
    window.clearTimeout(editTimer.current);
    editTimer.current = window.setTimeout(() => {
      setEdited(true);
      replayRef.current();
    }, 260);
  };

  const snippet = EDIT_SNIPPETS[row.id];

  return (
    <section id="watch" className="relative py-16 md:py-24">
      <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden="true">
        <div className="aurora aurora-ember top-1/3 -left-48 h-[440px] w-[440px]" />
      </div>
      <div className="relative mx-auto max-w-7xl px-5 md:px-8">
        <SectionHead
          tag="--watch · vscode · 10,427 files"
          title={
            <>
              改一行，<span className="fire-text">等 31 毫秒。</span>
            </>
          }
          lead={
            <>
              vscode 的一万多个文件，改一行动不到别人的测试文件。下面是一次 watch
              会话的模拟编辑：选一个场景，按下按钮，看两个编译器各自多久报完这一轮。
            </>
          }
        />

        <div className="grid grid-cols-1 items-start gap-5 lg:grid-cols-[minmax(0,7fr)_minmax(0,5fr)]">
          <Reveal className="panel panel-glow overflow-hidden">
            <div className="flex flex-wrap items-center gap-2 border-b border-seam px-4 py-3">
              <span className="num text-xs text-ash">场景</span>
              <div className="seg flex-wrap" role="group" aria-label="watch 场景">
                {TIME_ROWS.map((w, i) => (
                  <button
                    key={w.id}
                    type="button"
                    aria-pressed={idx === i}
                    onClick={() => trigger(i)}
                  >
                    {w.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="px-4 py-5 md:px-6">
              <div className="mb-5 rounded-lg border border-seam bg-coal/80 p-4">
                <p className="num mb-2 text-[11px] text-ash">src/testRunner.test.ts · 保存即触发</p>
                <p className="num text-sm">
                  <span className="mr-3 select-none text-seam2">42</span>
                  <span className={edited ? 'text-bone' : 'text-ash'}>
                    {edited ? snippet.after : snippet.before}
                  </span>
                  {row.id === 'error' && edited && (
                    <span className="num ml-3 rounded bg-danger/15 px-1.5 py-0.5 text-[11px] text-danger">
                      TS2322
                    </span>
                  )}
                </p>
              </div>

              <div className="space-y-4">
                {(
                  [
                    {
                      name: 'tsgo',
                      cls: 'go',
                      pct: race.goPct,
                      done: race.goDone,
                      label: row.tsgo,
                      color: 'text-tsgo',
                    },
                    {
                      name: 'tsrs',
                      cls: 'rs',
                      pct: race.rsPct,
                      done: race.rsDone,
                      label: row.tsrs,
                      color: 'text-flare',
                    },
                  ] as const
                ).map((lane) => (
                  <div key={lane.name}>
                    <div className="num mb-1.5 flex items-baseline justify-between text-sm">
                      <span className={`font-bold ${lane.color}`}>{lane.name}</span>
                      <span
                        className={
                          lane.done ? (lane.cls === 'rs' ? 'text-acid' : 'text-fog') : 'text-ash'
                        }
                      >
                        {lane.done
                          ? `✓ 本轮完成 · ${lane.label}`
                          : race.running
                            ? '检查中…'
                            : '等待编辑'}
                      </span>
                    </div>
                    <div className="lane h-4">
                      <div
                        className={`lane-fill ${lane.cls} ${!lane.done && race.running ? 'live' : ''}`}
                        style={{ width: `${lane.pct}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-5 flex flex-wrap items-center justify-between gap-3 border-t border-seam pt-4">
                <p className="max-w-md text-[13px] leading-relaxed text-ash">{row.how}</p>
                <div className="flex items-center gap-3">
                  <span
                    className={`num text-lg font-bold transition-opacity ${race.rsDone ? 'text-molten opacity-100' : 'opacity-30 text-ash'}`}
                  >
                    {row.ratio}
                  </span>
                  <button
                    type="button"
                    className="btn-fire !px-5 !py-2.5 text-sm"
                    onClick={() => trigger()}
                  >
                    {race.running ? '⟳ 再改一行' : '✎ 触发一次编辑'}
                  </button>
                </div>
              </div>
            </div>
          </Reveal>

          <div className="space-y-4">
            <Reveal delay={100} className="panel p-5">
              <p className="num mb-3 text-[11px] tracking-wider text-ash uppercase">
                同一次会话的内存读数
              </p>
              <div className="space-y-4">
                {MEM_ROWS.map((w) => (
                  <div key={w.id}>
                    <div className="mb-1.5 flex items-baseline justify-between">
                      <span className="text-sm font-semibold text-bone">{w.label}</span>
                      <span className="num text-sm font-bold text-molten">{w.ratio}</span>
                    </div>
                    <div className="num grid grid-cols-2 gap-2 text-[13px]">
                      <span className="rounded-md border border-tsgo/25 bg-tsgo/8 px-2.5 py-1.5 text-tsgo">
                        tsgo {w.tsgo}
                      </span>
                      <span className="rounded-md border border-ember/25 bg-ember/8 px-2.5 py-1.5 text-flare">
                        tsrs {w.tsrs}
                      </span>
                    </div>
                    <p className="mt-1.5 text-xs leading-relaxed text-ash">{w.how}</p>
                  </div>
                ))}
              </div>
            </Reveal>

            <Reveal delay={170} className="panel p-5">
              <p className="num mb-3 text-[11px] tracking-wider text-ash uppercase">全部读数</p>
              <table className="num w-full text-[12.5px]">
                <thead>
                  <tr className="text-left text-[11px] text-ash">
                    <th className="pb-2 font-normal">会话</th>
                    <th className="pb-2 text-right font-normal">tsgo</th>
                    <th className="pb-2 text-right font-normal">tsrs</th>
                    <th className="pb-2 text-right font-normal">倍数</th>
                  </tr>
                </thead>
                <tbody>
                  {WATCH.map((w) => (
                    <tr key={w.id} className="border-t border-seam/50">
                      <td className="py-2 pr-2 text-fog">{w.label}</td>
                      <td className="py-2 text-right text-tsgo">{w.tsgo}</td>
                      <td className="py-2 text-right text-flare">{w.tsrs}</td>
                      <td className="py-2 text-right font-bold text-molten">{w.ratio}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <p className="num mt-3 text-[11px] leading-relaxed text-ash">
                vscode · 10,427 个文件 · --watch -p src --noEmit · 8 vCPU · 5 次会话取中位数
              </p>
            </Reveal>
          </div>
        </div>
      </div>
    </section>
  );
}
