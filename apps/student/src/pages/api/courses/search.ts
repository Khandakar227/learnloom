import { NextApiRequest, NextApiResponse } from "next";
import { queries } from "@repo/utils";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    switch (req.method) {
      case "GET":
        return handleSearchCourses(req, res);
      default:
        res.status(405).json({error: true, message: "Method Not Allowed"});
        break;
    }
  } catch (error) {
    res.status(500).json({ error: true, message: "Internal Error" });
  }
}

async function handleSearchCourses(req: NextApiRequest, res: NextApiResponse) {
  try {
    let queryParameters:any = {};

    const { keyword, limit, offset } = req.query;
    if (limit && !isNaN(Number(limit)))  queryParameters.limit = +limit;
    if (offset && !isNaN(Number(offset))) queryParameters.offset = +offset;
    if (keyword) queryParameters.keyword = keyword.toString();

    const courses = await queries.searchCourses(queryParameters);
    res.status(200).json({ error: false, courses });
  } catch (error) {
    res.status(500).json({ error: true, message: "Internal Error" });
  }
}
