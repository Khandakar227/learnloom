import { NextApiRequest, NextApiResponse } from "next";
import { queries } from "@repo/utils";
import { getSession } from "@auth0/nextjs-auth0";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    try {
        if (req.method === "POST") {
            return handleEnroll(req, res);
        } else if (req.method === "GET") {
            return handleGetEnroll(req, res);
        }
    } catch (error) {
        console.log(error)
        res.status(500).json({ error: true, message: "Internal Error" });
    }
}

async function handleEnroll(req: NextApiRequest, res: NextApiResponse) {
    try {
        const { id } = req.query;
        const { amount, paymentMethod, phoneNo, paymentId } = req.body;
        const session = await getSession(req, res);
        
        if (!session)
            return res.status(403).json({ error: true, message: "Unauthorized" });

        const student = await queries.getStudent(session.user.email);
        const course = await queries.getCourse(id as string);
        const enroll = await queries.enrollStudent({ courseId: id as string, studentId: student.id, amount, paymentMethod, phoneNo, paymentId, paymentStatus: course.price ? "pending" : "paid" });
        res.status(200).json({ error: false, data: enroll });
    } catch (error) {
        console.log(error)
        res.status(500).json({ error: true, message: "Internal Error" });
    }
}

async function handleGetEnroll(req: NextApiRequest, res: NextApiResponse) {
    try {
        const { id } = req.query;

        const session = await getSession(req, res);
        if (!session)
            return res.status(403).json({ error: true, message: "Unauthorized" });
        const student = await queries.getStudent(session.user.email);
        const enroll = queries.getEnrolledData(student.id, id as string);
        res.status(200).json({ error: false, data: enroll });
    } catch (error) {
        console.log(error)
        res.status(500).json({ error: true, message: "Internal Error" });
    }
}