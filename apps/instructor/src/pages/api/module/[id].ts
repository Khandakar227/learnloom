import { getSession } from "@auth0/nextjs-auth0";
import { queries } from "@repo/utils";
import { ModuleInputInfo } from "@repo/utils/types";
import { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    switch (req.method) {
      case "GET":
        handleGetModule(req, res);
        break;
        case "POST":
        handleAddModuleById(req, res);
        break;
      case "PUT":
        handleUpdateModule(req, res);
        break;
      case "DELETE":
        handleDeleteModule(req, res);
      default:
        res.status(405).json({ error: true, message: "Method Not Allowed" });
        break;
    }
  } catch (error) {
    res.status(500).json({ error: true, message: "Internal Error" });
  }
}

async function handleGetModule(req: NextApiRequest, res: NextApiResponse) {
  try {
    const session = await getSession(req, res);
    if (!session)
      return res.status(403).json({ error: true, message: "Unauthorized" });
    
    const { id } = req.query;
    if (!id)
      return res.status(401).json({ error: true, message: "No module has been specified" });

    const module = await queries.getModule(id.toString());
    res.status(200).json({ error: false, module });
  } catch (error) {
    res.status(500).json({ error: true, message: "Internal Error" });
  }
}

async function handleUpdateModule(req: NextApiRequest, res: NextApiResponse) {
    try {
      const session = await getSession(req, res);
      if (!session)
        return res.status(403).json({ error: true, message: "Unauthorized" });
      
      const { id } = req.query;
      if (!id)
        return res.status(401).json({ error: true, message: "No module has been specified" });
  
      const { name, details, videoUrl } = req.body as ModuleInputInfo;
      const module = await queries.updateModule(id.toString(), {
        name, details, videoUrl,
      });
      res.status(200).json({ error: false, module });
    } catch (error) {
      res.status(500).json({ error: true, message: "Internal Error" });
    }
  }
  
  
async function handleDeleteModule(req: NextApiRequest, res: NextApiResponse) {
    try {
      const session = await getSession(req, res);
      if (!session)
        return res.status(403).json({ error: true, message: "Unauthorized" });
      
      const { id } = req.query;
      if (!id)
        return res.status(401).json({ error: true, message: "No module has been specified" });
  
      const module = await queries.deleteModule(id.toString());
      res.status(200).json({ error: false, message: "Module deleted" });
    } catch (error) {
      res.status(500).json({ error: true, message: "Internal Error" });
    }
  }

  
async function handleAddModuleById(req: NextApiRequest, res: NextApiResponse) {
    try {
      const session = await getSession(req, res);
      if (!session)
        return res.status(403).json({ error: true, message: "Unauthorized" });
      
      const { id, courseId } = req.query;
      if (!id || !courseId)
        return res.status(401).json({ error: true, message: "No module or course has been specified" });
  
      const { name, details, videoUrl } = req.body as ModuleInputInfo;
      const module = await queries.addModuleById(id.toString(), {
        name, details, videoUrl, courseId: courseId.toString()
      });
      
      res.status(200).json({ error: false, module });
    } catch (error) {
      res.status(500).json({ error: true, message: "Internal Error" });
    }
  }
  