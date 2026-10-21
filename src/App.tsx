import { Hero } from './components/Hero';
import { Differ, Intro, Split, Stats, Steps } from './components/Sections';
import { Watch } from './components/Watch';
import { Credits, Docs, FinalCta, Foot, Plate } from './components/Closing';

export default function App() {
  return (
    <>
      <header className="top">
        <a className="mark" href="#top">
          tsrs
        </a>
        <span className="ver num">0.18.0 · ts7.1.0-dev</span>
        <nav aria-label="页面">
          <a className="link" href="#consistency">
            一致性
          </a>
          <a className="link" href="#bench">
            基准
          </a>
          <a className="link" href="#docs">
            文档
          </a>
          <a className="btn" href="https://www.npmjs.com/package/tsrs" rel="noreferrer" target="_blank">
            安装 tsrs
          </a>
        </nav>
      </header>

      <main>
        <Hero />
        <Intro />
        <Stats />
        <Steps />
        <Split />
        <Differ />
        <Watch />
        <Docs />
        <Plate />
        <Credits />
        <FinalCta />
      </main>

      <Foot />
    </>
  );
}
