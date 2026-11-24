import { EditorialHero } from "@/components/home/editorial-hero";
import { EditorialWritingIndex } from "@/components/home/editorial-writing-index";
import { HomeColophon } from "@/components/home/home-colophon";
import { WorksShowcase } from "@/components/home/works-showcase";
import { SiteFooter } from "@/components/site/site-footer";
import { getPosts } from "@/lib/posts";

export default async function Home() {
  const posts = await getPosts();
  const recentPosts = posts.slice(0, 5);

  return (
    <>
      <main id="main">
        <EditorialHero />
        <WorksShowcase />
        <EditorialWritingIndex posts={recentPosts} totalCount={posts.length} />
        <HomeColophon />
      </main>
      <SiteFooter />
    </>
  );
}
