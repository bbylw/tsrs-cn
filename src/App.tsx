import { Nav } from './components/Nav';
import { Hero } from './components/Hero';
import { Stats } from './components/Stats';
import { Bench } from './components/Bench';
import { Consistency } from './components/Consistency';
import { WatchLab } from './components/WatchLab';
import { Quickstart } from './components/Quickstart';
import { Story } from './components/Story';
import { Docs } from './components/Docs';
import { Credits, FinalCta, Foot } from './components/Closing';

export default function App() {
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
