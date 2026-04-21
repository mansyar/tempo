import { Link, useLocation } from '@tanstack/react-router';
import ThemeToggle from './ThemeToggle';
import JuiceToggle from './JuiceToggle';

export default function Header() {
  const location = useLocation();
  const isRoom =
    location.pathname.startsWith('/room/') ||
    location.pathname.startsWith('/poker/');

  return (
    <header className="sticky top-0 z-50 border-b border-[var(--border-subtle)] bg-[var(--bg-secondary)] px-4 backdrop-blur-lg bg-opacity-80">
      <nav className="page-wrap flex flex-wrap items-center gap-x-3 gap-y-2 py-3 sm:py-4">
        <div className="flex items-center gap-2">
          <h2 className="m-0 flex-shrink-0 text-base font-semibold tracking-tight">
            <Link
              to="/"
              className="inline-flex items-center gap-2 rounded-full border border-[var(--border-subtle)] bg-[var(--bg-tertiary)] px-3 py-1.5 text-sm text-[var(--text-primary)] no-underline shadow-sm sm:px-4 sm:py-2 hover:border-[var(--border-focus)] transition-all"
            >
              <span className="text-xl">◈</span>
              Tempo
            </Link>
          </h2>
          {isRoom && (
            <div className="flex items-center gap-2 text-sm font-medium text-[var(--text-secondary)] animate-in fade-in slide-in-from-left-2">
              <span>▸</span>
              <span className="text-[var(--text-primary)]">Poker</span>
            </div>
          )}
        </div>

        <div className="ml-auto flex items-center gap-1.5 sm:ml-0 sm:gap-2">
          <JuiceToggle />
          <ThemeToggle />
          <a
            href="https://github.com/mansyar/tempo"
            target="_blank"
            rel="noreferrer"
            className="hidden rounded-xl p-2 text-[var(--text-secondary)] transition hover:bg-[var(--bg-tertiary)] hover:text-[var(--text-primary)] sm:block"
          >
            <span className="sr-only">Go to GitHub</span>
            <svg viewBox="0 0 16 16" aria-hidden="true" width="24" height="24">
              <path
                fill="currentColor"
                d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.012 8.012 0 0 0 16 8c0-4.42-3.58-8-8-8z"
              />
            </svg>
          </a>
        </div>

        <div className="order-3 flex w-full flex-wrap items-center gap-x-4 gap-y-1 pb-1 text-sm font-semibold sm:order-2 sm:w-auto sm:flex-nowrap sm:pb-0 ml-6">
          <Link
            to="/"
            className="text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors"
            activeProps={{ className: 'text-[var(--text-primary)] font-bold' }}
          >
            Home
          </Link>
        </div>
      </nav>
    </header>
  );
}
