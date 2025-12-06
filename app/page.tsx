import Link from 'next/link';
import Container from './components/Container';
import Button from '../components/ui/Button';

export default function Home() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-start hero-gradient py-12">
      <Container>
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl md:text-4xl font-extrabold leading-tight">Speckit Petstore</h1>
          <div className="hidden md:block text-sm text-muted">
            A modern demo using Next.js + DaisyUI
          </div>
        </div>

        <section className="card card-modern shadow-xl p-6 bg-white/60 dark:bg-base-200/60">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <h2 className="text-2xl font-semibold">Welcome</h2>
              <p className="mt-2 text-gray-600 dark:text-gray-300">
                This demo shows a Next.js App Router page using DaisyUI components and a themed
                layout. Try the Hello page to interact with the API.
              </p>
            </div>
            <div className="flex gap-3">
              <Link href="/hello" className="btn btn-primary">
                Try Hello
              </Link>
            </div>
          </div>
        </section>
      </Container>
    </main>
  );
}
