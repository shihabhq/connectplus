import { describe, expect, it } from "vitest";
import { buildVCard, escapeVCardText, foldLine, splitName } from "./vcard";
import { getDemoProfile } from "./profile";

const profile = getDemoProfile();
const url = "https://example.com/shamsul-al-amin";

describe("escapeVCardText", () => {
  it("escapes commas, semicolons, backslashes and newlines", () => {
    expect(escapeVCardText("a, b; c\\d\ne")).toBe("a\\, b\\; c\\\\d\\ne");
  });
});

describe("splitName", () => {
  it("uses the last word as the family name", () => {
    expect(splitName("Shamsul Al Amin")).toEqual({ family: "Amin", given: "Shamsul Al" });
    expect(splitName("Madonna")).toEqual({ family: "", given: "Madonna" });
  });
});

describe("foldLine", () => {
  it("leaves short lines alone and folds long ones at 75 characters", () => {
    expect(foldLine("short")).toBe("short");
    const folded = foldLine("X".repeat(200)).split("\r\n");
    expect(folded[0]).toHaveLength(75);
    expect(folded.slice(1).every((l) => l.startsWith(" ") && l.length <= 75)).toBe(true);
    expect(folded.join("").replace(/ /g, "")).toBe("X".repeat(200));
  });
});

describe("buildVCard", () => {
  const vcf = buildVCard(profile, { url, photoBase64: "QUJD".repeat(60) });
  const lines = vcf.split("\r\n");

  it("is a vCard 3.0 with CRLF line endings", () => {
    expect(lines[0]).toBe("BEGIN:VCARD");
    expect(lines[1]).toBe("VERSION:3.0");
    expect(lines.at(-2)).toBe("END:VCARD");
    expect(vcf.endsWith("\r\n")).toBe(true);
    expect(vcf.replace(/\r\n/g, "")).not.toMatch(/[\r\n]/);
  });

  it("includes the core contact fields", () => {
    expect(vcf).toContain("N:Amin;Shamsul Al;;;");
    expect(vcf).toContain("FN:Shamsul Al Amin");
    expect(vcf).toContain("ORG:CorpoMerch");
    expect(vcf).toContain("TITLE:Commercial & Creative Manager");
    expect(vcf).toContain("TEL;TYPE=CELL:+8801700000000");
    expect(vcf).toContain("EMAIL;TYPE=INTERNET:shamsul@corpomerch.com");
    expect(vcf).toContain(`URL:${url}`);
  });

  it("embeds a folded base64 photo", () => {
    expect(vcf).toContain("PHOTO;ENCODING=b;TYPE=JPEG:");
    expect(lines.every((l) => l.length <= 75)).toBe(true);
  });

  it("omits the photo and email when unavailable", () => {
    const bare = buildVCard({ ...profile, email: undefined }, { url });
    expect(bare).not.toContain("PHOTO");
    expect(bare).not.toContain("EMAIL");
  });

  it("escapes special characters in names and companies", () => {
    const out = buildVCard({ ...profile, company: "Acme, Inc; Ltd" }, { url });
    expect(out).toContain("ORG:Acme\\, Inc\\; Ltd");
  });
});
