import { useEffect, useRef, useState } from 'react';
import { WATCH } from '../data/bench';

export function Watch() {
  const [active, setActive] = useState(0);
  const notes = useRef<Array<HTMLLIElement | null>>([]);

  useEffect(() => {
    if (!('IntersectionObserver' in window)) return;
    const io = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue;
          const index = Number((entry.target as HTMLElement).dataset.index ?? '0');
          setActive(index);
        }
      },
      { rootMargin: '-46% 0px -46% 0px', threshold: 0 },
    );
    for (const el of notes.current) if (el) io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <section className="sec wrap" id="watch">
      <div className="watch-head">
        <h2 className="h2">
          <span className="soft">改一行，</span>
          <br />
          等 31 毫秒。
        </h2>
        <p className="watch-lead">
          vscode 的一万多个文件，改一行动不到别人的测试文件。面板里是同一次 watch 会话的两套读数，右边的注释放大其中六行。
        </p>
      </div>

      <div className="watch">
        <div className="watch-stick">
          <div className="panel" data-ui>
            <div className="prow prow--head" aria-hidden="true">
              <span>会话</span>
              <span>tsgo</span>
              <span>tsrs</span>
              <span>倍数</span>
            </div>
            {WATCH.map((w, i) => (
              <div className="prow num" key={w.id} data-on={active === i ? 'true' : 'false'}>
                <span className="plabel">{w.label}</span>
                <span>{w.tsgo}</span>
                <span>{w.tsrs}</span>
                <span>{w.ratio}</span>
              </div>
            ))}
            <p className="pcap">
              vscode · 10,427 个文件 · <span className="num">--watch -p src --noEmit</span> · 8 vCPU · 5 次会话取中位数
            </p>
          </div>
        </div>

        <ol className="notes">
          {WATCH.map((w, i) => (
            <li
              key={w.id}
              data-on={active === i ? 'true' : 'false'}
              data-index={i}
              ref={(el) => {
                notes.current[i] = el;
              }}
            >
              <span className="nlabel">{w.label}</span>
              <span className="nfig num">
                {w.tsgo} → {w.tsrs}，{w.ratio}
              </span>
              <span className="ntext">{w.how}</span>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
