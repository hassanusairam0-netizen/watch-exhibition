import { Component, lazy, Suspense, useMemo, type ReactNode } from 'react';
import { setUi, useUi } from '../state/store';
import { WatchFallback } from '../components/WatchFallback';

const Experience = lazy(() => import('./Experience'));

function hasWebGL() {
  try {
    const c = document.createElement('canvas');
    return !!(c.getContext('webgl2') || c.getContext('webgl'));
  } catch {
    return false;
  }
}

class GLBoundary extends Component<{ children: ReactNode }, { failed: boolean }> {
  state = { failed: false };
  static getDerivedStateFromError() {
    return { failed: true };
  }
  componentDidCatch(err: unknown) {
    console.error('3D stage failed, showing fallback:', err);
    setUi({ fallback: true });
  }
  render() {
    return this.state.failed ? <WatchFallback /> : this.props.children;
  }
}

/** Fixed full-screen WebGL stage behind the page, with a graceful 2D fallback. */
export function Stage() {
  const supported = useMemo(hasWebGL, []);
  const ready = useUi((s) => s.ready);

  if (!supported) {
    queueMicrotask(() => setUi({ fallback: true }));
    return <WatchFallback />;
  }
  return (
    <div className={`stage-canvas ${ready ? 'is-ready' : ''}`}>
      <GLBoundary>
        <Suspense fallback={null}>
          <Experience />
        </Suspense>
      </GLBoundary>
    </div>
  );
}
