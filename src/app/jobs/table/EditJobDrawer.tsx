"use client"

import { Box, Drawer } from "@mui/material"



export default function EditJobDrawer({open, onClose, row}: {open: boolean, onClose: Function, row: Record<string, any> | null}) {
    // need date picker, ...

    return (
        <Drawer open={open} onClose={() => onClose()}>
            <Box sx={{
                maxWidth: 600,
                mx: "auto",
                p: 1,
            }}>
            </Box>
        </Drawer>
    )
}