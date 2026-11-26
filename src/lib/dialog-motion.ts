"use client";

/**
 * 原生 <dialog> 顶层离场动画兼容检测与关闭工具
 * 遵循 modern-web-guidance: animate-to-from-top-layer
 * - Chrome/Edge 走纯 CSS `overlay` + `transition-behavior: allow-discrete`；
 * - Firefox/Safari 自动回退为 `data-closing` 等待 `getAnimations()` 结束后再调用 `.close()`。
 */

let supportsDisplayTransition: boolean | undefined;

function canTransitionDisplay(): boolean {
  if (supportsDisplayTransition !== undefined) return supportsDisplayTransition;
  if (
    typeof window === "undefined" ||
    !window.CSS?.supports?.("transition-behavior", "allow-discrete") ||
    !document.body
  ) {
    return false;
  }
  const probe = document.createElement("div");
  probe.style.cssText =
    "transition: display 1s allow-discrete !important; display: block;";
  document.body.appendChild(probe);
  getComputedStyle(probe).display;
  probe.style.display = "none";
  supportsDisplayTransition = getComputedStyle(probe).display === "block";
  probe.remove();
  return supportsDisplayTransition;
}

export function supportsTopLayerExit(): boolean {
  if (typeof window === "undefined") return false;
  return Boolean(
    window.CSS?.supports?.("overlay", "auto") && canTransitionDisplay(),
  );
}

export async function closeDialogSmoothly(
  dialog: HTMLDialogElement,
): Promise<void> {
  if (!dialog.open) return;

  if (!supportsTopLayerExit()) {
    dialog.setAttribute("data-closing", "");
    const animations = dialog.getAnimations({ subtree: true });
    if (animations.length > 0) {
      await Promise.race([
        Promise.allSettled(animations.map((a) => a.finished)),
        new Promise((resolve) => window.setTimeout(resolve, 450)),
      ]);
    }
    if (!dialog.hasAttribute("data-closing")) return;
    dialog.removeAttribute("data-closing");
  }

  if (dialog.open) {
    dialog.close();
  }
}
