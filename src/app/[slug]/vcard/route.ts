import { readFile } from "node:fs/promises";
import path from "node:path";
import { getProfile } from "@/lib/profile";
import { buildVCard } from "@/lib/vcard";

/** Reads a photo that lives under /public and returns it as base64, or undefined. */
async function readPhotoBase64(photo: string): Promise<string | undefined> {
  if (!photo.startsWith("/") || photo.startsWith("//")) return undefined;
  const publicDir = path.join(process.cwd(), "public");
  const file = path.resolve(publicDir, "." + photo);
  if (!file.startsWith(publicDir + path.sep)) return undefined;
  try {
    return (await readFile(file)).toString("base64");
  } catch {
    return undefined;
  }
}

export async function GET(request: Request, ctx: RouteContext<"/[slug]/vcard">) {
  const { slug } = await ctx.params;
  const profile = getProfile(slug);
  if (!profile) return new Response("Card not found", { status: 404 });

  const url = new URL(`/${profile.slug}`, request.url).toString();
  const body = buildVCard(profile, {
    url,
    photoBase64: await readPhotoBase64(profile.photo),
  });

  return new Response(body, {
    headers: {
      "Content-Type": "text/vcard; charset=utf-8",
      "Content-Disposition": `attachment; filename="${profile.slug}.vcf"`,
      "Cache-Control": "public, max-age=0, s-maxage=3600, stale-while-revalidate=86400",
    },
  });
}
