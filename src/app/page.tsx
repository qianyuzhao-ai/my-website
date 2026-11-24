import { SkyIslandExperience } from "@/components/island/sky-island-experience";
import { getPosts } from "@/lib/posts";

export default async function Home() {
  const posts = await getPosts();
  return <SkyIslandExperience posts={posts} />;
}
