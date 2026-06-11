import { NextResponse } from 'next/server';

export function success(data, status = 200) {
  return NextResponse.json({ success: true, data }, { status });
}

export function error(message, status = 400) {
  return NextResponse.json({ success: false, message }, { status });
}

export function parseBody(request) {
  return request.json().catch(() => null);
}

export function getSearchParams(request) {
  const { searchParams } = new URL(request.url);
  return searchParams;
}
