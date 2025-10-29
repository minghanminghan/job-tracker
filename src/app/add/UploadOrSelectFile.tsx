"use client"

import { Box, Button, FormControlLabel, MenuItem, Radio, RadioGroup, Select, SelectChangeEvent, Typography } from "@mui/material"
import { useState } from "react"

export default function UploadOrSelectFile({
  isResume,
  existingFiles,
  handleChange,
  defaultFile,
}: {
  isResume: boolean
  existingFiles: Record<string, any>[]
  handleChange: (file: File | null, existing: Record<string, any> | null) => void
  defaultFile?: Record<string, any>
}) {
  const [isUpload, setIsUpload] = useState(existingFiles.length === 0)
  const [selectedId, setSelectedId] = useState<string>(defaultFile?.id || "")
  const [uploadedFile, setUploadedFile] = useState<File | null>(null)

  const label = isResume ? "Resume" : "Cover Letter"

  function handleSelect(e: SelectChangeEvent) {
    const id = e.target.value
    setSelectedId(id)
    const file = existingFiles.find(f => f.id === id)
    handleChange(null, file || null)
  }

  function handleUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0] || null
    setUploadedFile(file)
    handleChange(file, null)
  }

  // Derive selected name from ID or uploaded file
  const selectedName = isUpload
    ? uploadedFile?.name
    : existingFiles.find(f => f.id === selectedId)?.name

  return(
    <Box sx={{ mt: 2, mb: 2 }}>
      <Typography>{label}</Typography>
      {existingFiles.length > 0 && (
        <RadioGroup row value={isUpload ? "upload" : "select"}>
          <FormControlLabel
            value="select"
            label="Select Existing"
            onChange={() => setIsUpload(false)}
            control={<Radio/>}
          />
          <FormControlLabel
            value="upload"
            label="Upload New"
            onChange={() => setIsUpload(true)}
            control={<Radio/>}
          />
        </RadioGroup>
      )}
      {isUpload ? (
        <Button variant="outlined" component="label" fullWidth>
          Upload {label}
          <input
            type="file"
            hidden
            accept=".pdf"
            onChange={handleUpload}
          />
        </Button>
      ) : (
        <Select onChange={handleSelect} value={selectedId} fullWidth defaultValue={defaultFile?.id || ""}>
          <MenuItem  value="">&nbsp;</MenuItem>
          {existingFiles.map((v) =>
            <MenuItem
              key={v.id}
              value={v.id}
            >
              {v.name}
            </MenuItem>
          )}
        </Select>
      )}
      {selectedName && (
        <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
          Selected: {selectedName}
        </Typography>
      )}
    </Box>
  )
}