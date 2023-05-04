import client from "@/libs/server/client";
import withHandler, { ResponseType } from "@/libs/server/withHandler";
import { withApiSession } from "@/libs/server/withSession";
import { NextApiRequest, NextApiResponse } from "next";

async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ResponseType>
) {
  if (req.method === "GET") {
    const {
      query: { page },
    } = req;

    console.log(page);

    const streams = await client.stream.findMany({
      take: 10,
      skip: 10 * (page ? parseInt(page.toString()) : 0),
    });

    res.json({
      ok: true,
      streams,
    });
  }

  if (req.method === "POST") {
    const stream = await client.stream.create({
      data: {
        price: req.body.price,
        name: req.body.name,
        description: req.body.description,
        user: {
          connect: {
            id: req?.session?.user?.id,
          },
        },
      },
    });

    res.json({
      ok: true,
      stream,
    });
  }
}

export default withApiSession(
  withHandler({ methods: ["GET", "POST"], handler })
);
