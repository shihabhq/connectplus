import type { CSSProperties } from "react";
import { accentCssVars } from "@/lib/color";
import type { Profile } from "@/lib/profile";
import { AboutSection } from "./AboutSection";
import { ActionBar } from "./ActionBar";
import { Backdrop } from "./Backdrop";
import { CardFooter } from "./CardFooter";
import { ContactSection } from "./ContactSection";
import { CvSection } from "./CvSection";
import { ExperienceSection } from "./ExperienceSection";
import { Hero } from "./Hero";
import { SkillsSection } from "./SkillsSection";
import { SocialRow } from "./SocialRow";

/**
 * The one card component. The public page and the Studio preview both render this.
 * Layout responds to the width of its own container, so the preview stays a phone
 * layout even on a wide screen.
 */
export function ProfileCard({ profile }: { profile: Profile }) {
  const s = profile.sections;
  const hasCv = profile.cv.enabled && Boolean(profile.cv.file);

  return (
    <div
      className="accent-scope relative min-h-full bg-bg text-text-2"
      style={accentCssVars(profile.accent) as CSSProperties}
    >
      <div className="@container relative isolate overflow-x-clip">
        <Backdrop />
        <main className="relative mx-auto w-full max-w-[440px] px-5 pb-12 pt-12 @5xl:max-w-[1040px] @5xl:px-8 @5xl:pt-12">
          <div className="grid grid-cols-[minmax(0,1fr)] gap-8 @5xl:grid-cols-[380px_minmax(0,1fr)] @5xl:items-start @5xl:gap-x-14">
            <div className="flex min-w-0 flex-col gap-8 @5xl:sticky @5xl:top-12">
              <Hero profile={profile} index={0} />
              <ActionBar profile={profile} index={1} />
              <SocialRow profile={profile} index={2} />
            </div>
            <div className="flex min-w-0 flex-col gap-8">
              {s.about && profile.about.trim() && (
                <AboutSection about={profile.about} index={3} />
              )}
              {s.skills && profile.skills.length > 0 && (
                <SkillsSection skills={profile.skills} index={4} />
              )}
              {s.experience && profile.experience.length > 0 && (
                <ExperienceSection experience={profile.experience} index={5} />
              )}
              {hasCv && <CvSection profile={profile} index={6} />}
              {s.contact && <ContactSection profile={profile} index={7} />}
            </div>
          </div>
          <CardFooter />
        </main>
      </div>
    </div>
  );
}
