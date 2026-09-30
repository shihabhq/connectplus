import type { CSSProperties, ReactElement, SVGProps } from "react";
import type { SocialType } from "@/lib/profile";

type IconProps = SVGProps<SVGSVGElement>;

const base = (props: IconProps): IconProps => ({
  viewBox: "0 0 24 24",
  width: 24,
  height: 24,
  fill: "currentColor",
  "aria-hidden": true,
  focusable: false,
  ...props,
});

export function FacebookIcon(props: IconProps) {
  return (
    <svg {...base(props)}>
      <path d="M13.5 21v-7.5h2.55l.4-3H13.5V8.6c0-.87.25-1.45 1.5-1.45h1.6V4.47c-.28-.04-1.22-.12-2.32-.12-2.3 0-3.88 1.4-3.88 3.98v2.17H7.8v3h2.6V21h3.1z" />
    </svg>
  );
}

export function LinkedInIcon(props: IconProps) {
  return (
    <svg {...base(props)}>
      <path d="M6.94 5a2 2 0 1 1-4-.002A2 2 0 0 1 6.94 5zM7 8.48H3V21h4V8.48zm6.32 0H9.34V21h3.94v-6.57c0-3.66 4.77-4 4.77 0V21H22v-7.93c0-6.17-7.06-5.94-8.72-2.91l.04-1.68z" />
    </svg>
  );
}

export function WhatsAppIcon(props: IconProps) {
  return (
    <svg {...base(props)}>
      <path
        fillRule="evenodd"
        d="M12.04 2.5a9.45 9.45 0 0 0-8.05 14.4L2.6 21.5l4.72-1.24A9.45 9.45 0 1 0 12.04 2.5zm0 1.9a7.55 7.55 0 1 1-3.9 14.02l-.28-.17-2.8.73.75-2.73-.18-.29A7.55 7.55 0 0 1 12.04 4.4zM8.9 7.6c-.2 0-.52.07-.8.37-.27.3-1.04 1.02-1.04 2.5s1.07 2.9 1.22 3.1c.15.2 2.1 3.2 5.1 4.48 2.5 1.06 3.02.85 3.56.8.55-.05 1.77-.72 2.02-1.42.25-.7.25-1.3.17-1.42-.07-.12-.27-.2-.57-.35-.3-.15-1.77-.87-2.04-.97-.28-.1-.48-.15-.68.15-.2.3-.77.97-.94 1.17-.17.2-.35.22-.65.07-.3-.15-1.27-.47-2.42-1.5-.9-.8-1.5-1.78-1.67-2.08-.17-.3-.02-.46.13-.6.13-.14.3-.35.45-.52.15-.18.2-.3.3-.5.1-.2.05-.37-.02-.52-.08-.15-.68-1.65-.93-2.25-.25-.58-.5-.5-.68-.51h-.58z"
      />
    </svg>
  );
}

export function TelegramIcon(props: IconProps) {
  return (
    <svg {...base(props)}>
      <path d="M21.6 4.2 2.9 11.4c-.75.3-.74 1.3.02 1.55l4.6 1.45 1.78 5.5c.2.62.98.82 1.45.36l2.55-2.45 4.75 3.5c.53.4 1.3.1 1.46-.55L23 5.6c.2-.85-.6-1.7-1.4-1.4zM9.6 13.9l8.4-6.3c.2-.15.38.1.2.26l-6.9 6.7-.27 3-1.42-3.66z" />
    </svg>
  );
}

export function InstagramIcon(props: IconProps) {
  return (
    <svg {...base(props)}>
      <path
        fillRule="evenodd"
        d="M7.5 3h9A4.5 4.5 0 0 1 21 7.5v9a4.5 4.5 0 0 1-4.5 4.5h-9A4.5 4.5 0 0 1 3 16.5v-9A4.5 4.5 0 0 1 7.5 3zm0 1.8A2.7 2.7 0 0 0 4.8 7.5v9a2.7 2.7 0 0 0 2.7 2.7h9a2.7 2.7 0 0 0 2.7-2.7v-9a2.7 2.7 0 0 0-2.7-2.7h-9zM12 7.4a4.6 4.6 0 1 1 0 9.2 4.6 4.6 0 0 1 0-9.2zm0 1.8a2.8 2.8 0 1 0 0 5.6 2.8 2.8 0 0 0 0-5.6zm5-2.7a1.1 1.1 0 1 1 0 2.2 1.1 1.1 0 0 1 0-2.2z"
      />
    </svg>
  );
}

export function XIcon(props: IconProps) {
  return (
    <svg {...base(props)}>
      <path d="M17.75 3h3.07l-6.7 7.66L22 21h-6.17l-4.83-6.32L5.46 21H2.4l7.17-8.2L2 3h6.33l4.37 5.78L17.75 3zm-1.08 16.16h1.7L7.4 4.75H5.58l11.09 14.41z" />
    </svg>
  );
}

