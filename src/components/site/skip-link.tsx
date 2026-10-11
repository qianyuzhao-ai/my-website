export function SkipLink() {
  return (
    <a
      href="#main"
      className="sr-only z-50 rounded-full bg-fg px-4 py-2 text-bg focus:not-sr-only focus:fixed focus:top-4 focus:left-4"
    >
      跳转到主要内容
    </a>
  );
}
