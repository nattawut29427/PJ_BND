
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

  if (pathname.startsWith("/order/")) {
    if (!user) {
      return NextResponse.redirect(new URL("/login", request.url));
    }
  
    const orderId = pathname.split("/").pop(); // ดึง orderId จาก URL
  
    // console.log(" Checking Order:", orderId);
    // console.log(" User ID:", user.id);
  
    const orderRes = await fetch(`http://localhost:3000/api/order/${orderId}`, {
      headers: { Authorization: `Bearer ${user.accessToken}` },
    });
  
    if (!orderRes.ok) {
      // console.log(" Order not found or unauthorized.");
      return NextResponse.redirect(new URL("/unauthorized", request.url));
    }
  
    const order = await orderRes.json();
  
    // console.log(" Order Customer ID:", order.customerId);
  
    if (String(order.customerId) !== String(user.id)) {
      console.log(" User is not the owner of this order.");
      return NextResponse.redirect(new URL("/unauthorized", request.url));
    }
  
    // console.log("✅ Access granted.");
  }
  return NextResponse.next()
}