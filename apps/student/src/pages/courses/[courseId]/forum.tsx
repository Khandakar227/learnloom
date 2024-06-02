import Editor from "@/components/common/Editor";
import Navbar from "@/components/common/Navbar";
import { getSession } from "@auth0/nextjs-auth0";
import { queries } from "@repo/utils";
import { formatDateTime } from "@repo/utils/client";
import { CourseData, EnrollPayment } from "@repo/utils/types";
import { GetServerSidePropsContext } from "next";
import { redirect } from "next/dist/server/api-utils";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";

type ForumPageProps = {
    course: CourseData;
    enrolled: EnrollPayment;
}

type Message = {
    text: string;
    senderName: string;
    createdAt: string;
}
export default function Forum({ course, enrolled }: ForumPageProps) {
    const [message, setMessage] = useState('');
    const [messages, setMessages] = useState([] as Message[]);
    
    useEffect(() => {
        fetch(`/api/courses/${course.id}/forum`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            }
        })
            .then(res => res.json())
            .then(data => {
                if (data.error) {
                    console.log(data.message);
                    return;
                }
                setMessages(data.messages);
            })
            .catch(err => {
                console.log(err);
            })
    }, [course.id]);
    
    function sendMessage() {
        if(!message) return;
        fetch(`/api/courses/${course.id}/forum`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ message })
        })
            .then(res => res.json())
            .then(data => {
                if (data.error) {
                    console.log(data.message);
                    return;
                }
                location.reload();
            })
            .catch(err => {
                console.log(err);
            })
    }

    return (
        <div className="min-h-screen">
            <Navbar />
            <div className="py-12 px-4 mx-auto max-w-7xl">
                <h1 className="text-2xl font-bold">Forum</h1>
                <p className="text-3xl pb-6">of <span className="font-semibold">{course.name}</span></p>
                <hr />
                <div className="pt-12 pb-4">
                    <Editor value={message} onChange={setMessage} />
                    <button onClick={sendMessage} className="bg-purple-600 rounded-md px-4 py-2 my-4">Send</button>

                    <div className="py-6">
                        {
                            messages.map((msg, i) => (
                                <div key={msg.createdAt + i} className="neo-dark p-4 rounded-md my-6">
                                    <p className="text-sm font-bold">{msg?.senderName}</p>
                                    <p className="text-xs pb-4">{formatDateTime(msg?.createdAt)}</p>
                                    <div className="description" dangerouslySetInnerHTML={{ __html: msg.text }} />
                                </div>
                            ))
                        }
                    </div>
                </div>
            </div>
        </div>
    )
}

export async function getServerSideProps(context: GetServerSidePropsContext) {
    try {
        const courseId = context.params?.courseId;
        const course = await queries.getCourse(courseId as string);
        const session = await getSession(context.req, context.res);
        const student = await queries.getStudent(session?.user.email as string);
        if (!student) return { redirect: { destination: '/courses', permanent: false } }
        const enrolled = await queries.getEnrolledData(student.id, courseId as string) || null;
        if (course && enrolled)
            return { props: { course: JSON.parse(JSON.stringify(course)), enrolled: enrolled ? JSON.parse(JSON.stringify(enrolled)) : null } }
        else
            return { redirect: { destination: '/courses', permanent: false } }
    } catch (error) {
        console.log(error)
        return { redirect: { destination: '/courses', permanent: false } }
    }

}