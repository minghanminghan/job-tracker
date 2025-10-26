"use client"

import {
  Select,
  MenuItem,
  Button,
  Box,
  Typography,
  Link
} from '@mui/material'
import { DataGrid, GridColDef } from '@mui/x-data-grid'
import DownloadIcon from '@mui/icons-material/Download'
import { TableLabel } from '@/types/TableLabel'


// Helper function to get nested property value using dot notation
// e.g. getNestedValue({a: {b: 2}}, "a.b") returns 2
function getNestedValue(obj: any, path: string): any {
    return path.split('.').reduce((current, key) => current?.[key], obj)
}


function exportToCSV(labels: TableLabel[], data: any[], filename: string = 'export.csv') {
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


export default function Table({title, labels, data, onChange}: { title: string, labels: TableLabel[], data: Record<any, any>[], onChange?: Function }) {
    function handleChange(job_id: string, new_status: string) {
        onChange!(job_id, new_status)
    }

    // Convert labels to DataGrid columns
    const columns: GridColDef[] = labels.map(label => ({
        field: label.raw_name,
        headerName: label.display_name,
        flex: 1,
        minWidth: 150,
        valueGetter: (value, row) => getNestedValue(row, label.raw_name),
        renderCell: (params) => {
            const value = params.value
            switch (label.renderType) {
                case 'select':
                    return (<Select
                        value={value}
                        onChange={(e) => handleChange(params.row.id, e.target.value)}
                        size="small"
                        autoWidth
                        sx={{ minWidth: 120 }}
                    >
                        {label.values?.map((v) => (
                            <MenuItem key={v} value={v}>{v}</MenuItem>
                        ))}
                    </Select>)
                case 'link':
                    return (<Link href={value}>{value}</Link>)
                default:
                    return value ? String(value) : ''
            }
        },
    }))

    return (
        <Box padding={5} sx={{ display: 'flex', flexDirection: 'column' }}>
            <Box
                width='100%'
                alignItems='center'
                justifyContent='space-between'
                sx={{ display: 'flex', flexDirection: 'row' }}
            >
                <Typography fontWeight='bold'>{title}</Typography>
                <Button
                    variant="outlined"
                    startIcon={<DownloadIcon />}
                    onClick={() => exportToCSV(labels, data, 'job-applications.csv')}
                    sx={{ alignSelf: 'flex-end', mb: 2 }}
                >
                    Export to CSV
                </Button>
            </Box>
            <DataGrid
                rows={data}
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
        </Box>
    )
}