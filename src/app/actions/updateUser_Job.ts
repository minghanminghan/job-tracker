"use server"

import { prisma } from "@/utils/prisma"
import { revalidatePath } from "next/cache"
import { $Enums } from "@/generated/prisma"

export default async function updateUser_Job_Status(user_job_id: string, new_status: $Enums.Status) {
    // new_job must contain id and updated fields
    // console.log(new_job)
    await prisma.user_Job.update({
        where: { id: user_job_id },
        data: {
            status: new_status
        }
    })
    revalidatePath("/home")
}