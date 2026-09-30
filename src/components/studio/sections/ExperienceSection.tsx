"use client";

import { useState } from "react";
import { CaretDown, CaretUp, Pencil, Plus, Trash } from "@phosphor-icons/react";
import { Button } from "@/components/ui/Button";
import { controlClass, FieldShell } from "@/components/ui/Field";
import { IconButton } from "@/components/ui/IconButton";
import { Select } from "@/components/ui/Select";
import { useToast } from "@/components/ui/Toast";
import {
  formatRange,
  MONTHS_LONG,
  parseMonth,
  sortRoles,
  toMonthString,
  validateRoleDraft,
  type RoleDraft,
  type RoleErrors,
} from "@/lib/dates";
import { plural, type Role } from "@/lib/profile";
import { Panel } from "../SectionShell";
import { useStudio } from "../StudioProvider";

const MONTH_OPTIONS = MONTHS_LONG.map((label, i) => ({ value: String(i + 1), label }));

function yearOptions() {
  const top = new Date().getFullYear() + 1;
  const list = [];
  for (let y = top; y >= 1980; y--) list.push({ value: String(y), label: String(y) });
  return list;
}

const EMPTY_DRAFT: RoleDraft = {
  title: "",
  startYear: "",
  startMonth: "",
  endYear: "",
  endMonth: "",
  current: false,
};

function draftFromRole(role: Role): RoleDraft {
  const s = parseMonth(role.start);
  const e = role.end ? parseMonth(role.end) : null;
  return {
    title: role.title,
    startYear: s ? String(s.year) : "",
    startMonth: s ? String(s.month) : "",
    endYear: e ? String(e.year) : "",
    endMonth: e ? String(e.month) : "",
    current: role.current,
  };
}

function RoleForm({
  initial,
  isNew,
  onSave,
  onCancel,
  onDelete,
}: {
  initial: RoleDraft;
  isNew: boolean;
  onSave: (role: Role) => void;
  onCancel: () => void;
  onDelete?: () => void;
}) {
  const [draft, setDraft] = useState(initial);
  const [errors, setErrors] = useState<RoleErrors>({});
  const years = yearOptions();
  const patch = (p: Partial<RoleDraft>) => setDraft((d) => ({ ...d, ...p }));

  function submit() {
    const found = validateRoleDraft(draft);
    setErrors(found);
    if (Object.keys(found).length > 0) return;
    onSave({
      title: draft.title.trim(),
      start: toMonthString(Number(draft.startYear), Number(draft.startMonth)),
      end: draft.current ? null : toMonthString(Number(draft.endYear), Number(draft.endMonth)),
      current: draft.current,
    });
  }

  return (
    <form
      className="pop-in mt-3 grid gap-4 rounded-btn border border-border-strong bg-bg-subtle p-4"
      onSubmit={(e) => {
        e.preventDefault();
        submit();
      }}
      aria-label={isNew ? "Add a role" : "Edit role"}
    >
      <FieldShell id="role-title" label="Role name" error={errors.title}>
        <input
          id="role-title"
          autoFocus
          value={draft.title}
          placeholder="Sales Executive"
          aria-invalid={errors.title ? true : undefined}
          onChange={(e) => patch({ title: e.target.value })}
          className={`${controlClass} h-11 ${errors.title ? "border-danger" : ""}`}
        />
      </FieldShell>

      <fieldset>
        <legend className="mb-1.5 text-[13px] font-semibold text-text">Started</legend>
        <div className="flex gap-2">
          <Select
            label="Start month"
            placeholder="Month"
            value={draft.startMonth}
            options={MONTH_OPTIONS}
            invalid={Boolean(errors.start)}
            onChange={(startMonth) => patch({ startMonth })}
          />
          <Select
            label="Start year"
            placeholder="Year"
            value={draft.startYear}
            options={years}
            invalid={Boolean(errors.start)}
            onChange={(startYear) => patch({ startYear })}
          />
        </div>
        {errors.start && (
          <p role="alert" className="mt-1.5 text-[13px] text-danger">
            {errors.start}
          </p>
        )}
      </fieldset>

      <fieldset>
        <legend className="mb-1.5 text-[13px] font-semibold text-text">Ended</legend>
        {draft.current ? (
          <p className="flex h-11 items-center rounded-btn border border-border bg-surface px-3.5 text-[15px] font-medium text-text-2">
            Present
          </p>
        ) : (
          <div className="flex gap-2">
            <Select
              label="End month"
              placeholder="Month"
              value={draft.endMonth}
              options={MONTH_OPTIONS}
              invalid={Boolean(errors.end)}
              onChange={(endMonth) => patch({ endMonth })}
            />
            <Select
              label="End year"
              placeholder="Year"
              value={draft.endYear}
              options={years}
              invalid={Boolean(errors.end)}
              onChange={(endYear) => patch({ endYear })}
            />
          </div>
        )}
        {errors.end && (
          <p role="alert" className="mt-1.5 text-[13px] text-danger">
            {errors.end}
          </p>
        )}
        <label className="mt-2 flex min-h-11 cursor-pointer items-center gap-2.5 text-sm text-text-2">
          <input
            type="checkbox"
            checked={draft.current}
            onChange={(e) => patch({ current: e.target.checked })}
            className="h-5 w-5 accent-(--accent-strong)"
          />
          I currently work in this role
        </label>
      </fieldset>

      <div className="flex flex-wrap items-center gap-2">
        <Button variant="primary" type="submit">
          Save role
        </Button>
        <Button variant="secondary" onClick={onCancel}>
          Cancel
        </Button>
        {onDelete && (
          <Button variant="ghost" className="ml-auto text-danger" onClick={onDelete}>
            Delete role
          </Button>
        )}
      </div>
    </form>
  );
}

