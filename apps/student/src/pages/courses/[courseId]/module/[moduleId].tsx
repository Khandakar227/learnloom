import Navbar from "@/components/common/Navbar";
import YoutubeEmbed from "@/components/common/YoutubeEmbed";
import { getSession } from "@auth0/nextjs-auth0";
import { queries } from "@repo/utils";
import { formatDateTime } from "@repo/utils/client";
import { CourseData, CourseModule } from "@repo/utils/types";
import { GetServerSidePropsContext } from "next";
import Head from "next/head";
import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { MdMenu } from "react-icons/md";

type CoursePageProps = {
    modules: CourseModule[];
    course: CourseData;
    module: CourseModule;
}

function isYouTubeLink(link: string) {
    var regexPattern = /(?:https?:\/\/)?(?:www\.)?(?:youtube\.com\/(?:[^\/\n\s]+\/\S+\/|(?:v|e(?:mbed)?)\/|\S*?[?&]v=)|youtu\.be\/)([a-zA-Z0-9_-]{11})/;
    return regexPattern.test(link);
}

function Module({ modules, course, module }: CoursePageProps) {
    const [menuHidden, setMenuHidden] = useState(true);
    const router = useRouter();

    useEffect(() => {
        setMenuHidden(true);
    }, [router.asPath])

    return (
        <div>
            <Head>
                <title> {module.name + " - " + course.name || "Module Not Fount"} </title>
            </Head>
            <Navbar />
            <div className="grid lg:grid-cols-4 md:grid-cols-3">
                <div className="shadow-sm shadow-white top-0 left-0 bg-green-950 bg-opacity-20 md:min-h-screen">
                    <div className="text-end p-4 md:hidden">
                        <button onClick={() => setMenuHidden(!menuHidden)}><MdMenu size={28} /></button>
                    </div>
                    <div className={`${menuHidden ? 'hidden' : ""} md:block`}>
                        {
                            modules.map((m, i) => <Link href={`/courses/${course.id}/module/${m.id}`} key={m.name + i} className={`${module.id == m.id ? "bg-green-700" : ""} block text-start text-lg w-full border-b p-4`}>{m.orderNo}. {m.name} </Link>)
                        }
                    </div>
                </div>

                <div className="py-12 px-4 lg:col-span-3 md:col-span-2">
                    <p className={`${course.isPublished ? "text-green-400" : "text-red-400"} text-sm px-4 pb-4`}>{course.isPublished ? "Published" : "Not Published"}</p>
                    <h1 className="text-xl md:text-2xl font-semibold px-4">{course.name}</h1>
                    <p className="text-lg pt-4 text-green-200 px-4">Price: {course.price ? course.price + " BDT" : "Free"}</p>
                    <p className="p-4">
                        <span className="px-2 py-1 rounded-md text-xs bg-green-800 my-2">{course.category}</span>
                    </p>
                    <p className="pb-8 text-end text-xs opacity-60"> {formatDateTime(course.createdAt)} </p>
                    <div className="p-4 shadow rounded bg-white bg-opacity-5">
                        <h1 className="py-4 md:text-4xl text-2xl">{module.name}</h1>
                        {
                            module.videoUrl && isYouTubeLink(module.videoUrl) ?
                                <YoutubeEmbed link={module.videoUrl} />
                                :
                                module.videoUrl ?
                                    <video controls className="w-full">
                                        <source src={module.videoUrl} type="video/mp4" />
                                        Your browser does not support the video tag.
                                    </video>
                                    :
                                    <div className="px-4 rounded text-black bg-white text-center py-12">
                                        Video is not available or not uploaded yet.
                                    </div>
                        }
                        <div className="py-12 description" dangerouslySetInnerHTML={{ __html: module.details }} />
                        <p className="text-end text-xs opacity-60"> {formatDateTime(module.createdAt)} </p>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Module





export async function getServerSideProps(context: GetServerSidePropsContext) {
    // TODO: Enrollments check
    const params = context.params;
    if (!params || !params.courseId || !params.moduleId)
        return { props: { modules: null, course: null, module: null } }

    const course = await queries.getCourse(params.courseId as string)
    const modules = await queries.getAllModulesLittleInfo(params.courseId as string)
    const _module = await queries.getModule(params.moduleId as string)
    // console.log(course)

    const session = await getSession(context.req, context.res);
    const student = await queries.getStudent(session?.user.email as string);
    const enroll = await queries.getEnrolledData(student.id, params.courseId as string) || null;
    if(!enroll || enroll.paymentStatus != "paid") {
        return {
            redirect: {
                destination: `/courses/${params.courseId}`,
                permanent: false
            }
        }
    }
    return {
        props: {
            modules: JSON.parse(JSON.stringify(modules)),
            course: JSON.parse(JSON.stringify(course)),
            module: JSON.parse(JSON.stringify(_module)),
            key: params.moduleId
        },
    }
}