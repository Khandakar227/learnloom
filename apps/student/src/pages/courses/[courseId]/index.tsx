import Navbar from "@/components/common/Navbar";
import { getSession } from "@auth0/nextjs-auth0";
import { queries } from "@repo/utils";
import { formatDateTime } from "@repo/utils/client";
import { CourseData, CourseModule, EnrollPayment } from "@repo/utils/types";
import { GetServerSidePropsContext } from "next";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect } from "react";
import { toast } from "react-toastify";

type CoursePageProps = {
  modules: CourseModule[];
  course: CourseData;
  enrolled: EnrollPayment;
}

export default function Course({ course, modules, enrolled }: CoursePageProps) {
  const router = useRouter();

  function showPending() {
    toast.warn("Your payment is being reviewed. Once reviewed you will get an email.");
  }

  function freeEnroll() {
    fetch(`/api/courses/${course.id}/enroll`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ paymentId: "free", phoneNo: "free", paymentMethod: "free", amount: course.price })
    })
      .then(res => res.json())
      .then(data => {
        if (data.error) {
          console.log(data.message);
          toast.error("Error occured: " + data.message);
          return;
        }
        toast.success("Enrolled successfully to course: " + course.name);
        router.push(`/courses/${course.id}`);
      })
      .catch(err => {
        console.log(err);
        toast.error("Error occured: " + err.message);
      })
  }

  return (
    <div>
      <Navbar />
      <div className="grid lg:grid-cols-4 md:grid-cols-3">
        <div className="shadow-sm shadow-white min-h-screen static top-0 left-0 bg-green-950 bg-opacity-20">
          <div className="py-6 px-4 mx-auto">
          </div>
          {
            modules.map((module, i) => <Link href={`/courses/${course.id}/module/${module.id}`} key={module.name + i} className="block text-start text-lg w-full border-b p-4">{module.orderNo}. {module.name} </Link>)
          }
        </div>

        <div className="py-12 px-4 lg:col-span-3 md:col-span-2">
          <p className={`${course.isPublished ? "text-green-400" : "text-red-400"} text-sm px-4 pb-4`}>{course.isPublished ? "Published" : "Not Published"}</p>

          <div className="flex items-center justify-between gap-4 flex-col md:flex-row">
            <h1 className="text-xl md:text-2xl font-semibold px-4">{course.name}</h1>
            {
              enrolled?.paymentStatus == "pending" ?
                <button onClick={showPending} className="block px-4 py-2 bg-green-500">Pending</button>
                :
                enrolled?.paymentStatus == "paid" ?
                  ""
                  :
                  (
                    course.price == 0 ?
                      <button onClick={freeEnroll} className="block px-4 py-2 bg-red-500">Enrol Now</button>
                      :
                      <Link href={`/enroll/${course.id}`} className="block px-4 py-2 bg-red-500">Enroll Now</Link>
                  )
            }
          </div>

          <p className="text-lg pt-4 text-green-200 px-4">Price: {course.price ? course.price + " BDT" : "Free"}</p>
          <p className="p-4">
            <span className="px-2 py-1 rounded-md text-xs bg-green-800 my-2">{course.category}</span>
          </p>

          <p className="text-end text-sm opacity-60"> {formatDateTime(course.createdAt)} </p>

          <div className="p-4">
            <Image width={800} height={800} className="max-w-4xl mx-auto w-full" src={course.imageUrl} alt={course.name} />
          </div>

          <div className="p-4 pt-12">
            <div className="description" dangerouslySetInnerHTML={{ __html: course.description }} />
          </div>
          {
            enrolled?.paymentStatus == "paid" && (
              <div className="py-12">
                <hr className="my-6" />
                <h3 className="text-center text-2xl font-semibold py-2">Join the Community</h3>
                <div className="text-center">
                  <Link href={`/courses/${course.id}/forum`} className="block w-max py-2 px-4 rounded-md bg-purple-500 mt-6 mx-auto"> Go to Forum </Link>
                </div>
              </div>
            )
          }
        </div>
      </div>
    </div>
  )
}


export async function getServerSideProps(context: GetServerSidePropsContext) {
  const params = context.params;
  if (!params || !params.courseId)
    return { props: { modules: null } }
  const course = await queries.getCourse(params.courseId as string);
  const modules = await queries.getAllModulesLittleInfo(params.courseId as string);

  const session = await getSession(context.req, context.res);
  const student = await queries.getStudent(session?.user.email as string);
  const enroll = await queries.getEnrolledData(student.id, params.courseId as string) || null;
  return { props: { modules: JSON.parse(JSON.stringify(modules)), course: JSON.parse(JSON.stringify(course)), enrolled: enroll ? JSON.parse(JSON.stringify(enroll)) : null } }
}
