import { NextApiRequest, NextApiResponse } from "next";
import { queries } from "@repo/utils";
import { getSession } from "@auth0/nextjs-auth0";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    switch (req.method) {
      case "PUT":
        return handleUpdateStudent(req, res);
      default:
        res.status(405).json({error: true, message: "Method Not Allowed"});
        break;
    }
  } catch (error) {
    res.status(500).json({ error: true, message: "Internal Error" });
  }
}

async function handleUpdateStudent(req: NextApiRequest, res: NextApiResponse) {
    try {
        const session = await getSession(req, res);
        if (!session) {
            return res.status(401).json({ error: true, message: "Unauthorized" });
        }
        const { name, photoUrl } = req.body;
        await queries.updateStudent(session.user.email, { name, photoUrl });
        res.status(200).json({ error: false, message: "Profile Updated"});
    } catch (error) {
        res.status(500).json({ error: true, message: "Internal Error" });
    }
}
