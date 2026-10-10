import { gsap } from "gsap";

export type SceneKind =
  | "framework"
  | "connect"
  | "prompt"
  | "storyboard"
  | "tabs";

/** Animate the original Figma layers; SVG assets keep their intrinsic geometry. */
export function sceneTimeline(
  root: HTMLElement,
  kind: SceneKind,
  count: number,
) {
  const node = (...ids: string[]) =>
    ids
      .map((id) => root.querySelector(`[data-node-id="${id}"]`))
      .filter((element): element is Element => element !== null);
  const tl = gsap.timeline({
    paused: true,
    defaults: { duration: 0.45, ease: "power2.out" },
  });
  tl.to({}, { duration: count }, 0);
  if (kind === "framework") {
    tl.from(
      node("33:473", "33:475", "33:478", "33:481", "33:484", "33:487"),
      { autoAlpha: 0, y: 12, stagger: 0.06 },
      1,
    );
    tl.from(node("33:500"), { autoAlpha: 0, clipPath: "inset(0 100% 0 0)" }, 2);
    tl.from(
      node("33:493", "33:494", "33:496", "33:497", "33:499"),
      { autoAlpha: 0, scale: 0.9, stagger: 0.08 },
      3,
    );
    tl.from(node("33:507"), { autoAlpha: 0, y: 20 }, 4);
  } else if (kind === "connect") {
    const endpoint = root.querySelector("[data-demo-endpoint]");
    const created = root.querySelector("[data-demo-created]");
    tl.from(endpoint, { scale: 0.5, duration: 0.4 }, 0);
    tl.fromTo(
      node("33:584"),
      { x: -120, y: -100 },
      { x: 10, y: -180, duration: 1 },
      0,
    );
    tl.to(
      node("33:565"),
      { outline: "3px solid var(--preview-selection)", outlineOffset: 4 },
      1,
    );
    tl.to(node("33:584"), { x: 0, y: 0, duration: 0.9 }, 1);
    tl.from(
      node("33:580"),
      { clipPath: "inset(0 100% 0 0)", duration: 1.8 },
      0,
    );
    tl.from(node("33:572", "33:587"), { autoAlpha: 0, y: 8 }, 2);
    tl.to(node("33:572", "33:587"), { autoAlpha: 0, duration: 0.2 }, 3);
    tl.fromTo(created, { autoAlpha: 0, y: 12 }, { autoAlpha: 1, y: 0 }, 3.2);
  } else if (kind === "prompt") {
    tl.set(node("33:617"), { height: 260 }, 0);
    tl.from(
      node("33:629").flatMap((el) => Array.from(el.children)),
      { autoAlpha: 0, y: 5, stagger: 0.12 },
      0,
    );
    tl.from(
      node("33:621", "33:634", "33:637"),
      { autoAlpha: 0, scale: 0.9 },
      1,
    );
    tl.from(node("33:624", "33:639"), { autoAlpha: 0, y: 6 }, 2);
    tl.from(node("33:623"), { opacity: 1 }, 2);
  } else if (kind === "storyboard") {
    tl.from(
      node("36:546", "36:559", "36:572"),
      { autoAlpha: 0, x: -48, stagger: 0.12 },
      0,
    );
    tl.from(node("36:585", "36:593"), { autoAlpha: 0, y: -8 }, 1);
    tl.to(node("36:585"), { autoAlpha: 0, duration: 0.2 }, 2);
    tl.to(node("36:564"), { backgroundColor: "var(--preview-discarded)" }, 2);
    tl.to(node("36:564"), { x: 3, duration: 0.06, repeat: 5, yoyo: true }, 2.1);
    tl.to(
      root.querySelector("[data-duration-valid]"),
      { autoAlpha: 0, duration: 0 },
      2,
    );
    tl.fromTo(
      root.querySelector("[data-duration-invalid]"),
      { autoAlpha: 0 },
      { autoAlpha: 1, duration: 0 },
      2,
    );
    tl.fromTo(
      root.querySelector("[data-demo-error]"),
      { autoAlpha: 0 },
      { autoAlpha: 1 },
      2,
    );
    tl.to(root.querySelector("[data-demo-error]"), { autoAlpha: 0 }, 3);
    tl.to(root.querySelector("[data-duration-invalid]"), { autoAlpha: 0 }, 3);
    tl.to(root.querySelector("[data-duration-valid]"), { autoAlpha: 1 }, 3);
    tl.to(node("36:564"), { backgroundColor: "transparent" }, 3);
    tl.from(
      node("36:555", "36:568", "36:581"),
      { autoAlpha: 0, stagger: 0.15 },
      3,
    );
    tl.from(
      node("36:557", "36:570", "36:583"),
      { autoAlpha: 0, stagger: 0.12 },
      4,
    );
    tl.to(
      node("36:557", "36:570", "36:583"),
      { backgroundColor: "var(--preview-text-chip)" },
      4,
    );
  } else {
    tl.to(node("36:630"), { backgroundColor: "var(--preview-canvas)" }, 0.25);
    tl.to(node("36:627"), { backgroundColor: "transparent" }, 0.25);
    tl.to(node("36:630"), { backgroundColor: "transparent" }, 0.75);
    tl.to(node("36:627"), { backgroundColor: "var(--preview-canvas)" }, 0.75);
    tl.from(node("36:631"), { autoAlpha: 0 }, 1.5);
    tl.fromTo(
      root.querySelector("[data-demo-spinner]"),
      { autoAlpha: 0, rotation: 0 },
      { autoAlpha: 1, rotation: 360, duration: 0.5 },
      1,
    );
    tl.to(
      root.querySelector("[data-demo-spinner]"),
      { autoAlpha: 0, duration: 0.1 },
      1.5,
    );
    tl.from(node("36:652", "36:653"), { autoAlpha: 0, y: 8 }, 2);
  }
  return tl;
}
