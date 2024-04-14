import Navbar from "@/components/common/Navbar"
import CreateModule from "@/components/courses/CreateModule";
import { getSession } from "@auth0/nextjs-auth0";
import { queries } from "@repo/utils";
import { formatDateTime } from "@repo/utils/client";
import { CourseData, CourseModule } from "@repo/utils/types";
import { GetServerSidePropsContext } from "next";
import Head from "next/head";
import Link from "next/link";
import { useRouter } from "next/router";
import { useState } from "react";

type CoursePageProps = {
    modules: CourseModule[];
    course: CourseData;
    module: CourseModule;
}

function Module({ modules, course, module }: CoursePageProps) {
    const [showCreateForm, setShowCreateForm] = useState(false);
    const router = useRouter();

    return (
        <div>
            <Head>
                <title> {module.name + " - " + course.name || "Module Not Fount"} </title>
            </Head>
            <Navbar />
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
                        modules.map((m, i) => <Link href={`/courses/${course.id}/module/${m.id}`} key={m.name + i} className={`${module.id == m.id ? "bg-green-700" : ""} block text-start text-lg w-full border-b p-4`}>{m.orderNo}. {m.name} </Link>)
                    }
                </div>

                <div className="py-12 px-4 lg:col-span-3 md:col-span-2">
                    <p className={`${course.isPublished ? "text-green-400" : "text-red-400"} text-sm px-4 pb-4`}>{course.isPublished ? "Published" : "Not Published"}</p>
                    <h1 className="text-xl md:text-2xl font-semibold px-4">{course.name}</h1>
                    <p className="text-lg pt-4 text-green-200 px-4">Price: {course.price ? course.price + " BDT" : "Free"}</p>
                    <p className="p-4">
                        <span className="px-2 py-1 rounded-md text-xs bg-green-800 my-2">{course.category}</span>
                    </p>
                    <p className="text-end text-sm opacity-60"> {formatDateTime(course.createdAt)} </p>

                </div>
            </div>
        </div>
    )
}

export default Module





export async function getServerSideProps(context: GetServerSidePropsContext) {
    const user = await getSession(context.req, context.res);
    if (!user)
      return {
        redirect: {
          permanent: false,
          destination: "/"
        }
      }
  
    const params = context.params;
    if (!params || !params.courseId || !params.moduleId)
      return { props: { modules: null, course: null, module: null } }
  
    const course = await queries.getCourse(params.courseId as string)
    const modules = await queries.getAllModulesLittleInfo(params.courseId as string)
    const module = await queries.getModule(params.moduleId as string)
    // console.log(course)
    return {
      props: {
        modules: JSON.parse(JSON.stringify(modules)),
        course: JSON.parse(JSON.stringify(course)),
        module: JSON.parse(JSON.stringify(module))
      }
    }
  }