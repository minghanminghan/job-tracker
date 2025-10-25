import { Box, Link as MuiLink } from '@mui/material'
import Link from 'next/link'
import AddResume from "./AddResume"

export default function NavBar() {


    return (
        <Box sx={{
            display: 'flex',
            flexDirection: 'row',
            padding: 1,
            gap: 3
        }}
        >
            <MuiLink component={Link} href="/home" underline="hover">Home</MuiLink>
            <MuiLink component={Link} href="/table" underline="hover">Table</MuiLink>
            <MuiLink component={Link} href="/dashboard" underline="hover">Dashboard</MuiLink>
            <MuiLink component={Link} href="/time-series" underline="hover">Time Series</MuiLink>
            <MuiLink component={Link} href="/add" underline="hover">Add Job</MuiLink>
            <MuiLink component={Link} href="/documents" underline="hover">View Documents</MuiLink>
        </Box>
    )
}