import type { ComponentProps } from "react";

const statusColors = {
  success: "bg-success",
  warning: "bg-warning",
  danger: "bg-danger",
};

type BadgeProps = ComponentProps<"span"> & {
  variant?: "neutral" | "primary";
  status?: keyof typeof statusColors;
};

export function Badge({
  variant = "neutral",
  status,
  className = "",
  children,
  ...props
}: BadgeProps) {
  return (
    <span
      className={`inline-flex h-[22px] items-center gap-1 rounded-sm border px-2 text-caption font-medium ${variant === "primary" ? "border-transparent bg-primary-subtle text-primary" : "border-border bg-bg text-fg-muted"} ${className}`}
      {...props}
    >
      {status && (
        <span
          aria-hidden="true"
          className={`size-1.5 rounded-full ${statusColors[status]}`}
        />
      )}
      {children}
    </span>
  );
}
