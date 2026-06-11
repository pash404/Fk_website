import { NextResponse } from 'next/server';

const publicPaths = ['/login', '/register', '/forgot-password', '/reset-password', '/admin/login', '/admin/register', '/index.html', '/cart.html', '/checkout.html', '/product-details.html', '/order-history.html', '/payment.html', '/preview.html', '/select-address.html', '/success.html'];

export function middleware(request) {
  const token = request.cookies.get('token')?.value;
  const path = request.nextUrl.pathname;

  const userStr = request.cookies.get('user')?.value;
  let user = null;
  try {
    user = userStr ? JSON.parse(userStr) : null;
  } catch {
  }

  const isPublic = publicPaths.some(p => path.startsWith(p)) || path === '/';

  if (isPublic) {
    if (token && user) {
      if (user.role === 'SELLER') {
        return NextResponse.redirect(new URL('/seller/dashboard', request.url));
      }
      if (user.role === 'ADMIN') {
        return NextResponse.redirect(new URL('/admin/dashboard', request.url));
      }
    }
    return NextResponse.next();
  }

  if (!token) {
    const loginUrl = new URL('/login', request.url);
    loginUrl.searchParams.set('redirect', path);
    return NextResponse.redirect(loginUrl);
  }

  if (path.startsWith('/seller') && user?.role !== 'SELLER') {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  if (path.startsWith('/admin') && user?.role !== 'ADMIN') {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico|uploads|images|css|js|.*\\.html).*)'],
};
