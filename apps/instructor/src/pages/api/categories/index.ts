import { NextApiRequest, NextApiResponse } from "next";
import { queries } from '@repo/utils'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    try {
        const categories = await queries.getCategories();
        res.status(200).json({error: false, categories });
    } catch (error) {
        res.status(500).json({error: true, message: "Internal Error" });
    }
}