'use client';

import React, { useState } from 'react';
import { Button, Card } from 'react-daisyui';

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
    <main className="min-h-screen flex flex-col items-center justify-start hero-gradient py-12">
      <div className="site-container">
        <section className="card card-modern shadow-xl p-6 bg-white/60 dark:bg-base-200/60">
          <div className="max-w-2xl mx-auto">
            <Card className="w-full">
              <Card.Body>
                <Card.Title>Hello (React + DaisyUI)</Card.Title>
                <form onSubmit={handleSubmit} className="flex gap-2 items-center">
                  <input
                    value={name}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                      setName(e.currentTarget.value)
                    }
                    placeholder="名前を入力"
                    className="input input-bordered flex-1"
                  />
                  <Button color="primary" type="submit" disabled={loading}>
                    {loading ? '送信中...' : '挨拶する'}
                  </Button>
                </form>

                {result && (
                  <div className="mt-4">
                    <strong>結果:</strong>
                    <div className="mt-2">{result}</div>
                  </div>
                )}
              </Card.Body>
            </Card>
          </div>
        </section>
      </div>
    </main>
  );
}
