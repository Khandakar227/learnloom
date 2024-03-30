import { useRouter } from "next/router"
import { useEffect } from "react";

export default function EditCourse() {
  const router = useRouter();

  useEffect(() => {
    console.log(router.asPath)
  }, [])

  return (
    <div>EditCourse</div>
  )
}
