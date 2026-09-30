"use client";

import { useState } from "react";
import { Plus, X } from "@phosphor-icons/react";
import { Button } from "@/components/ui/Button";
import { controlClass } from "@/components/ui/Field";
import { useToast } from "@/components/ui/Toast";
import { LIMITS } from "@/lib/profile";
import { Panel } from "../SectionShell";
import { useStudio } from "../StudioProvider";

const SUGGESTIONS = [
  "Leadership",
  "Communication",
  "Sales",
  "Marketing",
  "Negotiation",
  "Project Management",
  "Public Speaking",
  "Data Analysis",
];

export function SkillsSection() {
  const { state, dispatch } = useStudio();
  const toast = useToast();
  const [draft, setDraft] = useState("");
  const skills = state.profile.skills;
  const full = skills.length >= LIMITS.skills;

  function add(raw: string) {
    const skill = raw.trim();
    if (!skill) return;
    if (full) {
      toast(`You can add up to ${LIMITS.skills} skills. Remove one to add another.`, "error");
      return;
    }
    if (skills.some((s) => s.toLowerCase() === skill.toLowerCase())) {
      toast(`"${skill}" is already in your list.`, "error");
      return;
    }
    dispatch({ type: "addSkill", skill });
    setDraft("");
  }

  const suggestions = SUGGESTIONS.filter(
    (s) => !skills.some((k) => k.toLowerCase() === s.toLowerCase()),
  ).slice(0, 6);

  return (
    <>
      <Panel className="grid gap-4">
        <div>
          <label htmlFor="skill-input" className="text-[13px] font-semibold text-text">
            Add a skill
          </label>
          <div className="mt-1.5 flex gap-2">
            <input
              id="skill-input"
              value={draft}
              maxLength={40}
              disabled={full}
              placeholder={full ? "Skill limit reached" : "Type a skill and press Enter"}
              onChange={(e) => setDraft(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  add(draft);
                }
              }}
              className={`${controlClass} h-11 disabled:opacity-60`}
            />
            <Button
              variant="secondary"
              onClick={() => add(draft)}
              disabled={!draft.trim() || full}
              icon={<Plus size={16} weight="bold" aria-hidden />}
            >
              Add
            </Button>
          </div>
          <p className="tabular mt-1.5 text-[13px] text-text-3">
            {skills.length} of {LIMITS.skills} used
          </p>
        </div>

        {skills.length > 0 ? (
          <ul className="flex flex-wrap gap-2" aria-label="Your skills">
            {skills.map((skill) => (
              <li
                key={skill}
                className="flex items-center gap-1 rounded-chip border border-border-strong bg-surface py-0.5 pl-3.5 pr-0.5 text-[13.5px] font-medium text-text-2"
              >
                {skill}
                <button
                  type="button"
                  aria-label={`Remove ${skill}`}
                  onClick={() => dispatch({ type: "removeSkill", skill })}
                  className="flex h-11 w-11 items-center justify-center rounded-full text-text-3 hover:text-text"
                >
                  <X size={12} weight="bold" aria-hidden />
                </button>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-sm text-text-3">No skills yet. Add your first one above.</p>
        )}
      </Panel>

      {!full && suggestions.length > 0 && (
        <Panel>
          <p className="text-[13px] font-semibold text-text">Quick add</p>
          <ul className="mt-2.5 flex flex-wrap gap-2">
            {suggestions.map((s) => (
              <li key={s}>
                <button
                  type="button"
                  onClick={() => add(s)}
                  className="inline-flex min-h-11 items-center gap-1.5 rounded-chip border border-dashed border-border-strong px-3.5 text-[13.5px] font-medium text-text-2 hover:border-accent hover:bg-accent-soft"
                >
                  <Plus size={12} weight="bold" aria-hidden />
                  {s}
                </button>
              </li>
            ))}
          </ul>
        </Panel>
      )}
    </>
  );
}
