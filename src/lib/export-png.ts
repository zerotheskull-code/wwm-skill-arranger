import {
  assignLanes,
  COUNTDOWN_BASIC,
  COUNTDOWN_OPTIONS,
  isBasicMove,
  moveKey,
  type AxisRow,
  type Opening,
  type Phase,
} from "@/lib/planner";

const FONT =
  '600 14px "Microsoft JhengHei","PingFang TC","WenQuanYi Zen Hei","Noto Sans TC",sans-serif';
const FONT_SM =
  '500 12px "Microsoft JhengHei","PingFang TC","WenQuanYi Zen Hei","Noto Sans TC",sans-serif';
const FONT_XS =
  '700 12px "Microsoft JhengHei","PingFang TC","WenQuanYi Zen Hei","Noto Sans TC",sans-serif';

const C = {
  fg: "#eceef2",
  muted: "#9aa0ab",
  elevated: "#1a1d24",
  line: "#2a2f3a",
  axis: "#4f8cff",
  basic: "#6b4fcf",
  basicEdge: "#8b6fff",
  phase: "#2d3a4f",
  phaseFg: "#c3cddc",
  dungeon: "#9b1c1c",
  dungeonEdge: "#c23a3a",
  dungeonFg: "#ffe8e8",
  cd: "#d4a017",
  subtle: "#6e7480",
};

export type PreviewSnapshot = {
  opening: Opening;
  axes: AxisRow[];
  phases: Phase[];
  movePhase: Record<string, string>;
};

