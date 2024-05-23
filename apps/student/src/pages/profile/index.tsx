import Navbar from "@/components/common/Navbar"
import DisplayPhoto from "@/components/profile/DisplayPhoto"
import { Claims, getSession } from "@auth0/nextjs-auth0"
import { queries } from "@repo/utils"
import { formatDateTime } from '@repo/utils/client'
import { GetServerSideProps, GetServerSidePropsContext } from "next"
import { useRouter } from "next/router"
import { ChangeEvent, useEffect, useState } from "react"

type Props = {
    user: Claims;
    userData: queries.Student;
}

function Dashboard({user, userData}:Props) {
    const router = useRouter()
    const [userState, setUserState] = useState<queries.Student>(userData);

    console.log(user, userData)

    function onChange(e:ChangeEvent) {
        console.log((e.target as HTMLInputElement).value);
    }
    return (
        <div>
            <Navbar/>

            <div className="my-6 p-4 neo-dark mx-auto max-w-7xl">
                <h1 className="text-3xl font-semibold">Profile</h1>
                <div className="py-4">
                    <DisplayPhoto displayPhoto={userState?.photoUrl ? userState.photoUrl : user.picture} name={userData.name} />
                    <label htmlFor="name" className="text-xs pt-1">Name</label>
                    <input onChange={onChange} type="text" name="name" id="name" value={userState.name} className="p-1 rounded-md border bg-transparent w-full"/>
                    <label htmlFor="email" className="text-xs pt-1">Email</label>
                    <input disabled={true} type="email" name="email" id="email" defaultValue={userState.email} className="p-1 rounded-md border bg-transparent w-full"/>
                    <p className="pt-6 text-sm"><span>Created At:</span> {formatDateTime(userState.createdAt)}</p>

                    <div className="pt-12 text-end">
                        <button className="px-4 py-2 bg-green-500">Save</button>
                    </div>
                </div>
            </div>
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
        if (!user) {
            return {
                redirect: { destination: '/api/auth/login', permanent: false }
            };
        }
        const useData = await queries.getStudent(user.email);
        return { props: { user, userData: JSON.parse(JSON.stringify(useData)) } };
    })