import Image from "next/image";
import { BentoCard, ThemedImage } from "@/components/home/bento-card";
import { XIcon } from "@/components/home/icons";
import { IntroAvatar } from "@/components/home/intro-avatar";
import { ProjectLink } from "@/components/home/project-link";
import { links, projects } from "@/lib/home-cards";

function Memoji({
  className = "",
  sizes,
}: {
  className?: string;
  sizes: string;
}) {
  return (
    <span className={`block ${className}`}>
      <Image
        src="/images/memoji-light.png"
        alt=""
        fill
        sizes={sizes}
        draggable={false}
        className="object-contain dark:hidden"
      />
      <Image
        src="/images/memoji-dark.png"
        alt=""
        fill
        sizes={sizes}
        draggable={false}
        className="hidden object-contain dark:block"
      />
    </span>
  );
}

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

export function MapCard() {
  return (
    <BentoCard className="h-50 bg-surface">
      <ThemedImage
        name="map"
        alt="地图：当前所在城市"
        width={280}
        height={280}
        sizes="(min-width: 1024px) 280px, (min-width: 768px) 50vw, 100vw"
        className="absolute inset-0 size-full object-cover"
      />
      <span className="absolute top-1/2 left-1/2 size-30.5 -translate-x-1/2 -translate-y-1/2 rounded-full border-[2.5px] border-white bg-map-pin md:size-24">
        <Memoji className="absolute inset-1 top-1.5" sizes="112px" />
      </span>
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
