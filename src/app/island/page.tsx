import type { Metadata } from "next";
import { SkyIslandExperience } from "@/components/island/sky-island-experience";
import { getDictionary } from "@/lib/i18n/dictionaries";
import { getServerLocale } from "@/lib/i18n/server";
import { getPosts } from "@/lib/posts";

export async function generateMetadata(): Promise<Metadata> {
  const locale = await getServerLocale();
  const dict = getDictionary(locale);
  return {
    title: dict.meta.islandTitle,
    description: dict.meta.islandDescription,
  };
}

export default async function IslandPage() {
  const locale = await getServerLocale();
  const posts = await getPosts(locale);
  return <SkyIslandExperience posts={posts} />;
}
