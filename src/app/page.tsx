import { AigcFlowCard } from "@/components/home/aigc-flow-card";
import { ArticleCard } from "@/components/home/article-card";
import { HomeBento } from "@/components/home/home-bento";
import { HomeFooter } from "@/components/home/home-footer";
import { MapCard } from "@/components/home/map-card";
import { IntroCard, SocialCard } from "@/components/home/static-cards";
import { ThemeCard } from "@/components/home/theme-card";
import { SkipLink } from "@/components/site/skip-link";
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
      <SkipLink />
      <HomeBento
        key={category}
        initialCategory={category}
        cards={{
          intro: <IntroCard />,
          map: <MapCard />,
          social: <SocialCard />,
          skip: <AigcFlowCard />,
          article: <ArticleCard />,
          theme: <ThemeCard />,
        }}
      />
      <HomeFooter />
    </>
  );
}
