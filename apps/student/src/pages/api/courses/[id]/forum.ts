// ForumMessage
import { NextApiRequest, NextApiResponse } from "next";
import { queries } from "@repo/utils";
import { getSession } from "@auth0/nextjs-auth0";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    switch (req.method) {
      case "GET":
        return handleGetForum(req, res);
      case "POST":
        return handlePostForum(req, res);
      default:
        res.status(405).json({error: true, message: "Method Not Allowed"});
        break;
    }
  } catch (error) {
    res.status(500).json({ error: true, message: "Internal Error" });
  }
}

async function handleGetForum(req: NextApiRequest, res: NextApiResponse) {
  try {
    const { id } = req.query;
    const user = await getSession(req, res);
    if (!user) {
      res.status(401).json({ error: true, message: "Unauthorized" });
      return;
    }
    const student = await queries.getStudent(user.user.email);

    const enrolled = await queries.getEnrolledData(student.id, id as string) || null;
    if(!enrolled) {
        res.status(403).json({ error: true, message: "Forbidden" });
        return;
    }

    const messages = await queries.getForumMessages(id as string);
    res.status(200).json({ error: false, messages });
  } catch (error) {
    res.status(500).json({ error: true, message: "Internal Error" });
  }
}

async function handlePostForum(req: NextApiRequest, res: NextApiResponse) {
  try {
    const { id } = req.query;
    const user = await getSession(req, res);
    if (!user) {
      res.status(401).json({ error: true, message: "Unauthorized" });
      return;
    }
    const student = await queries.getStudent(user.user.email);

    const enrolled = await queries.getEnrolledData(student.id, id as string) || null;
    if(!enrolled) {
        res.status(403).json({ error: true, message: "Forbidden" });
        return;
    }

    const { message } = req.body;
    if (!message) {
      res.status(400).json({ error: true, message: "Bad Request" });
      return;
    }

    await queries.addForumMessage(id as string, student.id, message);
    res.status(200).json({ error: false });
  } catch (error) {
    res.status(500).json({ error: true, message: "Internal Error" });
  }
}
