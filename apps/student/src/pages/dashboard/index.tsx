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

    useEffect(() => {
        if (!user.isLoading && user.user) {
            fetch("/api/enroll")
                .then(res => res.json())
                .then(data => {
                    console.log(data)
                })
                .catch(err => console.log(err))
        }
    }, [user.user, user.isLoading]);
    
    if (user.isLoading) return <span className="loader" />

    return (
        <div>
            <Navbar />
            <div className="mx-auto max-w-7xl">
                <div className="neo-dark p-4 mt-6">
                    <h3 className="text-3xl font-semibold">Enrolled Course</h3>

                </div>
            </div>
        </div>
    )
}

