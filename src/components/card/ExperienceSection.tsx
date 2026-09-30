import { Briefcase } from "@phosphor-icons/react/dist/ssr";
import { formatRange, sortRoles } from "@/lib/dates";
import { initialOf, plural, type Company } from "@/lib/profile";
import { Section } from "./Section";

export function ExperienceSection({
  experience,
  index,
}: {
  experience: Company[];
  index: number;
}) {
  return (
    <Section id="experience" label="Experience" icon={Briefcase} index={index}>
      <div className="flex flex-col gap-3">
        {experience.map((company, i) => {
          const roles = sortRoles(company.roles);
          return (
            <article
              key={`${company.name}-${i}`}
              className="rounded-card border border-border bg-surface p-[18px] shadow-md"
            >
              <header className="flex items-center gap-3">
                <span
                  aria-hidden
                  className="flex h-10 w-10 shrink-0 items-center justify-center rounded-tile bg-accent-soft text-base font-semibold text-accent-ink"
                >
                  {initialOf(company.name)}
                </span>
                <div className="min-w-0">
                  <h3 className="text-base font-semibold leading-tight text-text">
                    {company.name}
                  </h3>
                  <p className="text-[13px] text-text-3">
                    {plural(roles.length, "role")}
                  </p>
                </div>
              </header>

              <ol className="relative mt-4 flex flex-col gap-4 pl-6">
                <span
                  aria-hidden
                  className="absolute bottom-1.5 left-[4.25px] top-1.5 w-[1.5px] bg-border-strong"
                />
                {roles.map((role, j) => (
                  <li key={`${role.title}-${j}`} className="relative">
                    <span
                      aria-hidden
                      className={`absolute -left-6 top-[5px] h-2.5 w-2.5 rounded-full ${
                        role.current ? "dot-glow bg-accent" : "bg-(--dot-idle)"
                      }`}
                    />
                    <div className="flex flex-wrap items-center gap-x-2 gap-y-1">
                      <h4 className="text-[15px] font-medium leading-snug text-text">
                        {role.title}
                      </h4>
                      {role.current && (
                        <span className="rounded-chip bg-accent-soft px-2 py-0.5 text-[11px] font-semibold text-accent-ink">
                          Current
                        </span>
                      )}
                    </div>
                    <p className="tabular mt-0.5 text-[13px] text-text-3">
                      {formatRange(role)}
                    </p>
                  </li>
                ))}
              </ol>
            </article>
          );
        })}
      </div>
    </Section>
  );
}
