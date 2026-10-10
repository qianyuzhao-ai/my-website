import type { ComponentProps } from "react";

type CardProps = ComponentProps<"div"> & { raised?: boolean };

export function Card({ raised = false, className = "", ...props }: CardProps) {
  return (
    <div
      className={`rounded-lg border border-border p-4 ${raised ? "bg-surface-raised shadow-lg" : "bg-surface"} ${className}`}
      {...props}
    />
  );
}
