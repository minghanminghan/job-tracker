import { requireAuth } from "@/app/utils/auth"
import { prisma } from "@/app/utils/prisma"
import Table from "../components/Table"

export default async function DashboardPage() {
  const session = await requireAuth()
  
  // const fields = prisma.user_Job.fields
  // const jobs = await prisma.user_Job.findMany({
  //   where: { user_id: session.user.id },
  //   // include: { job: true },
  // })
  const fields = ['id', 'Company', 'Position']
  const jobs = [
    {id: 0, Company: 'OpenAI', Position: 'SWE'},
    {id: 1, Company: 'Disney', Position: 'SWE'},
    {id: 2, Company: 'Google', Position: 'SWE'},
    {id: 3, Company: 'Anthropic', Position: 'SWE'},
    {id: 4, Company: 'Amazon', Position: 'SWE'},
  ]

  return (
    <>
      <Table keys={fields} values={jobs}/>
    </>
  )
}