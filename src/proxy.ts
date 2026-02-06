import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// required for totp plugin
export function proxy(request: NextRequest) {
  const pathname = request.nextUrl.pathname;
  const response = NextResponse.next();

  response.headers.append('x-pathname', pathname);

  return response;
}
