import * as THREE from 'three';

/**
 * All surface artwork is generated at runtime on 2D canvases — no external image
 * assets, so every texture is original to this project.
 */

const CHAMPAGNE = '#e6d3a8';
const SERIF = '"Cormorant Garamond", "Times New Roman", Georgia, serif';
const SANS = 'Manrope, "Helvetica Neue", Arial, sans-serif';

function canvas(size: number) {
  const c = document.createElement('canvas');
  c.width = c.height = size;
  const ctx = c.getContext('2d')!;
  return { c, ctx };
}

function toTexture(c: HTMLCanvasElement, srgb = true) {
  const t = new THREE.CanvasTexture(c);
  t.colorSpace = srgb ? THREE.SRGBColorSpace : THREE.NoColorSpace;
  t.anisotropy = 8;
  t.needsUpdate = true;
  return t;
}

/* -------------------------------------------------------------------------- */

/** Deep-green sunburst dial with minute track, printing and date aperture. */
export function makeDialTexture(day: number) {
  const S = 2048;
  const { c, ctx } = canvas(S);
  const cx = S / 2;
  const R = S / 2;

  // base colour: lighter centre, deep edge
  const base = ctx.createRadialGradient(cx, cx, 0, cx, cx, R);
  base.addColorStop(0, '#1f5c45');
  base.addColorStop(0.55, '#123f2f');
  base.addColorStop(1, '#06231a');
  ctx.fillStyle = base;
  ctx.fillRect(0, 0, S, S);

  // sunburst: broad light lobes + hairline radial brushing
  const lobes = ctx.createConicGradient(-Math.PI / 4, cx, cx);
  for (let i = 0; i <= 8; i++) {
    lobes.addColorStop(i / 8, i % 2 ? 'rgba(255,255,255,0.10)' : 'rgba(0,0,0,0.16)');
  }
  ctx.fillStyle = lobes;
  ctx.fillRect(0, 0, S, S);

  ctx.save();
  ctx.translate(cx, cx);
  for (let i = 0; i < 1400; i++) {
    const a = (i / 1400) * Math.PI * 2;
    ctx.strokeStyle = `rgba(255,255,255,${0.012 + Math.random() * 0.03})`;
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(Math.cos(a) * 40, Math.sin(a) * 40);
    ctx.lineTo(Math.cos(a) * R, Math.sin(a) * R);
    ctx.stroke();
  }

  // minute track (outer)
  for (let i = 0; i < 60; i++) {
    const a = (i / 60) * Math.PI * 2 - Math.PI / 2;
    const major = i % 5 === 0;
    ctx.save();
    ctx.rotate(a);
    ctx.fillStyle = major ? CHAMPAGNE : 'rgba(230,211,168,0.75)';
    const len = major ? 46 : 26;
    const w = major ? 7 : 3.5;
    ctx.fillRect(R * 0.93 - len, -w / 2, len, w);
    ctx.restore();
  }
  ctx.strokeStyle = 'rgba(230,211,168,0.35)';
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.arc(0, 0, R * 0.93, 0, Math.PI * 2);
  ctx.stroke();

  // printing
  ctx.fillStyle = CHAMPAGNE;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.font = `500 98px ${SERIF}`;
  ctx.letterSpacing = '22px';
  ctx.fillText('AUREL', 11, -R * 0.36);
  // small emblem above brand
  ctx.beginPath();
  ctx.moveTo(0, -R * 0.49 - 26);
  ctx.lineTo(19, -R * 0.49 + 14);
  ctx.lineTo(-19, -R * 0.49 + 14);
  ctx.closePath();
  ctx.fill();

  ctx.font = `600 34px ${SANS}`;
  ctx.letterSpacing = '12px';
  ctx.fillText('AUTOMATIC', 6, R * 0.3);
  ctx.font = `400 28px ${SANS}`;
  ctx.letterSpacing = '8px';
  ctx.fillStyle = 'rgba(230,211,168,0.8)';
  ctx.fillText('EXHIBITION PIECE', 4, R * 0.38);

  // date aperture at 3 o'clock
  const dx = R * 0.66;
  const w = 128;
  const h = 104;
  ctx.fillStyle = '#f4f1ea';
  ctx.fillRect(dx - w / 2, -h / 2, w, h);
  ctx.fillStyle = '#121212';
  ctx.font = `600 78px ${SANS}`;
  ctx.letterSpacing = '0px';
  ctx.fillText(String(day), dx, 4);
  ctx.restore();

  return toTexture(c);
}

