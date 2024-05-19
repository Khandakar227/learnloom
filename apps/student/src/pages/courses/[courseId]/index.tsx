import Navbar from "@/components/common/Navbar";
import { getSession } from "@auth0/nextjs-auth0";
import { queries } from "@repo/utils";
import { formatDateTime } from "@repo/utils/client";
import { CourseData, CourseModule } from "@repo/utils/types";
import { GetServerSidePropsContext } from "next";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/router";

type CoursePageProps = {
  modules: CourseModule [];
  course: CourseData
}

export default function AddModules({course, modules}:CoursePageProps) {
  const router = useRouter();
  // console.log(modules)
  return (
    <div>
      <Navbar/>
      <div className="grid lg:grid-cols-4 md: grid-cols-3">
        
        <div className="shadow-sm shadow-white min-h-screen static top-0 left-0 bg-green-950 bg-opacity-20">
          <div className="py-6 px-4 mx-auto">
          </div>
            {
              modules.map((module, i) => <Link href={`/courses/${course.id}/module/${module.id}`} key={module.name + i} className="block text-start text-lg w-full border-b p-4">{module.orderNo}. {module.name} </Link> )
            }
        </div>

        <div className="py-12 px-4 lg:col-span-3 md:col-span-2">
          <p className={`${course.isPublished ? "text-green-400" : "text-red-400"} text-sm px-4 pb-4`}>{course.isPublished ? "Published" : "Not Published"}</p>
          <div className="flex items-center justify-between gap-4 flex-col md:flex-row">
            <h1 className="text-xl md:text-2xl font-semibold px-4">{course.name}</h1>
            <Link href={`/enroll/${course.id}`} className="block px-4 py-2 bg-red-500">Enroll Now</Link>
          </div>
          <p className="text-lg pt-4 text-green-200 px-4">Price: {course.price ? course.price + " BDT" : "Free"}</p>
          <p className="p-4">
            <span className="px-2 py-1 rounded-md text-xs bg-green-800 my-2">{course.category}</span>
          </p>
          <p className="text-end text-sm opacity-60"> {formatDateTime(course.createdAt)} </p>
          <div className="p-4">
            <Image width={800} height={800} className="max-w-4xl mx-auto" src={course.imageUrl} alt={course.name} />
          </div>
          <div className="p-4 pt-12">
            <div className="description" dangerouslySetInnerHTML={{__html: course.description}} />
          </div>
        </div>
      </div>
    </div>
  )
}


export async function getServerSideProps(context:GetServerSidePropsContext) {
  // TODO: Enrollments check
  const params = context.params;
  if(!params || !params.courseId) 
    return { props: { modules: null } }
    const course = await queries.getCourse(params.courseId as string)
    const modules = await queries.getAllModulesLittleInfo(params.courseId as string)
    // console.log(course)
    return { props: { modules: JSON.parse(JSON.stringify(modules)), course: JSON.parse(JSON.stringify(course)) } }
}
