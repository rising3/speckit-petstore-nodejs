'use client';

import React, { useEffect, useState } from 'react';
import { Button } from 'react-daisyui';

const THEME_KEY = 'theme';

export default function ThemeToggle() {
  // Start with a deterministic initial theme for SSR and first client render
  // to avoid hydration mismatches. Do not access `window`/`localStorage` during render.
  const [theme, setTheme] = useState<string>('light');

  // On mount, read cookie first (to match server-rendered data-theme), then fall back to localStorage and system preference.
  useEffect(() => {
    try {
      function getCookie(name: string) {
        if (typeof document === 'undefined') return null;
        const match = document.cookie.match('(^|;)\\s*' + name + '\\s*=\\s*([^;]+)');
        return match ? match.pop() : null;
      }
      const cookie = getCookie('theme');
      if (cookie) {
        setTheme(cookie);
        document.documentElement.setAttribute('data-theme', cookie);
        return;
      }
      const stored = localStorage.getItem(THEME_KEY);
      if (stored) {
        setTheme(stored);
        document.documentElement.setAttribute('data-theme', stored);
        return;
      }
      const prefersDark =
        window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
      const initial = prefersDark ? 'dark' : 'light';
      setTheme(initial);
      document.documentElement.setAttribute('data-theme', initial);
    } catch (e) {
      // ignore
    }
  }, []);

  // Sync localStorage and document when theme changes after mount
  useEffect(() => {
    try {
      localStorage.setItem(THEME_KEY, theme);
      document.documentElement.setAttribute('data-theme', theme);
    } catch (e) {
      // ignore
    }
  }, [theme]);

  function toggle() {
    setTheme((prev) => (prev === 'dark' ? 'light' : 'dark'));
  }

  const Sun = (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="20"
      height="20"
      className="h-5 w-5"
      viewBox="0 0 24 24"
      fill="#F6C23E"
      aria-hidden="true"
      role="img"
    >
      <path d="M6.76 4.84l-1.8-1.79L3.17 5.84l1.79 1.79 1.8-2.79zM1 13h3v-2H1v2zm10-9h2V1h-2v3zm7.03 1.05l-1.79 1.79 1.8 1.79 1.79-1.79-1.8-1.79zM17 11v2h3v-2h-3zM12 7a5 5 0 100 10 5 5 0 000-10zm0 12h2v3h-2v-3zM4.22 17.66l1.79-1.79-1.8-1.79-1.79 1.79 1.8 1.79zM20.83 18.36l-1.79-1.79-1.8 1.79 1.79 1.79 1.8-1.79z" />
    </svg>
  );

  const Moon = (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="20"
      height="20"
      className="h-5 w-5"
      viewBox="0 0 24 24"
      fill="#C7D2FE"
      aria-hidden="true"
      role="img"
    >
      <path d="M21 12.79A9 9 0 1111.21 3c.26 0 .51.01.76.04A7 7 0 0021 12.79z" />
    </svg>
  );

  return (
    <Button
      size="sm"
      color="ghost"
      onClick={toggle}
      aria-label="Toggle theme"
      aria-pressed={theme === 'dark'}
      title={theme === 'dark' ? 'Night mode' : 'Day mode'}
      className="flex items-center gap-2"
    >
      {theme === 'dark' ? Moon : Sun}
      <span className="hidden sm:inline">{theme === 'dark' ? '夜' : '昼'}</span>
    </Button>
  );
}
