import { prisma } from "@/utils/prisma"
import { logger } from "@/utils/logger"
import { getCurrentUser } from "@/utils/auth"
import { NextRequest, NextResponse } from "next/server"


export async function GET(request: NextRequest) {
    const user = await getCurrentUser()
    if (!user) {
        return new NextResponse(JSON.stringify({ error: "unauthenticated request" }), { status: 401 })
    }

    const params = request.nextUrl.searchParams
    const user_id = params.get('user_id')
    if (!user_id) {
        logger.error("missing user_id")
        return new NextResponse("missing user_id", {status: 400 })
    }
    const jobs = await prisma.user_Job.findMany({ where: { user_id: user_id }})
    return new NextResponse(JSON.stringify(jobs))
}


export async function POST(request: NextRequest) {
    const user = await getCurrentUser()
    if (!user) {
        return new NextResponse(JSON.stringify({ error: "unauthenticated request" }), { status: 401 })
    }
    const user_id = user.id

    const body = await request.json()
    if (!body.status || !body.job || !body.resume) {
        logger.error("missing fields")
        return new NextResponse("missing fields", { status: 400 })
    }
    const { status, job, resume, coverLetter } = body
    try {
        const createData: any = {
            user: { connect: { id: user_id } },
            status,
            job: {
                connectOrCreate: {
                    where: { url: job.url },
                    create: { ...job }
                }
            },
        }
        if (resume.exists) {
            createData.resume = {
                connect: { user_id_name: { user_id: user_id, name: resume.name }}
            }
        } else {
            createData.resume = {
                create: {
                    name: resume.name,
                    url: resume.url,
                    user_id,
                }
            }
        }
        if (coverLetter.exists || coverLetter.uploaded) {
            createData.coverLetter = {
                connectOrCreate: {
                    where: { user_id_name: { user_id, name: coverLetter.name } },
                    create: {
                        name: coverLetter.name,
                        url: coverLetter.url,
                        user_id,
                    }
                }
            }
        }

        await prisma.user_Job.create({ data: createData })
    } catch(e: any) {
        logger.error(e)
        return new NextResponse(e.message, { status: 404 })
    }
    return new NextResponse()
}