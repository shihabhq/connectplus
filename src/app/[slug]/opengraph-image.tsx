import { readFile } from "node:fs/promises";
import path from "node:path";
import { ImageResponse } from "next/og";
import { buildAccentTokens, DEFAULT_ACCENT, NEUTRAL } from "@/lib/color";
import { getAllSlugs, getProfile } from "@/lib/profile";

export const alt = "CorpoMerch Card";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export function generateStaticParams() {
  return getAllSlugs().map((slug) => ({ slug }));
}

async function photoDataUrl(photo: string): Promise<string | null> {
  if (photo.startsWith("data:")) return photo;
  if (!photo.startsWith("/") || photo.startsWith("//")) return null;
  try {
    const bytes = await readFile(path.join(process.cwd(), "public", photo));
    const type = photo.toLowerCase().endsWith(".png") ? "image/png" : "image/jpeg";
    return `data:${type};base64,${bytes.toString("base64")}`;
  } catch {
    return null;
  }
}

export default async function Image({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const profile = getProfile(slug);
  const t = buildAccentTokens(profile?.accent ?? DEFAULT_ACCENT);
  const photo = profile ? await photoDataUrl(profile.photo) : null;
  const name = profile?.name ?? "CorpoMerch Card";
  const line = profile ? `${profile.title}` : "Digital business cards";
  const company = profile
    ? [profile.company, profile.location].filter(Boolean).join(" · ")
    : "";

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          position: "relative",
          background: NEUTRAL.bg,
          backgroundImage: `linear-gradient(to right, ${NEUTRAL.grid} 1px, transparent 1px), linear-gradient(to bottom, ${NEUTRAL.grid} 1px, transparent 1px)`,
          backgroundSize: "44px 44px",
          fontFamily: "sans-serif",
        }}
      >
        <div
          style={{
            position: "absolute",
            inset: 0,
            display: "flex",
            background:
              "radial-gradient(ellipse 60% 75% at 24% 50%, rgba(255,255,255,0) 0%, rgba(255,255,255,0.75) 55%, " + NEUTRAL.bg + " 100%)",
          }}
        />

        <div
          style={{
            display: "flex",
            position: "relative",
            width: 420,
            height: 460,
            marginLeft: 96,
            marginRight: 76,
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <div
            style={{
              position: "absolute",
              inset: -60,
              display: "flex",
              background: `radial-gradient(circle, ${t.accentRing} 0%, rgba(255,255,255,0) 68%)`,
            }}
          />
          <div
            style={{
              display: "flex",
              width: 380,
              height: 420,
              borderRadius: 56,
              overflow: "hidden",
              border: `4px solid ${t.accent}`,
              background: t.accentSoft,
              boxShadow: `0 30px 60px -24px ${t.accentRing}`,
            }}
          >
            {photo ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={photo}
                alt=""
                width={372}
                height={412}
                style={{ objectFit: "cover", width: 372, height: 412 }}
              />
            ) : (
              <div
                style={{
                  display: "flex",
                  width: "100%",
                  height: "100%",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: 140,
                  fontWeight: 700,
                  color: t.accentInk,
                }}
              >
                {name.charAt(0)}
              </div>
            )}
          </div>
        </div>

        <div
          style={{
            display: "flex",
            flexDirection: "column",
            position: "relative",
            flex: 1,
            paddingRight: 80,
          }}
        >
          <div
            style={{
              display: "flex",
              fontSize: 76,
              fontWeight: 700,
              letterSpacing: -2,
              lineHeight: 1.05,
              color: t.accentInk,
            }}
          >
            {name}
          </div>
          <div
            style={{
              display: "flex",
              marginTop: 22,
              fontSize: 36,
              fontWeight: 500,
              color: NEUTRAL.text,
              lineHeight: 1.2,
            }}
          >
            {line}
          </div>
          {company && (
            <div
              style={{
                display: "flex",
                marginTop: 12,
                fontSize: 28,
                color: NEUTRAL.text3,
              }}
            >
              {company}
            </div>
          )}
        </div>

        <div
          style={{
            position: "absolute",
            left: 96,
            bottom: 44,
            display: "flex",
            fontSize: 24,
            fontWeight: 600,
            color: NEUTRAL.text3,
          }}
        >
          corpomerch.com
        </div>
      </div>
    ),
    { ...size },
  );
}
