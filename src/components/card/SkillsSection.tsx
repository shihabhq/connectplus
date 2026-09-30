import { Lightbulb } from "@phosphor-icons/react/dist/ssr";
import { Section } from "./Section";

export function SkillsSection({ skills, index }: { skills: string[]; index: number }) {
  return (
    <Section id="skills" label="Skills" icon={Lightbulb} index={index}>
      <ul className="flex flex-wrap gap-2">
        {skills.map((skill) => (
          <li
            key={skill}
            className="max-w-full rounded-chip border border-border-strong bg-surface px-[13px] py-[7px] text-[13.5px] [overflow-wrap:anywhere] font-medium text-text-2 transition-[border-color,box-shadow] duration-200 hover:border-accent-ring hover:shadow-[0_0_0_4px_var(--accent-ring)]"
          >
            {skill}
          </li>
        ))}
      </ul>
    </Section>
  );
}
