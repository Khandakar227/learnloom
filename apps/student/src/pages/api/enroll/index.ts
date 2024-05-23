import { NextApiRequest, NextApiResponse } from "next";
import { queries } from "@repo/utils";
import { getSession } from "@auth0/nextjs-auth0";

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse
) {
    try {
        switch (req.method) {
            case "GET":
                return handleGetAllEnrolledCourses(req, res);
            default:
                res.status(405).json({ error: true, message: "Method Not Allowed" });
                break;
        }
    } catch (error) {
        res.status(500).json({ error: true, message: "Internal Error" });
    }
}

async function handleGetAllEnrolledCourses(req: NextApiRequest, res: NextApiResponse) {
    try {
        const session = await getSession(req, res);
        if (!session) {
            return res.status(401).json({ error: true, message: "Unauthorized" });
        }
        const student = await queries.getStudent(session.user.email);
        const courses = await queries.getEnrolledCourses(student.id);
        res.status(200).json({ error: false, courses });
    } catch (error) {
        res.status(500).json({ error: true, message: "Internal Error" });
    }
}
