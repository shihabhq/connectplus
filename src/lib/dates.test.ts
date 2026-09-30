import { describe, expect, it } from "vitest";
import {
  formatDay,
  formatMonth,
  formatRange,
  formatUpdated,
  parseMonth,
  sortRoles,
  validateRoleDraft,
} from "./dates";
import type { Role } from "./profile";

const role = (
  title: string,
  start: string,
  end: string | null,
  current = end === null,
): Role => ({ title, start, end, current });

describe("formatMonth", () => {
  it("formats YYYY-MM as a short month and year", () => {
    expect(formatMonth("2026-07")).toBe("Jul 2026");
    expect(formatMonth("2025-12")).toBe("Dec 2025");
    expect(formatMonth("2026-01")).toBe("Jan 2026");
  });

  it("returns invalid input unchanged", () => {
    expect(formatMonth("soon")).toBe("soon");
    expect(formatMonth("2026-13")).toBe("2026-13");
  });
});

describe("parseMonth", () => {
  it("parses valid months only", () => {
    expect(parseMonth("2026-07")).toEqual({ year: 2026, month: 7 });
    expect(parseMonth("2026-00")).toBeNull();
    expect(parseMonth("26-07")).toBeNull();
  });
});

describe("formatRange", () => {
  it("uses a spaced hyphen and Present for current roles", () => {
    expect(formatRange(role("A", "2026-07", null))).toBe("Jul 2026 - Present");
    expect(formatRange(role("B", "2026-01", "2026-06"))).toBe("Jan 2026 - Jun 2026");
  });
});

describe("formatUpdated", () => {
  it("builds the CV meta text", () => {
    expect(formatUpdated("2026-09")).toBe("Updated Sep 2026");
    expect(formatUpdated(undefined)).toBeNull();
  });
});

describe("sortRoles", () => {
  it("puts current roles first, then newest end date first", () => {
    const sorted = sortRoles([
      role("Old", "2024-01", "2024-12"),
      role("Recent", "2025-06", "2025-12"),
      role("Now", "2026-01", null),
    ]);
    expect(sorted.map((r) => r.title)).toEqual(["Now", "Recent", "Old"]);
  });

  it("orders several current roles by newest start", () => {
    const sorted = sortRoles([
      role("Earlier", "2025-01", null),
      role("Later", "2026-03", null),
    ]);
    expect(sorted.map((r) => r.title)).toEqual(["Later", "Earlier"]);
  });

  it("breaks end date ties by newest start", () => {
    const sorted = sortRoles([
      role("Short", "2025-10", "2025-12"),
      role("Long", "2025-01", "2025-12"),
    ]);
    expect(sorted.map((r) => r.title)).toEqual(["Short", "Long"]);
  });

  it("does not mutate its input", () => {
    const input = [role("A", "2024-01", "2024-02"), role("B", "2026-01", null)];
    sortRoles(input);
    expect(input[0].title).toBe("A");
  });
});

describe("validateRoleDraft", () => {
  const valid = {
    title: "Sales Executive",
    startYear: "2026",
    startMonth: "1",
    endYear: "2026",
    endMonth: "6",
    current: false,
  };

  it("accepts a complete role", () => {
    expect(validateRoleDraft(valid)).toEqual({});
  });

  it("reports a missing title and start", () => {
    const e = validateRoleDraft({ ...valid, title: "  ", startYear: "" });
    expect(e.title).toBeDefined();
    expect(e.start).toBeDefined();
  });

  it("reports a missing end unless the role is current", () => {
    expect(validateRoleDraft({ ...valid, endMonth: "" }).end).toBeDefined();
    expect(validateRoleDraft({ ...valid, endMonth: "", current: true })).toEqual({});
  });

  it("reports an end before the start", () => {
    const e = validateRoleDraft({ ...valid, endYear: "2025" });
    expect(e.end).toContain("before");
  });
});


describe("formatDay", () => {
  it("formats a full date", () => {
    expect(formatDay("2026-09-30")).toBe("30 Sep 2026");
    expect(formatDay("2027-01-05")).toBe("5 Jan 2027");
    expect(formatDay("nope")).toBe("nope");
  });
});
