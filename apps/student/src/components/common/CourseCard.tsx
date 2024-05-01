import { CourseData } from "@repo/utils/types";
import Image from "next/image";
import Link from "next/link";
import { PropsWithChildren } from "react";

interface CourseCardProps extends PropsWithChildren {
    course:CourseData;
}
function CourseCard({course}:CourseCardProps) {
  return (
    <Link  href={`/courses/${course.id}/`} className="block">
      <div className="rounded shadow shadow-black p-4 bg-[#00000073] max-w-md">
          <div className="pb-8 mx-auto">
              <Image width={400} height={300} src={course.imageUrl} alt={course.name} className="mx-auto" />
          </div>
          <h3 className="text-xl font-semibold">{course.name}</h3>
      </div>
    </Link>
  )
}

export default CourseCard