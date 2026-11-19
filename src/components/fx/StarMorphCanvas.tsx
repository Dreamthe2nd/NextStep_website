import { useEffect, useRef } from 'react';
import { useReducedMotion } from '@/hooks/useReducedMotion';

interface MorphStar {
  x: number;
  y: number;
  z: number;
  size: number;
  color: string;
  alpha: number;
}

interface AmbientBgStar {
  nx: number;
  ny: number;
  size: number;
  color: string;
  phase: number;
  speed: number;
  parallax: number;
  twinkleAmp: number;
}

const MORPH_COUNT = 340;
const AMBIENT_COUNT = 190;

const BLUE_DOMINANT_PALETTE = [
  '#93c5fd', // ice blue
  '#60a5fa', // cobalt glow
  '#bfdbfe', // soft sky
  '#e0f2fe', // pale ice white
  '#ffffff', // pure starlight
  '#38bdf8', // sapphire highlight
  '#e6c98b', // rare warm accent (~14%)
];

function seededRand(seedInit: number) {
  let s = seedInit;
  return () => {
    s = (s * 16807) % 2147483647;
    return (s - 1) / 2147483646;
  };
}

function buildAmbientStars(): AmbientBgStar[] {
  const rand = seededRand(809);
  return Array.from({ length: AMBIENT_COUNT }, (_, i) => {
    const color =
      i % 9 === 0
        ? '#e6c98b'
        : i % 4 === 0
        ? '#e0f2fe'
        : i % 3 === 0
        ? '#60a5fa'
        : '#93c5fd';
    return {
      nx: rand(),
      ny: rand(),
      size: rand() * 1.55 + 0.45,
      color,
      phase: rand() * Math.PI * 2,
      speed: rand() * 0.0022 + 0.0008,
      parallax: 0.4 + rand() * 0.85,
      twinkleAmp: 0.25 + rand() * 0.55,
    };
  });
}

/**
 * Redesigned 3D Perspective Open Book:
 * Clear V-spine cradle, swept lower cover boards, stacked fanned page arches,
 * page-line constellations, corner rivets, and rising diagonal bookmark stars.
 */
