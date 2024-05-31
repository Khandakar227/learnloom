import Navbar from "@/components/common/Navbar";
import { getSession } from "@auth0/nextjs-auth0";
import { formatDateTime } from "@repo/utils/client";
import { GetServerSidePropsContext } from "next";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";

interface Payment {
    amount: number;
    courseId: string;
    courseName: string;
    name: string;
    email: string;
    paymentAt: string;
    paymentId: string;
    paymentMethod: string;
    paymentStatus: string;
    phoneNo: string;
    studentId: string;
  }

export default function Enrollment() {
    const [enrolledStudents, setEnrolledStudents] = useState([] as Payment[]);
    const router = useRouter();

    useEffect(() => {
        let url = `/api/enrolled?courseId=${router.query.courseId}`;
        fetch(url)
            .then(res => res.json())
            .then(data => {
                if (data.error) {
                    console.log(data.error);
                    toast.error(data.message);
                } else {
                    setEnrolledStudents(data.students);
                }
            })
            .catch(err => {
                console.log(err);
                toast.error("Internal Error");
            })
    }   , [router.query.courseId]);

    return (
        <div>
            <Navbar />
            <div className="max-w-7xl mx-auto overflow-auto py-12">
                <div className="neo-semi-dark p-4">
                    {
                        !enrolledStudents.length ? 
                        <p className="py-12 opacity-50"> No students has been enrolled </p>
                        :
                        <table className="w-full">
                            <thead>
                                <tr>
                                    <th>ID</th>
                                    <th>Name</th>
                                    <th>Email</th>
                                    <th>Course</th>
                                    <th>Status</th>
                                    <th>Amount</th>
                                    <th>Time</th>
                                </tr>
                            </thead>
                            <tbody>
                            {
                                enrolledStudents.map((student, i) =>
                                    <tr key={student.paymentId}>
                                        <td className="px-4 border">{i+1}</td>
                                        <td className="px-4 text-nowrap max-w-max border">{student.name}</td>
                                        <td className="px-4 text-nowrap max-w-max border">{student.email}</td>
                                        <td className="border text-center max-w-80">
                                            <p className="px-4">
                                                <span className="px-2 py-1 rounded-md text-xs bg-green-800 my-2 text-nowrap w-max">{student.courseName}</span>
                                            </p>
                                        </td>
                                        <td className={`text-sm py-2 border text-center px-4`}>
                                            <span className={`${student.paymentStatus === "paid" ? "text-green-400" : student.paymentStatus === "pending" ? "text-yellow-400" : "text-red-400"}`}>{student.paymentStatus}</span>
                                        </td>
                                        <td className="border text-center px-4">
                                            <span>{student.amount + " BDT"}</span>
                                        </td>
                                        <td className="text-xs p-4 text-end opacity-50 text-nowrap w-max border">{formatDateTime(student.paymentAt)}</td>
                                    </tr>
                                )
                            }
                            </tbody>
                        </table>
                    }
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
    return {
        props: {}
    }
}