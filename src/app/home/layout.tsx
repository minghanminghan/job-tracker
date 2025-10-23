import { getServerSession } from "next-auth"
import { authOptions } from "@/utils/auth"
import { redirect } from "next/navigation"
import { Button, Link } from "@mui/material"

export default async function Layout({
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
      <Button variant="outlined"><Link href="/add">Add Job</Link></Button>
      <Button variant="outlined">Add Resume</Button>
      {children}
    </div>
  )
}