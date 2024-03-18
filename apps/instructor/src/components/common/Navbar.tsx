import { useUser } from "@auth0/nextjs-auth0/client";
import Image from "next/image";
import Link from "next/link";
import AvatarButton from "./AvatarButton";


export default function Navbar() {
  const { user, error, isLoading } = useUser();

  return (
    <div className="bg-stone-700 shadow">
      <div className="px-4 py-2 flex justify-between items-center max-w-7xl mx-auto">
          <Link href={"/"} className="flex gap-1 items-center justify-center">
              <Image src={"/images/logo-icon.jpg"} width={50} height={50} alt="LearnLoom Logo" className="rounded" />
              <div className="leading-none grid justify-center items-center font-cinzel font-bold text-2xl">
                <span>Learn</span>
                <span>Loom</span>
              </div>
          </Link>
          {
            isLoading ? <span className="loader w-6" />
            :
            !user ?
            <a className="block px-4 py-2 rounded-md bg-cyan-950 shadow-sm" href="/api/auth/login">Login</a>
            :
            <AvatarButton />
          }
      </div>
    </div>
  )
}
