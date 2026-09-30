"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import {
  ArrowLeft,
  ArrowRight,
  ArrowCounterClockwise,
  CaretRight,
  Eye,
  ListBullets,
} from "@phosphor-icons/react";
import { Button } from "@/components/ui/Button";
import { ToastProvider, useToast } from "@/components/ui/Toast";
import { AboutSection } from "./sections/AboutSection";
import { ContactSection } from "./sections/ContactSection";
import { CvSection } from "./sections/CvSection";
import { ExperienceSection } from "./sections/ExperienceSection";
import { ProfileSection } from "./sections/ProfileSection";
import { SkillsSection } from "./sections/SkillsSection";
import { SocialsSection } from "./sections/SocialsSection";
import { ThemeSection } from "./sections/ThemeSection";
import { FullPreview, PhonePreview } from "./PreviewPane";
import { SectionNav } from "./SectionNav";
import { SectionShell } from "./SectionShell";
import { STUDIO_SECTIONS, sectionSummary, type StudioSectionId } from "./sections";
import { StudioProvider, useStudio } from "./StudioProvider";
import { TopBar } from "./TopBar";

const BODY: Record<StudioSectionId, ReactNode> = {
  profile: <ProfileSection />,
  contact: <ContactSection />,
  socials: <SocialsSection />,
  about: <AboutSection />,
  skills: <SkillsSection />,
  experience: <ExperienceSection />,
  cv: <CvSection />,
  theme: <ThemeSection />,
};

function Hub({ onOpen }: { onOpen: (id: StudioSectionId) => void }) {
  const { state, dispatch } = useStudio();
  const toast = useToast();
  return (
    <div className="min-[860px]:hidden">
      <h2 className="text-[22px] font-bold tracking-[-0.02em] text-text">Your card</h2>
      <p className="mt-1 text-sm text-text-3">Choose a section to edit. Changes save on their own.</p>
      <ul className="mt-5 flex flex-col gap-2.5">
        {STUDIO_SECTIONS.map(({ id, label, icon: IconCmp }) => (
          <li key={id}>
            <button
              type="button"
              onClick={() => onOpen(id)}
              className="flex min-h-[68px] w-full items-center gap-3.5 rounded-card border border-border bg-surface p-3.5 text-left shadow-sm transition-transform duration-200 active:scale-[0.99]"
            >
              <span
                aria-hidden
                className="flex h-11 w-11 shrink-0 items-center justify-center rounded-tile bg-bg-subtle text-accent-ink"
              >
                <IconCmp size={22} weight="fill" />
              </span>
              <span className="min-w-0 flex-1">
                <span className="block text-[15px] font-semibold text-text">{label}</span>
                <span className="block truncate text-[13px] text-text-3">
                  {sectionSummary(id, state)}
                </span>
              </span>
              <CaretRight size={16} weight="bold" className="shrink-0 text-text-3" aria-hidden />
            </button>
          </li>
        ))}
      </ul>
      <Button
        variant="ghost"
        className="mt-4 w-full"
        icon={<ArrowCounterClockwise size={16} weight="bold" aria-hidden />}
        onClick={() => {
          dispatch({ type: "reset" });
          toast("Demo reset to the starting profile");
        }}
      >
        Reset demo
      </Button>
    </div>
  );
}

function Shell() {
  const [active, setActive] = useState<StudioSectionId>("profile");
  const [hub, setHub] = useState(true);
  const [previewOpen, setPreviewOpen] = useState(false);
  const top = useRef<HTMLDivElement>(null);

  const index = STUDIO_SECTIONS.findIndex((s) => s.id === active);
  const meta = STUDIO_SECTIONS[index];
  const prev = STUDIO_SECTIONS[index - 1];
  const next = STUDIO_SECTIONS[index + 1];

  function open(id: StudioSectionId) {
    setActive(id);
    setHub(false);
  }

  // Bring the editor back to the top whenever the section changes.
  useEffect(() => {
    top.current?.scrollIntoView({ block: "start" });
  }, [active, hub]);

  return (
    <div className="min-h-dvh bg-bg-subtle">
      <TopBar />

      <div className="mx-auto grid max-w-[1500px] gap-x-8 px-4 pb-28 pt-6 min-[860px]:grid-cols-[minmax(0,1fr)_340px] min-[860px]:px-6 min-[860px]:pb-16 min-[1180px]:grid-cols-[220px_minmax(0,1fr)_390px]">
        <div className="sticky top-[72px] hidden self-start min-[1180px]:block">
          <SectionNav active={active} onSelect={setActive} variant="list" />
        </div>

        <main ref={top} className="min-w-0 scroll-mt-20">
          {hub && <Hub onOpen={open} />}

          <div className={hub ? "hidden min-[860px]:block" : ""}>
            <div className="mb-6 hidden min-[860px]:block min-[1180px]:hidden">
              <SectionNav active={active} onSelect={setActive} variant="pills" />
            </div>
            <div className="mx-auto max-w-[720px]">
              <SectionShell key={active} meta={meta}>
                {BODY[active]}
              </SectionShell>

              <div className="mt-8 hidden items-center justify-between min-[860px]:flex">
                {prev ? (
                  <Button
                    variant="secondary"
                    onClick={() => setActive(prev.id)}
                    icon={<ArrowLeft size={16} weight="bold" aria-hidden />}
                  >
                    {prev.label}
                  </Button>
                ) : (
                  <span />
                )}
                {next && (
                  <Button variant="primary" onClick={() => setActive(next.id)}>
                    {next.label}
                    <ArrowRight size={16} weight="bold" aria-hidden />
                  </Button>
                )}
              </div>
            </div>
          </div>
        </main>

        <PhonePreview />
      </div>

      {!hub && (
        <nav
          aria-label="Section navigation"
          className="fixed inset-x-0 bottom-0 z-40 grid grid-cols-3 gap-2 border-t border-border bg-surface/95 p-2.5 backdrop-blur min-[860px]:hidden"
        >
          <Button variant="secondary" onClick={() => setHub(true)} icon={<ListBullets size={18} weight="bold" aria-hidden />}>
            All sections
          </Button>
          <Button variant="secondary" onClick={() => setPreviewOpen(true)} icon={<Eye size={18} weight="bold" aria-hidden />}>
            Preview
          </Button>
          <Button variant="primary" disabled={!next} onClick={() => next && setActive(next.id)}>
            Next
            <ArrowRight size={16} weight="bold" aria-hidden />
          </Button>
        </nav>
      )}

      {hub && (
        <div className="fixed inset-x-0 bottom-0 z-40 border-t border-border bg-surface/95 p-2.5 backdrop-blur min-[860px]:hidden">
          <Button variant="primary" className="w-full" onClick={() => setPreviewOpen(true)} icon={<Eye size={18} weight="bold" aria-hidden />}>
            Preview your card
          </Button>
        </div>
      )}

      {previewOpen && <FullPreview onClose={() => setPreviewOpen(false)} />}
    </div>
  );
}

export function StudioApp() {
  return (
    <ToastProvider>
      <StudioProvider>
        <Shell />
      </StudioProvider>
    </ToastProvider>
  );
}
