// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import clients from "@/libs/server/client";
import type { NextApiRequest, NextApiResponse } from "next";

type Data = {
  name: string;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  await clients.user.create({
    data: {
      email: "inzahan@gmail.com",
      name: "yang",
    },
  });
  res.status(200).json({ name: "John Doe" });
}
