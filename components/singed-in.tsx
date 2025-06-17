"use client"

import { useUser } from "@clerk/nextjs"
import { useEffect } from "react"
import { toast } from "sonner"

export default function UserSingedIn() {
    const { isSignedIn, user } = useUser()

    useEffect(() => {
        if (isSignedIn) {
            toast.success(`Welcome, ${user.firstName || "user"}!`)
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isSignedIn])

    return null
}