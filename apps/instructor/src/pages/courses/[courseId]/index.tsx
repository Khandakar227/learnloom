import Navbar from "@/components/common/Navbar";
import CreateModule from "@/components/courses/CreateModule";
import { getSession } from "@auth0/nextjs-auth0";
import { queries } from "@repo/utils";
import { formatDateTime } from "@repo/utils/client";
import { CourseData, CourseModule } from "@repo/utils/types";
import { GetServerSidePropsContext } from "next";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/router";
import { useState } from "react";

type CoursePageProps = {
  modules: CourseModule [];
  course: CourseData
}

export default function AddModules({course, modules}:CoursePageProps) {
  const [showCreateForm, setShowCreateForm] = useState(false);
  const router = useRouter();
  // console.log(modules)
  return (
    <div>
      <Navbar/>
      {
        showCreateForm && (
      <div className="grid overflow-y-auto py-12 justify-center items-center fixed top-0 left-0 right-0 bottom-0">
        <div onClick={() => setShowCreateForm(false)} className="absolute h-full w-full bg-black bg-opacity-50 top-0 left-0 right-0 bottom-0 z-[1] min-h-[150vh]" />
        <CreateModule hideForm={() => setShowCreateForm(false)} className="z-[2]" courseId={router.query.courseId as string} />
      </div>
        )
      }

      <div className="grid lg:grid-cols-4 md: grid-cols-3">
        
        <div className="shadow-sm shadow-white min-h-screen static top-0 left-0 bg-green-950 bg-opacity-20">
          <div className="py-6 px-4 mx-auto">
            <div className="text-start">
            <button onClick={() => setShowCreateForm(true)} className="py-4 px-4 bg-green-800 w-full">Create New Module</button>
            </div>
          </div>
            {
              modules.map((module, i) => <Link href={`/courses/${course.id}/module/${module.id}`} key={module.name + i} className="block text-start text-lg w-full border-b p-4">{module.orderNo}. {module.name} </Link> )
            }
        </div>

        <div className="py-12 px-4 lg:col-span-3 md:col-span-2">
          <p className={`${course.isPublished ? "text-green-400" : "text-red-400"} text-sm px-4 pb-4`}>{course.isPublished ? "Published" : "Not Published"}</p>
          <p className="px-4 py-4 text-sm opacity-60"> {formatDateTime(course.createdAt)} </p>
          <h1 className="text-xl md:text-2xl font-semibold px-4">{course.name}</h1>
          <p className="text-lg pt-4 text-green-200 px-4">Price: {course.price ? course.price + " BDT" : "Free"}</p>
          <p className="p-4">
            <span className="px-2 py-1 rounded-md text-xs bg-green-800 my-2">{course.category}</span>
          </p>
          <div className="p-4">
            <Image width={800} height={600} className="max-w-4xl mx-auto" src={course.imageUrl} alt={course.name} />
          </div>
          <div className="p-4 pt-12">
            <div className="description" dangerouslySetInnerHTML={{__html: course.description}} />
          </div>

          <div className="text-end py-6 px-4">
            <Link className="py-2 px-6 bg-green-700 rounded" href={"/courses/edit/"+course.id}>Edit</Link>
          </div>
        </div>
      </div>
    </div>
  )
}


export async function getServerSideProps(context:GetServerSidePropsContext) {
  const user = await getSession(context.req, context.res);
  if(!user)
  return {
    redirect: {
      permanent: false,
      destination: "/"
    }
  }
  const params = context.params;
  if(!params || !params.courseId) 
    return { props: { modules: null } }
    const course = await queries.getCourse(params.courseId as string)
    const modules = await queries.getAllModulesLittleInfo(params.courseId as string)
    // console.log(course)
    return { props: { modules: JSON.parse(JSON.stringify(modules)), course: JSON.parse(JSON.stringify(course)) } }
}
