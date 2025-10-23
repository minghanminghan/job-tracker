"use client"

import { 
  Table as MUI_Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableRow, 
  Select, 
  MenuItem,
  Paper,
  TableContainer 
} from '@mui/material'
import { useState } from 'react'

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


export default function Table({labels, initialData, onChange}: { labels: Label[], initialData: Record<any, any>[], onChange: Function }) {
    // const [data, setData] = useState(initialData)
    function handleChange(job_id: string, new_status: string) {
        onChange(job_id, new_status)
    }

    return (
        <TableContainer component={Paper}>
        <MUI_Table>
            <TableHead>
            <TableRow>
                {labels.map((label) => (
                    <TableCell sx={{ fontWeight: 'bold' }} key={label.raw_name}>{label.display_name}</TableCell>
                ))}
            </TableRow>
            </TableHead>
            <TableBody>
                {initialData.map((row, index) => (
                    <TableRow key={index}>
                        {labels.map((label) => {
                            const value = getNestedValue(row, label.raw_name)
                            if (!label.static) return (
                                <TableCell key={label.raw_name}>
                                    <Select
                                        autoWidth
                                        value={value}
                                        onChange={(e) => {handleChange(row.id, e.target.value)}}
                                    >
                                        {label.values!.map((v) => <MenuItem value={v}>{v}</MenuItem>)}
                                    </Select>
                                </TableCell>
                            )
                            return (
                                <TableCell key={label.raw_name}>
                                    {value ? String(value) : ''}
                                </TableCell>
                            )
                        })}
                    </TableRow>
                ))}
            </TableBody>
        </MUI_Table>
        </TableContainer>
    )
}