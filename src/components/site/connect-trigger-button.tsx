"use client";

import { ArrowRightIcon } from "@/components/home/icons";
import { openConnectDialog } from "@/components/site/connect-sheet";

export function ConnectTriggerButton({
  label = "发起信号连接",
}: {
  label?: string;
}) {
  return (
    <button
      type="button"
      onClick={openConnectDialog}
      aria-haspopup="dialog"
      className="inline-flex min-h-11 items-center justify-center gap-2 rounded-full bg-ink px-5 text-label font-medium text-ink-fg shadow-xs transition-opacity hover:opacity-90"
    >
      <span>{label}</span>
      <ArrowRightIcon className="size-4" />
    </button>
  );
}
