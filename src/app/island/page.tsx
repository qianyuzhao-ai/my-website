import type { Metadata } from "next";
import { SkyIslandExperience } from "@/components/island/sky-island-experience";
import { getPosts } from "@/lib/posts";
import { siteConfig } from "@/lib/site-config";

export const metadata: Metadata = {
  title: `Sky Island 3D · ${siteConfig.name}`,
  description: "云上庭园：可漫游的 3D 空岛交互实验，探索作品、手稿与彩蛋飞岛。",
};

export default async function IslandPage() {
  const posts = await getPosts();
  return <SkyIslandExperience posts={posts} />;
}
