import { CourseData } from "@repo/utils/types";
import { PropsWithChildren } from "react";
import CourseDescription from "@repo/ui/course-description";
import Link from "next/link";
import { formatDateTime } from "@repo/utils/client";

interface CourseCardProps extends PropsWithChildren {
    course:CourseData;
    paymentStatus: string;
}

export default function CourseCard({course, paymentStatus}:CourseCardProps) {
  return (
    <div className="rounded shadow shadow-black p-4 bg-[#00000073] my-4">
      <div className="gap-4 grid lg:grid-cols-3 items-center md:grid-cols-2">
        <div className="pb-6">
        <Link href={`/courses/${course.id}`}><img src={course.imageUrl} className="max-w-xl w-full rounded"/></Link>
        </div>
        <div className="lg:col-span-2">
            <Link href={`/courses/${course.id}`}><h3 className="text-xl md:text-2xl font-semibold">{course.name}</h3></Link>
            <p className="text-xs pt-2 pb-4 text-end">{formatDateTime(course.createdAt)}</p>
            <p><span className="px-2 py-1 rounded-md text-xs bg-green-800 my-2">{course.category}</span></p>
            <p className={`${course.isPublished ? "text-green-400" : "text-red-400"} py-4`}>{course.isPublished ? "Published" : "Not Published"}</p>
            <p>{course.price ? course.price + " BDT" : "Free"}</p>
            
            <p className="pt-4">Payment Status: <span className={`p-1 ml-2 rounded-md ${paymentStatus == "pending" ? "bg-yellow-600" : paymentStatus == "declined" ? "bg-red-600" : "bg-green-500"}`}>{paymentStatus.toUpperCase()}</span></p>
        </div>
      </div>
    </div>
  )
}
