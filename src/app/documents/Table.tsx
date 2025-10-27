"use client"

import {
  Select,
  MenuItem,
  Button,
  Box,
  Typography,
  Link,
  IconButton
} from '@mui/material'
import { DataGrid, GridColDef, GridEventListener } from '@mui/x-data-grid'
import DownloadIcon from '@mui/icons-material/Download'
import { TableLabel } from '@/types/TableLabel'


// Helper function to get nested property value using dot notation
// e.g. getNestedValue({a: {b: 2}}, "a.b") returns 2
function getNestedValue(obj: any, path: string): any {
    return path.split('.').reduce((current, key) => current?.[key], obj)
}


export default function Table({title, labels, data}: { title: string, labels: TableLabel[], data: Record<any, any>[] }) {
    const columns: GridColDef[] = labels.map(label => ({
        field: label.raw_name,
        headerName: label.display_name,
        flex: 1,
        minWidth: 150,
        valueGetter: (value, row) => getNestedValue(row, label.raw_name),
        renderCell: (params) => {
            const value = params.value
            switch (label.renderType) {
                case 'link':
                    return (<Link href={value}>{value}</Link>)
                default:
                    return value ? String(value) : ''
            }
        },
    }))


    return (
        <Box padding={5} sx={{ display: 'flex', flexDirection: 'column' }}>
            <Typography fontWeight='bold'>{title}</Typography>
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
                    },
                    '& .MuiDataGrid-row': {
                        cursor: 'pointer',
                    },
                }}
            />
        </Box>
    )
}