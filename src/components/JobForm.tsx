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
  CircularProgress,
} from "@mui/material"
import { Status } from "@/generated/prisma"
import UploadOrSelectFile from "@/app/add/UploadOrSelectFile"

export type JobFormData = {
  job: {
    url:          string
    company:      string
    position:     string
    platform:     string
    location:     string[]
    salary_min?:  number
    salary_max?:  number
  }
  status: Status
  resume: any
  coverLetter: any
}

const JOB_BOARDS = ["", "Ashby", "Greenhouse", "Handshake", "Indeed", "Lever", "LinkedIn", "Workday"]

export default function JobForm({
  initialData,
  existingResumes,
  existingCoverLetters,
  onSubmit,
  onCancel,
  isLoading,
}: {
  initialData?: Record<string, any>
  existingResumes: Record<string, any>[]
  existingCoverLetters: Record<string, any>[]
  onSubmit: (data: JobFormData) => void
  onCancel?: () => void
  isLoading?: boolean
}) {
  const [formData, setFormData] = useState({
    url: initialData?.job?.url || "",
    company: initialData?.job?.company || "",
    position: initialData?.job?.position || "",
    platform: initialData?.job?.platform || "",
    location: initialData?.job?.location || [],
    salary_min: initialData?.job?.salary_min || 0,
    salary_max: initialData?.job?.salary_max || 0,
    status: (initialData?.status as Status) || "PENDING",
    resume: initialData?.resume,
    coverLetter: initialData?.coverLetter
  })

  const [showOtherPlatform, setShowOtherPlatform] = useState(
    !JOB_BOARDS.includes(initialData?.job?.platform || "")
  )

  // Separate state for location input to allow typing commas and spaces
  const [locationInput, setLocationInput] = useState(
    initialData?.job?.location?.join(', ') || ""
  )

  const [resumeFile, setResumeFile] = useState<File | null>(null)
  const [resumeEntry, setResumeEntry] = useState<Record<string, any> | null>(
    initialData?.resume || initialData?.resume_name ? { name: initialData.resume_name, id: initialData.resume?.id } : null
  )
  const [coverLetterFile, setCoverLetterFile] = useState<File | null>(null)
  const [coverLetterEntry, setCoverLetterEntry] = useState<Record<string, any> | null>(
    initialData?.cover_letter || initialData?.cover_letter_name ? { name: initialData.cover_letter_name, id: initialData.cover_letter?.id } : null
  )

  const handleInputChange = (field: string, value: string | number | string[]) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const handleLocationChange = (value: string) => {
    // Update the input field immediately
    setLocationInput(value)
    // Split by comma and trim whitespace for the form data
    const locations = value.split(',').map(loc => loc.trim()).filter(loc => loc !== '')
    setFormData((prev) => ({ ...prev, location: locations }))
  }

  const handleResumeChange = (newResume: File | null, existingResume: Record<string, any> | null) => {
    if (newResume !== null) {
      setResumeFile(newResume)
      setResumeEntry(null)
    } else {
      setResumeFile(null)
      setResumeEntry(existingResume)
    }
  }

  const handleCoverLetterChange = (newCoverLetter: File | null, existingCoverLetter: Record<string, any> | null) => {
    if (newCoverLetter !== null) {
      setCoverLetterFile(newCoverLetter)
      setCoverLetterEntry(null)
    } else {
      setCoverLetterFile(null)
      setCoverLetterEntry(existingCoverLetter)
    }
  }

  const validateForm = (): string | null => {
    if (!formData.url.trim()) return "Job URL is required"
    if (!formData.company.trim()) return "Company name is required"
    if (!formData.position.trim()) return "Position is required"
    if (!formData.platform.trim()) return "Platform is required"
    if (formData.salary_min < 0) return "Minimum salary cannot be negative"
    if (formData.salary_max < 0) return "Maximum salary cannot be negative"
    if (formData.salary_min > formData.salary_max) return "Minimum salary cannot be greater than maximum salary"
    if (!resumeFile && !resumeEntry) return "Resume is required"
    return null
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    const validationError = validateForm()
    if (validationError) {
      // TODO: change this to show in MUI and not alert
      alert(validationError)
      return
    }

    const submitData: JobFormData = {
      job: {
        url: formData.url,
        company: formData.company,
        position: formData.position,
        platform: formData.platform,
        location: formData.location,
        salary_min: formData.salary_min,
        salary_max: formData.salary_max,
      },
      status: formData.status,
      resume: resumeEntry
        ? {
            id: resumeEntry.id,
            name: resumeEntry.name,
            url: resumeEntry.url,
            isExisting: true
          }
        : {
            name: resumeFile!.name,
            url: `uploads/resumes/${resumeFile!.name}`, // TODO: Actually upload file
            isExisting: false
          },
      coverLetter: coverLetterEntry
        ? {
            id: coverLetterEntry.id,
            name: coverLetterEntry.name,
            url: coverLetterEntry.url,
            isExisting: true
          }
        : coverLetterFile
        ? {
            name: coverLetterFile.name,
            url: `uploads/cover-letters/${coverLetterFile.name}`, // TODO: Actually upload file
            isExisting: false
          }
        : null,
    }

    onSubmit(submitData)
  }

  return (
    <form onSubmit={handleSubmit}>
      <TextField fullWidth required margin="normal"
        label="Job URL"
        value={formData.url}
        onChange={(e) => handleInputChange("url", e.target.value)}
      />

      <TextField fullWidth required margin="normal"
        label="Company"
        value={formData.company}
        onChange={(e) => handleInputChange("company", e.target.value)}
      />

      <TextField fullWidth required margin="normal"
        label="Position"
        value={formData.position}
        onChange={(e) => handleInputChange("position", e.target.value)}
      />

      <TextField fullWidth margin="normal"
        label="Location(s)"
        value={locationInput}
        onChange={(e) => handleLocationChange(e.target.value)}
        helperText="Enter comma separated values"
      />

      <Box sx={{ display: 'flex', gap: 2 }}>
        <TextField fullWidth margin="normal"
          label="Minimum Salary"
          type="number"
          value={formData.salary_min || ''}
          onChange={(e) => handleInputChange("salary_min", parseInt(e.target.value) || 0)}
          slotProps={{
            input: {
              startAdornment: <span style={{ marginRight: 4 }}>$</span>,
            }
          }}
        />
        <TextField fullWidth margin="normal"
          label="Maximum Salary"
          type="number"
          value={formData.salary_max || ''}
          onChange={(e) => handleInputChange("salary_max", parseInt(e.target.value) || 0)}
          slotProps={{
            input: {
              startAdornment: <span style={{ marginRight: 4 }}>$</span>,
            }
          }}
        />
      </Box>

      <FormControl fullWidth margin="normal" required>
        <InputLabel>Platform</InputLabel>
        <Select
          defaultValue=" "
          value={JOB_BOARDS.includes(formData.platform) ? formData.platform : "Other"}
          label="Platform"
          onChange={(e) => {
            const value = e.target.value
            if (value === "Other") {
              setShowOtherPlatform(true)
              handleInputChange("platform", "")
            } else {
              setShowOtherPlatform(false)
              handleInputChange("platform", value)
            }
          }}
        >
          <MenuItem value={""}>&nbsp;</MenuItem>
          <MenuItem value="Ashby">Ashby</MenuItem>
          <MenuItem value="Greenhouse">Greenhouse</MenuItem>
          <MenuItem value="Handshake">Handshake</MenuItem>
          <MenuItem value="Indeed">Indeed</MenuItem>
          <MenuItem value="Lever">Lever</MenuItem>
          <MenuItem value="LinkedIn">LinkedIn</MenuItem>
          <MenuItem value="Workday">Workday</MenuItem>
          <MenuItem value="Other">Other</MenuItem>
        </Select>
      </FormControl>

      {showOtherPlatform && (
        <TextField fullWidth required margin="normal"
          label="Specify Platform"
          value={formData.platform}
          onChange={(e) => handleInputChange("platform", e.target.value)}
          placeholder="Enter platform name"
        />
      )}

      <FormControl fullWidth margin="normal" required>
        <InputLabel>Status</InputLabel>
        <Select
          value={formData.status}
          label="Status"
          onChange={(e) =>
            handleInputChange("status", e.target.value as Status)
          }
        >
          <MenuItem value="PENDING">Pending (not applied yet)</MenuItem>
          <MenuItem value="APPLIED">Applied</MenuItem>
          <MenuItem value="INTERVIEW">Interview</MenuItem>
          <MenuItem value="OFFER">Offer</MenuItem>
          <MenuItem value="REJECTED">Rejected</MenuItem>
        </Select>
      </FormControl>

      {/* Resume */}
      <UploadOrSelectFile
        isResume={true}
        existingFiles={existingResumes}
        handleChange={handleResumeChange}
        defaultFile={formData.resume}
      />
      {/* Cover Letter */}
      <UploadOrSelectFile
        isResume={false}
        existingFiles={existingCoverLetters}
        handleChange={handleCoverLetterChange}
        defaultFile={formData.coverLetter}
      />

      <Box sx={{ display: 'flex', gap: 2, mt: 3 }}>
        {onCancel && (
          <Button onClick={onCancel} variant="outlined" fullWidth>
            Cancel
          </Button>
        )}
        <Button
          type="submit"
          variant="contained"
          fullWidth
          disabled={isLoading}
        >
          {isLoading ? <CircularProgress size={24} color="inherit" /> : "Save"}
        </Button>
      </Box>
    </form>
  )
}
