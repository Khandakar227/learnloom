import Image from "next/image"
import Link from "next/link"

function HomePage() {
  return (
    <div className="mx-auto max-w-7xl px-4 pt-24 pb-4">
      <Image src="images/homepage-1.svg" width={600} height={250} className="mx-auto" alt="Illustration" />
      <h1 className="text-4xl font-bold text-center mt-8 mx-auto max-w-2xl">Join the World of In-Demand Skills With Ease.</h1>
      <div className="mx-auto text-center pt-12 text-lg">
       <Link className="mx-auto text-center px-5 py-2 rounded shadow bg-green-600" href={"/api/auth/login"}> Join Us Now </Link>
      </div>
    </div>
  )
}

export default HomePage