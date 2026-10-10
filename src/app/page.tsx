import { AigcFlowCard } from "@/components/home/aigc-flow-card";
import { HomeBento } from "@/components/home/home-bento";
import { HomeFooter } from "@/components/home/home-footer";
import {
  ArticleCard,
  IntroCard,
  MapCard,
  MusicCard,
  ProjectCard,
  SocialCard,
} from "@/components/home/static-cards";
import { SubscribeCard } from "@/components/home/subscribe-card";
import { ThemeCard } from "@/components/home/theme-card";
import { categories } from "@/lib/home-cards";

export default async function Home({
  searchParams,
}: {
  searchParams: Promise<{ category?: string }>;
}) {
  const { category: requestedCategory } = await searchParams;
  const category =
    categories.find((item) => item.id === requestedCategory)?.id ?? "all";
  return (
    <>
      <a
        href="#main"
        className="sr-only z-50 rounded-full bg-fg px-4 py-2 text-bg focus:not-sr-only focus:fixed focus:top-4 focus:left-4"
      >
        跳转到主要内容
      </a>
      <HomeBento
        key={category}
        initialCategory={category}
        cards={{
          intro: <IntroCard />,
          map: <MapCard />,
          music: <MusicCard />,
          social: <SocialCard />,
          vouch: <ProjectCard id="vouch" />,
          skip: <AigcFlowCard />,
          article: <ArticleCard />,
          wrap: <ProjectCard id="wrap" />,
          theme: <ThemeCard />,
          subscribe: <SubscribeCard />,
        }}
      />
      <HomeFooter />
    </>
  );
}
