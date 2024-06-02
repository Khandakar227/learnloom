import { useEffect, useState } from "react";
import { CourseCategoryProps } from "./Courses";
import { toast } from "react-toastify";
import Link from "next/link";

export const CourseCategory = () => {
  
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

  if (loading) return <div className="p-4 flex flex-wrap justify-center items-stretch">Loading...</div>
  return (
    <div className="py-8 px-4 flex flex-wrap justify-center items-stretch gap-6">
      {categories.map(category => <Link href={`/courses?category=${category.name}`} key={"category" + category.name} className="block bg-purple-600 shadow-md rounded-md p-2 text-xs"> {category.name} </Link>
      )}
    </div>
  );
};
