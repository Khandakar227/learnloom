import { CourseData } from "@repo/utils/types";
import Image from "next/image";
import { PropsWithChildren } from "react";

interface CourseCardProps extends PropsWithChildren {
    course:CourseData;
}
function CourseCard({course}:CourseCardProps) {
  return (
    <div className="rounded shadow shadow-black p-4 bg-[#00000073]">
        <div className="pb-8">
            <Image width={400} height={300} src={course.imageUrl} alt={course.name} />
        </div>
        <h3 className="text-2xl font-semibold">{course.name}</h3>
    </div>
  )
}

export default CourseCard