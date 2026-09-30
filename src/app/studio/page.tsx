import type { Metadata } from "next";
import { StudioApp } from "@/components/studio/StudioApp";

export const metadata: Metadata = {
  title: "Card Studio",
  description: "Edit a CorpoMerch Card with a live phone preview. Demo only, saved in your browser.",
  robots: { index: false, follow: false },
};

export default function StudioPage() {
  return <StudioApp />;
}
