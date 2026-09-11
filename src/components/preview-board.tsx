import { useLayoutEffect, useRef, useState } from "react";
import { Clock } from "lucide-react";
import { assignLanes, isBasicMove, moveKey, BASIC_MOVES, COUNTDOWN_BASIC, COUNTDOWN_OPTIONS } from "@/lib/planner";
import { usePlanner } from "@/lib/planner-store";
import { cn } from "@/lib/utils";

const PHASE_H = 24;

export function PreviewBoard() {
  const { opening, axes, phases, movePhase } = usePlanner();
  const phaseById = Object.fromEntries(phases.map((p) => [p.id, p]));

  return (
    <div
      id="axis-preview"
      className="w-fit max-w-full rounded-md bg-ink px-3 py-4"
    >
      {opening.dungeonName.trim() ||
      opening.tiangong ||
      (opening.futie && opening.futie !== "無") ||
      opening.xinfa ? (
        <div className="mb-3 flex w-fit max-w-full flex-wrap items-center gap-1.5">
          {opening.dungeonName.trim() ? (
            <MetaChip tone="dungeon">{opening.dungeonName.trim()}</MetaChip>
          ) : null}
          {opening.tiangong ? (
            <MetaChip>{`天工${opening.tiangong}`}</MetaChip>
          ) : null}
          {opening.futie && opening.futie !== "無" ? (
            <MetaChip>{opening.futie}</MetaChip>
          ) : null}
          {opening.xinfa ? <MetaChip>{opening.xinfa}</MetaChip> : null}
        </div>
      ) : null}

      {opening.countdownCount > 0 ? (
        <div className="mb-4 flex flex-wrap items-center gap-2">
          <span className="inline-flex items-center gap-1.5 rounded-sm border border-line bg-elevated px-2 py-1">
            <Clock className="size-4 text-cd" strokeWidth={2.2} />
            <span className="text-sm font-medium text-fg">
              {COUNTDOWN_OPTIONS.find((o) => o.value === opening.countdownCount)
                ?.label ?? `${opening.countdownCount}次`}
            </span>
          </span>
          <span className="text-sm font-medium text-fg">:</span>
          {opening.countdownMoves.map((move, i) => (
            <span key={`${move.name}-${i}`} className="inline-flex items-center">
              <span className="mr-0.5 text-[11px] font-bold tabular-nums text-cd">
                {move.count}
              </span>
              <MoveBox
                name={move.name}
                basic={isBasicMove(move.name, COUNTDOWN_BASIC)}
              />
            </span>
          ))}
        </div>
      ) : null}

      <div className="flex flex-col gap-4">
        {axes
          .filter((axis) => axis.moves.length > 0)
          .map((axis) => (
          <AxisPreview
            key={axis.id}
            axisId={axis.id}
            number={axis.number}
            moves={axis.moves}
            movePhase={movePhase}
            phaseById={phaseById}
          />
        ))}
      </div>
    </div>
  );
}

function MetaChip({
  children,
  tone = "default",
}: {
  children: string;
  tone?: "default" | "dungeon";
}) {
  return (
    <span
      className={cn(
        "rounded-xs border px-2 py-1 text-xs leading-none whitespace-nowrap",
        tone === "dungeon"
          ? "border-dungeon-edge bg-dungeon text-dungeon-fg"
          : "border-line bg-elevated text-muted",
      )}
    >
      {children}
    </span>
  );
}

function MoveBox({
  name,
  basic,
  dataMove,
  moveRef,
}: {
  name: string;
  basic?: boolean;
  dataMove?: number;
  moveRef?: (el: HTMLDivElement | null) => void;
}) {
  return (
    <div
      ref={moveRef}
      data-move={dataMove}
      className={cn(
        "inline-flex shrink-0 items-center justify-center whitespace-nowrap rounded-sm border px-2 py-1 text-sm font-medium leading-none",
        basic
          ? "border-basic-edge bg-basic text-fg"
          : "border-line bg-elevated text-fg",
      )}
    >
      {name}
    </div>
  );
}

