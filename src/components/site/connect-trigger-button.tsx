"use client";

import { ArrowRightIcon } from "@/components/home/icons";
import { openConnectDialog } from "@/components/site/connect-sheet";

export function ConnectTriggerButton({
  label = "Connect",
}: {
  label?: string;
}) {
  return (
    <button
      type="button"
      onClick={openConnectDialog}
      aria-haspopup="dialog"
      className="inline-flex min-h-11 items-center justify-center gap-2 rounded-full bg-ink px-5 text-caption font-medium text-ink-fg transition-opacity hover:opacity-85 md:min-h-9"
    >
      <span>{label}</span>
      <ArrowRightIcon className="size-3.5" />
    </button>
  );
}
