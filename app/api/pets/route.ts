// App Router handler for GET /api/pets
export async function GET(_request: Request) {
  const body = JSON.stringify({ items: [], total: 0, page: 1, pageSize: 10 });
  return new Response(body, {
    status: 200,
    headers: { 'Content-Type': 'application/json' },
  });
}

// Future: export other methods (POST/PUT) as needed
