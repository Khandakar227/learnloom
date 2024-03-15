import { createRouteHandler } from "uploadthing/next-legacy";
 
import { ourFileRouter } from "@repo/utils/server";
 
export default createRouteHandler({
  router: ourFileRouter,
});