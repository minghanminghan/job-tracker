"use client"

import {
  Select,
  MenuItem,
  Button,
  Box,
  Typography,
  Link,
  IconButton,
  Drawer
} from '@mui/material'
import { DataGrid, GridColDef } from '@mui/x-data-grid'
import { TableLabel } from '@/types/TableLabel'
import DownloadIcon from '@mui/icons-material/Download'
import EditIcon from '@mui/icons-material/Edit'
import DeleteIcon from '@mui/icons-material/Delete'
import { useState } from 'react'
import EditJobDrawer from './EditJobDrawer'
import DeleteJobPopover from './DeleteJobPopover'


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


export default function Table({title, labels, data, onStatusChange}: { title: string, labels: TableLabel[], data: Record<any, any>[], onStatusChange: Function }) {
    const [showDeleteModal, setShowDeleteModal] = useState(false)
    const [showEditDrawer, setShowEditDrawer] = useState(false)
    const [currentRow, setCurrentRow] = useState<Record<string, any> | null>(null)
    const [deleteAnchor, setDeleteAnchor] = useState<any|null>(null)

    function handleChange(row: any, new_status: string) {
        onStatusChange(row.user_id, row.job_id, new_status)
    }

    function toggleRowEdit(row?: Record<string, any>) {
        if (row) {
            console.log('true')
            setCurrentRow(row)
            setShowEditDrawer(true)
        } else {
            console.log('false')
            setCurrentRow(null)
            setShowEditDrawer(false)
        }
    }

    function toggleRowDelete(e?: React.MouseEvent<HTMLElement>, row?: Record<string, any>) {
        e?.stopPropagation()
        if (e && row) {
            setDeleteAnchor(e.currentTarget)
            setCurrentRow(row)
            setShowDeleteModal(true)
        } else {
            setCurrentRow(null)
            setShowDeleteModal(false)
        }
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
                        onChange={(e) => handleChange(params.row, e.target.value)}
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
                columns={[
                    {
                        field: 'actions',
                        headerName: 'Actions',
                        width: 100,
                        sortable: false,
                        renderCell: (params) => (
                            <Box>
                            <IconButton onClick={(e) => {
                                e.stopPropagation() // Prevent row click
                                toggleRowEdit(params.row)
                            }}>
                                <EditIcon />
                            </IconButton>
                            <IconButton onClick={(e) => {
                                e.stopPropagation()
                                toggleRowDelete(e, params.row)
                            }}>
                                <DeleteIcon />
                            </IconButton>
                            </Box>
                        )
                    },
                    ...columns
                ]}
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
                    },
                    '& .MuiDataGrid-row': {
                        cursor: 'pointer',
                    },
                }}
            />
            <EditJobDrawer row={currentRow} open={showEditDrawer} onClose={() => toggleRowEdit()} />
            <DeleteJobPopover open={showDeleteModal} anchorEl={deleteAnchor} job={currentRow!} onClose={() => toggleRowDelete()} />
        </Box>
    )
}