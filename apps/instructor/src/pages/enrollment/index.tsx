import Navbar from "@/components/common/Navbar";
import { getSession } from "@auth0/nextjs-auth0";
import { GetServerSidePropsContext } from "next";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";

interface Payment {
    amount: number;
    courseId: string;
    courseName: string;
    name: string;
    paymentAt: string;
    paymentId: string;
    paymentMethod: string;
    paymentStatus: string;
    phoneNo: string;
    studentId: string;
  }
  

export default function Enrollment() {
    const [enrolledStudents, setEnrolledStudents] = useState([] as Payment[]);
    
    useEffect(() => {
        let url = `/api/enrolled`;
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
    }   , []);

    return (
        <div>
            <Navbar />
            <div className="max-w-7xl mx-auto overflow-auto">
                <div className="neo-semi-dark p-4">
                    {
                        !enrolledStudents.length && (<p className="py-12 opacity-50"> No students has been enrolled </p>)
                    }
                    {
                        enrolledStudents.map(student =>
                            <div key={student.paymentId} className="p-4 my-6 neo-dark flex">
                                <h3 className="text-xl md:text-2xl font-semibold">{student.name}</h3>
                                <p className="text-xs py-2 text-end opacity-50">{student.paymentAt}</p>
                                <p><span className="px-2 py-1 rounded-md text-xs bg-green-800 my-2">{student.courseName}</span></p>
                                <p className={`text-sm py-2 flex justify-between items-center`}>
                                    <span className={`${student.paymentStatus === "success" ? "text-green-400" : "text-red-400"}`}>{student.paymentStatus}</span>
                                    <span>{student.amount + " BDT"}</span>
                                </p>
                            </div>
                        )
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
}