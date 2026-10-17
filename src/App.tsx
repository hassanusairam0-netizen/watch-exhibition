import { useEffect } from 'react';
import { Nav } from './components/Nav';
import { Cursor } from './components/Cursor';
import { Loader } from './components/Loader';
import { Hero } from './sections/Hero';
import { Intro } from './sections/Intro';
import { Layers } from './sections/Layers';
import { Heartbeat } from './sections/Heartbeat';
import { Reassembly } from './sections/Reassembly';
import { Materials } from './sections/Materials';
import { Finale } from './sections/Finale';
import { Footer } from './sections/Footer';
import { Stage } from './three/Stage';
import { useScrollDirector } from './state/scroll';
import { useUi } from './state/store';
import { useDragRotate } from './hooks/useDragRotate';

const NAV_FOR_SECTION: Record<string, string> = {
  hero: '',
  intro: 'object',
  layers: 'layers',
  heartbeat: 'movement',
  reassembly: 'movement',
  materials: 'materials',
  finale: 'finale',
};

export default function App() {
  const section = useUi((s) => s.section);
  useScrollDirector();
  useDragRotate();

  useEffect(() => {
    document.documentElement.classList.add('js-anim');
  }, []);

  return (
    <>
      <a href="#object" className="skip-link">Skip to content</a>
      <div className="scroll-progress" aria-hidden="true" />
      <div className="backdrop" aria-hidden="true" />
      <Stage />
      <div className="vignette" aria-hidden="true" />
      <div className="grain" aria-hidden="true" />
      <div id="label-layer" className="label-layer" />
      <Nav active={NAV_FOR_SECTION[section]} />
      <main>
        <Hero />
        <Intro />
        <Layers />
        <Heartbeat />
        <Reassembly />
        <Materials />
        <Finale />
      </main>
      <Footer />
      <Cursor />
      <Loader />
    </>
  );
}
