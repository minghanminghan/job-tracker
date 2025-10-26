"use client"

import { Box, Link as MuiLink, Menu, MenuItem } from '@mui/material'
import Link from 'next/link'
import { useState } from 'react'
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown'

export default function NavBar() {
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null)
    const [closeTimeout, setCloseTimeout] = useState<NodeJS.Timeout | null>(null)

    const handleMouseEnter = (event: React.MouseEvent<HTMLElement>) => {
        if (closeTimeout) {
            clearTimeout(closeTimeout)
            setCloseTimeout(null)
        }
        setAnchorEl(event.currentTarget)
    }

    const handleMouseLeave = () => {
        const timeout = setTimeout(() => {
            setAnchorEl(null)
        }, 150)
        setCloseTimeout(timeout)
    }

    const handleMenuEnter = () => {
        if (closeTimeout) {
            clearTimeout(closeTimeout)
            setCloseTimeout(null)
        }
    }

    const handleClose = () => {
        setAnchorEl(null)
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

            <Box
                sx={{ position: 'relative' }}
                onMouseLeave={handleMouseLeave}
            >
                <Box
                    onMouseEnter={handleMouseEnter}
                    sx={{
                        display: 'inline-flex',
                        alignItems: 'center',
                    }}
                >
                    <MuiLink
                        component={Link}
                        href="/job"
                        underline="hover"
                        sx={{ display: 'flex', alignItems: 'center' }}
                    >
                        Jobs
                        <ArrowDropDownIcon sx={{ fontSize: 20 }} />
                    </MuiLink>
                </Box>

                <Menu
                    anchorEl={anchorEl}
                    open={Boolean(anchorEl)}
                    onClose={handleMouseLeave}
                    anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
                    transformOrigin={{ vertical: 'top', horizontal: 'left' }}
                    slotProps={{
                        paper: {
                            onMouseEnter: handleMenuEnter,
                            onMouseLeave: handleMouseLeave,
                            sx: { mt: 0.5 }
                        }
                    }}
                    disableRestoreFocus
                >
                    <MenuItem component={Link} href="/jobs/table">
                        Table
                    </MenuItem>
                    <MenuItem component={Link} href="/jobs/dashboard">
                        Dashboard
                    </MenuItem>
                    <MenuItem component={Link} href="/jobs/time-series">
                        Time Series
                    </MenuItem>
                </Menu>
            </Box>

            <MuiLink component={Link} href="/add" underline="hover">Add Job</MuiLink>
            <MuiLink component={Link} href="/documents" underline="hover">Documents</MuiLink>
        </Box>
    )
}