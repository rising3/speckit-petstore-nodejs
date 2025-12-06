import { POST } from '../../../../../app/api/hello/route';

describe('POST /api/hello', () => {
  it('returns greeting with provided name', async () => {
    const req = new Request('http://localhost/api/hello', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name: '太郎' }),
    });
    const res = await POST(req as any);
    expect(res.status).toBe(200);
    const text = await res.text();
    expect(text).toBe('こんにちは、太郎さん');
  });

  it('uses fallback name when name missing or empty', async () => {
    const req = new Request('http://localhost/api/hello', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({}),
    });
    const res = await POST(req as any);
    expect(res.status).toBe(200);
    const text = await res.text();
    expect(text).toBe('こんにちは、名無しさん');
  });

  it('returns 400 on invalid json', async () => {
    // invalid JSON body
    const req = new Request('http://localhost/api/hello', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: '{ invalid json',
    });
    const res = await POST(req as any);
    expect(res.status).toBe(400);
  });
});
