import { CourseData } from "@repo/utils/types";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import CourseCard from "../common/CourseCard";

type CourseCategoryProps = {
  categories: {
    id: string,
    name: string
  }[]
}

export default function Courses() {
  const [courses, setCourses] = useState([] as CourseData[])
  const [categories, setCategories] = useState([] as CourseCategoryProps['categories'])
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true);
    fetch('/api/categories/by-courses')
      .then(res => res.json())
      .then(data => {
        if (data.error) {
          toast.error("Error occured: " + data.message);
        }
        console.log(data.categories)
        setCategories(data.categories)
        setLoading(false)
      })
      .catch(err => {
        console.log(err)
        setLoading(false)
      })
  }, [])

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
      <CourseCategory categories={categories} />
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


const CourseCategory = ({ categories }:CourseCategoryProps) => {
  return (
    <div className="py-8 px-4 flex flex-wrap justify-center items-stretch gap-6">
      {
        categories.map(category =>
          <button key={"category" + category.name} className="bg-green-600 shadow-md rounded-md p-2 text-xs"> {category.name} </button>
        )
      }
    </div>
  )
}