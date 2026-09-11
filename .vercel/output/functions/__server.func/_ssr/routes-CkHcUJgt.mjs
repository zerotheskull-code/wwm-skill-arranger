import { i as __toESM } from "../_runtime.mjs";
import { L as require_react, v as require_jsx_runtime } from "../_libs/@tanstack/react-router+[...].mjs";
import { a as Download, i as GripVertical, n as Trash2, o as Clock, r as Plus } from "../_libs/lucide-react.mjs";
import { t as create } from "../_libs/zustand.mjs";
import { t as clsx } from "../_libs/clsx.mjs";
import { t as twMerge } from "../_libs/tailwind-merge.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/routes-CkHcUJgt.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var AXIS_MOVES = [
	"Q",
	"H",
	"L",
	"飛天",
	"掛",
	"龍捲",
	"挑飛",
	"風墻",
	"3連",
	"5連",
	"騎1",
	"騎2",
	"蛤蟆",
	"笛",
	"葉龍",
	"矢1",
	"矢2",
	"短火",
	"長火",
	"5拳",
	"鐘",
	"卸"
];
var BASIC_MOVES = /* @__PURE__ */ new Set([
	"Q",
	"H",
	"L",
	"飛天",
	"掛"
]);
var COUNTDOWN_MOVES = [
	"酒",
	"笛",
	"風墻",
	"鵝",
	"鐘",
	"Q"
];
var COUNTDOWN_BASIC = /* @__PURE__ */ new Set(["Q"]);
var COUNTDOWN_OPTIONS = [
	{
		value: 0,
		label: "無"
	},
	{
		value: 1,
		label: "1次"
	},
	{
		value: 2,
		label: "2次"
	},
	{
		value: 3,
		label: "3次"
	},
	{
		value: 4,
		label: "4次"
	}
];
var TIANGONG_OPTIONS = [
	"純火",
	"火毒",
	"純毒",
	"毒火"
];
var FUTIE_OPTIONS = [
	"無",
	"鬼掣帖",
	"蝕淵帖",
	"存煞帖",
	"行藏帖",
	"懸解帖",
	"明鑒帖"
];
var XINFA_OPTIONS = [
	"斷石",
	"春雷",
	"所恨"
];
function isBasicMove(name, set = BASIC_MOVES) {
	return set.has(name);
}
function moveKey(axisId, moveIndex) {
	return `${axisId}:${moveIndex}`;
}
function parseMoveKey(key) {
	const i = key.lastIndexOf(":");
	return {
		axisId: key.slice(0, i),
		moveIndex: Number(key.slice(i + 1))
	};
}
/** Greedy lane assignment: reuse a lower lane when intervals no longer overlap. */
function assignLanes(intervals) {
	const laneEnds = [];
	return intervals.map((it) => {
		const right = it.left + it.width;
		for (let i = 0; i < laneEnds.length; i++) if (it.left >= laneEnds[i] - .5) {
			laneEnds[i] = right;
			return i;
		}
		laneEnds.push(right);
		return laneEnds.length - 1;
	});
}
function cn(...inputs) {
	return twMerge(clsx(inputs));
}
function uid(prefix) {
	return `${prefix}-${Math.random().toString(36).slice(2, 9)}`;
}
var defaultOpening = {
	dungeonName: "",
	countdownCount: 0,
	countdownMoves: [],
	tiangong: "",
	futie: "無",
	xinfa: ""
};
var defaultPhases = [
	{
		id: "p-qijie",
		text: "氣竭"
	},
	{
		id: "p-phase2",
		text: "二階段"
	},
	{
		id: "p-blank",
		text: ""
	}
];
var defaultAxes = [
	{
		id: "ax-1",
		number: "1",
		moves: [
			"Q",
			"Q",
			"H",
			"L",
			"掛"
		]
	},
	{
		id: "ax-2",
		number: "2",
		moves: [
			"Q",
			"H",
			"L",
			"掛"
		]
	},
	{
		id: "ax-3",
		number: "3",
		moves: []
	}
];
var usePlanner = create((set, get) => ({
	opening: defaultOpening,
	phases: defaultPhases,
	axes: defaultAxes,
	movePhase: {},
	phaseLocation: {},
	customDraft: {},
	setDungeonName: (dungeonName) => set({ opening: {
		...get().opening,
		dungeonName
	} }),
	setCountdownCount: (countdownCount) => set({ opening: {
		...get().opening,
		countdownCount,
		countdownMoves: countdownCount === 0 ? [] : get().opening.countdownMoves
	} }),
	addCountdownMove: (name) => set({ opening: {
		...get().opening,
		countdownMoves: [...get().opening.countdownMoves.map((m) => {
			const n = Number.parseInt(m.count, 10);
			return {
				...m,
				count: Number.isFinite(n) ? String(n + 1) : m.count
			};
		}), {
			name,
			count: "1"
		}]
	} }),
	removeCountdownMove: (index) => set({ opening: {
		...get().opening,
		countdownMoves: get().opening.countdownMoves.filter((_, i) => i !== index)
	} }),
	setCountdownMoveCount: (index, count) => set({ opening: {
		...get().opening,
		countdownMoves: get().opening.countdownMoves.map((m, i) => i === index ? {
			...m,
			count
		} : m)
	} }),
	setTiangong: (tiangong) => set({ opening: {
		...get().opening,
		tiangong
	} }),
	setFutie: (futie) => set({ opening: {
		...get().opening,
		futie
	} }),
	setXinfa: (xinfa) => set({ opening: {
		...get().opening,
		xinfa
	} }),
	addPhase: () => set({ phases: [...get().phases, {
		id: uid("p"),
		text: ""
	}] }),
	removePhase: (id) => {
		const loc = get().phaseLocation[id];
		const movePhase = { ...get().movePhase };
		const phaseLocation = { ...get().phaseLocation };
		if (loc) delete movePhase[loc];
		delete phaseLocation[id];
		set({
			phases: get().phases.filter((p) => p.id !== id),
			movePhase,
			phaseLocation
		});
	},
	setPhaseText: (id, text) => set({ phases: get().phases.map((p) => p.id === id ? {
		...p,
		text
	} : p) }),
	assignPhase: (phaseId, axisId, moveIndex) => {
		const k = moveKey(axisId, moveIndex);
		const movePhase = { ...get().movePhase };
		const phaseLocation = { ...get().phaseLocation };
		const oldOnMove = movePhase[k];
		if (oldOnMove && oldOnMove !== phaseId) delete phaseLocation[oldOnMove];
		const oldLoc = phaseLocation[phaseId];
		if (oldLoc) delete movePhase[oldLoc];
		movePhase[k] = phaseId;
		phaseLocation[phaseId] = k;
		set({
			movePhase,
			phaseLocation
		});
	},
	addAxis: () => set({ axes: [...get().axes, {
		id: uid("ax"),
		number: String(get().axes.length + 1),
		moves: []
	}] }),
	removeAxis: (id) => {
		const movePhase = {};
		const phaseLocation = {};
		for (const [k, pid] of Object.entries(get().movePhase)) {
			if (parseMoveKey(k).axisId === id) continue;
			movePhase[k] = pid;
			phaseLocation[pid] = k;
		}
		set({
			axes: get().axes.filter((a) => a.id !== id),
			movePhase,
			phaseLocation
		});
	},
	setAxisNumber: (id, number) => set({ axes: get().axes.map((a) => a.id === id ? {
		...a,
		number
	} : a) }),
	addMove: (axisId, name) => set({ axes: get().axes.map((a) => a.id === axisId ? {
		...a,
		moves: [...a.moves, name]
	} : a) }),
	removeMove: (axisId, moveIndex) => {
		const nextMp = {};
		const nextLoc = {};
		for (const [k, pid] of Object.entries(get().movePhase)) {
			const parsed = parseMoveKey(k);
			if (parsed.axisId !== axisId) {
				nextMp[k] = pid;
				nextLoc[pid] = k;
				continue;
			}
			if (parsed.moveIndex === moveIndex) continue;
			const nk = moveKey(axisId, parsed.moveIndex > moveIndex ? parsed.moveIndex - 1 : parsed.moveIndex);
			nextMp[nk] = pid;
			nextLoc[pid] = nk;
		}
		set({
			axes: get().axes.map((a) => a.id === axisId ? {
				...a,
				moves: a.moves.filter((_, i) => i !== moveIndex)
			} : a),
			movePhase: nextMp,
			phaseLocation: nextLoc
		});
	},
	setCustomDraft: (axisId, v) => set({ customDraft: {
		...get().customDraft,
		[axisId]: v
	} }),
	commitCustom: (axisId) => {
		const name = (get().customDraft[axisId] ?? "").trim();
		if (!name) return;
		get().addMove(axisId, name);
		set({ customDraft: {
			...get().customDraft,
			[axisId]: ""
		} });
	}
}));
var PHASE_H = 24;
function PreviewBoard() {
	const { opening, axes, phases, movePhase } = usePlanner();
	const phaseById = Object.fromEntries(phases.map((p) => [p.id, p]));
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		id: "axis-preview",
		className: "w-fit max-w-full rounded-md bg-ink px-3 py-4",
		children: [
			opening.dungeonName.trim() || opening.tiangong || opening.futie && opening.futie !== "無" || opening.xinfa ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mb-3 flex w-fit max-w-full flex-wrap items-center gap-1.5",
				children: [
					opening.dungeonName.trim() ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(MetaChip, {
						tone: "dungeon",
						children: opening.dungeonName.trim()
					}) : null,
					opening.tiangong ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(MetaChip, { children: `天工${opening.tiangong}` }) : null,
					opening.futie && opening.futie !== "無" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(MetaChip, { children: opening.futie }) : null,
					opening.xinfa ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(MetaChip, { children: opening.xinfa }) : null
				]
			}) : null,
			opening.countdownCount > 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mb-4 flex flex-wrap items-center gap-2",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
						className: "inline-flex items-center gap-1.5 rounded-sm border border-line bg-elevated px-2 py-1",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Clock, {
							className: "size-4 text-cd",
							strokeWidth: 2.2
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "text-sm font-medium text-fg",
							children: COUNTDOWN_OPTIONS.find((o) => o.value === opening.countdownCount)?.label ?? `${opening.countdownCount}次`
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "text-sm font-medium text-fg",
						children: ":"
					}),
					opening.countdownMoves.map((move, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
						className: "inline-flex items-center",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "mr-0.5 text-[11px] font-bold tabular-nums text-cd",
							children: move.count
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(MoveBox, {
							name: move.name,
							basic: isBasicMove(move.name, COUNTDOWN_BASIC)
						})]
					}, `${move.name}-${i}`))
				]
			}) : null,
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "flex flex-col gap-4",
				children: axes.filter((axis) => axis.moves.length > 0).map((axis) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AxisPreview, {
					axisId: axis.id,
					number: axis.number,
					moves: axis.moves,
					movePhase,
					phaseById
				}, axis.id))
			})
		]
	});
}
function MetaChip({ children, tone = "default" }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
		className: cn("rounded-xs border px-2 py-1 text-xs leading-none whitespace-nowrap", tone === "dungeon" ? "border-dungeon-edge bg-dungeon text-dungeon-fg" : "border-line bg-elevated text-muted"),
		children
	});
}
function MoveBox({ name, basic, dataMove, moveRef }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		ref: moveRef,
		"data-move": dataMove,
		className: cn("inline-flex shrink-0 items-center justify-center whitespace-nowrap rounded-sm border px-2 py-1 text-sm font-medium leading-none", basic ? "border-basic-edge bg-basic text-fg" : "border-line bg-elevated text-fg"),
		children: name
	});
}
function AxisPreview({ axisId, number, moves, movePhase, phaseById }) {
	const wrapRef = (0, import_react.useRef)(null);
	const moveRefs = (0, import_react.useRef)([]);
	const [placed, setPlaced] = (0, import_react.useState)([]);
	const [padTop, setPadTop] = (0, import_react.useState)(0);
	(0, import_react.useLayoutEffect)(() => {
		const wrap = wrapRef.current;
		if (!wrap) return;
		const wrapRect = wrap.getBoundingClientRect();
		const items = [];
		moves.forEach((_, i) => {
			const pid = movePhase[moveKey(axisId, i)];
			const text = pid ? (phaseById[pid]?.text ?? "").trim() : "";
			if (!text) return;
			const el = moveRefs.current[i];
			if (!el) return;
			const r = el.getBoundingClientRect();
			const probe = document.createElement("span");
			probe.className = "pointer-events-none absolute whitespace-nowrap rounded-xs bg-phase px-2.5 py-1 text-xs leading-none text-phase-fg";
			probe.textContent = text;
			probe.style.visibility = "hidden";
			wrap.appendChild(probe);
			const w = probe.getBoundingClientRect().width;
			wrap.removeChild(probe);
			items.push({
				text,
				left: r.left - wrapRect.left,
				width: w
			});
		});
		const lanes = assignLanes(items);
		const maxLane = items.length ? Math.max(0, ...lanes) : 0;
		const pad = items.length ? (maxLane + 1) * PHASE_H + 4 : 0;
		setPadTop(pad);
		setPlaced(items.map((it, i) => ({
			text: it.text,
			left: it.left,
			lane: lanes[i] ?? 0,
			top: pad - ((lanes[i] ?? 0) + 1) * PHASE_H
		})));
	}, [
		axisId,
		moves,
		movePhase,
		phaseById
	]);
	const chunks = [];
	let i = 0;
	while (i < moves.length) if (isBasicMove(moves[i], BASIC_MOVES)) {
		let j = i;
		while (j < moves.length && isBasicMove(moves[j], BASIC_MOVES)) j++;
		chunks.push({
			start: i,
			end: j,
			basic: true
		});
		i = j;
	} else {
		chunks.push({
			start: i,
			end: i + 1,
			basic: false
		});
		i++;
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		ref: wrapRef,
		className: "relative",
		style: { paddingTop: padTop },
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "flex flex-nowrap items-center gap-2",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "inline-flex h-7 min-w-7 shrink-0 items-center justify-center rounded-sm bg-axis px-1.5 text-xs font-bold leading-none text-fg",
				children: number || "•"
			}), chunks.map((ch, ci) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
				className: "inline-flex items-center gap-2",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: cn("inline-flex items-center", ch.basic ? "gap-0.5" : "gap-2"),
					children: moves.slice(ch.start, ch.end).map((name, off) => {
						const idx = ch.start + off;
						return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(MoveBox, {
							name,
							basic: ch.basic,
							dataMove: idx,
							moveRef: (el) => {
								moveRefs.current[idx] = el;
							}
						}, idx);
					})
				}), ch.end < moves.length ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: "text-subtle",
					children: "›"
				}) : null]
			}, ci))]
		}), placed.map((p, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "pointer-events-none absolute whitespace-nowrap rounded-xs bg-phase px-2.5 py-1 text-xs leading-none text-phase-fg",
			style: {
				left: p.left,
				top: p.top
			},
			children: p.text
		}, `${p.text}-${i}`))]
	});
}
var FONT = "600 14px \"Microsoft JhengHei\",\"PingFang TC\",\"WenQuanYi Zen Hei\",\"Noto Sans TC\",sans-serif";
var FONT_SM = "500 12px \"Microsoft JhengHei\",\"PingFang TC\",\"WenQuanYi Zen Hei\",\"Noto Sans TC\",sans-serif";
var FONT_XS = "700 12px \"Microsoft JhengHei\",\"PingFang TC\",\"WenQuanYi Zen Hei\",\"Noto Sans TC\",sans-serif";
var C = {
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
	subtle: "#6e7480"
};
function fileName(dungeonName) {
	return `${(dungeonName.trim() || "燕雲排軸").replace(/[\\/:*?"<>|]+/g, "_").slice(0, 40)}.png`;
}
function roundRect(ctx, x, y, w, h, r) {
	const radius = Math.min(r, w / 2, h / 2);
	ctx.beginPath();
	ctx.moveTo(x + radius, y);
	ctx.arcTo(x + w, y, x + w, y + h, radius);
	ctx.arcTo(x + w, y + h, x, y + h, radius);
	ctx.arcTo(x, y + h, x, y, radius);
	ctx.arcTo(x, y, x + w, y, radius);
	ctx.closePath();
}
function fillChip(ctx, text, x, y, font, bg, fg, border, padX = 8, padY = 5) {
	ctx.font = font;
	const metrics = ctx.measureText(text);
	const tw = Math.ceil(metrics.width);
	const th = Math.max(12, Math.ceil((metrics.actualBoundingBoxAscent ?? 10) + (metrics.actualBoundingBoxDescent ?? 3)));
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
	ctx.fillText(text, x + padX, y + h / 2 + .5);
	return {
		w,
		h
	};
}
function drawClock(ctx, x, y, size) {
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
function chunkMoves(moves) {
	const chunks = [];
	let i = 0;
	while (i < moves.length) if (isBasicMove(moves[i])) {
		let j = i;
		while (j < moves.length && isBasicMove(moves[j])) j++;
		chunks.push({
			start: i,
			end: j,
			basic: true
		});
		i = j;
	} else {
		chunks.push({
			start: i,
			end: i + 1,
			basic: false
		});
		i++;
	}
	return chunks;
}
function renderPreviewCanvas(snap) {
	const measure = document.createElement("canvas").getContext("2d");
	if (!measure) throw new Error("無法建立畫布");
	const axes = snap.axes.filter((a) => a.moves.length > 0);
	const phaseById = Object.fromEntries(snap.phases.map((p) => [p.id, p]));
	const opening = snap.opening;
	const moveH = 26;
	const axisN = 26;
	const pad = 12;
	const gap = 6;
	const chips = [];
	if (opening.dungeonName.trim()) chips.push({
		text: opening.dungeonName.trim(),
		bg: C.dungeon,
		fg: C.dungeonFg,
		border: C.dungeonEdge
	});
	if (opening.tiangong) chips.push({
		text: `天工${opening.tiangong}`,
		bg: C.elevated,
		fg: C.muted,
		border: C.line
	});
	if (opening.futie && opening.futie !== "無") chips.push({
		text: opening.futie,
		bg: C.elevated,
		fg: C.muted,
		border: C.line
	});
	if (opening.xinfa) chips.push({
		text: opening.xinfa,
		bg: C.elevated,
		fg: C.muted,
		border: C.line
	});
	measure.font = FONT_SM;
	let metaW = 0;
	chips.forEach((c, i) => {
		metaW += Math.ceil(measure.measureText(c.text).width) + 16 + (i ? gap : 0);
	});
	let cdW = 0;
	if (opening.countdownCount > 0) {
		const label = COUNTDOWN_OPTIONS.find((o) => o.value === opening.countdownCount)?.label ?? `${opening.countdownCount}次`;
		measure.font = FONT_SM;
		cdW = 26 + Math.ceil(measure.measureText(label).width) + 16 + 14;
		opening.countdownMoves.forEach((m) => {
			measure.font = FONT_XS;
			const nw = Math.ceil(measure.measureText(m.count).width);
			measure.font = FONT;
			const mw = Math.ceil(measure.measureText(m.name).width) + 16;
			cdW += 8 + nw + 4 + mw;
		});
	}
	const axisLayouts = axes.map((axis) => {
		const chunks = chunkMoves(axis.moves);
		measure.font = FONT;
		const moveW = axis.moves.map((name) => Math.ceil(measure.measureText(name).width) + 16);
		const lefts = [];
		let x = 34;
		chunks.forEach((ch, ci) => {
			const innerGap = ch.basic ? 2 : 8;
			for (let i = ch.start; i < ch.end; i++) {
				lefts[i] = x;
				x += moveW[i] + (i < ch.end - 1 ? innerGap : 0);
			}
			if (ci < chunks.length - 1) x += 18;
		});
		const rowW = x;
		const items = [];
		axis.moves.forEach((_, i) => {
			const pid = snap.movePhase[moveKey(axis.id, i)];
			const text = pid ? (phaseById[pid]?.text ?? "").trim() : "";
			if (!text) return;
			measure.font = FONT_SM;
			items.push({
				text,
				left: lefts[i],
				width: Math.ceil(measure.measureText(text).width) + 16
			});
		});
		const lanes = assignLanes(items);
		const placed = items.map((it, i) => ({
			...it,
			lane: lanes[i] ?? 0
		}));
		const maxLane = placed.length ? Math.max(0, ...placed.map((p) => p.lane)) : -1;
		return {
			axis,
			chunks,
			moveW,
			lefts,
			rowW,
			placed,
			phasePad: maxLane >= 0 ? (maxLane + 1) * 24 : 0
		};
	});
	const contentW = Math.max(metaW, cdW, ...axisLayouts.map((a) => a.rowW), 40);
	const hasMeta = chips.length > 0;
	const hasCd = opening.countdownCount > 0;
	let contentH = 0;
	if (hasMeta) contentH += 32;
	if (hasCd) contentH += 38;
	axisLayouts.forEach((a, i) => {
		contentH += a.phasePad + moveH + (i < axisLayouts.length - 1 ? 16 : 0);
	});
	if (contentH === 0) contentH = 40;
	const W = Math.ceil(contentW + 24);
	const H = Math.ceil(contentH + 24);
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
		y += 32;
	}
	if (hasCd) {
		x = pad;
		const label = COUNTDOWN_OPTIONS.find((o) => o.value === opening.countdownCount)?.label ?? `${opening.countdownCount}次`;
		ctx.font = FONT_SM;
		const boxW = 26 + Math.ceil(ctx.measureText(label).width) + 16;
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
		ctx.fillText(label, x + 26, y + boxH / 2 + .5);
		x += boxW + 8;
		ctx.fillStyle = C.fg;
		ctx.font = FONT;
		ctx.fillText(":", x, y + boxH / 2 + .5);
		x += 12;
		opening.countdownMoves.forEach((m) => {
			ctx.font = FONT_XS;
			ctx.fillStyle = C.cd;
			const nw = Math.ceil(ctx.measureText(m.count).width);
			ctx.fillText(m.count, x, y + boxH / 2 + .5);
			x += nw + 3;
			const basic = isBasicMove(m.name, COUNTDOWN_BASIC);
			const r = fillChip(ctx, m.name, x, y + 1, FONT, basic ? C.basic : C.elevated, C.fg, basic ? C.basicEdge : C.line, 8, 5);
			x += r.w + 8;
		});
		y += 38;
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
		ctx.fillText(layout.axis.number || "•", x + axisN / 2, rowY + axisN / 2 + .5);
		ctx.textAlign = "left";
		layout.axis.moves.forEach((name, i) => {
			const basic = isBasicMove(name);
			fillChip(ctx, name, pad + layout.lefts[i], rowY + 0, FONT, basic ? C.basic : C.elevated, C.fg, basic ? C.basicEdge : C.line, 8, 6);
		});
		layout.chunks.forEach((ch, ci) => {
			if (ci === layout.chunks.length - 1) return;
			const last = ch.end - 1;
			const x1 = pad + layout.lefts[last] + layout.moveW[last];
			const x2 = pad + layout.lefts[ch.end];
			ctx.fillStyle = C.subtle;
			ctx.font = FONT;
			ctx.textAlign = "center";
			ctx.fillText("›", (x1 + x2) / 2, rowY + axisN / 2 + .5);
			ctx.textAlign = "left";
		});
		layout.placed.forEach((p) => {
			const top = rowY - (p.lane + 1) * 24;
			fillChip(ctx, p.text, pad + p.left, top, FONT_SM, C.phase, C.phaseFg, C.phase, 8, 4);
		});
		y += moveH + (i < axisLayouts.length - 1 ? 16 : 0);
	});
	return canvas;
}
async function downloadPreviewPng(snap) {
	const canvas = renderPreviewCanvas(snap);
	const a = document.createElement("a");
	a.href = canvas.toDataURL("image/png");
	a.download = fileName(snap.opening.dungeonName);
	a.click();
}
function PlannerApp() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "min-h-svh bg-ink px-4 py-5 text-fg sm:px-6",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "mx-auto max-w-[1400px]",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
				className: "mb-4 text-xl font-semibold tracking-tight",
				children: "燕雲競速排軸器"
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "grid grid-cols-1 gap-5 lg:grid-cols-2",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
					className: "rounded-lg border border-line bg-surface p-4",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(OpeningBlock, {}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PhaseBlock, {}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(AxisList, {}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "mt-3 flex justify-center",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AddAxisButton, {})
						})
					]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
					className: "rounded-lg border border-line bg-surface p-4",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "mb-3 flex flex-wrap items-center justify-between gap-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
							className: "text-sm font-medium text-muted",
							children: "即時預覽"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ExportPngButton, {})]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(PreviewBoard, {})]
				})]
			})]
		})
	});
}
function FieldLabel({ children }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
		className: "text-sm text-muted",
		children
	});
}
function NativeSelect({ value, onChange, options, placeholder }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("select", {
		value: String(value),
		onChange: (e) => onChange(e.target.value),
		className: "h-9 min-w-24 rounded-sm border border-line bg-well px-2 text-sm text-fg outline-none focus:border-accent",
		children: [placeholder ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
			value: "",
			children: placeholder
		}) : null, options.map((o) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
			value: o.value,
			children: o.label
		}, o.value))]
	});
}
function OpeningBlock() {
	const { opening, setDungeonName, setCountdownCount, addCountdownMove, removeCountdownMove, setCountdownMoveCount, setTiangong, setFutie, setXinfa } = usePlanner();
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "mb-4 space-y-3",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FieldLabel, { children: "開局注意事項" }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex flex-wrap items-center gap-2",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
						value: opening.dungeonName,
						onChange: (e) => setDungeonName(e.target.value),
						placeholder: "副本名稱",
						className: "h-9 min-w-40 flex-1 rounded-sm border border-line bg-well px-3 text-sm text-fg outline-none placeholder:text-subtle focus:border-accent"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center gap-1.5",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FieldLabel, { children: "天工：" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(NativeSelect, {
							value: opening.tiangong,
							onChange: setTiangong,
							placeholder: "選擇",
							options: TIANGONG_OPTIONS.map((o) => ({
								value: o,
								label: o
							}))
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center gap-1.5",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FieldLabel, { children: "符帖：" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(NativeSelect, {
							value: opening.futie,
							onChange: setFutie,
							options: FUTIE_OPTIONS.map((o) => ({
								value: o,
								label: o
							}))
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center gap-1.5",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FieldLabel, { children: "心法：" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(NativeSelect, {
							value: opening.xinfa,
							onChange: setXinfa,
							placeholder: "選擇",
							options: XINFA_OPTIONS.map((o) => ({
								value: o,
								label: o
							}))
						})]
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex flex-wrap items-center gap-2",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FieldLabel, { children: "倒數次數：" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(NativeSelect, {
					value: opening.countdownCount,
					onChange: (v) => setCountdownCount(Number(v)),
					options: COUNTDOWN_OPTIONS.map((o) => ({
						value: String(o.value),
						label: o.label
					}))
				})]
			}),
			opening.countdownCount > 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CountdownEditor, {
				moves: opening.countdownMoves,
				onAdd: addCountdownMove,
				onRemove: removeCountdownMove,
				onCountChange: setCountdownMoveCount
			}) : null
		]
	});
}
function CountdownEditor({ moves, onAdd, onRemove, onCountChange }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "rounded-md border border-line bg-well p-3",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "mb-2 flex min-h-8 flex-wrap items-center gap-1.5",
			children: moves.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				className: "text-sm text-subtle",
				children: "尚未新增倒數招式"
			}) : moves.map((m, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
				className: "inline-flex items-center gap-1",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
					value: m.count,
					title: "可自行修改倒數數字",
					onChange: (e) => onCountChange(i, e.target.value),
					className: "h-6 w-7 rounded-xs border border-cd/50 bg-ink text-center text-xs font-bold tabular-nums text-cd outline-none focus:border-cd"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
					className: cn("inline-flex items-center gap-1 rounded-sm border px-1.5 py-0.5 text-xs", isBasicMove(m.name, COUNTDOWN_BASIC) ? "border-basic-edge bg-basic" : "border-line bg-elevated"),
					children: [m.name, /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						type: "button",
						className: "text-danger",
						onClick: () => onRemove(i),
						"aria-label": "移除",
						children: "×"
					})]
				})]
			}, `${m.name}-${i}`))
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "flex flex-wrap gap-1.5",
			children: COUNTDOWN_MOVES.map((opt) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
				type: "button",
				onClick: () => onAdd(opt),
				className: cn("rounded-sm border px-2.5 py-1 text-xs", isBasicMove(opt, COUNTDOWN_BASIC) ? "border-basic-edge bg-basic/40 hover:bg-basic/70" : "border-line bg-elevated hover:border-accent"),
				children: opt
			}, opt))
		})]
	});
}
function PhaseBlock() {
	const { phases, phaseLocation, axes, addPhase, removePhase, setPhaseText } = usePlanner();
	function locLabel(phaseId) {
		const k = phaseLocation[phaseId];
		if (!k) return "未放置";
		const [axisId, idx] = [k.slice(0, k.lastIndexOf(":")), Number(k.slice(k.lastIndexOf(":") + 1))];
		const axis = axes.find((a) => a.id === axisId);
		if (!axis || !axis.moves[idx]) return "未放置";
		return `軸${axis.number} · ${axis.moves[idx]}`;
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "mb-4 rounded-md border border-line bg-well p-3",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "mb-2 flex items-center justify-between gap-2",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				className: "text-sm text-muted",
				children: "階段（拖到下方招式上，每個招式最多一個）"
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
				type: "button",
				onClick: addPhase,
				className: "inline-flex h-8 items-center gap-1 rounded-sm bg-accent px-2.5 text-xs font-medium text-accent-fg",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Plus, { className: "size-3.5" }), "新增階段"]
			})]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "flex flex-col gap-2",
			children: phases.map((p) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex items-center gap-2 rounded-sm border border-line bg-elevated px-2 py-1.5",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						draggable: true,
						title: "拖到招式上",
						className: "cursor-grab text-muted active:cursor-grabbing",
						onDragStart: (e) => {
							e.dataTransfer.setData("text/plain", p.id);
							e.dataTransfer.effectAllowed = "move";
						},
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(GripVertical, { className: "size-4" })
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
						value: p.text,
						placeholder: "例如 氣竭、二階段",
						onChange: (e) => setPhaseText(p.id, e.target.value),
						className: "h-8 min-w-0 flex-1 rounded-xs border border-line bg-well px-2 text-sm text-fg outline-none placeholder:text-subtle focus:border-accent"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "max-w-28 truncate text-[11px] text-subtle",
						children: locLabel(p.id)
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						type: "button",
						onClick: () => removePhase(p.id),
						className: "rounded-xs border border-danger-edge bg-danger-bg px-2 py-1 text-xs text-danger",
						children: "刪"
					})
				]
			}, p.id))
		})]
	});
}
function AxisList() {
	const { axes, addAxis } = usePlanner();
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "flex flex-col gap-3",
		children: axes.map((axis) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AxisEditor, { axisId: axis.id }, axis.id))
	});
}
function AddAxisButton() {
	const addAxis = usePlanner((s) => s.addAxis);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
		type: "button",
		onClick: addAxis,
		className: "inline-flex h-9 items-center gap-1 rounded-sm bg-accent px-4 text-sm font-medium text-accent-fg",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Plus, { className: "size-4" }), "新增軸"]
	});
}
function ExportPngButton() {
	const opening = usePlanner((s) => s.opening);
	const axes = usePlanner((s) => s.axes);
	const phases = usePlanner((s) => s.phases);
	const movePhase = usePlanner((s) => s.movePhase);
	const [busy, setBusy] = (0, import_react.useState)(false);
	const [err, setErr] = (0, import_react.useState)("");
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "flex items-center gap-2",
		children: [err ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
			className: "text-xs text-danger",
			children: err
		}) : null, /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
			type: "button",
			disabled: busy,
			onClick: async () => {
				setErr("");
				setBusy(true);
				try {
					await downloadPreviewPng({
						opening,
						axes,
						phases,
						movePhase
					});
				} catch {
					setErr("匯出失敗，請再試一次");
				} finally {
					setBusy(false);
				}
			},
			className: "inline-flex h-9 items-center gap-1.5 rounded-sm bg-accent px-3 text-sm font-medium text-accent-fg disabled:opacity-60",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Download, { className: "size-4" }), busy ? "匯出中…" : "下載 PNG"]
		})]
	});
}
function AxisEditor({ axisId }) {
	const axis = usePlanner((s) => s.axes.find((a) => a.id === axisId));
	const movePhase = usePlanner((s) => s.movePhase);
	const assignPhase = usePlanner((s) => s.assignPhase);
	const removeAxis = usePlanner((s) => s.removeAxis);
	const setAxisNumber = usePlanner((s) => s.setAxisNumber);
	const addMove = usePlanner((s) => s.addMove);
	const removeMove = usePlanner((s) => s.removeMove);
	const customDraft = usePlanner((s) => s.customDraft[axisId] ?? "");
	const setCustomDraft = usePlanner((s) => s.setCustomDraft);
	const commitCustom = usePlanner((s) => s.commitCustom);
	const [showCustom, setShowCustom] = (0, import_react.useState)(false);
	const [dropIdx, setDropIdx] = (0, import_react.useState)(null);
	if (!axis) return null;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "flex items-stretch gap-2.5",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "min-w-0 flex-1 rounded-md border border-line bg-well p-3",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mb-2 flex flex-wrap items-start gap-2",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-center gap-1.5",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "text-sm text-muted",
						children: "軸："
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
						value: axis.number,
						title: "可自行修改軸編號",
						onChange: (e) => setAxisNumber(axisId, e.target.value),
						className: "h-8 w-11 rounded-sm border-2 border-axis bg-axis-well text-center text-sm font-bold text-fg outline-none focus:border-accent"
					})]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "flex min-h-8 flex-1 flex-wrap items-center gap-1.5",
					children: axis.moves.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "text-sm text-subtle",
						children: "尚未新增招式"
					}) : axis.moves.map((m, i) => {
						const has = !!movePhase[moveKey(axisId, i)];
						return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
							className: "inline-flex items-center gap-1",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
								onDragOver: (e) => {
									e.preventDefault();
									setDropIdx(i);
								},
								onDragLeave: () => setDropIdx(null),
								onDrop: (e) => {
									e.preventDefault();
									setDropIdx(null);
									const pid = e.dataTransfer.getData("text/plain");
									if (pid) assignPhase(pid, axisId, i);
								},
								className: cn("inline-flex items-center gap-1 rounded-sm border px-1.5 py-0.5 text-xs", isBasicMove(m, BASIC_MOVES) ? "border-basic-edge bg-basic" : "border-line bg-elevated", has && "ring-1 ring-axis/70", dropIdx === i && "ring-2 ring-accent"),
								children: [m, /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
									type: "button",
									className: "text-danger",
									onClick: () => removeMove(axisId, i),
									children: "×"
								})]
							}), i < axis.moves.length - 1 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "text-subtle",
								children: "›"
							}) : null]
						}, `${m}-${i}`);
					})
				})]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex flex-wrap gap-1.5",
				children: [AXIS_MOVES.map((opt) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					type: "button",
					onClick: () => addMove(axisId, opt),
					className: cn("rounded-sm border px-2 py-1 text-xs", isBasicMove(opt, BASIC_MOVES) ? "border-basic-edge bg-basic/40 hover:bg-basic/70" : "border-line bg-elevated hover:border-accent"),
					children: opt
				}, opt)), showCustom ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
					className: "inline-flex items-center gap-1",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
						autoFocus: true,
						value: customDraft,
						placeholder: "自訂名稱",
						onChange: (e) => setCustomDraft(axisId, e.target.value),
						onKeyDown: (e) => {
							if (e.key === "Enter") {
								commitCustom(axisId);
								setShowCustom(false);
							}
						},
						className: "h-7 w-24 rounded-xs border border-line bg-ink px-2 text-xs outline-none focus:border-accent"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						type: "button",
						className: "h-7 rounded-xs bg-accent px-2 text-xs text-accent-fg",
						onClick: () => {
							commitCustom(axisId);
							setShowCustom(false);
						},
						children: "加入"
					})]
				}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					type: "button",
					onClick: () => setShowCustom(true),
					className: "rounded-sm border border-dashed border-line px-2 py-1 text-xs text-muted hover:border-accent",
					children: "自訂…"
				})]
			})]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "flex items-center",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
				type: "button",
				onClick: () => removeAxis(axisId),
				className: "inline-flex h-9 items-center gap-1 rounded-sm border border-danger-edge bg-danger-bg px-3 text-sm text-danger",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Trash2, { className: "size-3.5" }), "刪軸"]
			})
		})]
	});
}
function Home() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(PlannerApp, {});
}
//#endregion
export { Home as component };
