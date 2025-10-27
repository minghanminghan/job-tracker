"use client"

import { Box, Button, Popover, Typography } from "@mui/material"
import { deleteUser_Job } from "@/app/actions/user_JobActions"


export default function DeleteJobPopover({open, onClose, anchorEl, job}: {open: boolean, onClose: Function, anchorEl: HTMLElement, job: Record<string, any>}) {
    function onConfirm() {
        deleteUser_Job(job.user_id, job.job_id)
    }

    return (
        <Popover
            open={open}
            onClose={() => {onClose()}}
            anchorEl={anchorEl}
            anchorOrigin={{
                vertical: 'bottom',
                horizontal: 'left',
            }}
            transformOrigin={{
                vertical: 'top',
                horizontal: 'left',
            }}
        >
            <Box sx={{
                p: 2,
                maxWidth: 300
            }}>
                <Typography>Confirm Delete?</Typography>
                <Button variant='contained' onClick={() => onConfirm()}>Confirm</Button>
                <Button variant='outlined' onClick={() => onClose()}>Cancel</Button>
            </Box>
        </Popover>
    )
}