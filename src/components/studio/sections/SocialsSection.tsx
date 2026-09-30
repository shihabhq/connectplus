"use client";

import { useId, useState, type CSSProperties } from "react";
import {
  closestCenter,
  DndContext,
  KeyboardSensor,
  PointerSensor,
  TouchSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
} from "@dnd-kit/core";
import {
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { DotsSixVertical, Plus, Trash } from "@phosphor-icons/react";
import { BrandIcon, socialCircleStyle } from "@/components/icons/brands";
import { Button } from "@/components/ui/Button";
import { controlClass } from "@/components/ui/Field";
import { IconButton } from "@/components/ui/IconButton";
import {
  LIMITS,
  SOCIAL_META,
  SOCIAL_TYPES,
  socialHref,
  type SocialType,
} from "@/lib/profile";
import { Panel } from "../SectionShell";
import { useStudio } from "../StudioProvider";

function Circle({
  type,
  style,
  size,
}: {
  type: SocialType;
  style: "brand" | "mono";
  size: number;
}) {
  return (
    <span
      aria-hidden
      className="flex shrink-0 items-center justify-center rounded-full"
      style={{ width: size, height: size, ...socialCircleStyle(type, style) }}
    >
      <BrandIcon type={type} width={size * 0.5} height={size * 0.5} />
    </span>
  );
}

function SocialRowItem({
  type,
  value,
  style,
}: {
  type: SocialType;
  value: string;
  style: "brand" | "mono";
}) {
  const { dispatch } = useStudio();
  const inputId = useId();
  const meta = SOCIAL_META[type];
  const { attributes, listeners, setNodeRef, setActivatorNodeRef, transform, transition, isDragging } =
    useSortable({ id: type });
  const invalid = value.trim() !== "" && socialHref(type, value) === null;

  const rowStyle: CSSProperties = {
    transform: CSS.Transform.toString(transform),
    transition,
    zIndex: isDragging ? 10 : undefined,
  };

  return (
    <li
      ref={setNodeRef}
      style={rowStyle}
      className={`rounded-btn border bg-surface p-2.5 ${
        isDragging ? "border-accent shadow-lg" : "border-border"
      }`}
    >
      <div className="flex items-center gap-2">
        <button
          type="button"
          ref={setActivatorNodeRef}
          {...attributes}
          {...listeners}
          aria-label={`Reorder ${meta.label}. Press space, then use the arrow keys.`}
          className="flex h-11 w-11 shrink-0 cursor-grab touch-none items-center justify-center rounded-btn text-text-3 hover:bg-bg-subtle active:cursor-grabbing"
        >
          <DotsSixVertical size={20} weight="bold" aria-hidden />
        </button>
        <span className="hidden min-[420px]:flex"><Circle type={type} style={style} size={36} /></span>
        <div className="min-w-0 flex-1">
          <label htmlFor={inputId} className="block text-xs font-medium text-text-3">
            {meta.label}
          </label>
          <input
            id={inputId}
            value={value}
            placeholder={meta.placeholder}
            aria-invalid={invalid ? true : undefined}
            aria-describedby={invalid ? `${inputId}-err` : undefined}
            onChange={(e) => dispatch({ type: "updateSocial", socialType: type, value: e.target.value })}
            className={`${controlClass} mt-0.5 h-11 ${invalid ? "border-danger" : ""}`}
          />
        </div>
        <IconButton
          label={`Remove ${meta.label}`}
          onClick={() => dispatch({ type: "removeSocial", socialType: type })}
        >
          <Trash size={18} weight="bold" aria-hidden />
        </IconButton>
      </div>
      {invalid && (
        <p id={`${inputId}-err`} role="alert" className="mt-1.5 pl-11 text-[13px] text-danger">
          This does not look like a valid {meta.label} link. {meta.hint}, for example{" "}
          {meta.placeholder}.
        </p>
      )}
    </li>
  );
}

export function SocialsSection() {
  const { state, dispatch } = useStudio();
  const [adding, setAdding] = useState(false);
  const { socials, socialStyle } = state.profile;
  const dndId = useId();

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 4 } }),
    useSensor(TouchSensor, { activationConstraint: { delay: 150, tolerance: 6 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates }),
  );

  function onDragEnd({ active, over }: DragEndEvent) {
    if (!over || active.id === over.id) return;
    const ids = socials.map((s) => s.type as string);
    const from = ids.indexOf(String(active.id));
    const to = ids.indexOf(String(over.id));
    if (from < 0 || to < 0) return;
    dispatch({ type: "reorderSocials", from, to });
  }

  const remaining = SOCIAL_TYPES.filter((t) => !socials.some((s) => s.type === t));
  const full = socials.length >= LIMITS.socials;

  return (
    <Panel className="grid gap-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="text-[15px] font-semibold text-text">Icon colours</p>
          <p className="text-[13px] text-text-3">Applies to every link on your card.</p>
        </div>
        <div
          role="radiogroup"
          aria-label="Icon colours"
          className="inline-flex rounded-btn bg-bg-subtle p-1"
        >
          {(
            [
              ["brand", "Original colours"],
              ["mono", "Monotone"],
            ] as const
          ).map(([value, label]) => (
            <button
              key={value}
              type="button"
              role="radio"
              aria-checked={socialStyle === value}
              onClick={() => dispatch({ type: "setSocialStyle", value })}
              className={`min-h-11 rounded-[10px] px-3.5 text-[13px] font-semibold transition-colors duration-200 ${
                socialStyle === value
                  ? "bg-surface text-text shadow-sm"
                  : "text-text-3 hover:text-text"
              }`}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      {socials.length > 0 ? (
        <DndContext id={dndId} sensors={sensors} collisionDetection={closestCenter} onDragEnd={onDragEnd}>
          <SortableContext items={socials.map((s) => s.type)} strategy={verticalListSortingStrategy}>
            <ul className="flex flex-col gap-2.5" aria-label="Social links">
              {socials.map((s) => (
                <SocialRowItem key={s.type} type={s.type} value={s.value} style={socialStyle} />
              ))}
            </ul>
          </SortableContext>
        </DndContext>
      ) : (
        <p className="rounded-btn bg-bg-subtle p-4 text-sm text-text-3">
          No links yet. Add your first one below.
        </p>
      )}

      <div>
        <Button
          variant="secondary"
          disabled={full || remaining.length === 0}
          aria-expanded={adding}
          onClick={() => setAdding((v) => !v)}
          icon={<Plus size={16} weight="bold" aria-hidden />}
        >
          Add a link
        </Button>
        <span className="tabular ml-3 text-[13px] text-text-3">
          {full ? `Maximum of ${LIMITS.socials} links reached` : `${socials.length} of ${LIMITS.socials} used`}
        </span>

        {adding && !full && (
          <ul className="pop-in mt-4 grid grid-cols-4 gap-x-2 gap-y-3 min-[520px]:grid-cols-5" aria-label="Platforms you can add">
            {remaining.map((t) => (
              <li key={t}>
                <button
                  type="button"
                  aria-label={`Add ${SOCIAL_META[t].label}`}
                  onClick={() => {
                    dispatch({ type: "addSocial", socialType: t });
                    if (socials.length + 1 >= LIMITS.socials) setAdding(false);
                  }}
                  className="flex min-h-11 w-full flex-col items-center gap-1.5 rounded-btn py-1.5 text-xs text-text-3 hover:bg-bg-subtle"
                >
                  <Circle type={t} style={socialStyle} size={44} />
                  {SOCIAL_META[t].label}
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>
    </Panel>
  );
}
