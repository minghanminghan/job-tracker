"use server"

import { prisma } from "@/utils/prisma"

export async function getResumes(user_id: string) {
    const resumes = await prisma.resume.findMany({
        where: { user_id: user_id },
        orderBy: { createdAt: 'desc' },
    })
    return resumes
}

export async function getCoverLetters(user_id: string) {
    const cover_letters = await prisma.cover_Letter.findMany({
        where: { user_id: user_id },
        orderBy: { createdAt: 'desc' },
    })
    return cover_letters
}

export async function getUser_Jobs(user_id: string) {
    const user_jobs = await prisma.user_Job.findMany({
        where: { user_id: user_id },
        orderBy: { createdAt: 'desc' },
    })
    return user_jobs
}