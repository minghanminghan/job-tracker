import { getServerSession } from "next-auth"
import Link from "next/link"
import { prisma } from "@/utils/prisma"
import Table from "../../components/Table"
import { Button, Modal, Box, Paper, Typography, Dialog } from "@mui/material"
import { redirect } from "next/navigation"
import { logger } from "@/utils/logger"

export default async function Page() {
    const session = await getServerSession()
    if (!session) redirect("/auth/signin")

    const fields = Object.keys(prisma.user_Job.fields)
    const jobs = await prisma.user_Job.findMany({
        where: { user_id: session.user.id },
        include: {
            job: true,
            resume: true,
            cover_letter: true,
        },
    })
    console.log(jobs)
    
    return (
        <div>
            <Button variant="outlined"><Link href="/add">Add Job</Link></Button>
            <Button variant="outlined">Add Resume</Button>
            <Table keys={fields} values={jobs}/>
        </div>
    )
}