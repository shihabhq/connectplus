"use client";

import { TextField } from "@/components/ui/Field";
import { Switch } from "@/components/ui/Switch";
import { formatPhone } from "@/lib/profile";
import { Panel } from "../SectionShell";
import { useStudio } from "../StudioProvider";

const E164 = /^\+[1-9]\d{6,14}$/;

export function ContactSection() {
  const { state, dispatch } = useStudio();
  const p = state.profile;
  const phoneError = E164.test(p.phone)
    ? undefined
    : "Start with + and the country code, then the number, for example +8801700000000.";
  const emailError =
    !p.email || /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(p.email)
      ? undefined
      : "This does not look like an email address. Check for typos.";

  return (
    <>
      <Panel className="grid gap-4">
        <TextField
          label="Phone"
          type="tel"
          inputMode="tel"
          autoComplete="tel"
          value={p.phone}
          placeholder="+8801700000000"
          onChange={(value) =>
            dispatch({ type: "updateField", field: "phone", value: value.replace(/[\s()-]/g, "") })
          }
          error={phoneError}
          help={`Shown on your card as ${formatPhone(p.phone)}.`}
        />
        <TextField
          label="Email"
          type="email"
          inputMode="email"
          autoComplete="email"
          value={p.email ?? ""}
          placeholder="you@company.com"
          onChange={(value) => dispatch({ type: "updateField", field: "email", value })}
          error={emailError}
          help="Optional."
        />
        <TextField
          label="Website"
          inputMode="url"
          value={p.website ?? ""}
          placeholder="https://www.company.com"
          onChange={(value) => dispatch({ type: "updateField", field: "website", value })}
          help="Optional."
        />
      </Panel>

      <Panel className="divide-y divide-border !py-1">
        <div className="flex items-center justify-between gap-4 py-2">
          <div>
            <p className="text-[15px] font-semibold text-text">Save contact button</p>
            <p className="text-[13px] text-text-3">Lets people add you to their phone in one tap.</p>
          </div>
          <Switch
            label="Show Save contact button"
            checked={p.actions.saveContact}
            onChange={(value) => dispatch({ type: "toggleAction", action: "saveContact", value })}
          />
        </div>
        <div className="flex items-center justify-between gap-4 py-2">
          <div>
            <p className="text-[15px] font-semibold text-text">Call button</p>
            <p className="text-[13px] text-text-3">Calls the phone number above.</p>
          </div>
          <Switch
            label="Show Call button"
            checked={p.actions.call}
            onChange={(value) => dispatch({ type: "toggleAction", action: "call", value })}
          />
        </div>
      </Panel>
    </>
  );
}
