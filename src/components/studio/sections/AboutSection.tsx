"use client";

import { TextAreaField } from "@/components/ui/Field";
import { LIMITS } from "@/lib/profile";
import { Panel } from "../SectionShell";
import { useStudio } from "../StudioProvider";

export function AboutSection() {
  const { state, dispatch } = useStudio();
  const length = state.profile.about.length;
  const warn = length > LIMITS.aboutWarn;

  return (
    <Panel>
      <TextAreaField
        label="About you"
        value={state.profile.about}
        maxLength={LIMITS.about}
        placeholder="Who are you, what do you do, and what should people remember about you?"
        className="min-h-[260px] resize-y"
        onChange={(value) => dispatch({ type: "updateField", field: "about", value })}
        aside={
          <span
            aria-live="polite"
            className={`tabular text-[13px] font-medium ${warn ? "text-warn" : "text-text-3"}`}
          >
            {length} / {LIMITS.about}
          </span>
        }
        help={warn ? "Getting long. Short intros are read more often." : "Plain sentences work best."}
      />
    </Panel>
  );
}
