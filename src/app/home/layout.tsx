import { getServerSession } from "next-auth"
import { authOptions } from "@/app/utils/auth"
import { redirect } from "next/navigation"

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const session = await getServerSession(authOptions)
  
  if (!session) {
    redirect("/auth/signin")
  }

  return (
    <div>
      {children}
    </div>
  )
}