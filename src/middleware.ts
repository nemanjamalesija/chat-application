import { getToken } from 'next-auth/jwt';
import { withAuth } from 'next-auth/middleware';
import { NextResponse } from 'next/server';

export default withAuth(
  async function middleware(req) {
    // get the path
    const pathname = req.nextUrl.pathname;

    // get token
    const isAuth = await getToken({ req });

    //get the path name
    const isLoginPage = pathname.startsWith('/login');

    const sensitiveRoutes = ['/dashboard'];

    // check if user is trying to acess sensitive route
    const isAccessingSensitiveRoute = sensitiveRoutes.some((route) =>
      pathname.startsWith(route)
    );

    // redirect to dashboard if logged in and pathname is /login
    if (isLoginPage) {
      {
        if (isAuth)
          return NextResponse.redirect(new URL('/dashboard', req.url));
      }
      return NextResponse.next();
    }

    // redirect if not auth and trying to acess dashboard/:path*
    if (!isAuth && isAccessingSensitiveRoute)
      return NextResponse.redirect(new URL('/login', req.url));

    // if logged in and acessing /
    if (isAuth && pathname === '/')
      return NextResponse.redirect(new URL('/dashboard', req.url));
  },
  {
    callbacks: {
      async authorized() {
        return true;
      },
    },
  }
);

export const config = {
  matcher: ['/', '/login', '/dashboard/:path*'],
};
