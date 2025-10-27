// import { getUser_Jobs } from "@/app/actions/getEntries"
import { getCurrentUser } from "@/utils/auth"
import { redirect } from "next/navigation"
import { prisma } from "@/utils/prisma"
import Dashboard from "./Dashboard"

export default async function Page() {
    const user = await getCurrentUser()
    if (!user || !user.id) redirect("/auth/signin")
    const user_id = user.id

    // stats:
    // 

    // views:
    // funnel / pipeline / stacked bar
    // week over week aggregation
    // github-style heatmap

    const data = await prisma.user_Job.findMany({
        where: {
            user_id: user_id
        }
    })

    // render all data views on the server side
    const funnelDataObj = data.reduce((acc, v) => {
        acc[v.status] = (acc[v.status] || 0) + 1
        return acc
    }, {} as any)
    const funnelColors = ["#87A878", "#B0BC98", "#C7CCB9", "#CAE2BC", "#DBF9B8"]
    const funnelData = Object.entries(funnelDataObj).map(([status, count], i) => ({ name: status, value: count as number, fill: funnelColors[i] }))

    // just createdAt data => date added, not date applied (need to refactor schema first)
    // maybe: color code by status
    const heatmapDataObj = data.reduce((acc, job) => {
        const dateKey = job.createdAt.toISOString().split('T')[0] // "2024-01-15"
        acc[dateKey] = (acc[dateKey] || 0) + 1
        return acc
    }, {} as Record<string, number>)
    const heatmapData = Object.entries(heatmapDataObj).map(([date, value]) => ({
        date,
        value: value as number
    }))
    console.log(heatmapData)

    return(
        <Dashboard funnelData={funnelData} heatmapData={heatmapData} />
    )
}