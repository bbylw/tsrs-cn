import { useEffect, useId, useRef, useState } from 'react';
import { WATCH, WATCH_EXTRA, WATCH_META } from '../data/bench';
import { useRace } from '../lib/hooks';
import { Reveal, SectionHead } from './ui';

const EDIT_SNIPPETS: Record<string, { file: string; before: string; after: string }> = {
  build: {
    file: 'src/ · 9.4k 个文件',
    before: '// 冷启动：整个 src/ 从头检查',
    after: '// 9.4k 个文件，全部过一遍',
  },
  first: {
    file: 'src/vs/workbench/browser/parts/editor.ts',
    before: 'const visible = editors.length > 0;',
    after: 'const visible = editors.length > 0; // 改这行注释',
  },
  repeat: {
    file: 'src/vs/workbench/browser/parts/editor.ts',
    before: 'const visible = editors.length > 0; // 改这行注释',
    after: 'const visible = editors.length > 0; // 再改一次',
  },
  hub: {
    file: 'src/vs/editor/common/editorCommon.ts · 枢纽文件',
    before: 'export { createEditor } from "./editor";',
    after: 'export { createModel } from "./model"; // 新增导出',
  },
  error: {
    file: 'src/vs/base/common/strings.ts · 叶子文件',
    before: 'const n: number = count;',
    after: 'const n: number = "count";',
  },
};

