import { useEffect } from 'react';
import { scene } from '../state/store';

const MAX_PITCH = 0.9;
const clampZoom = (z: number) => Math.min(1.8, Math.max(0.6, z));

/**
 * Global pointer handling for any element marked `data-rotate`.
 * - drag (mouse or one finger) rotates; touch keeps native vertical scrolling (touch-action: pan-y)
 * - two-finger pinch or Ctrl/⌘ + wheel (trackpad pinch) zooms
 * Also tracks a normalised pointer position for subtle parallax.
 */
export function useDragRotate() {
  useEffect(() => {
    const pointers = new Map<number, { x: number; y: number }>();
    let zone: HTMLElement | null = null;
    let pinchStart = 0;
    let zoomStart = 1;

    const pinchDistance = () => {
      const [a, b] = [...pointers.values()];
      return Math.hypot(a.x - b.x, a.y - b.y);
    };

    const onDown = (e: PointerEvent) => {
      const target = (e.target as Element).closest<HTMLElement>('[data-rotate]');
      if (!target || (e.target as Element).closest('button, a')) return;
      zone = target;
      pointers.set(e.pointerId, { x: e.clientX, y: e.clientY });
      if (pointers.size === 2) {
        pinchStart = pinchDistance();
        zoomStart = scene.user.zoom;
      }
      zone.classList.add('is-dragging');
    };

    const onMove = (e: PointerEvent) => {
      scene.pointer.x = (e.clientX / window.innerWidth) * 2 - 1;
      scene.pointer.y = -(e.clientY / window.innerHeight) * 2 + 1;

      const prev = pointers.get(e.pointerId);
      if (!prev) return;
      const dx = e.clientX - prev.x;
      const dy = e.clientY - prev.y;
      pointers.set(e.pointerId, { x: e.clientX, y: e.clientY });
      scene.user.lastInteraction = performance.now();

      if (pointers.size === 2) {
        scene.user.zoom = clampZoom(zoomStart * (pinchDistance() / pinchStart));
        return;
      }
      scene.user.yaw += dx * 0.008;
      // On touch, vertical movement scrolls the page instead of tilting.
      if (e.pointerType === 'mouse' || e.pointerType === 'pen') {
        scene.user.pitch = Math.max(-MAX_PITCH, Math.min(MAX_PITCH, scene.user.pitch + dy * 0.006));
      }
    };

    const onUp = (e: PointerEvent) => {
      pointers.delete(e.pointerId);
      if (pointers.size === 0 && zone) {
        zone.classList.remove('is-dragging');
        zone = null;
      }
    };

    const onWheel = (e: WheelEvent) => {
      if (!(e.ctrlKey || e.metaKey)) return;
      if (!(e.target as Element).closest('[data-rotate]')) return;
      e.preventDefault();
      scene.user.zoom = clampZoom(scene.user.zoom * Math.exp(-e.deltaY * 0.01));
      scene.user.lastInteraction = performance.now();
    };

    window.addEventListener('pointerdown', onDown);
    window.addEventListener('pointermove', onMove, { passive: true });
    window.addEventListener('pointerup', onUp);
    window.addEventListener('pointercancel', onUp);
    window.addEventListener('wheel', onWheel, { passive: false });
    return () => {
      window.removeEventListener('pointerdown', onDown);
      window.removeEventListener('pointermove', onMove);
      window.removeEventListener('pointerup', onUp);
      window.removeEventListener('pointercancel', onUp);
      window.removeEventListener('wheel', onWheel);
    };
  }, []);
}
