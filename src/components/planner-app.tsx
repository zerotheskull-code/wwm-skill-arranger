import { useState } from "react";
import { Download, GripVertical, Plus, Trash2 } from "lucide-react";
import {
  AXIS_MOVES,
  BASIC_MOVES,
  COUNTDOWN_BASIC,
  COUNTDOWN_MOVES,
  COUNTDOWN_OPTIONS,
  FUTIE_OPTIONS,
  TIANGONG_OPTIONS,
  XINFA_OPTIONS,
  type CountdownMove,
  isBasicMove,
  moveKey,
} from "@/lib/planner";
import { usePlanner } from "@/lib/planner-store";
import { PreviewBoard } from "@/components/preview-board";
import { downloadPreviewPng } from "@/lib/export-png";
import { cn } from "@/lib/utils";

export function PlannerApp() {
  return (
    <div className="min-h-svh bg-ink px-4 py-5 text-fg sm:px-6">
      <div className="mx-auto max-w-[1400px]">
        <h1 className="mb-4 text-xl font-semibold tracking-tight">
          燕雲競速排軸器
        </h1>
        <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
          <section className="rounded-lg border border-line bg-surface p-4">
            <OpeningBlock />
            <PhaseBlock />
            <AxisList />
            <div className="mt-3 flex justify-center">
              <AddAxisButton />
            </div>
          </section>
          <section className="rounded-lg border border-line bg-surface p-4">
            <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
              <h2 className="text-sm font-medium text-muted">即時預覽</h2>
              <ExportPngButton />
            </div>
            <PreviewBoard />
          </section>
        </div>
      </div>
    </div>
  );
}

function FieldLabel({ children }: { children: string }) {
  return <label className="text-sm text-muted">{children}</label>;
}

function NativeSelect({
  value,
  onChange,
  options,
  placeholder,
}: {
  value: string | number;
  onChange: (v: string) => void;
  options: { value: string; label: string }[];
  placeholder?: string;
}) {
  return (
    <select
      value={String(value)}
      onChange={(e) => onChange(e.target.value)}
      className="h-9 min-w-24 rounded-sm border border-line bg-well px-2 text-sm text-fg outline-none focus:border-accent"
    >
      {placeholder ? (
        <option value="">{placeholder}</option>
      ) : null}
      {options.map((o) => (
        <option key={o.value} value={o.value}>
          {o.label}
        </option>
      ))}
    </select>
  );
}

