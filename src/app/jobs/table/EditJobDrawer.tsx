"use client"

import { Box, Drawer, Typography, Alert } from "@mui/material"
import { useState } from "react"
import JobForm, { JobFormData } from "@/components/JobForm"

export default function EditJobDrawer({
    open,
    onClose,
    row,
    existingResumes,
    existingCoverLetters
}: {
    open: boolean
    onClose: () => void
    row: Record<string, any> | null
    existingResumes: Record<string, any>[]
    existingCoverLetters: Record<string, any>[]
}) {
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)

    const handleSubmit = async (data: JobFormData) => {
        setLoading(true)
        setError(null)

        try {
            // TODO: Replace with server action
            // await updateJobAction(row?.id, data)

            const response = await fetch(`/api/user_job/${row?.id}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(data),
            })

            if (!response.ok) {
                const errorText = await response.text()
                throw new Error(errorText || "Failed to update job application")
            }

            onClose()
        } catch (err) {
            setError(err instanceof Error ? err.message : "An error occurred")
        } finally {
            setLoading(false)
        }
    }

    return (
        <Drawer anchor="right" open={open} onClose={onClose}>
            <Box sx={{
                width: 500,
                height: '100%',
                p: 3,
                overflowY: 'auto'
            }}>
                <Typography variant="h5" gutterBottom>
                    Edit Job Application
                </Typography>

                {error && (
                    <Alert severity="error" sx={{ mb: 2 }}>
                        {error}
                    </Alert>
                )}

                {row && (
                    <JobForm
                        initialData={{
                            job: row.job,
                            status: row.status,
                            resume: row.resume,
                            coverLetter: row.coverLetter,
                        }}
                        existingResumes={existingResumes}
                        existingCoverLetters={existingCoverLetters}
                        onSubmit={handleSubmit}
                        onCancel={onClose}
                        isLoading={loading}
                    />
                )}
            </Box>
        </Drawer>
    )
}
