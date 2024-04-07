import Navbar from "@/components/common/Navbar";
import { getSession } from "@auth0/nextjs-auth0";
import { queries } from "@repo/utils";
import { CourseData } from "@repo/utils/types";
import { GetServerSidePropsContext } from "next";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import CourseCard from '@/components/courses/CourseCard'

export default function Courses() {
    const [courses, setCourses] = useState([] as CourseData[]);

    useEffect(() => {
        fetch('/api/course')
        .then(res => res.json())
        .then(data => {
            if(data.error) {
                toast.error("Error occured: " + data.message);
            }
            console.log(data.courses)
            setCourses(data.courses)
        })
    }, [])
  return (
    <>
        <Navbar/>
        <div className="px-4 py-12 max-w-7xl mx-auto">
            <h3 className="text-3xl font-semibold text-center">Courses</h3>
            <div className="py-8">
                {
                    courses.map(course => <CourseCard key={course.name} course={course} />)
                }
            </div>
        </div>
    </>
  )
}


export async function getServerSideProps(context:GetServerSidePropsContext) {
    const user = await getSession(context.req, context.res);
    if(!user)
    return {
      redirect: {
        permanent: false,
        destination: "/"
      }
    }
    const userData = await queries.getInstructor(user.user.email)
    console.log(userData)
    return { props: {} }
}