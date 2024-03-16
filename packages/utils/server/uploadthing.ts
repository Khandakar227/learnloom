import { getSession } from "@auth0/nextjs-auth0";
import { createUploadthing, type FileRouter } from "uploadthing/next-legacy";
import { UploadThingError } from "uploadthing/server";
 
const f = createUploadthing();
 
// FileRouter for your app, can contain multiple FileRoutes
export const ourFileRouter = {
    courseImage:
    f({image: { maxFileSize: '4MB', maxFileCount: 1 }})
    .middleware(async ({ req, res }) => {
        const user = await getSession(req, res);
        
        if(!user) throw new UploadThingError("Unauthorized");
        
        return { user: user.user || {} };
    })
    .onUploadComplete(async ({ metadata, file }) => {
        console.log("file url", JSON.stringify(file));
        return ({metadata});
    })

} satisfies FileRouter;
 
export type OurFileRouter = typeof ourFileRouter;