function buildBookShape(): { pts: MorphStar[]; edges: Array<[number, number]> } {
  const rand = seededRand(101);
  const pts: MorphStar[] = [];
  const edges: Array<[number, number]> = [];

  const spineIdx = pts.length;
  // Center V-valley spine (16 dense vertical points from back-top to front-dip)
  for (let i = 0; i < 16; i++) {
    const u = i / 15;
    pts.push({
      x: 0,
      y: -0.26 + u * 0.66,
      z: -0.14 + Math.sin(u * Math.PI) * 0.06,
      size: i === 0 || i === 15 ? 2.6 : 1.75,
      color: i % 3 === 0 ? '#e6c98b' : '#e0f2fe',
      alpha: 0.92,
    });
    if (i > 0) edges.push([spineIdx + i - 1, spineIdx + i]);
  }

  // Left & Right symmetric winged page spreads + stacked page fan thickness + cover boards
  [-1, 1].forEach((side) => {
    // 1. Top gull-wing open page crest (distinct arched spine dip -> high shoulder -> outer drop)
    const topCurveStart = pts.length;
    const steps = 18;
    for (let s = 0; s < steps; s++) {
      const u = s / (steps - 1); // 0 = center spine -> 1 = outer fore-edge
      const x = side * (u * 0.86);
      const arch = Math.sin(u * Math.PI * 0.92) * 0.21;
      const y = -0.26 - arch + u * 0.14;
      const z = Math.sin(u * Math.PI) * 0.18 + u * 0.08;
      pts.push({
        x,
        y,
        z,
        size: s === steps - 1 || s === 0 ? 2.5 : 1.85,
        color: s % 4 === 0 ? '#ffffff' : '#93c5fd',
        alpha: 0.95,
      });
      if (s > 0) edges.push([topCurveStart + s - 1, topCurveStart + s]);
    }

    // 2. Bottom swept open page edge (crisp matching arch to show clear 3D open pages)
    const botCurveStart = pts.length;
    for (let s = 0; s < steps; s++) {
      const u = s / (steps - 1);
      const x = side * (u * 0.86);
      const arch = Math.sin(u * Math.PI * 0.92) * 0.19;
      const y = 0.36 - arch + u * 0.13;
      const z = Math.sin(u * Math.PI) * 0.18 + u * 0.08;
      pts.push({
        x,
        y,
        z,
        size: 1.85,
        color: s % 3 === 0 ? '#bfdbfe' : '#60a5fa',
        alpha: 0.9,
      });
      if (s > 0) edges.push([botCurveStart + s - 1, botCurveStart + s]);
    }

    // Outer fore-edge ribs + inner vertical page curvature ribs (4 columns per page)
    [0.35, 0.68, 1.0].forEach((uRatio, colIdx) => {
      const topIdx = topCurveStart + Math.min(steps - 1, Math.round(uRatio * (steps - 1)));
      const botIdx = botCurveStart + Math.min(steps - 1, Math.round(uRatio * (steps - 1)));
      edges.push([topIdx, botIdx]);

      // Populate vertical dots along the outer page stack edge
      if (colIdx === 2) {
        const outerStackStart = pts.length;
        for (let v = 1; v < 8; v++) {
          const vt = v / 8;
          pts.push({
            x: pts[topIdx].x + side * 0.03 * Math.sin(vt * Math.PI),
            y: pts[topIdx].y + (pts[botIdx].y - pts[topIdx].y) * vt,
            z: pts[topIdx].z,
            size: 1.65,
            color: '#93c5fd',
            alpha: 0.85,
          });
          if (v > 1) edges.push([outerStackStart + v - 2, outerStackStart + v - 1]);
        }
      }
    });

    // 3. Stepped Hardcover Outer Cover cradling bottom & side below the pages
    const coverStart = pts.length;
    for (let s = 0; s < 10; s++) {
      const u = s / 9;
      const x = side * (u * 0.96);
      const y = 0.44 + (1 - Math.sin(u * Math.PI * 0.8)) * 0.05;
      pts.push({
        x,
        y,
        z: -0.02 + u * 0.12,
        size: s === 9 ? 2.4 : 1.75,
        color: '#e6c98b', // crisp thin gold hard-cover edge accent
        alpha: 0.82,
      });
      if (s > 0) edges.push([coverStart + s - 1, coverStart + s]);
    }

    // 4. Curved written-line star constellations across each page
    [0.24, 0.5, 0.74].forEach((lineRow) => {
      const rowStart = pts.length;
      for (let k = 0; k < 6; k++) {
        const u = 0.14 + (k / 5) * 0.72;
        const arch = Math.sin(u * Math.PI * 0.92) * 0.2;
        const x = side * (u * 0.86);
        const y = -0.22 + lineRow * 0.54 - arch + u * 0.135;
        pts.push({
          x,
          y,
          z: Math.sin(u * Math.PI) * 0.16,
          size: k % 2 === 0 ? 1.55 : 1.15,
          color: BLUE_DOMINANT_PALETTE[(k + side + 4) % 5],
          alpha: 0.74,
        });
        if (k > 0) edges.push([rowStart + k - 1, rowStart + k]);
      }
    });
  });

  // Floating celestial bookmark ribbon & starlight rising above open spine
  const ribbonStart = pts.length;
  for (let i = 0; i < 8; i++) {
    const t = i / 7;
    pts.push({
      x: 0.04 + Math.sin(t * 2.2) * 0.08,
      y: -0.26 - t * 0.42,
      z: 0.1 + t * 0.05,
      size: i === 7 ? 2.8 : 1.6,
      color: '#e6c98b',
      alpha: 0.85 - t * 0.25,
    });
    if (i > 0) edges.push([ribbonStart + i - 1, ribbonStart + i]);
  }

  // Dense halo stardust filling around the book silhouette
  while (pts.length < MORPH_COUNT) {
    const idx = pts.length;
    const isHalo = idx % 3 === 0;
    pts.push({
      x: (rand() - 0.5) * (isHalo ? 1.65 : 1.4),
      y: (rand() - 0.5) * 1.15,
      z: (rand() - 0.5) * 0.55,
      size: rand() * 1.85 + 0.75,
      color: idx % 8 === 0 ? '#e6c98b' : BLUE_DOMINANT_PALETTE[idx % 5],
      alpha: 0.32 + rand() * 0.55,
    });
  }

  return { pts, edges };
}

