import { UserCircle } from "@phosphor-icons/react/dist/ssr";
import { Section } from "./Section";

export function AboutSection({ about, index }: { about: string; index: number }) {
  return (
    <Section id="about" label="About" icon={UserCircle} index={index}>
      <p className="max-w-[62ch] whitespace-pre-line [overflow-wrap:anywhere] text-left text-[15px] leading-[1.7] text-text-2 @5xl:text-base">
        {about}
      </p>
    </Section>
  );
}
