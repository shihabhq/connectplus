import { redirect } from "next/navigation";
import { DEMO_SLUG } from "@/lib/profile";

export default function Home() {
  redirect(`/${DEMO_SLUG}`);
}
