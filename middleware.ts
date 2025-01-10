import { getToken } from 'next-auth/jwt'
import { NextResponse } from 'next/server'

export async function middleware(request:any) {
  const user = await getToken({
    req: request,
    secret: process.env.NEXTAUTH_SECRET,
  })

  // Get the pathname of the request
  const { pathname } = request.nextUrl

  // redirect if user has login
  if( pathname.startsWith('/auth/signin') && user === user) {
    return NextResponse.redirect(new URL('/', request.url))
  }

  // If the pathname starts with /protected and the user is not an admin, redirect to the home page
  if (
    pathname.startsWith('/docs') &&
    (!user || user.role !== 'admin')
  ) {
    return NextResponse.redirect(new URL('/', request.url))
  }

  // Continue with the request if the user is an admin or the route is not protected
  return NextResponse.next()
}