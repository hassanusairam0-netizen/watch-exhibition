import { useLayoutEffect } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { scene, setUi, getUi, type SectionId } from './store';
import { COMPONENT_COUNT } from '../data/components';
import { HEARTBEAT_STAGES } from '../data/content';

gsap.registerPlugin(ScrollTrigger);

/* Exploded-view timeline, expressed as fractions of the Layers section. */
export const LAYERS = {
  explodeEnd: 0.1,
  stepsEnd: 0.96,
};

export function layerStepFromProgress(p: number) {
  if (p < LAYERS.explodeEnd) return -1;
  const t = (p - LAYERS.explodeEnd) / (LAYERS.stepsEnd - LAYERS.explodeEnd);
  return Math.min(COMPONENT_COUNT - 1, Math.max(0, Math.floor(t * COMPONENT_COUNT)));
}

function progressForStep(i: number) {
  const span = (LAYERS.stepsEnd - LAYERS.explodeEnd) / COMPONENT_COUNT;
  return LAYERS.explodeEnd + span * (i + 0.5);
}

const triggers: Partial<Record<SectionId, ScrollTrigger>> = {};

function behavior(): ScrollBehavior {
  return scene.reducedMotion ? 'auto' : 'smooth';
}

/** Scroll so the exploded view lands on component `i`. */
export function scrollToLayerStep(i: number) {
  const st = triggers.layers;
  if (!st) return;
  setUi({ assembled: false });
  const y = st.start + (st.end - st.start) * progressForStep(i);
  window.scrollTo({ top: y, behavior: behavior() });
}

export function scrollToId(id: string) {
  if (id === 'top') {
    window.scrollTo({ top: 0, behavior: behavior() });
    return;
  }
  const el = document.getElementById(id);
  if (!el) return;
  const y = el.getBoundingClientRect().top + window.scrollY;
  window.scrollTo({ top: id === 'materials' ? y + window.innerHeight * 0.3 : y, behavior: behavior() });
}

const SECTION_IDS: Record<SectionId, string> = {
  hero: 'top',
  intro: 'object',
  layers: 'layers',
  heartbeat: 'movement',
  reassembly: 'reassembly',
  materials: 'materials',
  finale: 'finale',
};

/** Wires every section to the scene store. Mount once, after the DOM exists. */
export function useScrollDirector() {
  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      const sections: { id: SectionId; start: string; end: string }[] = [
        { id: 'hero', start: 'top top', end: 'bottom top' },
        { id: 'intro', start: 'top bottom', end: 'bottom bottom' },
        { id: 'layers', start: 'top top', end: 'bottom bottom' },
        { id: 'heartbeat', start: 'top top', end: 'bottom bottom' },
        { id: 'reassembly', start: 'top top', end: 'bottom bottom' },
        { id: 'materials', start: 'top bottom', end: 'bottom top' },
        { id: 'finale', start: 'top bottom', end: 'bottom bottom' },
      ];

      for (const s of sections) {
        const el = document.getElementById(SECTION_IDS[s.id]);
        if (!el) continue;

        triggers[s.id] = ScrollTrigger.create({
          trigger: el,
          start: s.start,
          end: s.end,
          onUpdate: (self) => {
            scene.progress[s.id] = self.progress;
            if (s.id === 'layers') {
              const step = layerStepFromProgress(self.progress);
              if (step !== getUi().step) setUi({ step });
            }
            if (s.id === 'heartbeat') {
              const n = HEARTBEAT_STAGES.length;
              setUi({ beatStage: Math.min(n - 1, Math.floor(self.progress * n)) });
            }
          },
        });

        // Which chapter "owns" the viewport centre.
        ScrollTrigger.create({
          trigger: el,
          start: 'top center',
          end: 'bottom center',
          onToggle: (self) => {
            if (!self.isActive) return;
            scene.active = s.id;
            setUi({ section: s.id });
            // Leaving the exploded chapter clears the manual assemble override.
            if (s.id !== 'layers') setUi({ assembled: false });
          },
        });
      }

      // Opaque materials section: pause WebGL rendering while it fills the screen.
      const mat = document.getElementById('materials');
      if (mat) {
        ScrollTrigger.create({
          trigger: mat,
          start: () => `top+=${window.innerHeight * 0.32} top`,
          end: 'bottom bottom',
          onToggle: (self) => (scene.covered = self.isActive),
        });
      }

      const footer = document.querySelector<HTMLElement>('.footer');
      if (footer) {
        ScrollTrigger.create({
          trigger: footer,
          start: 'top bottom',
          end: 'bottom bottom',
          onUpdate: (self) => (scene.footerShift = (self.progress * footer.offsetHeight) / window.innerHeight),
        });
      }

      // Hairline progress bar.
      gsap.to('.scroll-progress', {
        scaleX: 1,
        ease: 'none',
        scrollTrigger: { start: 0, end: 'max', scrub: true },
      });

      if (!scene.reducedMotion) {
        gsap.utils.toArray<HTMLElement>('[data-reveal]').forEach((el) => {
          gsap.fromTo(
            el,
            { opacity: 0, y: 36 },
            {
              opacity: 1,
              y: 0,
              duration: 1.4,
              ease: 'expo.out',
              delay: Number(el.dataset.delay ?? 0),
              scrollTrigger: { trigger: el, start: 'top 88%', once: true },
            },
          );
        });

        gsap.from('.hero-title .line > span', {
          yPercent: 110,
          duration: 1.8,
          ease: 'expo.out',
          stagger: 0.12,
          delay: 0.5,
        });
      }
    });

    if (import.meta.env.DEV) Object.assign(window, { __ST: ScrollTrigger });
    // Fonts can shift layout after load.
    document.fonts?.ready.then(() => ScrollTrigger.refresh());

    return () => ctx.revert();
  }, []);
}
