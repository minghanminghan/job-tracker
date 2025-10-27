import Table from "./Table"
import { TableLabel } from "@/types/TableLabel"
import { getCurrentUser } from "@/utils/auth"
import { prisma } from "@/utils/prisma"

export default async function Page() {
    const user = await getCurrentUser()
    const user_id = user?.id

    const labels: TableLabel[] = [
        {
            display_name: "Name",
            raw_name: "name",
            renderType: 'text',
        },
        {
            display_name: "URL",
            raw_name: "url",
            renderType: 'link',
        },
    ]

    const documents = await Promise.all([
        prisma.resume.findMany({
            where: { user_id },
        }),
        prisma.cover_Letter.findMany({
            where: { user_id },
        }),
    ]).then(res => res.flat(1))
    
    return(
        <div>
            <Table title="Documents" labels={labels} data={documents} />
        </div>
    )
}