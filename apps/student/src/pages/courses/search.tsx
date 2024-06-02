import CourseCard from "@/components/common/CourseCard";
import Navbar from "@/components/common/Navbar";
import Searchbar from "@/components/common/Searchbar";
import { CourseData } from "@repo/utils/types";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";

export default function Search() {
  const router = useRouter();
  const [courses, setCourses] = useState([] as CourseData[]);
  const {keyword} = router.query;

  useEffect(() => {
    if(!keyword) return;

    fetch(`/api/courses/search?keyword=${keyword}`)
        .then(res => res.json())
        .then(data => {
            setCourses(data.courses);
        })
        .catch(err => {
            toast.error(err.message);
            console.log(err)
        })
  }, [keyword])

  return (
    <div className="min-h-screen">
      <Navbar />
      <div className="py-6 px-4">
        <Searchbar/>
      </div>
      <div className="grid lg:grid-cols-4 md:grid-cols-3 py-6 px-4">
        <div></div>
        <div className="lg:col-span-3 md:col-span-2 flex gap-4">
            {
                courses.map((course, i) => <CourseCard course={course} key={"search-course" + i}/>)
            }
        </div>
    </div>
    </div>
  )
}
