import { useUser } from "@auth0/nextjs-auth0/client";
import Image from "next/image";
import Link from "next/link";

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
            isLoading ? <span className="loader" />
            :
            !user ?
            <a className="block px-4 py-2 rounded-md bg-purple-950 shadow-sm" href="/api/auth/login">Login</a>
            :
            <a className="bg-purple-400 shadow rounded-full h-10 w-10 border-purple-950 border" href="/api/auth/me"></a>
          }
      </div>
    </div>
  )
}
