import { sortRoles } from "./dates";
import { getDemoProfile, LIMITS, storedProfileSchema } from "./profile";
import type { Profile, Role, SectionKey, SocialType } from "./profile";

export const STORAGE_KEY = "corpomerch-studio-v1";
export const PLACEHOLDER_PHOTO = "/profiles/placeholder.jpg";
export const SAMPLE_CV = "/cv/shamsul-al-amin.pdf";

export type PaymentMethod = "bkash" | "nagad" | "card";

export type Billing = {
  setupPaidOn: string; // YYYY-MM-DD
  nextRenewal: string; // YYYY-MM-DD, one year after setup
  method: PaymentMethod;
  renewalOn: boolean;
};

export type SaveStatus = "idle" | "saving" | "saved";

export type StudioState = {
  profile: Profile;
  cvUnlocked: boolean;
  billing: Billing | null;
  cvUpload: { name: string; size: number } | null;
  saveStatus: SaveStatus;
  hydrated: boolean;
};

/** Every action is shaped like a call a backend could serve later. */
export type StudioAction =
  | { type: "hydrate"; state: Partial<StudioState> | null }
  | { type: "saved" }
  | { type: "reset" }
  | { type: "updateField"; field: EditableField; value: string | undefined }
  | { type: "setPhoto"; photo: string }
  | { type: "toggleSection"; section: SectionKey; value: boolean }
  | { type: "toggleAction"; action: "saveContact" | "call"; value: boolean }
  | { type: "setSocialStyle"; value: "brand" | "mono" }
  | { type: "addSocial"; socialType: SocialType }
  | { type: "updateSocial"; socialType: SocialType; value: string }
  | { type: "removeSocial"; socialType: SocialType }
  | { type: "reorderSocials"; from: number; to: number }
  | { type: "addSkill"; skill: string }
  | { type: "removeSkill"; skill: string }
  | { type: "addCompany"; name: string }
  | { type: "renameCompany"; index: number; name: string }
  | { type: "deleteCompany"; index: number }
  | { type: "moveCompany"; index: number; direction: -1 | 1 }
  | { type: "saveRole"; company: number; role: number | null; value: Role }
  | { type: "deleteRole"; company: number; role: number }
  | { type: "setAccent"; hex: string }
  | { type: "unlockCv"; method: PaymentMethod; today: string }
  | { type: "setCvFile"; file: string; name: string; size: number }
  | { type: "updateCvLabel"; label: string }
  | { type: "setRenewal"; value: boolean };

export type EditableField =
  | "name"
  | "title"
  | "company"
  | "location"
  | "status"
  | "phone"
  | "email"
  | "website"
  | "about";

export function createSeed(): StudioState {
  const demo = getDemoProfile();
  return {
    profile: {
      ...demo,
      cv: { enabled: false, label: "Full CV" },
    },
    cvUnlocked: false,
    billing: null,
    cvUpload: null,
    saveStatus: "idle",
    hydrated: false,
  };
}

/** "YYYY-MM-DD" one year after the given date. */
export function addOneYear(date: string): string {
  const [y, m, d] = date.split("-").map(Number);
  return `${y + 1}-${String(m).padStart(2, "0")}-${String(d).padStart(2, "0")}`;
}

function edit(state: StudioState, profile: Profile): StudioState {
  return { ...state, profile, saveStatus: "saving" };
}

function move<T>(list: T[], from: number, to: number): T[] {
  if (from === to || from < 0 || to < 0 || from >= list.length || to >= list.length) {
    return list;
  }
  const next = [...list];
  const [item] = next.splice(from, 1);
  next.splice(to, 0, item);
  return next;
}

