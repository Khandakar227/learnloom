import { useUser } from "@auth0/nextjs-auth0/client";
import Image from "next/image"
import Link from "next/link";
import { useState } from "react"

function AvatarButton() {
  const [show, setShow] = useState(false);
  const user = useUser();

  const toggle = () => {
    setShow(!show);
  }
  
  return (
    <div className="relative">
        <button onClick={toggle} className="bg-green-400 shadow rounded-full border-green-950 border">
            <Image className="rounded-full shadow" src={user.user?.picture || `https://api.dicebear.com/7.x/initials/svg?seed=${user.user?.name}`} alt="" width={40} height={40} />
        </button>
        <div className={`${ show ? "z-20" : "scale-y-0"} origin-top transition-all p-4 rounded-lg shadow min-w-40 absolute top-full right-0 bg-zinc-950`}>
            <Link href={"/"} className="block w-full p-2 transition-all hover:text-black hover:bg-green-400">Dashboard</Link>
            <Link href={"/profile"} className="block w-full p-2 transition-all hover:text-black hover:bg-green-400">Profile</Link>
            <Link href={"/courses"} className="block w-full p-2 transition-all hover:text-black hover:bg-green-400">Courses</Link>
            <Link href={"/api/auth/logout"} className="block w-full p-2 transition-all hover:text-black hover:bg-green-400">Log out</Link>
        </div>
    </div>
  )
}

export default AvatarButton