export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="mt-20 border-t border-[var(--border-subtle)] px-4 pb-14 pt-10 text-[var(--text-secondary)]">
      <div className="page-wrap flex flex-col items-center justify-between gap-4 text-center sm:flex-row sm:text-left">
        <p className="m-0 text-sm">
          &copy; {year} Tempo. Scrum Tools for Modern Teams.
        </p>
        <p className="m-0 text-xs font-semibold uppercase tracking-widest text-[var(--text-tertiary)]">
          Built with TanStack Start & Convex
        </p>
      </div>
    </footer>
  );
}
