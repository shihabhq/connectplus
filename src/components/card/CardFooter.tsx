import { Globe } from "@phosphor-icons/react/dist/ssr";

export function CardFooter() {
  return (
    <footer className="mt-12 flex flex-col items-center gap-3 border-t border-border pt-8 text-center">
      <p className="text-sm text-text-3">Want a card like this for yourself?</p>
      <a
        href="https://www.corpomerch.com"
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex min-h-11 items-center gap-2 rounded-chip border border-border-strong bg-surface px-4 text-sm font-semibold text-text shadow-sm transition-colors duration-200 hover:bg-bg-subtle"
      >
        <Globe size={18} weight="fill" className="text-accent-ink" aria-hidden />
        corpomerch.com
      </a>
    </footer>
  );
}
