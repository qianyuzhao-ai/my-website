import Image from "next/image";
import type { ComponentProps } from "react";

export function BentoCard({ className = "", ...props }: ComponentProps<"div">) {
  return (
    <div
      className={`group relative overflow-hidden md:h-full rounded-card-sm md:rounded-card dark:border-[1.5px] dark:border-border ${className}`}
      {...props}
    />
  );
}

type ThemedImageProps = {
  /** public/images 下的文件名前缀，自动拼接 -light / -dark */
  name: string;
  alt: string;
  width: number;
  height: number;
  sizes: string;
  className?: string;
};

/** 浅深两套图片，通过 CSS 切换，避免依赖客户端主题状态 */
export function ThemedImage({
  name,
  className = "",
  ...props
}: ThemedImageProps) {
  return (
    <>
      <Image
        src={`/images/${name}-light.png`}
        draggable={false}
        className={`dark:hidden ${className}`}
        {...props}
      />
      <Image
        src={`/images/${name}-dark.png`}
        draggable={false}
        className={`hidden dark:block ${className}`}
        {...props}
      />
    </>
  );
}