/** Starmade 3D Geodesic Football (Sapphire/Ice-Blue dominant with pentagon constellations) */
function buildFootballShape(): { pts: MorphStar[]; edges: Array<[number, number]> } {
  const rand = seededRand(202);
  const pts: MorphStar[] = [];
  const edges: Array<[number, number]> = [];
  const radius = 0.7;

  const goldenRatio = (1 + Math.sqrt(5)) / 2;
  const ico: Array<[number, number, number]> = [
    [-1, goldenRatio, 0], [1, goldenRatio, 0], [-1, -goldenRatio, 0], [1, -goldenRatio, 0],
    [0, -1, goldenRatio], [0, 1, goldenRatio], [0, -1, -goldenRatio], [0, 1, -goldenRatio],
    [goldenRatio, 0, -1], [goldenRatio, 0, 1], [-goldenRatio, 0, -1], [-goldenRatio, 0, 1],
  ].map(([x, y, z]) => {
    const len = Math.hypot(x, y, z);
    return [(x / len) * radius, (y / len) * radius, (z / len) * radius] as [number, number, number];
  });

  ico.forEach(([cx, cy, cz], idx) => {
    const centerIdx = pts.length;
    pts.push({
      x: cx,
      y: cy,
      z: cz,
      size: 2.55,
      color: idx % 3 === 0 ? '#e6c98b' : '#38bdf8',
      alpha: 0.95,
    });

    const nx = cx / radius;
    const ny = cy / radius;
    const nz = cz / radius;
    const up: [number, number, number] = Math.abs(ny) < 0.9 ? [0, 1, 0] : [1, 0, 0];
    let tx = up[1] * nz - up[2] * ny;
    let ty = up[2] * nx - up[0] * nz;
    let tz = up[0] * ny - up[1] * nx;
    const tlen = Math.hypot(tx, ty, tz) || 1;
    tx /= tlen; ty /= tlen; tz /= tlen;
    const bx = ny * tz - nz * ty;
    const by = nz * tx - nx * tz;
    const bz = nx * ty - ny * tx;

    const ringStart = pts.length;
    const ringRadius = 0.25;
    for (let k = 0; k < 5; k++) {
      const ang = (k / 5) * Math.PI * 2;
      const sx = cx + (Math.cos(ang) * tx + Math.sin(ang) * bx) * ringRadius;
      const sy = cy + (Math.cos(ang) * ty + Math.sin(ang) * by) * ringRadius;
      const sz = cz + (Math.cos(ang) * tz + Math.sin(ang) * bz) * ringRadius;
      const nLen = Math.hypot(sx, sy, sz) || 1;
      pts.push({
        x: (sx / nLen) * radius,
        y: (sy / nLen) * radius,
        z: (sz / nLen) * radius,
        size: 1.85,
        color: '#e0f2fe',
        alpha: 0.88,
      });
      edges.push([ringStart + k, ringStart + ((k + 1) % 5)]);
      if (k % 2 === 0) edges.push([centerIdx, ringStart + k]);
    }
  });

  // Dense geodesic sphere surface + orbital halo stars
  while (pts.length < MORPH_COUNT) {
    const i = pts.length;
    const isHalo = i > MORPH_COUNT - 48;
    if (isHalo) {
      const a = ((i - (MORPH_COUNT - 48)) / 48) * Math.PI * 2;
      pts.push({
        x: Math.cos(a) * 0.96,
        y: Math.sin(a) * 0.25,
        z: Math.sin(a) * 0.96,
        size: 1.2 + rand() * 0.9,
        color: i % 5 === 0 ? '#e6c98b' : '#93c5fd',
        alpha: 0.5,
      });
    } else {
      const phi = Math.acos(1 - (2 * ((i % 200) + 0.5)) / 200);
      const theta = Math.PI * (1 + Math.sqrt(5)) * i;
      pts.push({
        x: radius * Math.cos(theta) * Math.sin(phi),
        y: radius * Math.cos(phi),
        z: radius * Math.sin(theta) * Math.sin(phi),
        size: rand() * 1.45 + 0.85,
        color: i % 8 === 0 ? '#e6c98b' : BLUE_DOMINANT_PALETTE[i % 5],
        alpha: 0.55 + rand() * 0.35,
      });
    }
  }

  return { pts, edges };
}

