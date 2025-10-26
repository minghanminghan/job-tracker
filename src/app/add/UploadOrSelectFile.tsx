"use client"

import { Box, Button, FormControlLabel, MenuItem, Radio, RadioGroup, Select, SelectChangeEvent, Typography } from "@mui/material"
import { useState } from "react"

export default function UploadOrSelectFile({isResume, existingFiles, handleChange}: {isResume: boolean, existingFiles: Record<string, any>[], handleChange: Function}) {
    const [isUpload, setIsUpload] = useState(existingFiles.length === 0)
    const [fileName, setFileName] = useState<string| null>(null)

    function handleSelect(e: SelectChangeEvent) {
        const id = e.target.value
        const file = existingFiles.find(f => f.id === id)
        setFileName(file?.name)
        handleChange(null, file)
    }

    function handleUpload(e: React.ChangeEvent<HTMLInputElement>) {
        const file = e.target.files?.[0]
        if (file) setFileName(file.name)
        handleChange(file, null)
    }

    return(
        <Box sx={{ mt: 2, mb: 2 }}>
            <Typography>{isResume ? "Resume" : "Cover Letter"}</Typography>
            {existingFiles.length > 0 &&
            <RadioGroup row defaultValue="Select Existing">
              <FormControlLabel
                value="Select Existing"
                label="Select Existing"
                onChange={() => setIsUpload(false)}
                control={<Radio/>}
              />
              <FormControlLabel
                value="Upload New"
                label="Upload New"
                onChange={() => setIsUpload(true)}
                control={<Radio/>}
              />
            </RadioGroup>}
            {isUpload ?
              <Button variant="outlined" component="label" fullWidth>
                Upload Resume
                <input
                  type="file"
                  hidden
                  accept=".pdf"
                  onChange={(e) => handleUpload(e)}
                />
              </Button>
            :
              <Select onChange={handleSelect} defaultValue={"None"}>
                <MenuItem key="None" value="None">None</MenuItem>
                {existingFiles.map((v) => 
                    <MenuItem
                        key={v.id}
                        value={v.id}
                    >
                        {v.name}
                    </MenuItem>
                )}
              </Select>
            }
            {fileName && (
              <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                Selected: {fileName ?? ''}
              </Typography>
            )}
          </Box>
    )
}