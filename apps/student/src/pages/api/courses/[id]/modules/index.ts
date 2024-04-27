import { NextApiRequest, NextApiResponse } from "next";
import { queries } from "@repo/utils";

export default async function handler(req:NextApiRequest, res:NextApiResponse) {
    try {
        switch (req.method) {
          case "GET":
            return handleGetModules(req, res);
          default:
            res.status(405).json({error: true, message: "Method Not Allowed"});
            break;
        }
    } catch (error) {
        console.log(error)
        res.status(500).json({error: true, message: "Internal Error"});
    }
}


async function handleGetModules(req: NextApiRequest, res: NextApiResponse) {
    try {
      const { id, short } = req.query;
      let modules;
      if (!short) modules = await queries.getAllModules(id as string);
      else modules = await queries.getAllModulesLittleInfo(id as string);

      res.status(200).json({ error: false, modules });
      
    } catch (error) {
      console.log(error)
      res.status(500).json({ error: true, message: "Internal Error" });
    }
}