/**
 * Direction map for MeshPhysicalMaterial.anisotropy — radial brushing gives the
 * characteristic sunburst streak that sweeps as the dial turns.
 */
export function makeRadialAnisotropyMap() {
  const S = 512;
  const { c, ctx } = canvas(S);
  const img = ctx.createImageData(S, S);
  for (let y = 0; y < S; y++) {
    for (let x = 0; x < S; x++) {
      const u = (x + 0.5) / S - 0.5;
      const v = 0.5 - (y + 0.5) / S;
      const len = Math.hypot(u, v) || 1;
      // tangential direction → highlight streaks run radially
      const dx = -v / len;
      const dy = u / len;
      const i = (y * S + x) * 4;
      img.data[i] = (dx * 0.5 + 0.5) * 255;
      img.data[i + 1] = (dy * 0.5 + 0.5) * 255;
      img.data[i + 2] = 255;
      img.data[i + 3] = 255;
    }
  }
  ctx.putImageData(img, 0, 0);
  const t = toTexture(c, false);
  t.anisotropy = 1;
  return t;
}

/* -------------------------------------------------------------------------- */

/** Ceramic dive-bezel insert: graduations and numerals for a flat ring (planar UVs). */
export function makeBezelTexture(innerRatio: number) {
  const S = 2048;
  const { c, ctx } = canvas(S);
  const cx = S / 2;
  const R = S / 2;
  const ri = R * innerRatio;
  const mid = (R + ri) / 2;

  const g = ctx.createRadialGradient(cx, cx, ri, cx, cx, R);
  g.addColorStop(0, '#0b3a2b');
  g.addColorStop(0.5, '#0f4634');
  g.addColorStop(1, '#082a1f');
  ctx.fillStyle = g;
  ctx.beginPath();
  ctx.arc(cx, cx, R, 0, Math.PI * 2);
  ctx.arc(cx, cx, ri, 0, Math.PI * 2, true);
  ctx.fill();

  ctx.save();
  ctx.translate(cx, cx);
  ctx.fillStyle = CHAMPAGNE;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.font = `500 ${Math.round((R - ri) * 0.48)}px ${SANS}`;

  for (let m = 0; m < 60; m++) {
    const a = (m / 60) * Math.PI * 2;
    ctx.save();
    ctx.rotate(a);
    if (m === 0) {
      // inverted triangle at 12 (pip added in 3D)
      ctx.beginPath();
      ctx.moveTo(0, -ri - (R - ri) * 0.15);
      ctx.lineTo(-(R - ri) * 0.3, -R + (R - ri) * 0.14);
      ctx.lineTo((R - ri) * 0.3, -R + (R - ri) * 0.14);
      ctx.closePath();
      ctx.fill();
    } else if (m % 10 === 0) {
      ctx.fillText(String(m), 0, -mid);
    } else if (m % 5 === 0) {
      ctx.fillRect(-9, -R + (R - ri) * 0.16, 18, (R - ri) * 0.62);
    } else if (m < 15) {
      ctx.fillRect(-4, -R + (R - ri) * 0.18, 8, (R - ri) * 0.32);
    }
    ctx.restore();
  }
  ctx.restore();
  return toTexture(c);
}

/* -------------------------------------------------------------------------- */