export function YouTubeIcon(props: IconProps) {
  return (
    <svg {...base(props)}>
      <path
        fillRule="evenodd"
        d="M21.6 7.2a2.5 2.5 0 0 0-1.8-1.8C18.2 5 12 5 12 5s-6.2 0-7.8.4A2.5 2.5 0 0 0 2.4 7.2C2 8.8 2 12 2 12s0 3.2.4 4.8a2.5 2.5 0 0 0 1.8 1.8C5.8 19 12 19 12 19s6.2 0 7.8-.4a2.5 2.5 0 0 0 1.8-1.8c.4-1.6.4-4.8.4-4.8s0-3.2-.4-4.8zM10 15V9l5.2 3L10 15z"
      />
    </svg>
  );
}

export function GitHubIcon(props: IconProps) {
  return (
    <svg {...base(props)}>
      <path d="M12 .5a11.5 11.5 0 0 0-3.64 22.41c.58.1.79-.25.79-.56v-2c-3.2.7-3.87-1.37-3.87-1.37-.52-1.33-1.28-1.69-1.28-1.69-1.05-.71.08-.7.08-.7 1.15.08 1.76 1.19 1.76 1.19 1.03 1.76 2.7 1.25 3.36.96.1-.75.4-1.25.73-1.54-2.55-.29-5.24-1.28-5.24-5.68 0-1.25.45-2.28 1.19-3.08-.12-.29-.52-1.46.11-3.05 0 0 .97-.31 3.17 1.18a11 11 0 0 1 5.77 0c2.2-1.49 3.17-1.18 3.17-1.18.63 1.59.23 2.76.11 3.05.74.8 1.19 1.83 1.19 3.08 0 4.41-2.69 5.38-5.25 5.67.41.36.78 1.06.78 2.14v3.17c0 .31.21.67.8.56A11.5 11.5 0 0 0 12 .5z" />
    </svg>
  );
}

export function WebsiteIcon(props: IconProps) {
  return (
    <svg
      {...base({
        fill: "none",
        stroke: "currentColor",
        strokeWidth: 1.8,
        strokeLinecap: "round",
        strokeLinejoin: "round",
        ...props,
      })}
    >
      <circle cx="12" cy="12" r="9" />
      <path d="M3 12h18" />
      <path d="M12 3c2.5 2.6 3.8 5.6 3.8 9s-1.3 6.4-3.8 9c-2.5-2.6-3.8-5.6-3.8-9S9.5 5.6 12 3z" />
    </svg>
  );
}

export function EmailIcon(props: IconProps) {
  return (
    <svg
      {...base({
        fill: "none",
        stroke: "currentColor",
        strokeWidth: 1.8,
        strokeLinecap: "round",
        strokeLinejoin: "round",
        ...props,
      })}
    >
      <rect x="3" y="5" width="18" height="14" rx="3" />
      <path d="m4 8 8 5.5L20 8" />
    </svg>
  );
}

const ICONS: Record<SocialType, (props: IconProps) => ReactElement> = {
  facebook: FacebookIcon,
  linkedin: LinkedInIcon,
  whatsapp: WhatsAppIcon,
  telegram: TelegramIcon,
  instagram: InstagramIcon,
  x: XIcon,
  youtube: YouTubeIcon,
  github: GitHubIcon,
  website: WebsiteIcon,
  email: EmailIcon,
};

export function BrandIcon({ type, ...props }: IconProps & { type: SocialType }) {
  const Icon = ICONS[type];
  return <Icon {...props} />;
}

export const BRAND_COLORS: Record<SocialType, string> = {
  facebook: "#1877F2",
  linkedin: "#0A66C2",
  whatsapp: "#25D366",
  telegram: "#229ED9",
  instagram: "#D6249F",
  x: "#0F1419",
  youtube: "#FF0000",
  github: "#181717",
  website: "#52525B",
  email: "#EA4335",
};

const INSTAGRAM_GRADIENT =
  "radial-gradient(circle at 30% 107%, #fdf497 0%, #fdf497 5%, #fd5949 45%, #d6249f 60%, #285AEB 90%)";
const WHITE = "#FFFFFF";

/** Inline style for a social icon circle: background, plus --brand for the hover shadow. */
export function socialCircleStyle(
  type: SocialType,
  style: "brand" | "mono",
): CSSProperties {
  if (style === "mono") {
    // Theme aware: dark circle with a white glyph on light, the reverse on dark.
    return {
      background: "var(--mono-bg)",
      color: "var(--mono-fg)",
      ["--brand" as string]: "var(--mono-bg)",
    };
  }
  return {
    background: type === "instagram" ? INSTAGRAM_GRADIENT : BRAND_COLORS[type],
    color: WHITE,
    ["--brand" as string]: BRAND_COLORS[type],
  };
}

/** Colours for the demo checkout payment method tiles. */
export const PAYMENT_COLORS = {
  bkash: "#E2136E",
  nagad: "#F6921E",
  card: "#27272A",
} as const;
