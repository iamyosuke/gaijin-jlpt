import { auth } from "@/auth"
import { NextResponse } from "next/server"

export default auth((req) => {
  const isLoggedIn = !!req.auth?.user
  const isOnLogin = req.nextUrl.pathname === '/login'
  console.log(isLoggedIn, isOnLogin)
  if (isOnLogin) {
    if (isLoggedIn) return NextResponse.redirect(new URL('/', req.nextUrl))
    return NextResponse.next()
  }

  if (!isLoggedIn) {
    return NextResponse.redirect(new URL('/login', req.nextUrl))
  }
  return NextResponse.next()
})

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico|login).*)', '/', '/login'],
}