/** Perlage — overlapping circular graining used on main plates. */
export function makePerlageTexture() {
  const S = 1024;
  const { c, ctx } = canvas(S);
  ctx.fillStyle = '#b9bdc2';
  ctx.fillRect(0, 0, S, S);
  const step = 46;
  for (let y = -step; y < S + step; y += step * 0.72) {
    for (let x = -step; x < S + step; x += step * 0.72) {
      const g = ctx.createRadialGradient(x, y, 0, x, y, step * 0.62);
      g.addColorStop(0, 'rgba(255,255,255,0.55)');
      g.addColorStop(0.5, 'rgba(200,204,208,0.25)');
      g.addColorStop(0.92, 'rgba(90,94,99,0.4)');
      g.addColorStop(1, 'rgba(90,94,99,0)');
      ctx.fillStyle = g;
      ctx.beginPath();
      ctx.arc(x, y, step * 0.62, 0, Math.PI * 2);
      ctx.fill();
    }
  }
  const t = toTexture(c);
  t.wrapS = t.wrapT = THREE.RepeatWrapping;
  t.repeat.set(3, 3);
  return t;
}

/** Côtes de Genève — parallel waves of light across bridges and rotor. */
export function makeCotesTexture() {
  const S = 1024;
  const { c, ctx } = canvas(S);
  const bands = 7;
  const bw = S / bands;
  for (let i = 0; i < bands; i++) {
    const g = ctx.createLinearGradient(i * bw, 0, (i + 1) * bw, 0);
    g.addColorStop(0, '#80858b');
    g.addColorStop(0.35, '#e7eaed');
    g.addColorStop(0.55, '#ffffff');
    g.addColorStop(0.8, '#a9aeb3');
    g.addColorStop(1, '#6d7278');
    ctx.fillStyle = g;
    ctx.fillRect(i * bw, 0, bw + 1, S);
  }
  const t = toTexture(c);
  t.wrapS = t.wrapT = THREE.RepeatWrapping;
  t.rotation = -Math.PI / 5;
  t.repeat.set(1.4, 1.4);
  return t;
}

/** Circular-brushed "snailing" for ratchet wheels and the case back centre. */
export function makeSnailTexture() {
  const S = 1024;
  const { c, ctx } = canvas(S);
  ctx.fillStyle = '#c4c8cc';
  ctx.fillRect(0, 0, S, S);
  for (let r = 4; r < S * 0.72; r += 2.2) {
    ctx.strokeStyle = `rgba(${Math.random() > 0.5 ? '255,255,255' : '60,64,68'},${0.06 + Math.random() * 0.1})`;
    ctx.lineWidth = 1.2;
    ctx.beginPath();
    ctx.arc(S / 2, S / 2, r, 0, Math.PI * 2);
    ctx.stroke();
  }
  return toTexture(c);
}

/** Engraved legend for the case back, as an alpha mask. */
export function makeCasebackEngraving() {
  const S = 1024;
  const { c, ctx } = canvas(S);
  ctx.fillStyle = '#000';
  ctx.fillRect(0, 0, S, S);
  ctx.translate(S / 2, S / 2);
  ctx.fillStyle = '#fff';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';

  const text = 'AUREL  ·  EXHIBITION PIECE  ·  STAINLESS STEEL  ·  AUTOMATIC  ·  ';
  ctx.font = `600 34px ${SANS}`;
  const chars = text.split('');
  const radius = S * 0.4;
  const step = (Math.PI * 2) / chars.length;
  chars.forEach((ch, i) => {
    ctx.save();
    ctx.rotate(i * step);
    ctx.fillText(ch, 0, -radius);
    ctx.restore();
  });

  ctx.strokeStyle = '#fff';
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.arc(0, 0, S * 0.35, 0, Math.PI * 2);
  ctx.stroke();

  // centre monogram
  ctx.font = `500 120px ${SERIF}`;
  ctx.fillText('A', 0, 8);
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.arc(0, 0, 110, 0, Math.PI * 2);
  ctx.stroke();

  return toTexture(c, false);
}
