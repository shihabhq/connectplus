import { describe, expect, it } from "vitest";
import {
  addOneYear,
  createSeed,
  deserialise,
  serialise,
  studioReducer,
  type StudioAction,
  type StudioState,
} from "./studio-store";

const run = (state: StudioState, ...actions: StudioAction[]) =>
  actions.reduce(studioReducer, state);

const seed = () => ({ ...createSeed(), hydrated: true });

describe("studioReducer", () => {
  it("updates fields and marks the state as saving", () => {
    const s = run(seed(), { type: "updateField", field: "name", value: "Ada" });
    expect(s.profile.name).toBe("Ada");
    expect(s.saveStatus).toBe("saving");
    expect(studioReducer(s, { type: "saved" }).saveStatus).toBe("saved");
  });

  it("clears empty optional fields and caps the about text", () => {
    const s = run(
      seed(),
      { type: "updateField", field: "location", value: "  " },
      { type: "updateField", field: "about", value: "x".repeat(600) },
    );
    expect(s.profile.location).toBeUndefined();
    expect(s.profile.about).toHaveLength(500);
  });

  it("adds, edits, reorders and removes socials, with a cap of 6 and no duplicates", () => {
    let s = seed(); // 4 socials
    s = run(s, { type: "addSocial", socialType: "facebook" });
    expect(s.profile.socials).toHaveLength(4);
    s = run(
      s,
      { type: "addSocial", socialType: "x" },
      { type: "addSocial", socialType: "github" },
      { type: "addSocial", socialType: "email" },
    );
    expect(s.profile.socials).toHaveLength(6);
    s = run(s, { type: "updateSocial", socialType: "x", value: "@ada" });
    expect(s.profile.socials.find((x) => x.type === "x")?.value).toBe("@ada");
    s = run(s, { type: "reorderSocials", from: 4, to: 0 });
    expect(s.profile.socials[0].type).toBe("x");
    s = run(s, { type: "removeSocial", socialType: "x" });
    expect(s.profile.socials).toHaveLength(5);
  });

  it("limits skills to 8 and rejects duplicates", () => {
    let s = seed(); // 5 skills
    s = run(s, { type: "addSkill", skill: "brand strategy" });
    expect(s.profile.skills).toHaveLength(5);
    s = run(
      s,
      { type: "addSkill", skill: "A" },
      { type: "addSkill", skill: "B" },
      { type: "addSkill", skill: "C" },
      { type: "addSkill", skill: "D" },
    );
    expect(s.profile.skills).toHaveLength(8);
    s = run(s, { type: "removeSkill", skill: "A" });
    expect(s.profile.skills).not.toContain("A");
  });

  it("saves roles sorted, current first", () => {
    let s = seed();
    s = run(s, {
      type: "saveRole",
      company: 0,
      role: null,
      value: { title: "Intern", start: "2025-01", end: "2025-05", current: false },
    });
    expect(s.profile.experience[0].roles.map((r) => r.title)).toEqual([
      "Sales Executive",
      "Creative Visualizer",
      "Intern",
    ]);
    s = run(s, { type: "deleteRole", company: 0, role: 2 });
    expect(s.profile.experience[0].roles).toHaveLength(2);
  });

  it("adds, renames, moves and deletes companies", () => {
    let s = seed();
    s = run(s, { type: "addCompany", name: "Acme" });
    s = run(s, { type: "renameCompany", index: 2, name: "Acme Ltd" });
    s = run(s, { type: "moveCompany", index: 2, direction: -1 });
    expect(s.profile.experience.map((c) => c.name)).toEqual([
      "DSAT School",
      "Acme Ltd",
      "SA Trading Corporation",
    ]);
    s = run(s, { type: "moveCompany", index: 0, direction: -1 });
    expect(s.profile.experience[0].name).toBe("DSAT School");
    s = run(s, { type: "deleteCompany", index: 1 });
    expect(s.profile.experience).toHaveLength(2);
  });

  it("starts with the CV locked and unlocks it with billing dates", () => {
    let s = seed();
    expect(s.profile.cv.enabled).toBe(false);
    s = run(s, { type: "unlockCv", method: "bkash", today: "2026-09-30" });
    expect(s.cvUnlocked).toBe(true);
    expect(s.profile.cv.enabled).toBe(true);
    expect(s.billing).toMatchObject({
      setupPaidOn: "2026-09-30",
      nextRenewal: "2027-09-30",
      method: "bkash",
      renewalOn: true,
    });
    s = run(s, { type: "setRenewal", value: false });
    expect(s.billing?.renewalOn).toBe(false);
  });

  it("resets to the seed", () => {
    const s = run(seed(), { type: "updateField", field: "name", value: "Ada" }, { type: "reset" });
    expect(s.profile.name).toBe("Shamsul Al Amin");
  });
});

describe("storage", () => {
  it("round-trips state and drops object URLs", () => {
    let s = seed();
    s = run(s, { type: "unlockCv", method: "card", today: "2026-01-05" });
    s = run(s, { type: "setCvFile", file: "blob:http://x/1", name: "cv.pdf", size: 10 });
    const back = deserialise(serialise(s));
    expect(back?.profile?.cv.file).toBe("/cv/shamsul-al-amin.pdf");
    expect(back?.cvUpload?.name).toBe("cv.pdf");
    expect(back?.billing?.method).toBe("card");
  });

  it("ignores broken storage", () => {
    expect(deserialise(null)).toBeNull();
    expect(deserialise("{nope")).toBeNull();
    expect(deserialise(JSON.stringify({ profile: { name: 1 } }))).toBeNull();
  });

  it("adds one year", () => {
    expect(addOneYear("2026-09-30")).toBe("2027-09-30");
  });
});