/** Starmade Scientific Apparatus (Erlenmeyer Flask + Orbital Atom Rings + Graduations, Blue-heavy) */
function buildApparatusShape(): { pts: MorphStar[]; edges: Array<[number, number]> } {
  const rand = seededRand(303);
  const pts: MorphStar[] = [];
  const edges: Array<[number, number]> = [];

  const flaskPath: Array<[number, number]> = [
    [-0.14, -0.68],
    [0.14, -0.68],
    [0.1, -0.62],
    [0.1, -0.22],
    [0.5, 0.46],
    [0.45, 0.58],
    [-0.45, 0.58],
    [-0.5, 0.46],
    [-0.1, -0.22],
    [-0.1, -0.62],
  ];

  const flaskStart = pts.length;
  for (let i = 0; i < flaskPath.length; i++) {
    const [x1, y1] = flaskPath[i];
    const [x2, y2] = flaskPath[(i + 1) % flaskPath.length];
    const segs = 6;
    for (let s = 0; s < segs; s++) {
      const u = s / segs;
      pts.push({
        x: x1 + (x2 - x1) * u,
        y: y1 + (y2 - y1) * u,
        z: 0.05,
        size: s === 0 ? 2.45 : 1.75,
        color: s === 0 ? '#e0f2fe' : '#60a5fa',
        alpha: 0.94,
      });
    }
  }
  const flaskCount = pts.length - flaskStart;
  for (let i = 0; i < flaskCount; i++) {
    edges.push([flaskStart + i, flaskStart + ((i + 1) % flaskCount)]);
  }

  // Liquid wave curve inside flask
  const waveStart = pts.length;
  for (let i = 0; i < 18; i++) {
    const u = i / 17;
    const x = -0.35 + u * 0.7;
    const y = 0.22 + Math.sin(u * Math.PI * 2) * 0.04;
    pts.push({ x, y, z: 0.1, size: 1.9, color: '#38bdf8', alpha: 0.92 });
    if (i > 0) edges.push([waveStart + i - 1, waveStart + i]);
  }

  // Three dense tilted elliptical orbital atom rings framing flask
  [-0.55, 0, 0.55].forEach((tilt) => {
    const ringStart = pts.length;
    const n = 28;
    for (let i = 0; i < n; i++) {
      const a = (i / n) * Math.PI * 2;
      const rx = Math.cos(a) * 0.82;
      const ry = Math.sin(a) * 0.25;
      const x = rx * Math.cos(tilt) - ry * Math.sin(tilt);
      const y = rx * Math.sin(tilt) + ry * Math.cos(tilt) - 0.06;
      const z = Math.sin(a) * 0.36;
      pts.push({
        x,
        y,
        z,
        size: i % 7 === 0 ? 2.2 : 1.35,
        color: i % 10 === 0 ? '#e6c98b' : i % 2 === 0 ? '#93c5fd' : '#e0f2fe',
        alpha: 0.75,
      });
      edges.push([ringStart + i, ringStart + ((i + 1) % n)]);
    }
  });

  // Rising laboratory bubbles & cosmic field fill
  while (pts.length < MORPH_COUNT) {
    const inside = pts.length % 3 !== 0;
    pts.push({
      x: inside ? (rand() - 0.5) * 0.2 : (rand() - 0.5) * 1.45,
      y: inside ? -0.15 - rand() * 0.65 : (rand() - 0.5) * 1.25,
      z: (rand() - 0.5) * 0.5,
      size: rand() * 1.95 + 0.85,
      color: pts.length % 9 === 0 ? '#e6c98b' : BLUE_DOMINANT_PALETTE[pts.length % 5],
      alpha: 0.36 + rand() * 0.56,
    });
  }

  return { pts, edges };
}

function smoothstep(edge0: number, edge1: number, x: number): number {
  const t = Math.max(0, Math.min(1, (x - edge0) / (edge1 - edge0)));
  return t * t * (3 - 2 * t);
}

