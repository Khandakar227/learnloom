import { NextApiRequest, NextApiResponse } from "next";

export default async function handler(req:NextApiRequest, res:NextApiResponse) {
    try {
        console.log(req.query)
        res.status(200).json({error: false});
    } catch (error) {
        res.status(500).json({error: true, message: "Internal Error"});
    }
}