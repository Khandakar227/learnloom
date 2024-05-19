import Navbar from "@/components/common/Navbar";
import { getSession } from "@auth0/nextjs-auth0";
import { CourseData } from "@repo/utils/types";
import { GetServerSidePropsContext } from "next";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/router";
import { FormEvent, useEffect, useState } from "react";

export default function Enroll() {
  const router = useRouter();
  const [course, setCourse] = useState({} as CourseData);
  const { courseId } = router.query;
  const [loading, setLoading] = useState(false);
  
  useEffect(() => {
    if (!courseId) return;
    setLoading(true);
    fetch(`/api/courses/${courseId}`)
      .then(res => res.json())
      .then(data => {
        if (data.error) {
          console.log(data.message)
          return;
        }
        setCourse(data.course);
        setLoading(false);
      })
      .catch(err => console.log(err));
  }
  , [courseId]);
  
  function payNow(e:FormEvent) {
    e.preventDefault();
    const form = e.target as HTMLFormElement;
    const trxId = form.trxId.value;
    const phoneNumber = form.phoneNumber.value;
    console.log(trxId, phoneNumber);
  }

  return (
    <div>
      <Navbar />
      <div className="py-12 max-w-7xl mx-auto px-4">
        <h2 className="text-3xl font-bold"> Enroll in </h2>
        <div className="grid md:grid-cols-2 gap-4 justify-between items-start">
          <Link href={`/courses/${course.id}`}  className="my-4 p-4 rounded-md neo-semi-dark max-w-fit block">
            <h1 className="text-xl">{course.name}</h1>
            <p className="text-xl pb-8"> Price: <b className="text-green-300">{course.price} Tk.</b> </p>
            <Image src={course.imageUrl} width={400} height={400} alt={course.name} />
          </Link>
          <div className="neo-semi-dark">
            <div className="bg-pink-600 mx-auto rounded-md">
              <h3 className="text-center p-4"> Send <b>{course.price} TK.</b> using the Bkash QR Code or Send Money to the phone number given below.</h3>
              <Image src={"/images/payment_qr.jpg"} width={300} height={500} className="mx-auto rounded-md overflow-hidden" alt={"Payment QR Code"} />
              <div className="py-6 px-4">
                <form onSubmit={payNow}>
                  <input required type="text" name="trxId" id="trxId" className="p-2 bg-white text-black rounded-md shadow-sm w-full my-2" placeholder="Transaction ID"/>
                  <input required type="tel" name="phoneNumber" id="phoneNumber" className="p-2 bg-white text-black rounded-md shadow-sm w-full my-2" placeholder="Phone Number"/>
                  <p className="p-4"> After payment you will receive a confirmation mail within 24 hours. After that you can access the course materials.</p>
                  <button className="bg-yellow-500 text-white p-2 rounded-md w-full my-2"> Pay Now </button>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export async function getServerSideProps(context: GetServerSidePropsContext) {
  const user = await getSession(context.req, context.res);
  if (!user) return {
      redirect: { destination: '/api/auth/login', permanent: false }
    }

  return {
    props: {
      isLoggedIn: true
    }
  }
}