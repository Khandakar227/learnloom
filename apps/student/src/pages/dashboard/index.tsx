import CourseCard from "@/components/enrolled/CourseCard";
import Navbar from "@/components/common/Navbar";
import { useUser } from "@auth0/nextjs-auth0/client"
import { CourseData } from "@repo/utils/types";
import { useRouter } from "next/router"
import { useEffect, useState } from "react"
import { toast } from "react-toastify";

interface EnrolledCourseProps extends CourseData {
    paymentStatus: string;
}

export default function Dashboard() {
    const router = useRouter();
    const user = useUser();
    const [enrolledCourses, setEnrolledCourses] = useState([] as EnrolledCourseProps[]);

    useEffect(() => {
        if (!user.isLoading && !user.user) router.push("/")
        console.log(user)
    }, [user.user, user.isLoading])

    useEffect(() => {
        if (!user.isLoading && user.user) {
            fetch("/api/enroll")
                .then(res => res.json())
                .then(data => {
                    console.log(data);
                    if(data.error) toast.error(data.message);
                    else setEnrolledCourses(data.courses);
                })
                .catch(err => console.log(err))
        }
    }, [user.user, user.isLoading]);
    
    if (user.isLoading) return <span className="loader" />

    return (
        <div className="min-h-screen">
            <Navbar />
            <div className="mx-auto max-w-7xl">
                <div className="neo-dark p-4 mt-6">
                    <h3 className="text-3xl font-semibold">Enrolled Course</h3>
                    <div className="py-6">
                        {
                            enrolledCourses.map((course, i) => (
                                <CourseCard paymentStatus={course.paymentStatus} course={course} key={"enrolled course" + i} />
                            ))
                        }
                    </div>
                </div>
            </div>
        </div>
    )
}

