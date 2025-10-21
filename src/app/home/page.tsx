import { requireAuth } from "@/app/utils/auth"
import { prisma } from "@/app/utils/prisma"

export default async function DashboardPage() {
  const session = await requireAuth()
  
  const jobs = await prisma.user_Job.findMany({
    where: { user_id: session.user.id },
    include: { job: true },
  })

  return <div>Your jobs: {jobs.length}</div>
}