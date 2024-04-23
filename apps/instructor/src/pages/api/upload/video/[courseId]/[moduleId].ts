import fs from "fs";
import path from "path";
import formidable, { File } from "formidable";
import { NextApiRequest, NextApiResponse } from "next";
import { v4 as uuidv4 } from "uuid";
import mime from "mime";
import { mkdir, stat } from "fs/promises";

const isFile = (file: File | File[] | undefined): file is File =>
  !Array.isArray(file) && file?.filepath !== undefined;

export const config = {
  api: {
    bodyParser: false, // Disabling bodyParser to handle form data manually
  },
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "POST") {
    const { courseId, moduleId } = req.query;
    // Check courseId, moduleId given
    if (!courseId || !moduleId)
      return res
        .status(401)
        .json({ error: true, message: "No course or module specified." });

    try {
      const uploadDir = path.join(process.cwd(), `public/uploads/videos/${courseId}/${moduleId}`);
      const isOk = await makeFolders(uploadDir);
      if (!isOk)
        return res.status(500).json({ error: true, message: "Internal Error" });

      const form = formidable({
        maxFiles: 1,
        uploadDir,
        filename(name, ext, part, form) {
          return `${uuidv4()}_${Date.now()}.${mime.getExtension(part.mimetype || "") || "unknown"}`;
        },
      });
      const filePath: string = await new Promise((resolve, reject) => {
        form.parse(req, (err, _fields, files) => {
            if (err) {
                console.error("Error parsing form:", err);
                return res.status(500).json({ error: "Error parsing form data" });
            }
            const file = files.file?.length ? files.file[0] : null;
            if (file) {
                const relFilePath = path.relative(path.normalize(process.cwd()), path.normalize(file.filepath));    
                resolve(relFilePath);
            }
          reject();
        });
      });

      const protocol = req.headers["x-forwarded-proto"]+ "://";
      
      res.status(200).send({
        message: "ok",
        filePath: protocol + path.join(req.headers.host as string, filePath.substring("public/".length)).replace(/\\/g, '/')
    });
    } catch (error) {
      console.log(error);
      res.status(400).send({ message: "Bad Request" });
    }
  }
}

const makeFolders = async (uploadDir: string) => {
  try {
    await stat(uploadDir);
    return true;
  } catch (e: any) {
    if (e.code === "ENOENT") {
      await mkdir(uploadDir, { recursive: true });
      return true;
    } else {
      console.error(e);
      return false;
    }
  }
};
