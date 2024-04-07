import Navbar from "@/components/common/Navbar";
import CreateModule from "@/components/courses/CreateModule";
import { getSession } from "@auth0/nextjs-auth0";
import { queries } from "@repo/utils";
import { CourseModule } from "@repo/utils/types";
import { GetServerSidePropsContext } from "next";
import { useRouter } from "next/router";
import { useState } from "react";

type AddModuleProps = {
  modules: CourseModule [];
}

export default function AddModules({modules}:AddModuleProps) {
  const [showCreateForm, setShowCreateForm] = useState(false);
  const router = useRouter();

  console.log(modules)
  return (
    <div>
      <Navbar/>
      <div className="py-12 px-4 mx-auto max-w-7xl">
        <div className="text-end">
         <button onClick={() => setShowCreateForm(true)} className="py-2 px-4 bg-green-800">Create New Module</button>
        </div>
      </div>

      {
        showCreateForm && (
      <div className="grid overflow-y-auto py-12 justify-center items-center fixed top-0 left-0 right-0 bottom-0">
        <div onClick={() => setShowCreateForm(false)} className="absolute h-full w-full bg-black bg-opacity-50 top-0 left-0 right-0 bottom-0 z-[1] min-h-[150vh]" />
        <CreateModule hideForm={() => setShowCreateForm(false)} className="z-[2]" courseId={router.query.courseId as string} />
      </div>
        )
      }
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
    const modules = await queries.getAllModules(params.courseId as string)
    // console.log(course)
    return { props: { modules: JSON.parse(JSON.stringify(modules)) } }
}
