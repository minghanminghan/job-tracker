import { prisma } from "./prisma"
import { logger } from "./logger"
import { NextAuthOptions } from "next-auth"
import GoogleProvider from "next-auth/providers/google"
import { getServerSession } from "next-auth"
import { redirect } from "next/navigation"

export const authOptions: NextAuthOptions = {
    providers: [
        GoogleProvider({
        clientId: process.env.GOOGLE_CLIENT_ID!,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
        }),
    ],
    session: {
        strategy: "jwt",
    },
    callbacks: {
        async signIn({ user, account, profile }) {
            // check existence in User table
            if (user.email) {
                await prisma.user.upsert({
                    where: { email: user.email },
                    update: {  }, // pass, maybe update updatedAt
                    create: { email: user.email },
                })
                return true
            } else {
                logger.error({user}, 'missing email for user')
                return false
            }
        },
        async jwt({ token, user, account, profile }) {
            // First time JWT is created (on sign in)
            if (user) {
                token.id = user.id
                token.email = user.email
                token.name = user.name
                token.picture = user.image
            }
            return token
        },
        async session({ session, token }) {
            // Send properties to the client
            if (token) {
                session.user.id = token.id as string
                session.user.email = token.email as string
                session.user.name = token.name as string
                session.user.image = token.picture as string
            }
            return session
        },
    },
    secret: process.env.NEXTAUTH_SECRET,
}

// Helper to require auth in server components
export async function requireAuth() {
    const session = await getServerSession(authOptions)
    if (!session) {
        redirect("/auth/signin")
    }
    return session
}

// Helper to get current user (returns null if not authenticated)
export async function getCurrentUser() {
    const session = await getServerSession(authOptions)
    return session?.user
}