import { create } from "zustand";
import {
  type AxisRow,
  type Opening,
  type Phase,
  moveKey,
  parseMoveKey,
} from "@/lib/planner";
import { uid } from "@/lib/utils";

type PlannerState = {
  opening: Opening;
  phases: Phase[];
  axes: AxisRow[];
  /** moveKey -> phaseId */
  movePhase: Record<string, string>;
  /** phaseId -> moveKey */
  phaseLocation: Record<string, string>;
  customDraft: Record<string, string>;
  setDungeonName: (v: string) => void;
  setCountdownCount: (v: Opening["countdownCount"]) => void;
  addCountdownMove: (name: string) => void;
  removeCountdownMove: (index: number) => void;
  setCountdownMoveCount: (index: number, count: string) => void;
  setTiangong: (v: string) => void;
  setFutie: (v: string) => void;
  setXinfa: (v: string) => void;
  addCustomTag: () => void;
  setCustomTag: (index: number, text: string) => void;
  removeCustomTag: (index: number) => void;
  addPhase: () => void;
  removePhase: (id: string) => void;
  setPhaseText: (id: string, text: string) => void;
  assignPhase: (phaseId: string, axisId: string, moveIndex: number) => void;
  addAxis: () => void;
  removeAxis: (id: string) => void;
  setAxisNumber: (id: string, number: string) => void;
  addMove: (axisId: string, name: string) => void;
  removeMove: (axisId: string, moveIndex: number) => void;
  setCustomDraft: (axisId: string, v: string) => void;
  commitCustom: (axisId: string) => void;
};

const defaultOpening: Opening = {
  dungeonName: "",
  countdownCount: 0,
  countdownMoves: [],
  tiangong: "",
  futie: "無",
  xinfa: "",
  customTags: [],
};

const defaultPhases: Phase[] = [
  { id: "p-qijie", text: "氣竭" },
  { id: "p-phase2", text: "二階段" },
  { id: "p-blank", text: "" },
];

const defaultAxes: AxisRow[] = [
  { id: "ax-1", number: "1", moves: ["Q", "Q", "H", "L", "掛"] },
  { id: "ax-2", number: "2", moves: ["Q", "H", "L", "掛"] },
  { id: "ax-3", number: "3", moves: [] },
];

export const usePlanner = create<PlannerState>((set, get) => ({
  opening: defaultOpening,
  phases: defaultPhases,
  axes: defaultAxes,
  movePhase: {},
  phaseLocation: {},
  customDraft: {},

  setDungeonName: (dungeonName) =>
    set({ opening: { ...get().opening, dungeonName } }),
  setCountdownCount: (countdownCount) =>
    set({
      opening: {
        ...get().opening,
        countdownCount,
        countdownMoves:
          countdownCount === 0 ? [] : get().opening.countdownMoves,
      },
    }),
  addCountdownMove: (name) =>
    set({
      opening: {
        ...get().opening,
        countdownMoves: [
          ...get().opening.countdownMoves.map((m) => {
            const n = Number.parseInt(m.count, 10);
            return {
              ...m,
              count: Number.isFinite(n) ? String(n + 1) : m.count,
            };
          }),
          { name, count: "1" },
        ],
      },
    }),
  removeCountdownMove: (index) =>
    set({
      opening: {
        ...get().opening,
        countdownMoves: get().opening.countdownMoves.filter((_, i) => i !== index),
      },
    }),
  setCountdownMoveCount: (index, count) =>
    set({
      opening: {
        ...get().opening,
        countdownMoves: get().opening.countdownMoves.map((m, i) =>
          i === index ? { ...m, count } : m,
        ),
      },
    }),
  setTiangong: (tiangong) =>
    set({ opening: { ...get().opening, tiangong } }),
  setFutie: (futie) => set({ opening: { ...get().opening, futie } }),
  setXinfa: (xinfa) => set({ opening: { ...get().opening, xinfa } }),
  addCustomTag: () =>
    set({
      opening: {
        ...get().opening,
        customTags: [...get().opening.customTags, ""],
      },
    }),
  setCustomTag: (index, text) =>
    set({
      opening: {
        ...get().opening,
        customTags: get().opening.customTags.map((t, i) =>
          i === index ? text : t,
        ),
      },
    }),
  removeCustomTag: (index) =>
    set({
      opening: {
        ...get().opening,
        customTags: get().opening.customTags.filter((_, i) => i !== index),
      },
    }),

  addPhase: () =>
    set({ phases: [...get().phases, { id: uid("p"), text: "" }] }),
  removePhase: (id) => {
    const loc = get().phaseLocation[id];
    const movePhase = { ...get().movePhase };
    const phaseLocation = { ...get().phaseLocation };
    if (loc) delete movePhase[loc];
    delete phaseLocation[id];
    set({
      phases: get().phases.filter((p) => p.id !== id),
      movePhase,
      phaseLocation,
    });
  },
  setPhaseText: (id, text) =>
    set({
      phases: get().phases.map((p) => (p.id === id ? { ...p, text } : p)),
    }),
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
    set({ movePhase, phaseLocation });
  },

  addAxis: () =>
    set({
      axes: [
        ...get().axes,
        { id: uid("ax"), number: String(get().axes.length + 1), moves: [] },
      ],
    }),
  removeAxis: (id) => {
    const movePhase: Record<string, string> = {};
    const phaseLocation: Record<string, string> = {};
    for (const [k, pid] of Object.entries(get().movePhase)) {
      const parsed = parseMoveKey(k);
      if (parsed.axisId === id) continue;
      movePhase[k] = pid;
      phaseLocation[pid] = k;
    }
    set({
      axes: get().axes.filter((a) => a.id !== id),
      movePhase,
      phaseLocation,
    });
  },
  setAxisNumber: (id, number) =>
    set({
      axes: get().axes.map((a) => (a.id === id ? { ...a, number } : a)),
    }),
  addMove: (axisId, name) =>
    set({
      axes: get().axes.map((a) =>
        a.id === axisId ? { ...a, moves: [...a.moves, name] } : a,
      ),
    }),
  removeMove: (axisId, moveIndex) => {
    const nextMp: Record<string, string> = {};
    const nextLoc: Record<string, string> = {};
    for (const [k, pid] of Object.entries(get().movePhase)) {
      const parsed = parseMoveKey(k);
      if (parsed.axisId !== axisId) {
        nextMp[k] = pid;
        nextLoc[pid] = k;
        continue;
      }
      if (parsed.moveIndex === moveIndex) continue;
      const nm =
        parsed.moveIndex > moveIndex
          ? parsed.moveIndex - 1
          : parsed.moveIndex;
      const nk = moveKey(axisId, nm);
      nextMp[nk] = pid;
      nextLoc[pid] = nk;
    }
    set({
      axes: get().axes.map((a) =>
        a.id === axisId
          ? { ...a, moves: a.moves.filter((_, i) => i !== moveIndex) }
          : a,
      ),
      movePhase: nextMp,
      phaseLocation: nextLoc,
    });
  },
  setCustomDraft: (axisId, v) =>
    set({ customDraft: { ...get().customDraft, [axisId]: v } }),
  commitCustom: (axisId) => {
    const name = (get().customDraft[axisId] ?? "").trim();
    if (!name) return;
    get().addMove(axisId, name);
    set({ customDraft: { ...get().customDraft, [axisId]: "" } });
  },
}));
