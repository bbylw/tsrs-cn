import typeCase from '../../assets/metal-movable-type.jpg';
import composingStick from '../../assets/thai-movable-type-on-composing-stick-bangkok.jpg';
import { Reveal, SectionHead } from './ui';

export function Story() {
  return (
    <section id="port" tabIndex={-1} className="deferred-section relative py-16 md:py-24">
      <div className="relative mx-auto max-w-7xl px-5 md:px-8">
        <div className="grid grid-cols-1 items-start gap-10 lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)]">
          <div className="lg:sticky lg:top-24">
            <SectionHead
              tag="The Port"
              title={
                <>
                  同一副字义，
                  <br />
                  <span className="fire-text">另一副字模。</span>
                </>
              }
            />
            <Reveal delay={100}>
              <p className="lead-pretty max-w-prose text-[15px] leading-relaxed text-fog">
                移植不是重写。同一份语义，换一副模子重新排一遍，印出来还得是同一页字。tsrs 把
                TypeScript 的实现逐条搬进
                Rust，再用同一批诊断去校对：哪一行输出的字符不一样，就是哪里还没搬完。
              </p>
              <p className="lead-pretty mt-5 max-w-prose text-sm leading-relaxed text-ash">
                整体移植由 Max Schwenk 完成；@walkerdb 与 @JiangWeixian 之后做了改进，其中
                @JiangWeixian 转让了 tsrs 这个 npm 包名。TypeScript 团队提供了全程支持。
              </p>
            </Reveal>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-[1.2fr_1fr] sm:items-end">
            <Reveal
              as="figure"
              className="story-fig relative overflow-hidden rounded-xl border border-seam"
            >
              <img
                className="story-img block aspect-[4/3] w-full object-cover"
                src={typeCase}
                width={1920}
                height={1276}
                alt="排字工的活字盘：木格子里按字母分装着金属活字，一把字盘上夹着已排好的一行字"
                loading="lazy"
                decoding="async"
              />
              <figcaption className="absolute inset-x-2 bottom-2 rounded-md bg-coal/85 px-3 py-2 text-[11px] leading-relaxed text-fog backdrop-blur-sm">
                字盘：同一批字，按格归位。Willi Heidelbach 摄，CC BY 2.5
              </figcaption>
            </Reveal>
            <Reveal
              as="figure"
              delay={120}
              className="story-fig relative overflow-hidden rounded-xl border border-seam"
            >
              <img
                className="story-img block aspect-[4/3.55] w-full object-cover"
                src={composingStick}
                width={1920}
                height={1280}
                alt="一把排字手盘，里面反着排了一行泰文金属活字"
                loading="lazy"
                decoding="async"
              />
              <figcaption className="absolute inset-x-2 bottom-2 rounded-md bg-coal/85 px-3 py-2 text-[11px] leading-relaxed text-fog backdrop-blur-sm">
                排字手盘：字要反着排，印出来才是正的。Paul_012 摄，CC BY-SA 4.0
              </figcaption>
            </Reveal>
          </div>
        </div>
      </div>
    </section>
  );
}
