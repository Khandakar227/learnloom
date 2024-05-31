import { NextApiRequest, NextApiResponse } from "next";
import { CourseInputInfo } from "@repo/utils/types";
import { getSession } from "@auth0/nextjs-auth0";
import { queries } from "@repo/utils";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    switch (req.method) {
      case "GET":
        return handleGetEnrolledStudents(req, res);
      default:
        return res.status(405).json({error: true, message: "Method Not Allowed"});
    }
  } catch (error) {
    res.status(500).json({ error: true, message: "Internal Error" });
  }
}

async function handleGetEnrolledStudents(req: NextApiRequest, res: NextApiResponse) {
  try {
    const session = await getSession(req, res);
    if (!session)
      return res.status(403).json({ error: true, message: "Unauthorized" });

    const students = await queries.getEnrolledStudentsByCourse(session?.user.email, req.query.courseId as string);
    res.status(200).json({ error: false, students });
  } catch (error) {
    res.status(500).json({ error: true, message: "Internal Error" });
  }
}

