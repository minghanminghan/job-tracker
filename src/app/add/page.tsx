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
} from "@mui/material"
import { Status } from "@/generated/prisma"
import { useSession } from "next-auth/react"

export default function Page() {
  const { data: session, status } = useSession()

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
  const [coverLetterFile, setCoverLetterFile] = useState<File | null>(null)

  // UI state
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)

  // Handle text input changes
  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  // Handle resume file upload
  const handleResumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setResumeFile(file)
    }
  }

  // Handle cover letter file upload
  const handleCoverLetterChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setCoverLetterFile(file)
    }
  }

  // Form validation
  const validateForm = (): string | null => {
    if (!formData.url.trim()) return "Job URL is required"
    if (!formData.company.trim()) return "Company name is required"
    if (!formData.position.trim()) return "Position is required"
    if (!formData.platform.trim()) return "Platform is required"
    if (!resumeFile) return "Resume file is required"
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
      const resumeUrl = `uploads/resumes/${resumeFile!.name}`
      const coverLetterUrl = coverLetterFile
        ? `uploads/cover-letters/${coverLetterFile.name}`
        : undefined

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
          name: resumeFile!.name,
          url: resumeUrl,
        },
        cover_letter: coverLetterFile
          ? {
              name: coverLetterFile.name,
              url: coverLetterUrl!,
            }
          : undefined,
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
      setCoverLetterFile(null)
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
        mt: 4,
        p: 3,
      }}
    >
      <Paper elevation={3} sx={{ p: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Add New Job Application
        </Typography>

        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        {success && (
          <Alert severity="success" sx={{ mb: 2 }}>
            Job application created successfully!
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

          {/* Resume Upload */}
          <Box sx={{ mt: 2, mb: 2 }}>
            <Button variant="outlined" component="label" fullWidth>
              Upload Resume
              <input
                type="file"
                hidden
                accept=".pdf"
                onChange={handleResumeChange}
              />
            </Button>
            {resumeFile && (
              <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                Selected: {resumeFile.name}
              </Typography>
            )}
          </Box>

          {/* Cover Letter Upload (Optional) */}
          <Box sx={{ mt: 2, mb: 3 }}>
            <Button variant="outlined" component="label" fullWidth>
              Upload Cover Letter (Optional)
              <input
                type="file"
                hidden
                accept=".pdf"
                onChange={handleCoverLetterChange}
              />
            </Button>
            {coverLetterFile && (
              <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                Selected: {coverLetterFile.name}
              </Typography>
            )}
          </Box>

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
