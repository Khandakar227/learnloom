import Navbar from "@/components/common/Navbar"
import { Claims, getSession } from "@auth0/nextjs-auth0"
import { GetServerSideProps, GetServerSidePropsContext } from "next"
import { useRouter } from "next/router"
import { useEffect } from "react"

type Props = {
    user:Claims
}

function Dashboard({user}:Props) {
    const router = useRouter()

    useEffect(() => {
        if(!user) router.push("/")
        console.log(user)
    }, [user])

    return (
        <div>
            <Navbar/>
        </div>
    )
}

export default Dashboard

export const config = {
    runtime: 'nodejs', // or "edge"
}

export const getServerSideProps: GetServerSideProps =
    (async ({ req, res }: GetServerSidePropsContext) => {
        const session = await getSession(req, res);
        const user = session?.user || null;
        return { props: { user } };
    })