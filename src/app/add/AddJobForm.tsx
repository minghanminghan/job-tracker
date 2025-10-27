"use client"

import { useState } from "react"
import {
  Box,
  Typography,
  Paper,
  Alert,
} from "@mui/material"
import JobForm, { JobFormData } from "@/components/JobForm"

export default function AddJobForm({
  user_id,
  existingResumes,
  existingCoverLetters
}: {
  user_id: string
  existingResumes: Record<string, any>[]
  existingCoverLetters: Record<string, any>[]
}) {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)

  const handleSubmit = async (data: JobFormData) => {
    setLoading(true)
    setError(null)
    setSuccess(false)

    try {
      const response = await fetch("/api/user_job", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      })

      if (!response.ok) {
        const errorText = await response.text()
        throw new Error(errorText || "Failed to create job application")
      }

      setSuccess(true)
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred")
    } finally {
      setLoading(false)
    }
  }

  return (
    <Box
      sx={{
        maxWidth: 600,
        mx: "auto",
        p: 1,
      }}
    >
      <Paper elevation={3} sx={{ p: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Add Job
        </Typography>

        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        {success && (
          <Alert severity="success" sx={{ mb: 2 }}>
            Job application added successfully!
          </Alert>
        )}

        <JobForm
          existingResumes={existingResumes}
          existingCoverLetters={existingCoverLetters}
          onSubmit={handleSubmit}
          isLoading={loading}
        />
      </Paper>
    </Box>
  )
}
