import {
  AddressBook,
  Briefcase,
  FileText,
  Lightbulb,
  Palette,
  ShareNetwork,
  TextAlignLeft,
  UserCircle,
  type Icon,
} from "@phosphor-icons/react";
import { plural, type SectionKey } from "@/lib/profile";
import type { StudioState } from "@/lib/studio-store";

export type StudioSectionId =
  | "profile"
  | "contact"
  | "socials"
  | "about"
  | "skills"
  | "experience"
  | "cv"
  | "theme";

export type StudioSectionMeta = {
  id: StudioSectionId;
  label: string;
  icon: Icon;
  description: string;
  /** Key in profile.sections when the section has a "Show on card" switch. */
  toggle?: SectionKey;
};

export const STUDIO_SECTIONS: StudioSectionMeta[] = [
  {
    id: "profile",
    label: "Profile",
    icon: UserCircle,
    description: "Your photo and the details people see first.",
  },
  {
    id: "contact",
    label: "Contact",
    icon: AddressBook,
    description: "How people reach you. Save contact and Call use these details.",
    toggle: "contact",
  },
  {
    id: "socials",
    label: "Social links",
    icon: ShareNetwork,
    description: "Up to 6 links. Drag to change the order they appear in.",
    toggle: "socials",
  },
  {
    id: "about",
    label: "About",
    icon: TextAlignLeft,
    description: "A short introduction in your own words.",
    toggle: "about",
  },
  {
    id: "skills",
    label: "Skills",
    icon: Lightbulb,
    description: "Up to 8 things you are good at.",
    toggle: "skills",
  },
  {
    id: "experience",
    label: "Experience",
    icon: Briefcase,
    description: "Where you have worked and what you did there.",
    toggle: "experience",
  },
  {
    id: "cv",
    label: "CV / Resume",
    icon: FileText,
    description: "Let people download your CV from your card.",
  },
  {
    id: "theme",
    label: "Theme",
    icon: Palette,
    description: "Pick the one colour your card uses for emphasis.",
  },
];

/** One-line summary shown on the mobile section hub. */
export function sectionSummary(id: StudioSectionId, state: StudioState): string {
  const p = state.profile;
  switch (id) {
    case "profile":
      return [p.name, p.title].filter(Boolean).join(", ") || "Add your name and title";
    case "contact":
      return [p.phone, p.email].filter(Boolean).join(", ") || "Add a phone number";
    case "socials":
      return p.socials.length ? plural(p.socials.length, "link") : "No links yet";
    case "about":
      return p.about.trim() ? `${p.about.length} of 500 characters` : "Not written yet";
    case "skills": {
      if (!p.skills.length) return "No skills yet";
      const shown = p.skills.slice(0, 2).join(", ");
      const rest = p.skills.length - 2;
      return rest > 0 ? `${shown} +${rest}` : shown;
    }
    case "experience":
      return p.experience.length ? plural(p.experience.length, "company", "companies") : "No experience yet";
    case "cv":
      return state.cvUnlocked ? (state.cvUpload?.name ?? "Unlocked") : "Locked, ৳500 one-time";
    case "theme":
      return p.accent;
  }
}
