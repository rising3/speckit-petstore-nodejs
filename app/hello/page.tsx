'use client';

import React, { useState } from 'react';
import Container from '../components/Container';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';

export default function HelloPage() {
  const [name, setName] = useState('');
  const [result, setResult] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setResult(null);
    try {
      const res = await fetch('/api/hello', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name }),
      });
      const text = await res.text();
      setResult(text);
    } catch (err) {
      setResult('エラーが発生しました');
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen flex items-center justify-center hero-gradient py-16">
      <Container>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
          <div className="space-y-4 px-4">
            <div className="avatar">
              <div className="w-28 rounded-full ring ring-primary ring-offset-base-100 ring-offset-2">
                <svg viewBox="0 0 64 64" className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
                  <rect width="64" height="64" rx="12" fill="url(#g)" />
                  <defs>
                    <linearGradient id="g" x1="0" x2="1">
                      <stop offset="0" stopColor="#7c3aed" />
                      <stop offset="1" stopColor="#06b6d4" />
                    </linearGradient>
                  </defs>
                  <path d="M32 14c-7 0-12 5-12 11s5 11 12 11 12-5 12-11-5-11-12-11z" fill="#fff" opacity="0.9" />
                  <circle cx="24" cy="26" r="3" fill="#7c3aed" />
                  <circle cx="40" cy="26" r="3" fill="#06b6d4" />
                </svg>
              </div>
            </div>

            <h1 className="text-3xl md:text-4xl font-extrabold">こんにちは！</h1>
            <p className="text-md text-muted">名前を入力してボタンを押すと、日本語で挨拶します。DaisyUI と Tailwind で美しく。</p>

            <div className="hidden md:block">
              <div className="stats shadow">
                <div className="stat">
                  <div className="stat-title">Demo</div>
                  <div className="stat-value">DaisyUI</div>
                  <div className="stat-desc">React + Next.js</div>
                </div>
                <div className="stat">
                  <div className="stat-title">Status</div>
                  <div className="stat-value">Ready</div>
                  <div className="stat-desc">すぐに使えます</div>
                </div>
              </div>
            </div>
          </div>

          <div className="px-4">
            <Card className="w-full bg-white/80 backdrop-blur-md">
              <h2 className="text-2xl font-semibold mb-2">挨拶を送る</h2>
              <p className="text-sm text-muted mb-4">あなたの名前を入力して「挨拶する」を押してください。</p>

              <form onSubmit={handleSubmit} className="w-full">
                <div className="join w-full">
                  <input
                    value={name}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => setName(e.currentTarget.value)}
                    placeholder="名前を入力"
                    className="input input-bordered flex-1 join-item"
                    aria-label="名前"
                  />
                  <Button uiVariant="primary" type="submit" className="join-item" disabled={loading}>
                    {loading ? '送信中...' : '挨拶する'}
                  </Button>
                </div>
                <p className="text-xs text-muted mt-2">例: 太郎</p>
              </form>

              {result && (
                <div className="mt-6">
                  <strong>結果:</strong>
                  <div className="mt-2">
                    <div className="alert alert-info shadow-lg">
                      <div>
                        <svg xmlns="http://www.w3.org/2000/svg" className="stroke-current flex-shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M12 2a10 10 0 100 20 10 10 0 000-20z" />
                        </svg>
                        <span className="ml-2">{result}</span>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </Card>
          </div>
        </div>
      </Container>
    </main>
  );
}
