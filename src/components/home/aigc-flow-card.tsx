import { AigcFlowArtwork } from "@/components/home/aigc-flow-artwork";
import { BentoCard } from "@/components/home/bento-card";
import { ProjectLink } from "@/components/home/project-link";
import { links, projects } from "@/lib/home-cards";

export function AigcFlowCard() {
  return (
    <BentoCard
      className={`h-[400px] ${projects.skip.tone}`}
      data-project="aigc-flow"
    >
      <div aria-hidden="true" className="aigc-entry-art">
        <AigcFlowArtwork />
      </div>
      <ProjectLink name={projects.skip.name} href={links.skip} />
    </BentoCard>
  );
}
