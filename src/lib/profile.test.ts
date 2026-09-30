import { describe, expect, it } from "vitest";
import {
  firstSentence,
  formatPhone,
  getAllSlugs,
  getDemoProfile,
  getProfile,
  profileSchema,
  socialHref,
} from "./profile";

describe("demo profile", () => {
  it("passes the schema and is listed", () => {
    const p = getDemoProfile();
    expect(profileSchema.safeParse(p).success).toBe(true);
    expect(getAllSlugs()).toContain("shamsul-al-amin");
    expect(getProfile("nobody")).toBeNull();
  });

  it("uses no em dashes in content", () => {
    expect(JSON.stringify(getDemoProfile())).not.toContain(String.fromCharCode(0x2014));
  });

  it("rejects bad data", () => {
    const p = getDemoProfile();
    expect(profileSchema.safeParse({ ...p, phone: "01700000000" }).success).toBe(false);
    expect(profileSchema.safeParse({ ...p, accent: "#FFFFCC" }).success).toBe(false);
    expect(profileSchema.safeParse({ ...p, about: "x".repeat(501) }).success).toBe(false);
    expect(profileSchema.safeParse({ ...p, skills: Array(9).fill("a") }).success).toBe(false);
  });
});

describe("formatPhone", () => {
  it("formats Bangladesh numbers and leaves others alone", () => {
    expect(formatPhone("+8801700000000")).toBe("+880 1700-000000");
    expect(formatPhone("+14155550123")).toBe("+14155550123");
  });
});

describe("socialHref", () => {
  it("adds https to bare domains", () => {
    expect(socialHref("facebook", "facebook.com/x")).toBe("https://facebook.com/x");
    expect(socialHref("website", "www.corpomerch.com")).toBe("https://www.corpomerch.com");
  });

  it("keeps full URLs", () => {
    expect(socialHref("linkedin", "https://linkedin.com/in/a")).toBe("https://linkedin.com/in/a");
  });

  it("turns WhatsApp numbers into wa.me links", () => {
    expect(socialHref("whatsapp", "+880 1700-000000")).toBe("https://wa.me/8801700000000");
    expect(socialHref("whatsapp", "abc")).toBeNull();
  });

  it("turns email into mailto", () => {
    expect(socialHref("email", "a@b.com")).toBe("mailto:a@b.com");
    expect(socialHref("email", "mailto:a@b.com")).toBe("mailto:a@b.com");
    expect(socialHref("email", "not an email")).toBeNull();
  });

  it("expands handles per platform", () => {
    expect(socialHref("telegram", "@shamsul")).toBe("https://t.me/shamsul");
    expect(socialHref("instagram", "shamsul")).toBe("https://instagram.com/shamsul");
    expect(socialHref("x", "@shamsul")).toBe("https://x.com/shamsul");
    expect(socialHref("github", "octocat")).toBe("https://github.com/octocat");
  });

  it("refuses unsafe schemes and empty values", () => {
    expect(socialHref("website", "javascript:alert(1)")).toBeNull();
    expect(socialHref("website", "data:text/html,hi")).toBeNull();
    expect(socialHref("website", "  ")).toBeNull();
  });
});

describe("firstSentence", () => {
  it("returns the first sentence", () => {
    expect(firstSentence("Marketing and finance professional. I lead marketing.")).toBe(
      "Marketing and finance professional.",
    );
    expect(firstSentence("No full stop here")).toBe("No full stop here");
  });
});