export function StarMorphCanvas() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const reduced = useReducedMotion();

  useEffect(() => {
    if (reduced) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const ambientStars = buildAmbientStars();
    const book = buildBookShape();
    const football = buildFootballShape();
    const apparatus = buildApparatusShape();

    let animId = 0;
    let tabVisible = !document.hidden;
    let width = window.innerWidth;
    let height = window.innerHeight;
    let targetMouseX = 0;
    let targetMouseY = 0;
    let mouseX = 0;
    let mouseY = 0;
    let rotY = 0;

    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const resize = () => {
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = Math.max(1, Math.round(width * dpr));
      canvas.height = Math.max(1, Math.round(height * dpr));
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    resize();

    const onMove = (e: PointerEvent) => {
      targetMouseX = (e.clientX / Math.max(1, width) - 0.5) * 2;
      targetMouseY = (e.clientY / Math.max(1, height) - 0.5) * 2;
    };
    const onVis = () => {
      tabVisible = !document.hidden;
    };

    window.addEventListener('resize', resize);
    window.addEventListener('pointermove', onMove, { passive: true });
    document.addEventListener('visibilitychange', onVis);

    const getScrollState = () => {
      const opp = document.getElementById('opportunities');
      const consult = document.getElementById('consultations');
      const team = document.getElementById('team');
      const about = document.getElementById('about');
      if (!opp || !consult || !team || !about) {
        return { morphT: 0, masterAlpha: 0, scrollRatio: 0 };
      }

      const midY = height * 0.5;
      const oppY = opp.getBoundingClientRect().top;
      const consultY = consult.getBoundingClientRect().top;
      const teamY = team.getBoundingClientRect().top;
      const aboutY = about.getBoundingClientRect().top;

      const enterAlpha = smoothstep(height * 0.92, height * 0.25, oppY);
      const exitAlpha = smoothstep(height * 0.25, height * 0.92, aboutY);
      const masterAlpha = enterAlpha * exitAlpha;

      const w01 = smoothstep(midY + height * 0.2, midY - height * 0.35, consultY);
      const w12 = smoothstep(midY + height * 0.2, midY - height * 0.35, teamY);
      const morphT = w01 + w12;

      const maxDoc = Math.max(1, document.documentElement.scrollHeight - height);
      const scrollRatio = window.scrollY / maxDoc;

      return { morphT, masterAlpha, scrollRatio };
    };

    const projected = new Array<{
      x: number;
      y: number;
      z: number;
      size: number;
      color: string;
      alpha: number;
    }>(MORPH_COUNT);

    const draw = (time: number) => {
      if (tabVisible && width > 0 && height > 0) {
        const { morphT, masterAlpha, scrollRatio } = getScrollState();

        ctx.clearRect(0, 0, width, height);

        if (masterAlpha > 0.015) {
          mouseX += (targetMouseX - mouseX) * 0.06;
          mouseY += (targetMouseY - mouseY) * 0.06;
          rotY = time * 0.00028 + mouseX * 0.35;
          const rotX = mouseY * 0.2;

          // Layer 1: General Deep-Space Blue-Heavy Background Starfield across entire viewport
          for (let i = 0; i < AMBIENT_COUNT; i++) {
            const s = ambientStars[i];
            const px = ((s.nx * width + mouseX * 14 * s.parallax) % width + width) % width;
            const rawY = s.ny * height - scrollRatio * height * 1.4 * s.parallax + mouseY * 10 * s.parallax;
            const py = ((rawY % height) + height) % height;
            const twinkle = 0.42 + s.twinkleAmp * Math.sin(time * s.speed + s.phase);
            const alpha = Math.max(0.08, Math.min(0.85, twinkle * masterAlpha));

            ctx.globalAlpha = alpha * 0.28;
            ctx.fillStyle = s.color;
            ctx.beginPath();
            ctx.arc(px, py, s.size * 2.4, 0, Math.PI * 2);
            ctx.fill();

            ctx.globalAlpha = alpha;
            ctx.beginPath();
            ctx.arc(px, py, s.size, 0, Math.PI * 2);
            ctx.fill();
          }
          ctx.globalAlpha = 1;

          // Layer 2: Starmade Morphing Constellation (Book -> Football -> Scientific Apparatus)
          const cosX = Math.cos(rotX);
          const sinX = Math.sin(rotX);

          const scale = Math.min(width, height) * (width < 640 ? 0.38 : 0.35);
          const cx = width * (width >= 1024 ? 0.51 : 0.5) + mouseX * 16;
          const cy = height * 0.52 + mouseY * 12;

          const tA = Math.min(1, Math.max(0, morphT));
          const tB = Math.min(1, Math.max(0, morphT - 1));
          const useSecondSegment = morphT > 1;
          const localT = useSecondSegment ? tB : tA;
          const swirlFactor = Math.sin(localT * Math.PI) * 0.42;

          const shapeA = useSecondSegment ? football : book;
          const shapeB = useSecondSegment ? apparatus : football;

          for (let i = 0; i < MORPH_COUNT; i++) {
            const pA = shapeA.pts[i];
            const pB = shapeB.pts[i];

            let bx = pA.x + (pB.x - pA.x) * localT;
            let by = pA.y + (pB.y - pA.y) * localT;
            let bz = pA.z + (pB.z - pA.z) * localT;

            if (swirlFactor > 0.01) {
              const ang = swirlFactor * 1.9 + i * 0.025;
              const rx = bx * Math.cos(ang) - bz * Math.sin(ang);
              const rz = bx * Math.sin(ang) + bz * Math.cos(ang);
              bx = rx;
              bz = rz;
            }

            const rotWeight = useSecondSegment ? 1 - localT * 0.72 : 0.24 + localT * 0.76;
            const cyRot = Math.cos(rotY * rotWeight);
            const syRot = Math.sin(rotY * rotWeight);
            const rx = bx * cyRot - bz * syRot;
            const rz = bx * syRot + bz * cyRot;
            const ry = by * cosX - rz * sinX;
            const fz = by * sinX + rz * cosX;

            const depthScale = 1 / (1 + fz * 0.25);
            const px = cx + rx * scale * depthScale;
            const py = cy + ry * scale * depthScale;

            const twinkle = 0.74 + 0.26 * Math.sin(time * 0.002 + i * 1.1);
            projected[i] = {
              x: px,
              y: py,
              z: fz,
              size: (pA.size + (pB.size - pA.size) * localT) * depthScale,
              color: localT > 0.5 ? pB.color : pA.color,
              alpha: (pA.alpha + (pB.alpha - pA.alpha) * localT) * masterAlpha * twinkle * 0.68,
            };
          }

          // Cool cobalt-sapphire radial nebula halo for blue contrast
          const halo = ctx.createRadialGradient(cx, cy, 0, cx, cy, scale * 1.25);
          halo.addColorStop(0, `rgba(59, 130, 246, ${(0.11 * masterAlpha).toFixed(3)})`);
          halo.addColorStop(0.55, `rgba(147, 197, 253, ${(0.055 * masterAlpha).toFixed(3)})`);
          halo.addColorStop(1, 'rgba(9, 9, 11, 0)');
          ctx.fillStyle = halo;
          ctx.beginPath();
          ctx.arc(cx, cy, scale * 1.25, 0, Math.PI * 2);
          ctx.fill();

          // Constellation edges in cool ice-blue
          const edgeShape = localT > 0.5 ? shapeB : shapeA;
          const edgeAlpha = (1 - Math.sin(localT * Math.PI) * 0.85) * masterAlpha * 0.3;
          if (edgeAlpha > 0.015) {
            ctx.lineWidth = 0.85;
            ctx.strokeStyle = `rgba(147, 197, 253, ${edgeAlpha.toFixed(3)})`;
            ctx.beginPath();
            for (const [a, b] of edgeShape.edges) {
              const pa = projected[a];
              const pb = projected[b];
              if (!pa || !pb) continue;
              ctx.moveTo(pa.x, pa.y);
              ctx.lineTo(pb.x, pb.y);
            }
            ctx.stroke();
          }

          for (let i = 0; i < MORPH_COUNT; i++) {
            const p = projected[i];
            if (p.alpha <= 0.01) continue;
            ctx.globalAlpha = Math.min(1, p.alpha * 0.36);
            ctx.fillStyle = p.color;
            ctx.beginPath();
            ctx.arc(p.x, p.y, p.size * 2.55, 0, Math.PI * 2);
            ctx.fill();

            ctx.globalAlpha = Math.min(1, p.alpha);
            ctx.beginPath();
            ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
            ctx.fill();
          }
          ctx.globalAlpha = 1;
        }
      }
      animId = requestAnimationFrame(draw);
    };

    animId = requestAnimationFrame(draw);

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('resize', resize);
      window.removeEventListener('pointermove', onMove);
      document.removeEventListener('visibilitychange', onVis);
    };
  }, [reduced]);

  if (reduced) return null;

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className="fixed inset-0 w-full h-full z-[1] pointer-events-none"
    />
  );
}
