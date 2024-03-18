import { handleAuth, handleCallback } from "@auth0/nextjs-auth0";
import { addInstructor } from "@repo/utils";
import { NextApiRequest, NextApiResponse } from "next";

export default handleAuth({
  callback: async (req: NextApiRequest, res: NextApiResponse) => {
    try {
      await handleCallback(req, res, {
        afterCallback: async(req, res, session, state) => {
            const user = session.user;
            // store user in db
            await addInstructor({email: user.email, name: user.name});
            
            return session;
        },
      });
    } catch (error) {
      console.error(error);
    }
  },
});
