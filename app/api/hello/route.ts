// POST /api/hello
export async function POST(request: Request) {
  try {
    const data = (await request.json()) as { name?: string };
    const name = typeof data?.name === 'string' && data.name.trim() ? data.name.trim() : '名無し';
    const greeting = `こんにちは、${name}さん`;
    return new Response(greeting, {
      status: 200,
      headers: { 'Content-Type': 'text/plain; charset=utf-8' },
    });
  } catch (err) {
    return new Response('Invalid request', { status: 400 });
  }
}
