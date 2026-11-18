import { Nav } from './components/Nav';
import { Hero } from './components/Hero';
import { Stats } from './components/Stats';
import { Bench } from './components/Bench';
import { Consistency } from './components/Consistency';
import { WatchLab } from './components/WatchLab';
import { FastLint } from './components/FastLint';
import { Quickstart } from './components/Quickstart';
import { Story } from './components/Story';
import { Docs } from './components/Docs';
import { Credits, FinalCta, Foot } from './components/Closing';
import { DocsApp } from './docs/DocsApp';
import { useRoute, useRouteScroll } from './lib/router';

export default function App() {
  const route = useRoute();
  useRouteScroll(route);

  if (route.startsWith('docs')) return <DocsApp route={route} />;

  return (
    <>
      <div className="grain" aria-hidden="true" />
      <Nav />
      <main>
        <Hero />
        <Stats />
        <Bench />
        <Consistency />
        <WatchLab />
        <FastLint />
        <Quickstart />
        <Story />
        <Docs />
        <Credits />
        <FinalCta />
      </main>
      <Foot />
    </>
  );
}
