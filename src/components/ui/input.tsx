import type { ComponentProps } from "react";

type InputProps = ComponentProps<"input"> & {
  id: string;
  label: string;
  helpText?: string;
  error?: string;
};

export function Input({
  id,
  label,
  helpText,
  error,
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
      <label htmlFor={id} className="text-label font-medium">
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
          className={`text-caption ${error ? "text-danger" : "text-fg-subtle"}`}
        >
          {message}
        </p>
      )}
    </div>
  );
}
