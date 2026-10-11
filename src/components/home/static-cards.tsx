import { BentoCard } from "@/components/home/bento-card";
import { XIcon } from "@/components/home/icons";
import { IntroAvatar } from "@/components/home/intro-avatar";
import { ProjectLink } from "@/components/home/project-link";
import { links, projects } from "@/lib/home-cards";

export function IntroCard() {
  return (
    <BentoCard className="flex flex-col gap-4 bg-surface p-6 lg:justify-between lg:px-10">
      <IntroAvatar />
      <div className="flex flex-col gap-6.5 lg:gap-0">
        <p>
          我是 <span className="font-serif text-name font-bold">QianYu</span>
          ，一名来自北京的产品设计与开发。
        </p>
        <p>我对 React、Node、产品设计、AIGC、Agentic 方面充满兴趣。</p>
      </div>
    </BentoCard>
  );
}

export function SocialCard() {
  return (
    <BentoCard className="h-42 bg-card-blue">
      <XIcon className="absolute top-1/2 left-1/2 size-16 -translate-1/2 text-social-icon" />
      <ProjectLink name={projects.social.name} href={links.social} />
    </BentoCard>
  );
}