function AxisPreview({
  axisId,
  number,
  moves,
  movePhase,
  phaseById,
}: {
  axisId: string;
  number: string;
  moves: string[];
  movePhase: Record<string, string>;
  phaseById: Record<string, { id: string; text: string }>;
}) {
  const wrapRef = useRef<HTMLDivElement>(null);
  const moveRefs = useRef<(HTMLDivElement | null)[]>([]);
  const [placed, setPlaced] = useState<
    { text: string; left: number; top: number; lane: number }[]
  >([]);
  const [padTop, setPadTop] = useState(0);

  useLayoutEffect(() => {
    const wrap = wrapRef.current;
    if (!wrap) return;
    const wrapRect = wrap.getBoundingClientRect();

    const items: { text: string; left: number; width: number }[] = [];
    moves.forEach((_, i) => {
      const pid = movePhase[moveKey(axisId, i)];
      const text = pid ? (phaseById[pid]?.text ?? "").trim() : "";
      if (!text) return;
      const el = moveRefs.current[i];
      if (!el) return;
      const r = el.getBoundingClientRect();
      const probe = document.createElement("span");
      probe.className =
        "pointer-events-none absolute whitespace-nowrap rounded-xs bg-phase px-2.5 py-1 text-xs leading-none text-phase-fg";
      probe.textContent = text;
      probe.style.visibility = "hidden";
      wrap.appendChild(probe);
      const w = probe.getBoundingClientRect().width;
      wrap.removeChild(probe);
      items.push({ text, left: r.left - wrapRect.left, width: w });
    });

    const lanes = assignLanes(items);
    const maxLane = items.length ? Math.max(0, ...lanes) : 0;
    const pad = items.length ? (maxLane + 1) * PHASE_H + 4 : 0;
    setPadTop(pad);
    setPlaced(
      items.map((it, i) => ({
        text: it.text,
        left: it.left,
        lane: lanes[i] ?? 0,
        top: pad - ((lanes[i] ?? 0) + 1) * PHASE_H,
      })),
    );
  }, [axisId, moves, movePhase, phaseById]);

  const chunks: { start: number; end: number; basic: boolean }[] = [];
  let i = 0;
  while (i < moves.length) {
    const basic = isBasicMove(moves[i], BASIC_MOVES);
    if (basic) {
      let j = i;
      while (j < moves.length && isBasicMove(moves[j], BASIC_MOVES)) j++;
      chunks.push({ start: i, end: j, basic: true });
      i = j;
    } else {
      chunks.push({ start: i, end: i + 1, basic: false });
      i++;
    }
  }

  return (
    <div
      ref={wrapRef}
      className="relative"
      style={{ paddingTop: padTop }}
    >
      <div className="flex flex-nowrap items-center gap-2">
        <div className="inline-flex h-7 min-w-7 shrink-0 items-center justify-center rounded-sm bg-axis px-1.5 text-xs font-bold leading-none text-fg">
          {number || "•"}
        </div>
        {chunks.map((ch, ci) => (
          <span key={ci} className="inline-flex items-center gap-2">
            <span
              className={cn(
                "inline-flex items-center",
                ch.basic ? "gap-0.5" : "gap-2",
              )}
            >
              {moves.slice(ch.start, ch.end).map((name, off) => {
                const idx = ch.start + off;
                return (
                  <MoveBox
                    key={idx}
                    name={name}
                    basic={ch.basic}
                    dataMove={idx}
                    moveRef={(el) => {
                      moveRefs.current[idx] = el;
                    }}
                  />
                );
              })}
            </span>
            {ch.end < moves.length ? (
              <span className="text-subtle">›</span>
            ) : null}
          </span>
        ))}
      </div>
      {placed.map((p, i) => (
        <div
          key={`${p.text}-${i}`}
          className="pointer-events-none absolute whitespace-nowrap rounded-xs bg-phase px-2.5 py-1 text-xs leading-none text-phase-fg"
          style={{ left: p.left, top: p.top }}
        >
          {p.text}
        </div>
      ))}
    </div>
  );
}
