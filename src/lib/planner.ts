export const AXIS_MOVES = [
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
  "解",
  "鐘",
  "卸",
  "閃",
] as const;

export const BASIC_MOVES = new Set(["Q", "H", "L", "飛天", "掛"]);

export const COUNTDOWN_MOVES = ["酒", "笛", "風墻", "鵝", "鐘", "Q"] as const;
export const COUNTDOWN_BASIC = new Set(["Q"]);

export const COUNTDOWN_OPTIONS = [
  { value: 0, label: "無" },
  { value: 1, label: "1次" },
  { value: 2, label: "2次" },
  { value: 3, label: "3次" },
  { value: 4, label: "4次" },
] as const;

export const TIANGONG_OPTIONS = ["純火", "火毒", "純毒", "毒火"] as const;
export const FUTIE_OPTIONS = [
  "無",
  "鬼掣帖",
  "蝕淵帖",
  "存煞帖",
  "行藏帖",
  "懸解帖",
  "明鑒帖",
] as const;
export const XINFA_OPTIONS = ["斷石", "春雷", "所恨"] as const;

export type AxisRow = {
  id: string;
  number: string;
  moves: string[];
};

export type Phase = {
  id: string;
  text: string;
};

export type CountdownMove = {
  name: string;
  count: string;
};

export type Opening = {
  dungeonName: string;
  countdownCount: 0 | 1 | 2 | 3 | 4;
  countdownMoves: CountdownMove[];
  tiangong: string;
  futie: string;
  xinfa: string;
  customTags: string[];
};

export function isBasicMove(name: string, set: Set<string> = BASIC_MOVES) {
  return set.has(name);
}

export function moveKey(axisId: string, moveIndex: number) {
  return `${axisId}:${moveIndex}`;
}

export function parseMoveKey(key: string) {
  const i = key.lastIndexOf(":");
  return { axisId: key.slice(0, i), moveIndex: Number(key.slice(i + 1)) };
}

/** Greedy lane assignment: reuse a lower lane when intervals no longer overlap. */
export function assignLanes(
  intervals: { left: number; width: number }[],
): number[] {
  const laneEnds: number[] = [];
  return intervals.map((it) => {
    const right = it.left + it.width;
    for (let i = 0; i < laneEnds.length; i++) {
      if (it.left >= laneEnds[i] - 0.5) {
        laneEnds[i] = right;
        return i;
      }
    }
    laneEnds.push(right);
    return laneEnds.length - 1;
  });
}
