"use client"

import {
  Select,
  MenuItem,
  Button,
} from '@mui/material'
import { DataGrid, GridColDef } from '@mui/x-data-grid'
import DownloadIcon from '@mui/icons-material/Download'


export type Label = {
    display_name: string    // display name
    raw_name: string        // value for fetching
    static: boolean         // is this field editable
    values?: string[]       // exists only if static is false
}


// Helper function to get nested property value using dot notation
// e.g. getNestedValue({a: {b: 2}}, "a.b") returns 2
function getNestedValue(obj: any, path: string): any {
    return path.split('.').reduce((current, key) => current?.[key], obj)
}


function exportToCSV(labels: Label[], data: any[], filename: string = 'export.csv') {
  // Create CSV header from labels
  const headers = labels.map(label => label.display_name).join(',')
  
  // Create CSV rows
  const rows = data.map(row => {
    return labels.map(label => {
      const value = getNestedValue(row, label.raw_name)
      // Escape commas and quotes in values
      const escapedValue = String(value || '')
        .replace(/"/g, '""')
        .replace(/,/g, ' ')
      return `"${escapedValue}"`
    }).join(',')
  })
  
  // Combine header and rows
  const csv = [headers, ...rows].join('\n')
  
  // Create download link
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' })
  const link = document.createElement('a')
  const url = URL.createObjectURL(blob)
  link.setAttribute('href', url)
  link.setAttribute('download', filename)
  link.style.visibility = 'hidden'
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
}


export default function Table({labels, initialData, onChange}: { labels: Label[], initialData: Record<any, any>[], onChange: Function }) {
    function handleChange(job_id: string, new_status: string) {
        onChange(job_id, new_status)
    }

    // Convert labels to DataGrid columns
    const columns: GridColDef[] = labels.map(label => ({
        field: label.raw_name,
        headerName: label.display_name,
        flex: 1,
        minWidth: 150,
        // Handle nested values (e.g., "job.company")
        valueGetter: (value, row) => getNestedValue(row, label.raw_name),
        // Custom cell renderer
        renderCell: (params) => {
            const value = params.value

            // Editable field with Select dropdown
            if (!label.static && label.values) {
                return (
                    <Select
                        value={value || ''}
                        onChange={(e) => handleChange(params.row.id, e.target.value)}
                        size="small"
                        autoWidth
                        sx={{ minWidth: 120 }}
                    >
                        {label.values.map((v) => (
                            <MenuItem key={v} value={v}>{v}</MenuItem>
                        ))}
                    </Select>
                )
            }

            // Static field - plain text
            return value ? String(value) : ''
        },
    }))

    return (
        <div style={{ display: 'flex', flexDirection: 'column' }}>
            <Button
                variant="outlined"
                startIcon={<DownloadIcon />}
                onClick={() => exportToCSV(labels, initialData, 'job-applications.csv')}
                sx={{ alignSelf: 'flex-end', mb: 2 }}
            >
                Export to CSV
            </Button>
            <DataGrid
                rows={initialData}
                columns={columns}
                getRowId={(row) => row.id}
                pageSizeOptions={[10, 25, 50, 100]}
                initialState={{
                    pagination: { paginationModel: { pageSize: 25 } },
                }}
                disableRowSelectionOnClick
                getRowHeight={() => 'auto'}
                sx={{
                    '& .MuiDataGrid-cell': {
                        display: 'flex',
                        alignItems: 'center',
                        whiteSpace: 'normal',
                        wordWrap: 'break-word',
                        lineHeight: '1.5',
                        py: 1,
                    }
                }}
            />
        </div>
    )
}