export function WatchLab({ docPage = false }: { docPage?: boolean }) {
  const [idx, setIdx] = useState(2);
  const tableCaptionId = useId();
  const row = WATCH[idx];
  const race = useRace([row.tsgo ?? 1, row.tsrs ?? 1], 3.2);
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
  const ratio = row.tsgo && row.tsrs ? Math.round(row.tsgo / row.tsrs) : null;

  return (
    <section
      id="watch"
      tabIndex={-1}
      className={`${docPage ? '' : 'deferred-section '}relative py-16 md:py-24`}
    >
      <div className="relative mx-auto max-w-7xl px-5 md:px-8">
        <SectionHead
          tag="--watch · vscode · src/ 9.4k files"
          headingLevel={docPage ? 'h1' : 'h2'}
          title={
            <>
              改一行，<span className="fire-text">等 59 毫秒。</span>
            </>
          }
          lead={
            <>
              vscode 的 9.4k 个源文件，一次注释编辑动不到别人。选一个场景触发模拟编辑，对比 tsrs 与
              tsgo 的响应耗时。macOS（FSEvents）与 Linux（inotify）已支持，Windows 尚未移植。
            </>
          }
        />

        <div className="grid grid-cols-1 items-start gap-5 lg:grid-cols-[minmax(0,7fr)_minmax(0,5fr)]">
          <Reveal className="panel panel-glow overflow-hidden">
            <div className="flex flex-wrap items-center gap-2.5 border-b border-seam bg-coal/50 px-4 py-3">
              <span className="num text-xs text-ash">场景</span>
              <div className="seg flex-wrap" role="group" aria-label="watch 场景">
                {WATCH.map((w, i) => (
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
              <div
                className={`mb-5 overflow-hidden rounded-lg border transition-colors ${
                  row.id === 'error' && edited
                    ? 'border-danger/45 bg-danger/5'
                    : 'border-seam bg-coal/90'
                }`}
              >
                <div className="flex items-center justify-between gap-2 border-b border-seam/70 bg-soot/60 px-3.5 py-2">
                  <span className="num truncate text-[11px] text-ash">{snippet.file}</span>
                  <span className="num shrink-0 text-[11px] text-ash">保存即触发</span>
                </div>
                <p className="num flex items-center overflow-x-auto px-3.5 py-3 text-[13px] whitespace-nowrap">
                  <span
                    className="mr-3 border-r border-seam pr-3 select-none text-seam2"
                    aria-hidden="true"
                  >
                    42
                  </span>
                  <span className={edited ? 'text-bone' : 'text-ash'}>
                    {edited ? snippet.after : snippet.before}
                  </span>
                  {row.id === 'error' && edited && (
                    <span className="num ml-3 rounded bg-danger/15 px-1.5 py-0.5 text-[11px] font-semibold text-danger">
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
                      pct: race.pct[0],
                      done: race.done[0],
                      label: row.tsgoLabel,
                      color: 'text-tsgo',
                    },
                    {
                      name: 'tsrs',
                      cls: 'rs',
                      pct: race.pct[1],
                      done: race.done[1],
                      label: row.tsrsLabel,
                      color: 'text-flare',
                    },
                  ] as const
                ).map((lane) => (
                  <div key={lane.name}>
                    <div className="num mb-1.5 flex items-baseline justify-between text-sm">
                      <span className={`font-semibold ${lane.color}`}>{lane.name}</span>
                      <span
                        className={
                          lane.done ? (lane.cls === 'rs' ? 'text-acid' : 'text-fog') : 'text-ash'
                        }
                      >
                        {lane.done ? (
                          <>
                            <span aria-hidden="true">✓ </span>本轮完成 · {lane.label}
                          </>
                        ) : race.running ? (
                          '检查中…'
                        ) : (
                          '等待编辑'
                        )}
                      </span>
                    </div>
                    <div className="lane h-3.5">
                      <div
                        className={`lane-fill ${lane.cls} ${!lane.done && race.running ? 'live' : ''}`}
                        style={{ width: `${lane.pct}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-5 flex flex-wrap items-center justify-between gap-3 border-t border-seam pt-4">
                <p className="lead-pretty max-w-md text-[13px] leading-relaxed text-ash">
                  {row.how}
                </p>
                <div className="flex items-center gap-3">
                  {ratio && (
                    <span
                      className={`num text-lg font-bold transition-opacity ${race.done[1] ? 'text-molten opacity-100' : 'text-ash opacity-30'}`}
                    >
                      {ratio}×
                    </span>
                  )}
                  <button
                    type="button"
                    className="btn-fire !px-4 !py-2 text-sm"
                    onClick={() => trigger()}
                  >
                    <span aria-hidden="true">{race.running ? '⟳ ' : '✎ '}</span>
                    {race.running ? '再改一行' : '触发一次编辑'}
                  </button>
                </div>
              </div>
            </div>
          </Reveal>

          <div className="space-y-4">
            <Reveal delay={80} className="panel p-5">
              <p className="num mb-3 text-[11px] tracking-wider text-ash uppercase">
                同一次会话的常驻内存（RSS）
              </p>
              <div className="num grid grid-cols-1 gap-2 text-[13px] sm:grid-cols-2">
                <span className="rounded-lg border border-tsgo/25 bg-tsgo/8 px-3 py-2 text-tsgo">
                  tsgo {WATCH_EXTRA.rss.tsgo}
                </span>
                <span className="rounded-lg border border-ember/25 bg-ember/8 px-3 py-2 text-flare">
                  tsrs {WATCH_EXTRA.rss.tsrs}
                </span>
              </div>
              <p className="lead-pretty mt-3 text-xs leading-relaxed text-ash">
                -b --watch 增量构建：tsrs {WATCH_EXTRA.rss.buildTsrs} · tsgo{' '}
                {WATCH_EXTRA.rss.buildTsgo}。分支往返 8 轮（4,037 个文件改写）后，泄漏修复把 RSS
                增长从每轮 +1.85 GB 压到约 0.5 GB。
              </p>
            </Reveal>

            <Reveal delay={140} className="panel p-5">
              <p className="num mb-3 text-[11px] tracking-wider text-ash uppercase">
                全部读数 · --watch 与 -b --watch
              </p>
              <div
                tabIndex={0}
                role="region"
                aria-labelledby={tableCaptionId}
                className="doc-scroll overflow-x-auto"
              >
                <table className="num w-full text-[11.5px]">
                  <caption id={tableCaptionId} className="visually-hidden">
                    --watch 与 -b --watch 五类编辑场景延迟对照表
                  </caption>
                  <thead>
                    <tr className="text-left text-[10.5px] text-ash">
                      <th scope="col" className="sticky-col py-2 pr-2 pl-3 font-normal">
                        场景
                      </th>
                      <th scope="col" className="px-2 py-2 text-right font-normal">
                        tsrs
                      </th>
                      <th scope="col" className="px-2 py-2 text-right font-normal">
                        tsgo
                      </th>
                      <th scope="col" className="px-2 py-2 text-right font-normal">
                        -b tsrs
                      </th>
                      <th scope="col" className="py-2 pr-3 pl-2 text-right font-normal">
                        -b tsgo
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {WATCH.map((w) => (
                      <tr key={w.id}>
                        <th
                          scope="row"
                          className="sticky-col border-t border-seam/50 py-2 pr-2 pl-3 text-left font-normal text-fog"
                        >
                          {w.label}
                        </th>
                        <td className="border-t border-seam/50 px-2 py-2 text-right whitespace-nowrap text-flare">
                          {w.tsrsLabel.split(' · ')[0]}
                        </td>
                        <td className="border-t border-seam/50 px-2 py-2 text-right whitespace-nowrap text-tsgo">
                          {w.tsgoLabel.split(' · ')[0]}
                        </td>
                        <td className="border-t border-seam/50 px-2 py-2 text-right whitespace-nowrap text-flare/80">
                          {w.buildTsrs}
                        </td>
                        <td className="border-t border-seam/50 py-2 pr-3 pl-2 text-right whitespace-nowrap text-tsgo/80">
                          {w.buildTsgo}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <p className="num mt-3 text-[11px] leading-relaxed text-ash">
                {WATCH_META.machine} · {WATCH_META.project}
              </p>
            </Reveal>

            <Reveal delay={200} className="panel p-5">
              <p className="num mb-3 text-[11px] tracking-wider text-ash uppercase">会话细节</p>
              <ul className="space-y-2 text-[13px] leading-relaxed text-ash">
                <li>
                  <span className="font-semibold text-bone">空闲零开销：</span>
                  {WATCH_EXTRA.idle}
                </li>
                <li>
                  <span className="font-semibold text-bone">退出干脆：</span>
                  {WATCH_EXTRA.ctrlc}
                </li>
                <li>
                  <span className="font-semibold text-bone">场景基线：</span>
                  {WATCH_EXTRA.suites}
                </li>
                <li>
                  <span className="font-semibold text-bone">改动检测：</span>
                  tsrs {WATCH_EXTRA.detected.tsrs} · tsgo {WATCH_EXTRA.detected.tsgo}（macOS
                  FSEvents；可用 TSRS_WATCH_BACKEND 切 kqueue）。
                </li>
              </ul>
              <p className="num mt-3 border-t border-seam pt-3 text-[11px] leading-relaxed text-ash">
                对照为 {WATCH_META.reference}。来源：
                <a className="link-u" href={WATCH_META.source} rel="noreferrer" target="_blank">
                  notes/watch-macos.md
                </a>
              </p>
            </Reveal>
          </div>
        </div>
      </div>
    </section>
  );
}
