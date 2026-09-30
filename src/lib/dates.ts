import type { Role } from "./profile";

export const MONTHS_SHORT = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
] as const;

export const MONTHS_LONG = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
] as const;

const MONTH_RE = /^(\d{4})-(0[1-9]|1[0-2])$/;

export function isMonthString(value: string): boolean {
  return MONTH_RE.test(value);
}

/** "2026-07" -> { year: 2026, month: 7 }. Returns null for anything else. */
export function parseMonth(value: string): { year: number; month: number } | null {
  const m = MONTH_RE.exec(value);
  return m ? { year: Number(m[1]), month: Number(m[2]) } : null;
}

export function toMonthString(year: number, month: number): string {
  return `${year}-${String(month).padStart(2, "0")}`;
}

/** "2026-07" -> "Jul 2026". Unparseable input is returned unchanged. */
export function formatMonth(value: string): string {
  const p = parseMonth(value);
  return p ? `${MONTHS_SHORT[p.month - 1]} ${p.year}` : value;
}

/** "Jul 2026 - Present" or "Jan 2026 - Jun 2026". */
export function formatRange(role: Role): string {
  const end = role.current || !role.end ? "Present" : formatMonth(role.end);
  return `${formatMonth(role.start)} - ${end}`;
}

/** "2026-09" -> "Updated Sep 2026". */
export function formatUpdated(value: string | undefined): string | null {
  return value && parseMonth(value) ? `Updated ${formatMonth(value)}` : null;
}

/** Whole months between two "YYYY-MM" strings, or 0 when either is invalid. */
function monthIndex(value: string): number {
  const p = parseMonth(value);
  return p ? p.year * 12 + (p.month - 1) : 0;
}

/**
 * Current roles first (newest start first), then finished roles by end date,
 * newest first. Ties fall back to the newest start. Does not mutate the input.
 */
export function sortRoles(roles: readonly Role[]): Role[] {
  return [...roles].sort((a, b) => {
    if (a.current !== b.current) return a.current ? -1 : 1;
    if (!a.current) {
      const byEnd = monthIndex(b.end ?? "") - monthIndex(a.end ?? "");
      if (byEnd !== 0) return byEnd;
    }
    return monthIndex(b.start) - monthIndex(a.start);
  });
}

export type RoleDraft = {
  title: string;
  startYear: string;
  startMonth: string;
  endYear: string;
  endMonth: string;
  current: boolean;
};

export type RoleErrors = Partial<
  Record<"title" | "start" | "end", string>
>;

/** Validation for the Studio role form. Empty object means valid. */
export function validateRoleDraft(draft: RoleDraft): RoleErrors {
  const errors: RoleErrors = {};
  if (!draft.title.trim()) errors.title = "Enter a role name, for example Sales Executive.";
  const hasStart = draft.startYear !== "" && draft.startMonth !== "";
  if (!hasStart) errors.start = "Choose the month and year this role started.";
  if (!draft.current) {
    const hasEnd = draft.endYear !== "" && draft.endMonth !== "";
    if (!hasEnd) {
      errors.end = "Choose the month and year this role ended, or tick the current role box.";
    } else if (hasStart) {
      const start = Number(draft.startYear) * 12 + Number(draft.startMonth);
      const end = Number(draft.endYear) * 12 + Number(draft.endMonth);
      if (end < start) errors.end = "The end date is before the start date. Pick a later end date.";
    }
  }
  return errors;
}

/** "2026-09-30" -> "30 Sep 2026". Unparseable input is returned unchanged. */
export function formatDay(value: string): string {
  const m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(value);
  if (!m) return value;
  const month = MONTHS_SHORT[Number(m[2]) - 1];
  return month ? `${Number(m[3])} ${month} ${m[1]}` : value;
}
