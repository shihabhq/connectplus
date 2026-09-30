import { normaliseWebsite, type Profile } from "./profile";

const CRLF = "\r\n";

/** Escapes text values as vCard 3.0 requires: backslash, comma, semicolon and newlines. */
export function escapeVCardText(value: string): string {
  return value
    .replace(/\\/g, "\\\\")
    .replace(/\r\n|\r|\n/g, "\\n")
    .replace(/,/g, "\\,")
    .replace(/;/g, "\\;");
}

/** Folds a content line at 75 characters, continuation lines start with one space. */
export function foldLine(line: string): string {
  if (line.length <= 75) return line;
  const parts = [line.slice(0, 75)];
  for (let i = 75; i < line.length; i += 74) parts.push(" " + line.slice(i, i + 74));
  return parts.join(CRLF);
}

/** "Shamsul Al Amin" -> family "Amin", given "Shamsul Al". A single word is the given name. */
export function splitName(full: string): { family: string; given: string } {
  const words = full.trim().split(/\s+/).filter(Boolean);
  if (words.length <= 1) return { family: "", given: words[0] ?? "" };
  return { family: words[words.length - 1], given: words.slice(0, -1).join(" ") };
}

export type VCardOptions = {
  /** Absolute URL of the public card page. */
  url: string;
  /** Base64 of the JPEG photo, without a data URL prefix. Omit when unavailable. */
  photoBase64?: string;
};

export function buildVCard(profile: Profile, options: VCardOptions): string {
  const { family, given } = splitName(profile.name);
  const lines = [
    "BEGIN:VCARD",
    "VERSION:3.0",
    `N:${escapeVCardText(family)};${escapeVCardText(given)};;;`,
    `FN:${escapeVCardText(profile.name)}`,
    `ORG:${escapeVCardText(profile.company)}`,
    `TITLE:${escapeVCardText(profile.title)}`,
    `TEL;TYPE=CELL:${profile.phone}`,
  ];
  if (profile.email) lines.push(`EMAIL;TYPE=INTERNET:${escapeVCardText(profile.email)}`);
  lines.push(`URL:${options.url}`);
  const website = normaliseWebsite(profile.website);
  if (website && website !== options.url) lines.push(`URL:${website}`);
  if (profile.location) lines.push(`ADR;TYPE=WORK:;;;${escapeVCardText(profile.location)};;;`);
  if (options.photoBase64) lines.push(`PHOTO;ENCODING=b;TYPE=JPEG:${options.photoBase64}`);
  lines.push("END:VCARD");
  return lines.map(foldLine).join(CRLF) + CRLF;
}
