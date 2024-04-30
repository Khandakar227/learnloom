import { CourseData } from "@repo/utils/types"
import CourseCard from "../courses/CourseCard";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { formatDateTime } from "@repo/utils/client";
import Link from "next/link";


function Courses() {
    const [courses, setCourses] = useState([] as CourseData[])
    const [loading, setLoading] = useState(false);
    useEffect(() => {
        setLoading(true);
        fetch(`/api/course`)
        .then(res => res.json())
        .then(data => {
            if(data.error) {
                toast.error("Error occured: " + data.message);
                setLoading(false);
             }
            console.log(data.courses)
            setCourses(data.courses)
            setLoading(false);
        })
        .catch(err => {
            console.log(err);
            setLoading(false);
        })
      }, []);

  return (
    <div className="p-4 shadow-sm rounded-md py-6 mt-8 block">
        <h3 className="text-3xl py-6"> Courses </h3>
        {
            ! courses.length && (<p className="py-12 opacity-50"> No courses has been added </p>)
        }
        {
            courses.map(course =>
            <Link href={`/courses/${course.id}/`} key={course.id} className="neo-semi-dark p-4">
                <h3 className="text-xl md:text-2xl font-semibold">{course.name}</h3>
                <p className="text-xs py-2 text-end opacity-50">{formatDateTime(course.createdAt)}</p>
                <p><span className="px-2 py-1 rounded-md text-xs bg-green-800 my-2">{course.category}</span></p>
                <p className={`text-sm py-2 flex justify-between items-center`}>
                    <span className={`${course.isPublished ? "text-green-400" : "text-red-400"}`}>{course.isPublished ? "Published" : "Not Published"}</span>
                    <span>{course.price ? course.price + " BDT" : "Free"}</span>
                </p>
            </Link>
            )
        }
    </div>
  )
}

export default Courses