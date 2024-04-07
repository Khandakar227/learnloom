import { NextApiRequest, NextApiResponse } from "next";
import { ModuleInputInfo } from "@repo/utils/types";
import { getSession } from "@auth0/nextjs-auth0";
import { queries } from "@repo/utils";

interface ModuleProps extends ModuleInputInfo {
  courseId: string;
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    switch (req.method) {
      case "POST":
        handleAddModule(req, res);
        break;
      case "GET":
        handleGetAllModules(req, res);
      default:
        break;
    }
  } catch (error) {
    res.status(500).json({ error: true, message: "Internal Error" });
  }
}

async function handleGetAllModules(req: NextApiRequest, res: NextApiResponse) {
  try {
    const session = await getSession(req, res);
    if (!session)
      return res.status(403).json({ error: true, message: "Unauthorized" });
    const { courseId } = req.query;
    if(!courseId) return res.status(401).json({error: true, message: "No course has been specified"});
    const modules = await queries.getAllModules(courseId.toString());
    res.status(200).json({ error: false, modules});
  } catch (error) {
    res.status(500).json({ error: true, message: "Internal Error" });
  }
}

async function handleAddModule(req: NextApiRequest, res: NextApiResponse) {
  try {
    const session = await getSession(req, res);
    if (!session)
      return res.status(403).json({ error: true, message: "Unauthorized" });

    const { name, details, videoUrl, courseId } = req.body as ModuleProps;

    const module = await queries.addModule({name, details, courseId, videoUrl});

    res.status(200).json({ error: false, message: "New module added", module });
  } catch (error) {
    res.status(500).json({ error: true, message: "Internal Error" });
  }
}
