import { HomeBento } from "@/components/home/home-bento";
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

export default function Home() {
  return (
    <>
      <a
        href="#main"
        className="sr-only z-50 rounded-full bg-fg px-4 py-2 text-bg focus:not-sr-only focus:fixed focus:top-4 focus:left-4"
      >
        跳转到主要内容
      </a>
      <HomeBento
        cards={{
          intro: <IntroCard />,
          map: <MapCard />,
          music: <MusicCard />,
          social: <SocialCard />,
          vouch: <ProjectCard id="vouch" />,
          skip: <ProjectCard id="skip" />,
          article: <ArticleCard />,
          wrap: <ProjectCard id="wrap" />,
          theme: <ThemeCard />,
          subscribe: <SubscribeCard />,
        }}
      />
    </>
  );
}
