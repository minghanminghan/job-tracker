"use client"

import { Box, Link as MuiLink, Menu, MenuItem } from '@mui/material'
import Link from 'next/link'
import { useState, useRef } from 'react'
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown'

export default function NavBar() {
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null)
    const closeTimeoutRef = useRef<NodeJS.Timeout | null>(null)

    const clearCloseTimeout = () => {
        if (closeTimeoutRef.current) {
            clearTimeout(closeTimeoutRef.current)
            closeTimeoutRef.current = null
        }
    }

    const handleMouseEnter = (event: React.MouseEvent<HTMLElement>) => {
        clearCloseTimeout()
        setAnchorEl(event.currentTarget)
    }

    const handleMouseLeave = () => {
        clearCloseTimeout()
        closeTimeoutRef.current = setTimeout(() => {
            setAnchorEl(null)
        }, 200)
    }

    return (
        <Box sx={{
            display: 'flex',
            flexDirection: 'row',
            padding: 1,
            gap: 3
        }}
        >
            <MuiLink component={Link} href="/home" underline="hover">Home</MuiLink>
            <MuiLink component={Link} href="/add" underline="hover">Add Job</MuiLink>
            <Box
                onMouseEnter={handleMouseEnter}
                onMouseLeave={handleMouseLeave}
                sx={{ position: 'relative', display: 'inline-block' }}
            >
                <Box sx={{
                    display: 'inline-flex',
                    alignItems: 'center',
                }}>
                    <MuiLink
                        component={Link}
                        href="/job"
                        underline="hover"
                        sx={{ display: 'flex', alignItems: 'center' }}
                    >
                        View Jobs
                        <ArrowDropDownIcon sx={{ fontSize: 20 }} />
                    </MuiLink>
                </Box>
                <Menu
                    anchorEl={anchorEl}
                    open={Boolean(anchorEl)}
                    onClose={() => setAnchorEl(null)}
                    onClick={() => setAnchorEl(null)}
                    anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
                    transformOrigin={{ vertical: 'top', horizontal: 'left' }}
                    disablePortal
                    disableAutoFocus
                    disableRestoreFocus
                >
                    <MenuItem component={Link} href="/jobs/table">
                        Table
                    </MenuItem>
                    <MenuItem component={Link} href="/jobs/dashboard">
                        Dashboard
                    </MenuItem>
                </Menu>
            </Box>
            <MuiLink component={Link} href="/documents" underline="hover">View Documents</MuiLink>
        </Box>
    )
}