function OpeningBlock() {
  const {
    opening,
    setDungeonName,
    setCountdownCount,
    addCountdownMove,
    removeCountdownMove,
    setCountdownMoveCount,
    setTiangong,
    setFutie,
    setXinfa,
    addCustomTag,
    setCustomTag,
    removeCustomTag,
  } = usePlanner();

  return (
    <div className="mb-4 space-y-3">
      <div className="flex flex-wrap items-center gap-2">
        <input
          value={opening.dungeonName}
          onChange={(e) => setDungeonName(e.target.value)}
          placeholder="副本/軸名稱"
          className="h-9 min-w-40 flex-1 rounded-sm border border-line bg-well px-3 text-sm text-fg outline-none placeholder:text-subtle focus:border-accent"
        />
        <div className="flex items-center gap-1.5">
          <FieldLabel>天工：</FieldLabel>
          <NativeSelect
            value={opening.tiangong}
            onChange={setTiangong}
            placeholder="選擇"
            options={TIANGONG_OPTIONS.map((o) => ({ value: o, label: o }))}
          />
        </div>
        <div className="flex items-center gap-1.5">
          <FieldLabel>符帖：</FieldLabel>
          <NativeSelect
            value={opening.futie}
            onChange={setFutie}
            options={FUTIE_OPTIONS.map((o) => ({ value: o, label: o }))}
          />
        </div>
        <div className="flex items-center gap-1.5">
          <FieldLabel>心法：</FieldLabel>
          <NativeSelect
            value={opening.xinfa}
            onChange={setXinfa}
            placeholder="選擇"
            options={XINFA_OPTIONS.map((o) => ({ value: o, label: o }))}
          />
        </div>
        {opening.customTags.map((tag, i) => (
          <div key={i} className="flex items-center gap-1">
            <input
              value={tag}
              placeholder="自定標籤"
              onChange={(e) => setCustomTag(i, e.target.value)}
              className="h-9 w-28 rounded-sm border border-line bg-well px-2 text-sm text-fg outline-none placeholder:text-subtle focus:border-accent"
            />
            <button
              type="button"
              className="text-danger"
              aria-label="刪除標籤"
              onClick={() => removeCustomTag(i)}
            >
              ×
            </button>
          </div>
        ))}
        <button
          type="button"
          onClick={addCustomTag}
          className="inline-flex h-9 items-center rounded-sm border border-dashed border-line px-2.5 text-xs text-muted hover:border-accent"
        >
          +自定標籤
        </button>
      </div>

      <div className="flex flex-wrap items-center gap-2">
        <FieldLabel>倒數次數：</FieldLabel>
        <NativeSelect
          value={opening.countdownCount}
          onChange={(v) =>
            setCountdownCount(Number(v) as 0 | 1 | 2 | 3 | 4)
          }
          options={COUNTDOWN_OPTIONS.map((o) => ({
            value: String(o.value),
            label: o.label,
          }))}
        />
      </div>

      {opening.countdownCount > 0 ? (
        <CountdownEditor
          moves={opening.countdownMoves}
          onAdd={addCountdownMove}
          onRemove={removeCountdownMove}
          onCountChange={setCountdownMoveCount}
        />
      ) : null}
    </div>
  );
}

function CountdownEditor({
  moves,
  onAdd,
  onRemove,
  onCountChange,
}: {
  moves: CountdownMove[];
  onAdd: (n: string) => void;
  onRemove: (i: number) => void;
  onCountChange: (i: number, count: string) => void;
}) {
  return (
    <div className="rounded-md border border-line bg-well p-3">
      <div className="mb-2 flex min-h-8 flex-wrap items-center gap-1.5">
        {moves.length === 0 ? (
          <span className="text-sm text-subtle">尚未新增倒數招式</span>
        ) : (
          moves.map((m, i) => (
            <span key={`${m.name}-${i}`} className="inline-flex items-center gap-1">
              <input
                value={m.count}
                title="可自行修改倒數數字"
                onChange={(e) => onCountChange(i, e.target.value)}
                className="h-6 w-7 rounded-xs border border-cd/50 bg-ink text-center text-xs font-bold tabular-nums text-cd outline-none focus:border-cd"
              />
              <span
                className={cn(
                  "inline-flex items-center gap-1 rounded-sm border px-1.5 py-0.5 text-xs",
                  isBasicMove(m.name, COUNTDOWN_BASIC)
                    ? "border-basic-edge bg-basic"
                    : "border-line bg-elevated",
                )}
              >
                {m.name}
                <button
                  type="button"
                  className="text-danger"
                  onClick={() => onRemove(i)}
                  aria-label="移除"
                >
                  ×
                </button>
              </span>
            </span>
          ))
        )}
      </div>
      <div className="flex flex-wrap gap-1.5">
        {COUNTDOWN_MOVES.map((opt) => (
          <button
            key={opt}
            type="button"
            onClick={() => onAdd(opt)}
            className={cn(
              "rounded-sm border px-2.5 py-1 text-xs",
              isBasicMove(opt, COUNTDOWN_BASIC)
                ? "border-basic-edge bg-basic/40 hover:bg-basic/70"
                : "border-line bg-elevated hover:border-accent",
            )}
          >
            {opt}
          </button>
        ))}
      </div>
    </div>
  );
}

