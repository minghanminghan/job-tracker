import { getServerSession } from "next-auth"
import Link from "next/link"
import { prisma } from "@/utils/prisma"
import { redirect } from "next/navigation"
import { logger } from "@/utils/logger"
import Table from "@/components/Table"
import { TableLabel } from "@/types/TableLabel"
import { Box } from "@mui/material"
import updateUser_Job_Status from "@/app/actions/updateUser_Job"


export default async function Page() {
    const session = await getServerSession()
    if (!session) redirect("/auth/signin")

    const labels: TableLabel[] = [
		{
			display_name: "Status",
			raw_name: "status",
			renderType: "select",
			values: ["PENDING", "APPLIED", "INTERVIEW", "OFFER", "REJECTED"]
		},
		{
			display_name: "Company",
			raw_name: "job.company",
			renderType: "text",
		},
		{
			display_name: "Position",
			raw_name: "job.position",
			renderType: "text",
		},
		{
			display_name: "Platform",
			raw_name: "job.platform",
			renderType: "text",
			},
		{
			display_name: "Resume",
			raw_name: "resume_name",
			renderType: "text",
		},
		{
			display_name: "Cover Letter",
			raw_name: "cover_letter_name",
			renderType: "text",
		},
		{
			display_name: "Created",
			raw_name: "createdAt",
			renderType: "text",
		},
        {
            display_name: "Updated",
            raw_name: "updatedAt",
            renderType: "text",
        },
    ]

    const jobs = await prisma.user_Job.findMany({
        where: { user_id: session.user.id },
        include: {
            job: true,
            resume: true,
            cover_letter: true,
        },
    })
    
    return (
        <Box>
			<Table title="Jobs" labels={labels} data={jobs} onChange={updateUser_Job_Status} />
        </Box>
    )
}