export function studioReducer(state: StudioState, action: StudioAction): StudioState {
  const p = state.profile;
  switch (action.type) {
    case "hydrate":
      return { ...state, ...(action.state ?? {}), saveStatus: "idle", hydrated: true };
    case "saved":
      return state.saveStatus === "saving" ? { ...state, saveStatus: "saved" } : state;
    case "reset":
      return { ...createSeed(), saveStatus: "saving", hydrated: true };

    case "updateField": {
      const trimmedOptional = ["location", "status", "email", "website"];
      const value =
        trimmedOptional.includes(action.field) && !action.value?.trim()
          ? undefined
          : (action.value ?? "");
      const capped =
        action.field === "about" && typeof value === "string"
          ? value.slice(0, LIMITS.about)
          : value;
      return edit(state, { ...p, [action.field]: capped });
    }
    case "setPhoto":
      return edit(state, { ...p, photo: action.photo });
    case "toggleSection":
      return edit(state, { ...p, sections: { ...p.sections, [action.section]: action.value } });
    case "toggleAction":
      return edit(state, { ...p, actions: { ...p.actions, [action.action]: action.value } });
    case "setSocialStyle":
      return edit(state, { ...p, socialStyle: action.value });

    case "addSocial": {
      if (p.socials.length >= LIMITS.socials) return state;
      if (p.socials.some((s) => s.type === action.socialType)) return state;
      return edit(state, {
        ...p,
        socials: [...p.socials, { type: action.socialType, value: "" }],
      });
    }
    case "updateSocial":
      return edit(state, {
        ...p,
        socials: p.socials.map((s) =>
          s.type === action.socialType ? { ...s, value: action.value } : s,
        ),
      });
    case "removeSocial":
      return edit(state, {
        ...p,
        socials: p.socials.filter((s) => s.type !== action.socialType),
      });
    case "reorderSocials":
      return edit(state, { ...p, socials: move(p.socials, action.from, action.to) });

    case "addSkill": {
      const skill = action.skill.trim();
      if (!skill || p.skills.length >= LIMITS.skills) return state;
      if (p.skills.some((s) => s.toLowerCase() === skill.toLowerCase())) return state;
      return edit(state, { ...p, skills: [...p.skills, skill] });
    }
    case "removeSkill":
      return edit(state, { ...p, skills: p.skills.filter((s) => s !== action.skill) });

    case "addCompany":
      return edit(state, {
        ...p,
        experience: [...p.experience, { name: action.name, roles: [] }],
      });
    case "renameCompany":
      return edit(state, {
        ...p,
        experience: p.experience.map((c, i) =>
          i === action.index ? { ...c, name: action.name } : c,
        ),
      });
    case "deleteCompany":
      return edit(state, {
        ...p,
        experience: p.experience.filter((_, i) => i !== action.index),
      });
    case "moveCompany":
      return edit(state, {
        ...p,
        experience: move(p.experience, action.index, action.index + action.direction),
      });
    case "saveRole":
      return edit(state, {
        ...p,
        experience: p.experience.map((c, i) => {
          if (i !== action.company) return c;
          const roles =
            action.role === null
              ? [...c.roles, action.value]
              : c.roles.map((r, j) => (j === action.role ? action.value : r));
          return { ...c, roles: sortRoles(roles) };
        }),
      });
    case "deleteRole":
      return edit(state, {
        ...p,
        experience: p.experience.map((c, i) =>
          i === action.company
            ? { ...c, roles: c.roles.filter((_, j) => j !== action.role) }
            : c,
        ),
      });

    case "setAccent":
      return edit(state, { ...p, accent: action.hex });

    case "unlockCv":
      return {
        ...edit(state, {
          ...p,
          cv: {
            enabled: true,
            file: p.cv.file ?? SAMPLE_CV,
            label: p.cv.label || "Full CV",
            updated: action.today.slice(0, 7),
          },
        }),
        cvUnlocked: true,
        billing: {
          setupPaidOn: action.today,
          nextRenewal: addOneYear(action.today),
          method: action.method,
          renewalOn: true,
        },
      };
    case "setCvFile":
      return {
        ...edit(state, {
          ...p,
          cv: { ...p.cv, file: action.file, updated: todayMonth() },
        }),
        cvUpload: { name: action.name, size: action.size },
      };
    case "updateCvLabel":
      return edit(state, { ...p, cv: { ...p.cv, label: action.label } });
    case "setRenewal":
      return state.billing
        ? { ...state, billing: { ...state.billing, renewalOn: action.value }, saveStatus: "saving" }
        : state;
    default:
      return state;
  }
}

function todayMonth(): string {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
}

export function todayIso(): string {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}

// ------------------------------------------------------------------ storage

/** What is written to localStorage. Object URLs do not survive a reload, so they are dropped. */
export function serialise(state: StudioState): string {
  const file = state.profile.cv.file;
  const profile =
    file && file.startsWith("blob:")
      ? { ...state.profile, cv: { ...state.profile.cv, file: SAMPLE_CV } }
      : state.profile;
  return JSON.stringify({
    profile,
    cvUnlocked: state.cvUnlocked,
    billing: state.billing,
    cvUpload: state.cvUpload,
  });
}

/** Reads and validates stored state. Returns null when nothing usable is stored. */
export function deserialise(raw: string | null): Partial<StudioState> | null {
  if (!raw) return null;
  try {
    const data = JSON.parse(raw) as Record<string, unknown>;
    const parsed = storedProfileSchema.safeParse(data.profile);
    if (!parsed.success) return null;
    return {
      profile: parsed.data,
      cvUnlocked: data.cvUnlocked === true,
      billing: (data.billing as Billing | null) ?? null,
      cvUpload: (data.cvUpload as StudioState["cvUpload"]) ?? null,
    };
  } catch {
    return null;
  }
}
