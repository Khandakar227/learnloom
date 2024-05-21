import { NextApiRequest, NextApiResponse } from "next";
import { queries } from "@repo/utils";
import { getSession } from "@auth0/nextjs-auth0";

export default async function handler(req:NextApiRequest, res:NextApiResponse) {
    try {
        switch (req.method) {
          case "GET":
            return handleGetCourse(req, res);
          default:
            res.status(405).json({error: true, message: "Method Not Allowed"});
            break;
        }
    } catch (error) {
        console.log(error)
        res.status(500).json({error: true, message: "Internal Error"});
    }
}


async function handleGetCourse(req: NextApiRequest, res: NextApiResponse) {
    try {
      const { id } = req.query;

      const course = await  queries.getCourse(id as string);
      res.status(200).json({error: false, course});
    } catch (error) {
      console.log(error)
      res.status(500).json({ error: true, message: "Internal Error" });
    }
  }