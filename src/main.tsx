import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';
import { scene } from './state/store';
import './styles/global.css';
import './styles/sections.css';
import './styles/materials.css';

const motionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
scene.reducedMotion = motionQuery.matches;
motionQuery.addEventListener('change', (e) => (scene.reducedMotion = e.matches));

if ('scrollRestoration' in history) history.scrollRestoration = 'manual';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
