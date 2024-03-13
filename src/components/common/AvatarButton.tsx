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
        <button onClick={toggle} className="bg-purple-400 shadow rounded-full border-purple-950 border">
            <Image className="rounded-full shadow" src={user.user?.picture || `https://api.dicebear.com/7.x/initials/svg?seed=${user.user?.name}`} alt="" width={40} height={40} />
        </button>
        <div className={`${ show ? "" : "scale-y-0"} origin-top transition-all p-4 rounded-lg shadow min-w-40 absolute top-full right-0 bg-zinc-950`}>
            <Link href={"/profile"} className="block w-full p-2 transition-all hover:text-black hover:bg-purple-400">Profile</Link>
            <Link href={"/dashboard"} className="block w-full p-2 transition-all hover:text-black hover:bg-purple-400">Dashboard</Link>
            <Link href={"/api/auth/logout"} className="block w-full p-2 transition-all hover:text-black hover:bg-purple-400">Log out</Link>
        </div>
    </div>
  )
}

export default AvatarButton