function fileName(dungeonName: string) {
  const base = dungeonName.trim() || "燕雲排軸";
  const safe = base.replace(/[\\/:*?"<>|]+/g, "_").slice(0, 40);
  return `${safe}.png`;
}

function roundRect(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  w: number,
  h: number,
  r: number,
) {
  const radius = Math.min(r, w / 2, h / 2);
  ctx.beginPath();
  ctx.moveTo(x + radius, y);
  ctx.arcTo(x + w, y, x + w, y + h, radius);
  ctx.arcTo(x + w, y + h, x, y + h, radius);
  ctx.arcTo(x, y + h, x, y, radius);
  ctx.arcTo(x, y, x + w, y, radius);
  ctx.closePath();
}

function fillChip(
  ctx: CanvasRenderingContext2D,
  text: string,
  x: number,
  y: number,
  font: string,
  bg: string,
  fg: string,
  border: string,
  padX = 8,
  padY = 5,
) {
  ctx.font = font;
  const metrics = ctx.measureText(text);
  const tw = Math.ceil(metrics.width);
  const th = Math.max(
    12,
    Math.ceil(
      (metrics.actualBoundingBoxAscent ?? 10) +
        (metrics.actualBoundingBoxDescent ?? 3),
    ),
  );
  const w = tw + padX * 2;
  const h = th + padY * 2;
  roundRect(ctx, x, y, w, h, 4);
  ctx.fillStyle = bg;
  ctx.fill();
  ctx.strokeStyle = border;
  ctx.lineWidth = 1;
  ctx.stroke();
  ctx.fillStyle = fg;
  ctx.textBaseline = "middle";
  ctx.textAlign = "left";
  ctx.fillText(text, x + padX, y + h / 2 + 0.5);
  return { w, h };
}

function drawClock(ctx: CanvasRenderingContext2D, x: number, y: number, size: number) {
  const cx = x + size / 2;
  const cy = y + size / 2;
  ctx.strokeStyle = C.cd;
  ctx.lineWidth = 1.6;
  ctx.beginPath();
  ctx.arc(cx, cy, size / 2 - 1.5, 0, Math.PI * 2);
  ctx.stroke();
  ctx.beginPath();
  ctx.moveTo(cx, cy);
  ctx.lineTo(cx, cy - size / 4);
  ctx.moveTo(cx, cy);
  ctx.lineTo(cx + size / 5, cy + size / 8);
  ctx.stroke();
}

function chunkMoves(moves: string[]) {
  const chunks: { start: number; end: number; basic: boolean }[] = [];
  let i = 0;
  while (i < moves.length) {
    const basic = isBasicMove(moves[i]);
    if (basic) {
      let j = i;
      while (j < moves.length && isBasicMove(moves[j])) j++;
      chunks.push({ start: i, end: j, basic: true });
      i = j;
    } else {
      chunks.push({ start: i, end: i + 1, basic: false });
      i++;
    }
  }
  return chunks;
}

export function renderPreviewCanvas(snap: PreviewSnapshot) {
  const measure = document.createElement("canvas").getContext("2d");
  if (!measure) throw new Error("無法建立畫布");

  const axes = snap.axes.filter((a) => a.moves.length > 0);
  const phaseById = Object.fromEntries(snap.phases.map((p) => [p.id, p]));
  const opening = snap.opening;

  const chipH = 22;
  const moveH = 26;
  const axisN = 26;
  const phaseH = 15;
  const pad = 12;
  const gap = 6;

  type Chip = { text: string; bg: string; fg: string; border: string };
  const chips: Chip[] = [];
  if (opening.dungeonName.trim()) {
    chips.push({
      text: opening.dungeonName.trim(),
      bg: C.dungeon,
      fg: C.dungeonFg,
      border: C.dungeonEdge,
    });
  }
  if (opening.tiangong) {
    chips.push({
      text: `天工${opening.tiangong}`,
      bg: C.elevated,
      fg: C.muted,
      border: C.line,
    });
  }
  if (opening.futie && opening.futie !== "無") {
    chips.push({
      text: opening.futie,
      bg: C.elevated,
      fg: C.muted,
      border: C.line,
    });
  }
  if (opening.xinfa) {
    chips.push({
      text: opening.xinfa,
      bg: C.elevated,
      fg: C.muted,
      border: C.line,
    });
  }
  for (const tag of opening.customTags) {
    const text = tag.trim();
    if (!text) continue;
    chips.push({
      text,
      bg: C.elevated,
      fg: C.muted,
      border: C.line,
    });
  }

  measure.font = FONT_SM;
  let metaW = 0;
  chips.forEach((c, i) => {
    metaW += Math.ceil(measure.measureText(c.text).width) + 16 + (i ? gap : 0);
  });

  let cdW = 0;
  if (opening.countdownCount > 0) {
    const label =
      COUNTDOWN_OPTIONS.find((o) => o.value === opening.countdownCount)?.label ??
      `${opening.countdownCount}次`;
    measure.font = FONT_SM;
    cdW = 18 + 8 + Math.ceil(measure.measureText(label).width) + 16 + 14;
    opening.countdownMoves.forEach((m) => {
      measure.font = FONT_XS;
      const nw = Math.ceil(measure.measureText(m.count).width);
      measure.font = FONT;
      const mw = Math.ceil(measure.measureText(m.name).width) + 16;
      cdW += 8 + nw + 4 + mw;
    });
  }

  type PlacedPhase = { text: string; left: number; width: number; lane: number };
  const axisLayouts = axes.map((axis) => {
    const chunks = chunkMoves(axis.moves);
    measure.font = FONT;
    const moveW = axis.moves.map((name) => Math.ceil(measure.measureText(name).width) + 16);
    const lefts: number[] = [];
    let x = axisN + 8;
    chunks.forEach((ch, ci) => {
      const innerGap = ch.basic ? 2 : 8;
      for (let i = ch.start; i < ch.end; i++) {
        lefts[i] = x;
        x += moveW[i] + (i < ch.end - 1 ? innerGap : 0);
      }
      if (ci < chunks.length - 1) x += 18;
    });
    const rowW = x;

    const items: { text: string; left: number; width: number }[] = [];
    axis.moves.forEach((_, i) => {
      const pid = snap.movePhase[moveKey(axis.id, i)];
      const text = pid ? (phaseById[pid]?.text ?? "").trim() : "";
      if (!text) return;
      measure.font = FONT_SM;
      items.push({
        text,
        left: lefts[i],
        width: Math.ceil(measure.measureText(text).width) + 16,
      });
    });
    const lanes = assignLanes(items);
    const placed: PlacedPhase[] = items.map((it, i) => ({
      ...it,
      lane: lanes[i] ?? 0,
    }));
    const maxLane = placed.length ? Math.max(0, ...placed.map((p) => p.lane)) : -1;
    const phasePad = maxLane >= 0 ? (maxLane + 1) * (phaseH + 2) : 0;
    return { axis, chunks, moveW, lefts, rowW, placed, phasePad };
  });

  const contentW = Math.max(
    metaW,
    cdW,
    ...axisLayouts.map((a) => a.rowW),
    40,
  );
  const hasMeta = chips.length > 0;
  const hasCd = opening.countdownCount > 0;
  let contentH = 0;
  if (hasMeta) contentH += chipH + 10;
  if (hasCd) contentH += 28 + 10;
  axisLayouts.forEach((a, i) => {
    contentH += a.phasePad + moveH + (i < axisLayouts.length - 1 ? 2 : 0);
  });
  if (contentH === 0) contentH = 40;

  const W = Math.ceil(contentW + pad * 2);
  const H = Math.ceil(contentH + pad * 2);
  const scale = 2;
  const canvas = document.createElement("canvas");
  canvas.width = W * scale;
  canvas.height = H * scale;
  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("無法建立畫布");
  ctx.scale(scale, scale);
  ctx.textBaseline = "middle";
  ctx.textAlign = "left";

  let y = pad;
  let x = pad;

  if (hasMeta) {
    x = pad;
    chips.forEach((c) => {
      const r = fillChip(ctx, c.text, x, y, FONT_SM, c.bg, c.fg, c.border);
      x += r.w + gap;
    });
    y += chipH + 10;
  }

  if (hasCd) {
    x = pad;
    const label =
      COUNTDOWN_OPTIONS.find((o) => o.value === opening.countdownCount)?.label ??
      `${opening.countdownCount}次`;
    ctx.font = FONT_SM;
    const lw = Math.ceil(ctx.measureText(label).width);
    const boxW = 18 + 8 + lw + 16;
    const boxH = 24;
    roundRect(ctx, x, y, boxW, boxH, 6);
    ctx.fillStyle = C.elevated;
    ctx.fill();
    ctx.strokeStyle = C.line;
    ctx.lineWidth = 1;
    ctx.stroke();
    drawClock(ctx, x + 6, y + 4, 16);
    ctx.fillStyle = C.fg;
    ctx.font = FONT_SM;
    ctx.fillText(label, x + 26, y + boxH / 2 + 0.5);
    x += boxW + 8;
    ctx.fillStyle = C.fg;
    ctx.font = FONT;
    ctx.fillText(":", x, y + boxH / 2 + 0.5);
    x += 12;
    opening.countdownMoves.forEach((m) => {
      ctx.font = FONT_XS;
      ctx.fillStyle = C.cd;
      const nw = Math.ceil(ctx.measureText(m.count).width);
      ctx.fillText(m.count, x, y + boxH / 2 + 0.5);
      x += nw + 3;
      const basic = isBasicMove(m.name, COUNTDOWN_BASIC);
      const r = fillChip(
        ctx,
        m.name,
        x,
        y + 1,
        FONT,
        basic ? C.basic : C.elevated,
        C.fg,
        basic ? C.basicEdge : C.line,
        8,
        5,
      );
      x += r.w + 8;
    });
    y += 28 + 10;
  }

  axisLayouts.forEach((layout, i) => {
    y += layout.phasePad;
    const rowY = y;
    x = pad;
    roundRect(ctx, x, rowY, axisN, axisN, 4);
    ctx.fillStyle = C.axis;
    ctx.fill();
    ctx.fillStyle = C.fg;
    ctx.font = FONT_XS;
    ctx.textAlign = "center";
    ctx.fillText(layout.axis.number || "•", x + axisN / 2, rowY + axisN / 2 + 0.5);
    ctx.textAlign = "left";

    layout.axis.moves.forEach((name, i) => {
      const basic = isBasicMove(name);
      fillChip(
        ctx,
        name,
        pad + layout.lefts[i],
        rowY + (axisN - moveH) / 2,
        FONT,
        basic ? C.basic : C.elevated,
        C.fg,
        basic ? C.basicEdge : C.line,
        8,
        6,
      );
    });

    layout.chunks.forEach((ch, ci) => {
      if (ci === layout.chunks.length - 1) return;
      const last = ch.end - 1;
      const x1 = pad + layout.lefts[last] + layout.moveW[last];
      const x2 = pad + layout.lefts[ch.end];
      ctx.fillStyle = C.subtle;
      ctx.font = FONT;
      ctx.textAlign = "center";
      ctx.fillText("›", (x1 + x2) / 2, rowY + axisN / 2 + 0.5);
      ctx.textAlign = "left";
    });

    layout.placed.forEach((p) => {
      const top = rowY - (p.lane + 1) * (phaseH + 2);
      fillChip(
        ctx,
        p.text,
        pad + p.left,
        top,
        FONT_SM,
        C.phase,
        C.phaseFg,
        C.phase,
        8,
        2,
      );
    });

    y += moveH + (i < axisLayouts.length - 1 ? 2 : 0);
  });

  return canvas;
}

export async function downloadPreviewPng(snap: PreviewSnapshot) {
  const canvas = renderPreviewCanvas(snap);
  const a = document.createElement("a");
  a.href = canvas.toDataURL("image/png");
  a.download = fileName(snap.opening.dungeonName);
  a.click();
}
