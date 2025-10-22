import { withAuth } from "next-auth/middleware"

export default withAuth({
  callbacks: {
    authorized({ req, token }) {
      return !!token
    },
  },
  // pages: {
  //   signIn: "/login",
  // },
})

export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * / (home page)
     * /auth/* (auth pages)
     * /api
     * /_next/* (Next.js internals)
     * /favicon.ico, /sitemap.xml, /robots.txt (static files)
     */
    "/((?!$|auth|api|_next|favicon.ico|sitemap.xml|robots.txt).*)",
  ],
}