function PhaseBlock() {
  const { phases, phaseLocation, axes, addPhase, removePhase, setPhaseText } =
    usePlanner();

  function locLabel(phaseId: string) {
    const k = phaseLocation[phaseId];
    if (!k) return "未放置";
    const [axisId, idx] = [k.slice(0, k.lastIndexOf(":")), Number(k.slice(k.lastIndexOf(":") + 1))];
    const axis = axes.find((a) => a.id === axisId);
    if (!axis || !axis.moves[idx]) return "未放置";
    return `軸${axis.number} · ${axis.moves[idx]}`;
  }

  return (
    <div className="mb-4 rounded-md border border-line bg-well p-3">
      <div className="mb-2 flex items-center justify-between gap-2">
        <span className="text-sm text-muted">
          階段（拖到下方招式上，每個招式最多一個）
        </span>
        <button
          type="button"
          onClick={addPhase}
          className="inline-flex h-8 items-center gap-1 rounded-sm bg-accent px-2.5 text-xs font-medium text-accent-fg"
        >
          <Plus className="size-3.5" />
          新增階段
        </button>
      </div>
      <div className="flex flex-col gap-2">
        {phases.map((p) => (
          <div
            key={p.id}
            className="flex items-center gap-2 rounded-sm border border-line bg-elevated px-2 py-1.5"
          >
            <span
              draggable
              title="拖到招式上"
              className="cursor-grab text-muted active:cursor-grabbing"
              onDragStart={(e) => {
                e.dataTransfer.setData("text/plain", p.id);
                e.dataTransfer.effectAllowed = "move";
              }}
            >
              <GripVertical className="size-4" />
            </span>
            <input
              value={p.text}
              placeholder="例如 氣竭、二階段"
              onChange={(e) => setPhaseText(p.id, e.target.value)}
              className="h-8 min-w-0 flex-1 rounded-xs border border-line bg-well px-2 text-sm text-fg outline-none placeholder:text-subtle focus:border-accent"
            />
            <span className="max-w-28 truncate text-[11px] text-subtle">
              {locLabel(p.id)}
            </span>
            <button
              type="button"
              onClick={() => removePhase(p.id)}
              className="rounded-xs border border-danger-edge bg-danger-bg px-2 py-1 text-xs text-danger"
            >
              刪
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

function AxisList() {
  const { axes, addAxis } = usePlanner();
  void addAxis;
  return (
    <div className="flex flex-col gap-3">
      {axes.map((axis) => (
        <AxisEditor key={axis.id} axisId={axis.id} />
      ))}
    </div>
  );
}

function AddAxisButton() {
  const addAxis = usePlanner((s) => s.addAxis);
  return (
    <button
      type="button"
      onClick={addAxis}
      className="inline-flex h-9 items-center gap-1 rounded-sm bg-accent px-4 text-sm font-medium text-accent-fg"
    >
      <Plus className="size-4" />
      新增軸
    </button>
  );
}

function ExportPngButton() {
  const opening = usePlanner((s) => s.opening);
  const axes = usePlanner((s) => s.axes);
  const phases = usePlanner((s) => s.phases);
  const movePhase = usePlanner((s) => s.movePhase);
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState("");

  return (
    <div className="flex items-center gap-2">
      {err ? <span className="text-xs text-danger">{err}</span> : null}
      <button
        type="button"
        disabled={busy}
        onClick={async () => {
          setErr("");
          setBusy(true);
          try {
            await downloadPreviewPng({ opening, axes, phases, movePhase });
          } catch {
            setErr("匯出失敗，請再試一次");
          } finally {
            setBusy(false);
          }
        }}
        className="inline-flex h-9 items-center gap-1.5 rounded-sm bg-accent px-3 text-sm font-medium text-accent-fg disabled:opacity-60"
      >
        <Download className="size-4" />
        {busy ? "匯出中…" : "下載 PNG"}
      </button>
    </div>
  );
}

function AxisEditor({ axisId }: { axisId: string }) {
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
  const [showCustom, setShowCustom] = useState(false);
  const [dropIdx, setDropIdx] = useState<number | null>(null);

  if (!axis) return null;

  return (
    <div className="flex items-stretch gap-2.5">
      <div className="min-w-0 flex-1 rounded-md border border-line bg-well p-3">
        <div className="mb-2 flex flex-wrap items-start gap-2">
          <div className="flex items-center gap-1.5">
            <span className="text-sm text-muted">軸：</span>
            <input
              value={axis.number}
              title="可自行修改軸編號"
              onChange={(e) => setAxisNumber(axisId, e.target.value)}
              className="h-8 w-11 rounded-sm border-2 border-axis bg-axis-well text-center text-sm font-bold text-fg outline-none focus:border-accent"
            />
          </div>
          <div className="flex min-h-8 flex-1 flex-wrap items-center gap-1.5">
            {axis.moves.length === 0 ? (
              <span className="text-sm text-subtle">尚未新增招式</span>
            ) : (
              axis.moves.map((m, i) => {
                const has = !!movePhase[moveKey(axisId, i)];
                return (
                  <span key={`${m}-${i}`} className="inline-flex items-center gap-1">
                    <span
                      onDragOver={(e) => {
                        e.preventDefault();
                        setDropIdx(i);
                      }}
                      onDragLeave={() => setDropIdx(null)}
                      onDrop={(e) => {
                        e.preventDefault();
                        setDropIdx(null);
                        const pid = e.dataTransfer.getData("text/plain");
                        if (pid) assignPhase(pid, axisId, i);
                      }}
                      className={cn(
                        "inline-flex items-center gap-1 rounded-sm border px-1.5 py-0.5 text-xs",
                        isBasicMove(m, BASIC_MOVES)
                          ? "border-basic-edge bg-basic"
                          : "border-line bg-elevated",
                        has && "ring-1 ring-axis/70",
                        dropIdx === i && "ring-2 ring-accent",
                      )}
                    >
                      {m}
                      <button
                        type="button"
                        className="text-danger"
                        onClick={() => removeMove(axisId, i)}
                      >
                        ×
                      </button>
                    </span>
                    {i < axis.moves.length - 1 ? (
                      <span className="text-subtle">›</span>
                    ) : null}
                  </span>
                );
              })
            )}
          </div>
        </div>
        <div className="flex flex-wrap gap-1.5">
          {AXIS_MOVES.map((opt) => (
            <button
              key={opt}
              type="button"
              onClick={() => addMove(axisId, opt)}
              className={cn(
                "rounded-sm border px-2 py-1 text-xs",
                isBasicMove(opt, BASIC_MOVES)
                  ? "border-basic-edge bg-basic/40 hover:bg-basic/70"
                  : "border-line bg-elevated hover:border-accent",
              )}
            >
              {opt}
            </button>
          ))}
          {showCustom ? (
            <span className="inline-flex items-center gap-1">
              <input
                autoFocus
                value={customDraft}
                placeholder="自訂名稱"
                onChange={(e) => setCustomDraft(axisId, e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    commitCustom(axisId);
                    setShowCustom(false);
                  }
                }}
                className="h-7 w-24 rounded-xs border border-line bg-ink px-2 text-xs outline-none focus:border-accent"
              />
              <button
                type="button"
                className="h-7 rounded-xs bg-accent px-2 text-xs text-accent-fg"
                onClick={() => {
                  commitCustom(axisId);
                  setShowCustom(false);
                }}
              >
                加入
              </button>
            </span>
          ) : (
            <button
              type="button"
              onClick={() => setShowCustom(true)}
              className="rounded-sm border border-dashed border-line px-2 py-1 text-xs text-muted hover:border-accent"
            >
              自訂…
            </button>
          )}
        </div>
      </div>
      <div className="flex items-center">
        <button
          type="button"
          onClick={() => removeAxis(axisId)}
          className="inline-flex h-9 items-center gap-1 rounded-sm border border-danger-edge bg-danger-bg px-3 text-sm text-danger"
        >
          <Trash2 className="size-3.5" />
          刪軸
        </button>
      </div>
    </div>
  );
}
