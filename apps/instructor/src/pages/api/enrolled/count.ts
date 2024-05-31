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
        if(req.query.groupby === "course")
          return handleGetEnrolledStudentByCourse(req, res);
        else
        return handleGetStudentCount(req, res);
      default:
        return res.status(405).json({error: true, message: "Method Not Allowed"});
    }
  } catch (error) {
    res.status(500).json({ error: true, message: "Internal Error" });
  }
}

async function handleGetStudentCount(req: NextApiRequest, res: NextApiResponse) {
  try {
    const session = await getSession(req, res);
    if (!session)
      return res.status(403).json({ error: true, message: "Unauthorized" });

    const data = await queries.getEnrolledCount(session?.user.email);
    res.status(200).json({ error: false, count: data.count });
  } catch (error) {
    res.status(500).json({ error: true, message: "Internal Error" });
  }
}


async function handleGetEnrolledStudentByCourse(req: NextApiRequest, res: NextApiResponse) {
  try {
    const session = await getSession(req, res);
    if (!session)
      return res.status(403).json({ error: true, message: "Unauthorized" });

    const data = await queries.getEnrolledStudentCountByCourse(session?.user.email);
    res.status(200).json({ error: false, data });
  } catch (error) {
    res.status(500).json({ error: true, message: "Internal Error" });
  }
}