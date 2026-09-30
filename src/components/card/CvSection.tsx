import { DownloadSimple, FilePdf, FileText } from "@phosphor-icons/react/dist/ssr";
import { formatUpdated } from "@/lib/dates";
import type { Profile } from "@/lib/profile";
import { Section } from "./Section";

export function CvSection({ profile, index }: { profile: Profile; index: number }) {
  const { file, label, updated } = profile.cv;
  if (!profile.cv.enabled || !file) return null;
  const meta = ["PDF", formatUpdated(updated)].filter(Boolean).join(" · ");

  return (
    <Section id="cv" label="CV" icon={FileText} index={index}>
      <div className="sheen relative flex flex-wrap items-center gap-x-3.5 gap-y-3 overflow-hidden rounded-card border border-border bg-surface p-[18px] shadow-md">
        <span
          aria-hidden
          className="flex h-12 w-12 shrink-0 items-center justify-center rounded-tile bg-bg-subtle text-accent-ink"
        >
          <FilePdf size={26} weight="fill" />
        </span>
        <div className="min-w-[8rem] flex-1">
          <p className="[overflow-wrap:anywhere] text-[15px] font-semibold text-text">
            {label?.trim() || "Full CV"}
          </p>
          <p className="tabular text-[13px] text-text-3">{meta}</p>
        </div>
        <a
          href={file}
          download
          className="relative inline-flex h-11 w-full shrink-0 items-center justify-center gap-1.5 @[400px]:w-auto rounded-btn bg-accent-strong px-4 text-sm font-semibold text-on-accent transition-transform duration-200 active:scale-[0.97]"
        >
          <DownloadSimple size={18} weight="fill" aria-hidden />
          Download
        </a>
      </div>
    </Section>
  );
}
