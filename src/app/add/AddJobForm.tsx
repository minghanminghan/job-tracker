"use client"

import { useState } from "react"
import {
  Box,
  Button,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Typography,
  Paper,
  Alert,
  CircularProgress,
  RadioGroup,
  Radio,
  FormControlLabel,
} from "@mui/material"
import { Status } from "@/generated/prisma"
import { getResumes, getCoverLetters } from "@/app/actions/getEntry"
import UploadOrSelectFile from "./UploadOrSelectFile"

export default function AddJobForm({user_id, existingResumes, existingCoverLetters }: {user_id: string, existingResumes: Record<string, any>[], existingCoverLetters: Record<string, any>[]}) {
  // Form state
  const [formData, setFormData] = useState({
    url: "",
    company: "",
    position: "",
    platform: "",
    status: "PENDING" as Status,
  })

  // File state
  const [resumeFile, setResumeFile] = useState<File | null>(null)
  const [resumeEntry, setResumeEntry] = useState<Record<string, any> | null>(null)
  const [coverLetterFile, setCoverLetterFile] = useState<File | null>(null)
  const [coverLetterEntry, setCoverLetterEntry] = useState<Record<string, any> | null>(null)

  // UI state
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)

  // Handle text input changes
  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  // Handle resume file upload / selection
  const handleResumeChange = (newResume: File | null, existingResume: Record<string, any> | null) => {
    if (existingResume === null) {
      setResumeFile(newResume)
      setResumeEntry(null)
    } else {
      setResumeFile(null)
      setResumeEntry(existingResume)
    }
  }

  // Handle cover letter file upload / selection
  const handleCoverLetterChange = (newCoverLetter: File | null, existingCoverLetter: Record<string, any> | null) => {
    if (newCoverLetter) {
      setCoverLetterFile(newCoverLetter)
      setCoverLetterEntry(null)
    } else {
      setCoverLetterFile(null)
      setCoverLetterEntry(existingCoverLetter)
    }
  }

  // Form validation
  const validateForm = (): string | null => {
    console.log("file", resumeFile)
    console.log("entry", resumeEntry)
    if (!formData.url.trim()) return "Job URL is required"
    if (!formData.company.trim()) return "Company name is required"
    if (!formData.position.trim()) return "Position is required"
    if (!formData.platform.trim()) return "Platform is required"
    if (!resumeFile && !resumeEntry) return "Resume is required"
    return null
  }

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setSuccess(false)

    // Validate form
    const validationError = validateForm()
    if (validationError) {
      setError(validationError)
      return
    }

    setLoading(true)

    try {
      // TODO: Upload files to storage (e.g., S3, Cloudinary, etc.)
      // For now, we'll use placeholder URLs
      const resumeExists = resumeEntry !== null
      const resumeUrl = resumeExists ? resumeEntry?.url : resumeFile?.name // handle file upload

      const coverLetterExists = coverLetterEntry !== null
      const coverLetterUrl = coverLetterExists ? coverLetterEntry?.url : coverLetterFile?.name

      // Prepare request body
      const requestBody = {
        job: {
          url: formData.url,
          company: formData.company,
          position: formData.position,
          platform: formData.platform,
        },
        status: formData.status,
        resume: {
          ...resumeEntry,
          ...resumeFile,
          exists: resumeExists, // technically don't need this
        },
        coverLetter: {
          ...coverLetterEntry,
          ...coverLetterFile,
          exists: coverLetterEntry !== null,
          uploaded: coverLetterFile !== null,
        },
      }

      // Submit to API
      const response = await fetch("/api/user_job", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(requestBody),
      })

      if (!response.ok) {
        const errorText = await response.text()
        throw new Error(errorText || "Failed to create job application")
      }

      // Success
      setSuccess(true)
      // Reset form
      setFormData({
        url: "",
        company: "",
        position: "",
        platform: "",
        status: "PENDING",
      })
      setResumeFile(null)
      setResumeEntry(null)
      setCoverLetterFile(null)
      setCoverLetterEntry(null)
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

        <form onSubmit={handleSubmit}>
          {/* Job URL */}
          <TextField
            fullWidth
            label="Job URL"
            value={formData.url}
            onChange={(e) => handleInputChange("url", e.target.value)}
            margin="normal"
            required
            placeholder="https://company.com/careers/job-id"
          />

          {/* Company */}
          <TextField
            fullWidth
            label="Company"
            value={formData.company}
            onChange={(e) => handleInputChange("company", e.target.value)}
            margin="normal"
            required
            placeholder="Google"
          />

          {/* Position */}
          <TextField
            fullWidth
            label="Position"
            value={formData.position}
            onChange={(e) => handleInputChange("position", e.target.value)}
            margin="normal"
            required
            placeholder="Software Engineer"
          />

          {/* Platform */}
          <TextField
            fullWidth
            label="Platform"
            value={formData.platform}
            onChange={(e) => handleInputChange("platform", e.target.value)}
            margin="normal"
            required
            placeholder="LinkedIn, Indeed, Company Website, etc."
          />

          {/* Status */}
          <FormControl fullWidth margin="normal" required>
            <InputLabel>Status</InputLabel>
            <Select
              value={formData.status}
              label="Status"
              onChange={(e) =>
                handleInputChange("status", e.target.value as Status)
              }
            >
              <MenuItem value="PENDING">Pending</MenuItem>
              <MenuItem value="APPLIED">Applied</MenuItem>
              <MenuItem value="INTERVIEW">Interview</MenuItem>
              <MenuItem value="OFFER">Offer</MenuItem>
              <MenuItem value="REJECTED">Rejected</MenuItem>
            </Select>
          </FormControl>

          {/* Resume, Cover Letter Upload */}
          <UploadOrSelectFile isResume={true} existingFiles={existingResumes} handleChange={handleResumeChange} />
          <UploadOrSelectFile isResume={false} existingFiles={existingCoverLetters} handleChange={handleCoverLetterChange} />

          {/* Submit Button */}
          <Button
            type="submit"
            variant="contained"
            fullWidth
            size="large"
            disabled={loading}
            sx={{ mt: 2 }}
          >
            {loading ? (
              <CircularProgress size={24} color="inherit" />
            ) : (
              "Add Job"
            )}
          </Button>
        </form>
      </Paper>
    </Box>
  )
}
