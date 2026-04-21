import {
  HeadContent,
  Scripts,
  createRootRoute,
  Outlet,
} from '@tanstack/react-router';
import { TanStackRouterDevtoolsPanel } from '@tanstack/react-router-devtools';
import { TanStackDevtools } from '@tanstack/react-devtools';
import Footer from '../components/Footer';
import Header from '../components/Header';
import { OfflineBanner } from '../components/OfflineBanner';
import { AriaLiveAnnouncer } from '../components/AriaLiveAnnouncer';
import { JuiceProvider } from '../components/JuiceToggle';
import { ConvexProvider, ConvexReactClient } from 'convex/react';
import { Toaster } from 'sonner';
import { useState, useEffect } from 'react';

import '../styles.css';

const THEME_INIT_SCRIPT = `(function(){try{var stored=window.localStorage.getItem('theme');var mode=(stored==='light'||stored==='dark'||stored==='auto')?stored:'auto';var prefersDark=window.matchMedia('(prefers-color-scheme: dark)').matches;var resolved=mode==='auto'?(prefersDark?'dark':'light'):mode;var root=document.documentElement;root.classList.remove('light','dark');root.classList.add(resolved);if(mode==='auto'){root.removeAttribute('data-theme')}else{root.setAttribute('data-theme',mode)}root.style.colorScheme=resolved;}catch(e){}})();`;

export const Route = createRootRoute({
  head: () => ({
    meta: [
      {
        charSet: 'utf-8',
      },
      {
        name: 'viewport',
        content: 'width=device-width, initial-scale=1, maximum-scale=1',
      },
      {
        title: 'Tempo - Planning Poker',
      },
      {
        name: 'description',
        content:
          'Scrum Tools for Modern Teams. High-juice, real-time collaboration.',
      },
      {
        property: 'og:title',
        content: 'Tempo - Scrum Tools for Modern Teams',
      },
      {
        property: 'og:description',
        content: 'Real-time estimation and collaboration for agile teams.',
      },
    ],
    links: [
      { rel: 'icon', type: 'image/svg+xml', href: '/favicon.svg' },
      { rel: 'apple-touch-icon', href: '/logo192.png' },
    ],
  }),
  shellComponent: RootDocument,
  component: RootComponent,
});

function RootComponent() {
  const [convex] = useState(
    () => new ConvexReactClient(import.meta.env.VITE_CONVEX_URL)
  );

  useEffect(() => {
    if (
      typeof window !== 'undefined' &&
      'serviceWorker' in navigator &&
      !import.meta.env.SSR &&
      import.meta.env.PROD
    ) {
      const register = () => {
        navigator.serviceWorker.register('/sw.js').catch((error) => {
          console.error('Service Worker registration failed:', error);
        });
      };

      if (document.readyState === 'complete') {
        register();
      } else {
        window.addEventListener('load', register);
        return () => window.removeEventListener('load', register);
      }
    }
  }, []);

  return (
    <ConvexProvider client={convex}>
      <Outlet />
    </ConvexProvider>
  );
}

function RootDocument({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="manifest" href="/manifest.json" />
        <script dangerouslySetInnerHTML={{ __html: THEME_INIT_SCRIPT }} />
        <HeadContent />
      </head>
      <body className="font-sans antialiased [overflow-wrap:anywhere] selection:bg-[rgba(79,184,178,0.24)]">
        <JuiceProvider>
          <Toaster richColors closeButton position="top-center" />
          <AriaLiveAnnouncer />
          <OfflineBanner />
          <Header />
          {children}
          <Footer />
        </JuiceProvider>
        <TanStackDevtools />
        <TanStackRouterDevtoolsPanel />
        <Scripts />
      </body>
    </html>
  );
}
