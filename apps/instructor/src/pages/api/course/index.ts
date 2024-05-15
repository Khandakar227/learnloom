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
      case "POST":
        return handleAddCourse(req, res);
      case "GET":
        return handleGetAllCourses(req, res);
      default:
        return res.status(405).json({error: true, message: "Method Not Allowed"});
    }
  } catch (error) {
    res.status(500).json({ error: true, message: "Internal Error" });
  }
}

async function handleGetAllCourses(req: NextApiRequest, res: NextApiResponse) {
  try {
    const session = await getSession(req, res);
    if (!session)
      return res.status(403).json({ error: true, message: "Unauthorized" });

    const courses = await queries.getCourseByUser(session?.user.email);

    res.status(200).json({ error: false, courses });
  } catch (error) {
    res.status(500).json({ error: true, message: "Internal Error" });
  }
}

async function handleAddCourse(req: NextApiRequest, res: NextApiResponse) {
  try {
    const session = await getSession(req, res);
    if (!session)
      return res.status(403).json({ error: true, message: "Unauthorized" });

    const instructorId = await queries.getInstructorId(session.user.email);

    const { name, price, isPublished, description, categoryId, imageUrl } =
      req.body as CourseInputInfo;

    const course = await queries.addCourse({
      instructorId,
      name,
      price,
      isPublished,
      description,
      categoryId,
      imageUrl,
    });

    res.status(200).json({ error: false, message: "New course added" });
  } catch (error) {
    res.status(500).json({ error: true, message: "Internal Error" });
  }
}
