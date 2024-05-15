import { CourseData } from "@repo/utils/types";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import CourseCard from "../common/CourseCard";

export default function Courses() {
  const [courses, setCourses] = useState([] as CourseData[])
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true);
    fetch('/api/courses')
      .then(res => res.json())
      .then(data => {
        if (data.error) {
          toast.error("Error occured: " + data.message);
        }
        console.log(data.courses)
        setCourses(data.courses)
        setLoading(false)
      })
      .catch(err => {
        console.log(err)
        setLoading(false)
      })
  }, [])
  return (
    <div className="py-16">
      <h2 className="text-center py-4 text-3xl font-semibold">Browse our popular courses</h2>
      <p className="text-center text-gray-300 max-w-2xl mx-auto">Join thousands of learners for a brighter future. Start browsing now and explore a world of knowledge and growth.</p>
      <div className="py-8 px-4 flex flex-wrap justify-center items-stretch gap-6">
        {
          courses.map(course =>
            <CourseCard key={course.id} course={course} />
          )
        }
      </div>
    </div>
  )
}