type Editing = { company: number; role: number | null } | null;

export function ExperienceSection() {
  const { state, dispatch } = useStudio();
  const toast = useToast();
  const companies = state.profile.experience;
  const [editing, setEditing] = useState<Editing>(null);
  const [confirming, setConfirming] = useState<number | null>(null);
  const [justAdded, setJustAdded] = useState<number | null>(null);

  return (
    <>
      {companies.length === 0 && (
        <Panel>
          <p className="text-sm text-text-3">No experience yet. Add a company to start.</p>
        </Panel>
      )}

      {companies.map((company, ci) => {
        // Roles are shown in card order, but edits address the stored index.
        const sorted = sortRoles(company.roles);
        const indexOf = (role: Role) => company.roles.indexOf(role);
        const isEditingHere = editing?.company === ci;

        return (
          <Panel key={ci}>
            <div className="flex flex-wrap items-center gap-x-2 gap-y-1">
              <input
                aria-label="Company name"
                value={company.name}
                autoFocus={justAdded === ci}
                onFocus={(e) => justAdded === ci && e.currentTarget.select()}
                onChange={(e) => dispatch({ type: "renameCompany", index: ci, name: e.target.value })}
                className="h-11 min-w-[9rem] flex-1 rounded-btn border border-transparent bg-transparent px-2 text-base font-semibold text-text hover:border-border-strong focus:border-accent focus:outline-none focus:ring-4 focus:ring-accent-ring"
              />
              <span className="hidden text-[13px] text-text-3 min-[520px]:inline">
                {plural(company.roles.length, "role")}
              </span>
              <span className="ml-auto flex items-center min-[420px]:ml-0">
              <IconButton
                label={`Move ${company.name || "company"} up`}
                disabled={ci === 0}
                onClick={() => dispatch({ type: "moveCompany", index: ci, direction: -1 })}
              >
                <CaretUp size={18} weight="bold" aria-hidden />
              </IconButton>
              <IconButton
                label={`Move ${company.name || "company"} down`}
                disabled={ci === companies.length - 1}
                onClick={() => dispatch({ type: "moveCompany", index: ci, direction: 1 })}
              >
                <CaretDown size={18} weight="bold" aria-hidden />
              </IconButton>
              <IconButton
                label={`Delete ${company.name || "company"}`}
                onClick={() => setConfirming(confirming === ci ? null : ci)}
              >
                <Trash size={18} weight="bold" aria-hidden />
              </IconButton>
              </span>
            </div>

            {confirming === ci && (
              <div
                role="alertdialog"
                aria-label="Confirm delete"
                className="pop-in mt-2 flex flex-wrap items-center gap-2 rounded-btn border border-danger bg-surface p-3"
              >
                <p className="mr-auto text-sm font-medium text-text">
                  {company.roles.length > 0
                    ? `Delete ${company.name || "this company"} and its ${plural(company.roles.length, "role")}?`
                    : `Delete ${company.name || "this company"}?`}
                </p>
                <Button
                  variant="danger"
                  onClick={() => {
                    dispatch({ type: "deleteCompany", index: ci });
                    setConfirming(null);
                    setEditing(null);
                    toast("Company deleted");
                  }}
                >
                  Delete
                </Button>
                <Button variant="secondary" onClick={() => setConfirming(null)}>
                  Cancel
                </Button>
              </div>
            )}

            <ol className="relative mt-3 flex flex-col gap-1 pl-5">
              <span
                aria-hidden
                className="absolute bottom-4 left-[3.25px] top-4 w-[1.5px] bg-border-strong"
              />
              {sorted.map((role) => {
                const ri = indexOf(role);
                const active = isEditingHere && editing?.role === ri;
                return (
                  <li key={ri} className="relative">
                    <span
                      aria-hidden
                      className={`absolute -left-5 top-[22px] h-2 w-2 rounded-full ${
                        role.current ? "bg-accent" : "bg-(--dot-idle)"
                      }`}
                    />
                    <div className="flex items-center gap-1">
                      <button
                        type="button"
                        onClick={() => setEditing(active ? null : { company: ci, role: ri })}
                        aria-label={`Edit ${role.title}`}
                        className="min-h-11 min-w-0 flex-1 rounded-btn px-2 py-1.5 text-left hover:bg-bg-subtle"
                      >
                        <span className="block truncate text-[15px] font-medium text-text">
                          {role.title}
                        </span>
                        <span className="tabular block text-[13px] text-text-3">
                          {formatRange(role)}
                        </span>
                      </button>
                      <IconButton
                        label={`Edit ${role.title}`}
                        onClick={() => setEditing(active ? null : { company: ci, role: ri })}
                      >
                        <Pencil size={18} weight="bold" aria-hidden />
                      </IconButton>
                    </div>
                    {active && (
                      <RoleForm
                        key={`${ci}-${ri}`}
                        isNew={false}
                        initial={draftFromRole(role)}
                        onCancel={() => setEditing(null)}
                        onDelete={() => {
                          dispatch({ type: "deleteRole", company: ci, role: ri });
                          setEditing(null);
                          toast("Role deleted");
                        }}
                        onSave={(value) => {
                          dispatch({ type: "saveRole", company: ci, role: ri, value });
                          setEditing(null);
                          toast("Role saved");
                        }}
                      />
                    )}
                  </li>
                );
              })}
            </ol>

            {isEditingHere && editing?.role === null ? (
              <RoleForm
                key={`new-${ci}`}
                isNew
                initial={EMPTY_DRAFT}
                onCancel={() => setEditing(null)}
                onSave={(value) => {
                  dispatch({ type: "saveRole", company: ci, role: null, value });
                  setEditing(null);
                  toast("Role saved");
                }}
              />
            ) : (
              <Button
                variant="ghost"
                className="mt-2"
                onClick={() => setEditing({ company: ci, role: null })}
                icon={<Plus size={16} weight="bold" aria-hidden />}
              >
                Add a role
              </Button>
            )}
          </Panel>
        );
      })}

      <div>
        <Button
          variant="secondary"
          icon={<Plus size={16} weight="bold" aria-hidden />}
          onClick={() => {
            dispatch({ type: "addCompany", name: "New company" });
            setJustAdded(companies.length);
            setEditing(null);
          }}
        >
          Add a company
        </Button>
      </div>
    </>
  );
}
