import type { Opportunity } from '@/data/schema';

/**
 * Generates a 1080×1920 Instagram Story PNG card for any opportunity.
 */
export async function exportStoryCard(opp: Opportunity): Promise<void> {
  const W = 1080;
  const H = 1920;
  const canvas = document.createElement('canvas');
  canvas.width = W;
  canvas.height = H;
  const ctx = canvas.getContext('2d');
  if (!ctx) return;

  // Void background
  ctx.fillStyle = '#050507';
  ctx.fillRect(0, 0, W, H);

  // Warm crimson + amber aura
  const aura1 = ctx.createRadialGradient(W * 0.85, H * 0.18, 40, W * 0.85, H * 0.18, 620);
  aura1.addColorStop(0, 'rgba(225, 29, 72, 0.34)');
  aura1.addColorStop(1, 'rgba(5, 5, 7, 0)');
  ctx.fillStyle = aura1;
  ctx.fillRect(0, 0, W, H);

  const aura2 = ctx.createRadialGradient(W * 0.15, H * 0.78, 40, W * 0.15, H * 0.78, 640);
  aura2.addColorStop(0, 'rgba(245, 158, 11, 0.28)');
  aura2.addColorStop(1, 'rgba(5, 5, 7, 0)');
  ctx.fillStyle = aura2;
  ctx.fillRect(0, 0, W, H);

  // Hairline frame
  ctx.strokeStyle = 'rgba(255, 255, 255, 0.14)';
  ctx.lineWidth = 2;
  ctx.strokeRect(56, 56, W - 112, H - 112);

  // Brand top
  ctx.fillStyle = '#a1a1aa';
  ctx.font = '600 28px Inter, system-ui, sans-serif';
  ctx.fillText('NEXTSTEP HYDERABAD', 110, 160);

  // Category chip
  ctx.fillStyle = 'rgba(245, 158, 11, 0.16)';
  ctx.fillRect(110, 260, 340, 58);
  ctx.strokeStyle = 'rgba(245, 158, 11, 0.45)';
  ctx.strokeRect(110, 260, 340, 58);
  ctx.fillStyle = '#fcd34d';
  ctx.font = '500 24px monospace';
  ctx.fillText(opp.category.toUpperCase(), 134, 298);

  // Title (word-wrapped serif italic)
  ctx.fillStyle = '#ffffff';
  ctx.font = 'italic 76px "Instrument Serif", Georgia, serif';
  const words = opp.title.split(' ');
  let line = '';
  let y = 440;
  for (const w of words) {
    const test = line ? `${line} ${w}` : w;
    if (ctx.measureText(test).width > W - 220) {
      ctx.fillText(line, 110, y);
      line = w;
      y += 92;
    } else {
      line = test;
    }
  }
  if (line) ctx.fillText(line, 110, y);

  // Eligibility + Deadline
  y += 110;
  ctx.fillStyle = '#d4d4d8';
  ctx.font = '500 32px Inter, system-ui, sans-serif';
  ctx.fillText(opp.eligibility, 110, y);

  y += 64;
  ctx.fillStyle = '#f59e0b';
  ctx.font = '600 30px monospace';
  ctx.fillText(`Deadline: ${opp.deadlineLabel}`, 110, y);

  // Footer
  ctx.fillStyle = '#a1a1aa';
  ctx.font = '500 28px Inter, system-ui, sans-serif';
  ctx.fillText('nextstephyderabad.netlify.app', 110, H - 170);
  ctx.fillStyle = '#ffffff';
  ctx.fillText('@nextstep.hyderabad', 110, H - 120);

  const blob = await new Promise<Blob | null>((resolve) =>
    canvas.toBlob((b) => resolve(b), 'image/png')
  );
  if (!blob) return;

  const file = new File([blob], `${opp.id}-story.png`, { type: 'image/png' });
  if (
    typeof navigator !== 'undefined' &&
    navigator.canShare &&
    navigator.canShare({ files: [file] })
  ) {
    try {
      await navigator.share({ files: [file], title: opp.title });
      return;
    } catch {
      // fall back to download
    }
  }

  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `${opp.id}-story.png`;
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
}
