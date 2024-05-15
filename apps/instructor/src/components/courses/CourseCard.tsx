import { CourseData } from "@repo/utils/types";
import { PropsWithChildren } from "react";
import CourseDescription from "@repo/ui/course-description";
import Link from "next/link";
import { formatDateTime } from "@repo/utils/client";

interface CourseCardProps extends PropsWithChildren {
    course:CourseData;
}

export default function CourseCard({course}:CourseCardProps) {
  return (
    <div className="rounded shadow shadow-black p-4 bg-[#00000073] my-4">
      <div className="gap-4 grid lg:grid-cols-3 items-center md:grid-cols-2">
        <div className="pb-6">
             <img src={course.imageUrl} className="max-w-xl w-full rounded"/>
        </div>
        <div className="lg:col-span-2">
            <h3 className="text-xl md:text-2xl font-semibold">{course.name}</h3>
            <p className="text-xs pt-2 pb-4 text-end">{formatDateTime(course.createdAt)}</p>
            <p><span className="px-2 py-1 rounded-md text-xs bg-green-800 my-2">{course.category}</span></p>
            <p className={`${course.isPublished ? "text-green-400" : "text-red-400"} py-4`}>{course.isPublished ? "Published" : "Not Published"}</p>
            <p>{course.price ? course.price + " BDT" : "Free"}</p>
            <div className="text-xs text-ellipsis line-clamp-5 text-[#7d7d7d] py-4 overflow-hidden">
                <CourseDescription short={true} description={course.description}/>
            </div>
        </div>
      </div>

      <div className="flex justify-end items-center py-2 gap-8">
        <Link className="py-1 px-4 bg-green-700 text-sm rounded" href={"/courses/edit/"+course.id}>Edit</Link>
        <Link className="py-1 px-4 bg-yellow-700 text-sm rounded" href={`/courses/${course.id}/`}>Add Modules</Link>
      </div>
    </div>
  )
}
