import Image from "next/image";
import { BentoCard, ThemedImage } from "@/components/home/bento-card";
import { ArrowIcon, SpotifyIcon, TwitterIcon } from "@/components/home/icons";
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
      <div className="flex flex-col gap-[26px] lg:gap-0">
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
    <BentoCard className="h-[200px] bg-surface">
      <ThemedImage
        name="map"
        alt="地图：当前所在城市"
        width={280}
        height={280}
        sizes="(min-width: 1024px) 280px, (min-width: 768px) 50vw, 100vw"
        className="absolute inset-0 size-full object-cover"
      />
      <span className="absolute top-1/2 left-1/2 size-[122px] -translate-x-1/2 -translate-y-1/2 rounded-full border-[2.5px] border-white bg-map-pin md:size-24">
        <Memoji className="absolute inset-1 top-1.5" sizes="112px" />
      </span>
    </BentoCard>
  );
}

export function MusicCard() {
  return (
    <BentoCard className="flex gap-5 bg-surface p-8 md:flex-col md:justify-between">
      <SpotifyIcon className="size-[54px] shrink-0" />
      <div className="flex min-w-0 flex-col gap-0.5 pt-[26px] md:pt-0 md:pb-1">
        <p className="text-label font-medium text-accent">
          <span aria-hidden="true">ııı </span>Offline. Last played
        </p>
        <p className="font-serif text-title font-bold">I Don’t Belong</p>
        <p>Fontaines D.C.</p>
      </div>
    </BentoCard>
  );
}

export function SocialCard() {
  return (
    <BentoCard className="h-[168px] bg-card-blue">
      <TwitterIcon className="absolute top-[calc(50%+4px)] left-1/2 size-[72px] -translate-1/2 text-social-icon" />
      <ProjectLink name={projects.social.name} href={links.social} />
    </BentoCard>
  );
}

const artwork = {
  vouch: {
    width: 280,
    height: 524,
    alt: "Vouch 项目界面截图",
    className: "h-[400px]",
    position: "object-[50%_81%] md:object-center",
  },
  skip: {
    width: 280,
    height: 524,
    alt: "Skip 项目界面截图",
    className: "h-[400px]",
    position: "object-[50%_81%] md:object-center",
  },
  wrap: {
    width: 576,
    height: 230,
    alt: "Wrap.so 项目界面截图",
    className: "h-[216px]",
    position: "object-center",
  },
} as const;

export function ProjectCard({ id }: { id: keyof typeof artwork }) {
  const { className, position, ...image } = artwork[id];
  return (
    <BentoCard className={`${projects[id].tone} ${className}`}>
      <ThemedImage
        name={id}
        sizes="(min-width: 1024px) 576px, 100vw"
        className={`absolute inset-0 size-full object-cover ${position}`}
        {...image}
      />
      <ProjectLink name={projects[id].name} href={links[id]} />
    </BentoCard>
  );
}

export function ArticleCard() {
  const readMore = (
    <>
      <ArrowIcon className="size-4" />
      Read more
    </>
  );
  const pillClass =
    "inline-flex h-[38px] items-center gap-2 rounded-full border border-border bg-surface pr-4 pl-3 text-label font-medium transition-colors hover:border-fg-muted";

  return (
    <BentoCard className="flex flex-col justify-between gap-8 bg-surface p-6 lg:px-10 lg:pt-[38px] lg:pb-8">
      <article className="flex flex-col gap-2">
        <h2 className="font-serif text-title font-bold">
          How it started vs. how it’s going
        </h2>
        <p>
          A short personal history as it relates to design and development, and
          how I’ve found value in the cross-section between both disciplines.
        </p>
      </article>
      <div className="flex items-center justify-between gap-4">
        {links.article ? (
          <a href={links.article} draggable={false} className={pillClass}>
            {readMore}
          </a>
        ) : (
          <span className={pillClass} title="文章页待开发">
            {readMore}
          </span>
        )}
        <time dateTime="2021-05-05" className="text-caption text-fg-muted">
          May 5, 2021
        </time>
      </div>
    </BentoCard>
  );
}
