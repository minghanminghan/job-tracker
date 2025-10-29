"use server"

import { prisma } from "@/utils/prisma"
import { revalidatePath } from "next/cache"
import { $Enums } from "@/generated/prisma"

export async function updateUser_Job_Status(user_id: string, job_id: string, new_status: $Enums.Status) {
    const now = new Date()
    await prisma.user_Job.update({
        where: { user_id_job_id: {
            job_id,
            user_id
        }},
        data: {
            status: new_status,
            [`${new_status.toLowerCase()}Date`]: now,
        }
    })
    revalidatePath("/jobs/table")
}

export async function deleteUser_Job(user_id: string, job_id: string) {
    await prisma.user_Job.delete({
        where: { user_id_job_id: {
            job_id,
            user_id
        }}
    })
    revalidatePath("/jobs/table")
}