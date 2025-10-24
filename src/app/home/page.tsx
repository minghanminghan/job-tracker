import { getServerSession } from "next-auth"
import Link from "next/link"
import { prisma } from "@/utils/prisma"
import { redirect } from "next/navigation"
import { logger } from "@/utils/logger"
import Table, { Label } from "@/components/Table"
import { Box } from "@mui/material"
import updateUser_Job_Status from "@/app/actions/updateUser_Job"


export default async function Page() {
    const session = await getServerSession()
    if (!session) redirect("/auth/signin")

    const labels: Label[] = [
		{
			display_name: "Status",
			raw_name: "status",
			static: false,
			values: ["PENDING", "APPLIED", "INTERVIEW", "OFFER", "REJECTED"]
		},
		{
			display_name: "Company",
			raw_name: "job.company",
			static: true,
		},
		{
			display_name: "Position",
			raw_name: "job.position",
			static: true,
		},
		{
			display_name: "Platform",
			raw_name: "job.platform",
			static: true,
			},
		{
			display_name: "Resume",
			raw_name: "resume_name",
			static: true,
		},
		{
			display_name: "Cover Letter",
			raw_name: "cover_letter_name",
			static: true,
		},
		{
			display_name: "Created",
			raw_name: "createdAt",
			static: true,
		},
        {
            display_name: "Updated",
            raw_name: "updatedAt",
            static: true,
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
        <Box padding={5}>
			<Table labels={labels} initialData={jobs} onChange={updateUser_Job_Status} />
        </Box>
    )
}