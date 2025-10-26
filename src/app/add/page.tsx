import { getCurrentUser } from "@/utils/auth";
import { prisma } from "@/utils/prisma";
import { redirect } from "next/navigation";
import AddJobForm from "./AddJobForm";


export default async function Page() {
  const user = await getCurrentUser()
  if (!user || !user.id) redirect("/auth/signin")
  const user_id = user.id

  const [resumes, coverLetters] = await Promise.all([
    prisma.resume.findMany({ where: { user_id: user_id } }),
    prisma.cover_Letter.findMany({ where: { user_id: user_id } })
  ])
  
  return <AddJobForm user_id={user_id} existingResumes={resumes} existingCoverLetters={coverLetters} />
}