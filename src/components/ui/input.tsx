import type { ComponentProps } from "react";

type InputProps = ComponentProps<"input"> & {
  id: string;
  label: string;
  helpText?: string;
  error?: string;
  /** 视觉上隐藏标签（仍供读屏使用），用于占位符已说明用途的紧凑表单 */
  hideLabel?: boolean;
};

export function Input({
  id,
  label,
  helpText,
  error,
  hideLabel = false,
  className = "",
  "aria-describedby": describedBy,
  "aria-invalid": invalid,
  ...props
}: InputProps) {
  const message = error || helpText;
  const messageId = `${id}-message`;
  const description =
    [describedBy, message ? messageId : undefined].filter(Boolean).join(" ") ||
    undefined;

  return (
    <div className="flex min-w-0 flex-col gap-1">
      <label
        htmlFor={id}
        className={hideLabel ? "sr-only" : "text-label font-medium"}
      >
        {label}
      </label>
      <input
        id={id}
        className={`ui-input ${className}`}
        aria-invalid={error ? true : invalid}
        aria-describedby={description}
        {...props}
      />
      {message && (
        <p
          id={messageId}
          className={`text-caption ${error ? "text-danger" : "text-fg-muted"}`}
        >
          {message}
        </p>
      )}
    </div>
  );
}
