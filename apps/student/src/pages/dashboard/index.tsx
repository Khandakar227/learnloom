import Navbar from "@/components/common/Navbar";
import { useUser } from "@auth0/nextjs-auth0/client"
import { useRouter } from "next/router"
import { useEffect } from "react"

export default function Dashboard() {
    const router = useRouter();
    const user = useUser();

    useEffect(() => {
        if (!user.isLoading && !user.user) router.push("/")
        console.log(user)
    }, [user.user, user.isLoading])

    if (user.isLoading) return <span className="loader" />

    return (
        <div>
            <Navbar />
        </div>
    )
}
