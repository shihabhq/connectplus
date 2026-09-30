import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ProfileCard } from "@/components/card/ProfileCard";
import { ThemeToggle } from "@/components/ui/ThemeToggle";
import { firstSentence, getAllSlugs, getProfile } from "@/lib/profile";

export const dynamicParams = false;

export function generateStaticParams() {
  return getAllSlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: PageProps<"/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const profile = getProfile(slug);
  if (!profile) return { title: "Card not found" };

  const title = `${profile.name} · ${profile.title} at ${profile.company}`;
  const description = firstSentence(profile.about) || `${profile.name}, ${profile.title}`;
  const path = `/${profile.slug}`;

  return {
    title,
    description,
    alternates: { canonical: path },
    openGraph: {
      type: "profile",
      title,
      description,
      url: path,
      siteName: "CorpoMerch Card",
    },
    twitter: { card: "summary_large_image", title, description },
  };
}

export default async function CardPage({ params }: PageProps<"/[slug]">) {
  const { slug } = await params;
  const profile = getProfile(slug);
  if (!profile) notFound();
  return (
    <>
      <ThemeToggle className="fixed right-4 top-4 z-30" />
      <ProfileCard profile={profile} />
    </>
  );
}
