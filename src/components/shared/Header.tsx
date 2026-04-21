import { Link, useLocation } from '@tanstack/react-router';
import ThemeToggle from './ThemeToggle';
import JuiceToggle from './JuiceToggle';

export default function Header() {
  const location = useLocation();
  const isRoom =
    location.pathname.startsWith('/room/') ||
    location.pathname.startsWith('/poker/');

  return (
    <header className="brutal-border border-x-0 border-t-0 bg-white px-4 py-3">
      <nav className="page-wrap flex items-center justify-between">
        {/* Left: Logo & Poker Badge */}
        <div className="flex items-center gap-4">
          <Link
            to="/"
            className="brutal-btn bg-retro-yellow text-black px-4 py-2 text-lg no-underline"
          >
            <span className="text-xl rotate-45 inline-block">◈</span>
            Tempo
          </Link>
          
          {isRoom && (
            <div className="hidden sm:flex items-center gap-2 bg-retro-green text-black px-3 py-1 brutal-border text-xs font-black uppercase tracking-widest">
              <span>▸</span>
              <span>Poker Mode</span>
            </div>
          )}
        </div>

        {/* Center: Navigation */}
        <div className="hidden md:flex items-center gap-8">
          <Link
            to="/"
            className="text-sm font-black uppercase tracking-[0.2em] text-black no-underline hover:text-retro-pink transition-colors border-b-4 border-transparent active:border-black"
            activeProps={{ className: 'border-retro-yellow' }}
          >
            Home
          </Link>
        </div>

        {/* Right: Actions */}
        <div className="flex items-center gap-3">
          <JuiceToggle />
          <ThemeToggle />
          
          <a
            href="https://github.com/mansyar/tempo"
            target="_blank"
            rel="noreferrer"
            className="brutal-btn bg-white p-2 text-black hover:bg-retro-blue transition-all"
          >
            <span className="sr-only">Go to GitHub</span>
            <svg viewBox="0 0 16 16" aria-hidden="true" width="20" height="20">
              <path
                fill="currentColor"
                d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.012 8.012 0 0 0 16 8c0-4.42-3.58-8-8-8z"
              />
            </svg>
          </a>
        </div>
      </nav>
    </header>
  );
}
