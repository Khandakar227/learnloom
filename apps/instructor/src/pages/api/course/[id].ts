import { NextApiRequest, NextApiResponse } from "next";
import { getSession } from "@auth0/nextjs-auth0";
import { queries } from "@repo/utils";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    switch (req.method) {
      case "GET":
        if (req.query.id == 'count') return handleGetModuleCount(req, res);
        else return handleGetCourse(req, res);
        break;
      case "PUT":
        handlePutCourse(req, res);
        break;
      case "DELETE":
        handleDeleteCourse(req, res);
        break;
      default:
        res.status(405).json({ error: true, message: "Method Not Allowed" });
        break;
    }
  } catch (error) {
    console.log(error)
    res.status(500).json({ error: true, message: "Internal Error" });
  }
}

async function handlePutCourse(req: NextApiRequest, res: NextApiResponse) {
  try {
    const session = await getSession(req, res);
    if (!session)
      return res.status(403).json({ error: true, message: "Unauthorized" });

    const { id } = req.query;
    const course = req.body;
    const updatedCourse = await queries.updateCourse(id as string, course);
    res.status(200).json({ error: false, course: updatedCourse });
  } catch (error) {
    console.log(error)
    res.status(500).json({ error: true, message: "Internal Error" });
  }
}


async function handleGetCourse(req: NextApiRequest, res: NextApiResponse) {
  try {
    const session = await getSession(req, res);
    if (!session)
      return res.status(403).json({ error: true, message: "Unauthorized" });

    const { id } = req.query;
    const course = await queries.getCourse(id as string);
    res.status(200).json({ error: false, course });
  } catch (error) {
    console.log(error)
    res.status(500).json({ error: true, message: "Internal Error" });
  }
}

async function handleGetModuleCount(req: NextApiRequest, res: NextApiResponse) {
  try {
    const session = await getSession(req, res);
    if (!session)
      return res.status(403).json({ error: true, message: "Unauthorized" });

    const { courseId } = req.query;
    if (!courseId) return res.status(401).json({ error: true, message: "Missing course ID" });
    const count = await queries.getModulesCountForCourse(courseId as string);
    return res.status(200).json({ error: false, count: count?.moduleCount || null });
  } catch (error) {
    console.log(error)
    res.status(500).json({ error: true, message: "Internal Error" });
  }
}

async function handleDeleteCourse(req: NextApiRequest, res: NextApiResponse) {
  try {
    const session = await getSession(req, res);
    if (!session)
      return res.status(403).json({ error: true, message: "Unauthorized" });

    const { id } = req.query;
    const instructor = await queries.getInstructor(session.user.email);
    if (!instructor) return res.status(403).json({ error: true, message: "Unauthorized" });
    const course = await queries.deleteCourse(id as string, instructor.id);
    res.status(200).json({ error: false, course });
  } catch (error) {
    console.log(error)
    res.status(500).json({ error: true, message: "Internal Error" });
  }
}
