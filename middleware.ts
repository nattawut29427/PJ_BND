
import { getToken } from 'next-auth/jwt'
import { NextResponse } from 'next/server'

export async function middleware(request:any) {
  const user = await getToken({
    req: request,
    secret: process.env.NEXTAUTH_SECRET,
  })

  const { pathname } = request.nextUrl

  // if (pathname.startsWith('/api/productService') && !user) {
  //   return NextResponse.json({ error: 'Unauthorized access' }, { status: 401 });
  // }

  if (pathname.startsWith('/auth/signin') && user) {
    return NextResponse.redirect(new URL('/', request.url));
  }

  
  if (
    pathname.startsWith('/admin') &&
    (!user || user.role !== 'admin')
  ) {
    console.log(user)
    return NextResponse.redirect(new URL('/', request.url))
  }

  if (
    pathname.startsWith('/cashier') &&
    (!user || (user.role !== 'cashier' && user.role !== 'admin'))
  ) {
    console.log(user)
    return NextResponse.redirect(new URL('/', request.url))
  }


  
  return NextResponse.next()
}