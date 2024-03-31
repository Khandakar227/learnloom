import { NextApiRequest, NextApiResponse } from "next";
import { getSession } from "@auth0/nextjs-auth0";
import { updateCourse } from "@repo/utils";

export default async function handler(req:NextApiRequest, res:NextApiResponse) {
    try {
        switch (req.method) {
          case "GET":
            handleGetCourse(req, res);
          case "PUT":
            handlePutCourse(req, res);
            break;
            default:
            break;
        }
        res.status(200).json({error: false});
    } catch (error) {
        res.status(500).json({error: true, message: "Internal Error"});
    }
}

async function handlePutCourse(req: NextApiRequest, res: NextApiResponse) {
    try {
      const session = await getSession(req, res);
      if (!session)
        return res.status(403).json({ error: true, message: "Unauthorized" });
      
      const { id } = req.query;
      const course = req.body;
      const updatedCourse = await  updateCourse(id as string, course);
      res.status(200).json({error: false, course:updatedCourse});
    } catch (error) {
      res.status(500).json({ error: true, message: "Internal Error" });
    }
  }

  
async function handleGetCourse(req: NextApiRequest, res: NextApiResponse) {
  try {
    const session = await getSession(req, res);
    if (!session)
      return res.status(403).json({ error: true, message: "Unauthorized" });
    
    const { id } = req.query;
    // const updatedCourse = await  updateCourse(id as string, course);
    res.status(200).json({error: false,});
  } catch (error) {
    res.status(500).json({ error: true, message: "Internal Error" });
  }
}
