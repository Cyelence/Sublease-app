import { useRouter } from "next/router"
import { useEffect } from "react"
import { useMeQuery } from "../generated/graphql"

// hook for making sure the user is logged in
export const useIsAuth = () => {
    const [{ data, fetching }] = useMeQuery()
    const router = useRouter()
    useEffect(() => {
        if (!fetching && !data?.me) {
            // telling the login page where to go after the user has logged in
            router.replace("/login?next=" + router.pathname)
        }
    }, [fetching, data, router])
}