import { signIn } from "next-auth/react"
import { Button } from "@mui/material"

export default function Login() {
    return (
        <Button variant="outlined" onClick={() => signIn('google')}>Login</Button>
    )
}