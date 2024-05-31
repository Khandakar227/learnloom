import { getSession } from "@auth0/nextjs-auth0";
import { GetServerSidePropsContext } from "next";
import Link from "next/link";
import { use, useEffect, useMemo, useState } from "react";

type CourseByCount = { id: string, name: string, count: number };

function EnrolledUsers() {
  const [studentCountByCourse, setStudentCountByCourse] = useState([] as CourseByCount[]);
  const studentCount = useMemo(() => studentCountByCourse.reduce((acc, course) => acc + course.count, 0), [studentCountByCourse]);
  
  useEffect(() => {
    fetch(`/api/enrolled/count?groupby=course`)
      .then(res => res.json())
      .then(data => {
        if (data.error) console.log(data.error)
        else {
          setStudentCountByCourse(data.data as CourseByCount[]);
        }
      })
      .catch(err => console.log(err))
  }, []);

  return (
    <div className="p-4 shadow-sm rounded-md py-6 mt-8 block neo-semi-dark">
      <div className="flex justify-between items-center pb-5">
        <h3 className="text-3xl py-6"> Enrolled Students </h3>
        <div>
          Total: {studentCount}
        </div>
      </div>

      <div>
        {
          studentCountByCourse.map((course, i) => (
            <Link href={`/enrollment/${course.id}`} key={i + "course-enroll"} className="flex justify-between items-center py-2 px-4 neo-dark my-4">
              <h3 className="font-semibold line-clamp-1">{course.name}</h3>
              <p className="font-extrabold pl-4">{course.count}</p>
            </Link>
          ))
        }
      </div>
    </div>
  )
}

export default EnrolledUsers


export async function getServerSideProps(context:GetServerSidePropsContext) {
  const user = await getSession(context.req, context.res);
  if(!user)
  return {
    redirect: {
      permanent: false,
      destination: "/"
    }
  }
}