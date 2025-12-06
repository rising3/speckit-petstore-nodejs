import React from 'react';

export default function Card({
  children,
  className = '',
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={`card shadow-lg rounded-lg p-6 bg-white/70 dark:bg-base-200/60 ${className}`}>
      {children}
    </div>
  );
}
