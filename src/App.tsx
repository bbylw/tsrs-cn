import { Nav } from './components/Nav';
import { Hero } from './components/Hero';
import { Stats } from './components/Stats';
import { Bench } from './components/Bench';
import { Consistency } from './components/Consistency';
import { WatchLab } from './components/WatchLab';
import { FastLint } from './components/FastLint';
import { Quickstart } from './components/Quickstart';
import { Story } from './components/Story';
import { Credits, FinalCta, Foot } from './components/Closing';
import { DocsApp } from './docs/DocsApp';
import { useRoute, useRouteScroll } from './lib/router';

export default function App() {
  const route = useRoute();
  useRouteScroll(route);

  if (route.startsWith('docs')) return <DocsApp route={route} />;

  return (
    <>
      <a href="#main-content" className="skip-link visually-hidden">
        跳到主要内容
      </a>
      <div className="grain-wrap" aria-hidden="true">
        <div className="grain" />
      </div>
      <Nav />
      <main id="main-content" tabIndex={-1}>
        <Hero />
        <Stats />
        <Bench />
        <Consistency />
        <WatchLab />
        <FastLint />
        <Quickstart />
        <Story />
        <Credits />
        <FinalCta />
      </main>
      <Foot />
    </>
  );
}
