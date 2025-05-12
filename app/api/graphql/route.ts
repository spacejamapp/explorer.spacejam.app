import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  const body = await request.json();
  const res = await fetch(process.env.GRAPHQL_SCHEMA_URL, {
    method: 'POST',
    body: JSON.stringify(body),
  });
  const data = await res.json();

  return NextResponse.json(data);
}
