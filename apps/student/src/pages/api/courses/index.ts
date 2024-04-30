import { NextApiRequest, NextApiResponse } from "next";
import { queries } from "@repo/utils";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    switch (req.method) {
      case "GET":
        return handleGetAllCourses(req, res);
      default:
        res.status(405).json({error: true, message: "Method Not Allowed"});
        break;
    }
  } catch (error) {
    res.status(500).json({ error: true, message: "Internal Error" });
  }
}

async function handleGetAllCourses(req: NextApiRequest, res: NextApiResponse) {
  try {
    let queryParameters:any = {};

    const { limit, offset } = req.query;
    
    if (limit && !isNaN(Number(limit)))  queryParameters.limit = +limit;
    if (offset && !isNaN(Number(offset))) queryParameters.offset = +offset;

    const courses = await queries.getPublishedCourses(queryParameters);
    res.status(200).json({ error: false, courses });
  } catch (error) {
    res.status(500).json({ error: true, message: "Internal Error" });
  }
}
