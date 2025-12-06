import React from 'react';
import './globals.css';
import Header from './components/Header';

export const metadata = {
  title: 'Speckit Petstore',
  description: 'Demo app for Hello endpoint',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  // Render a deterministic initial theme on the server to avoid hydration mismatches.
  // The client will read preferences on mount and may update the theme afterwards.
  return (
    <html lang="ja" data-theme="light">
      <head>
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;600;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="bg-base-100 text-base-content">
        <Header />
        <main>{children}</main>
      </body>
    </html>
  );
}
