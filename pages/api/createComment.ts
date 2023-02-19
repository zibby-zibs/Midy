// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next"
import { createClient } from "next-sanity";

export const config = {
    dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || "production",
    projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
    apiVersion: "2021-08-11", 
    token: process.env.SANITY_API_TOKEN,
    useCdn: process.env.NODE_ENV === "production",
  };
const client =  createClient(config)
export default async function createComment(req: NextApiRequest, res:NextApiResponse) {
    const { name, email, comment, _id } = JSON.parse(req.body)

    try {
        await client.create({
            _type: 'comment',
            post: {
                _type: 'reference',
                _ref: _id
            },
            name,
            email,
            comment,
        });
    } catch (error) {
        return res.status(500).json({message: "Couldn't submit comment", error})
    }
    res.status(200).json({ message: 'Comment submitted' })
  }
  