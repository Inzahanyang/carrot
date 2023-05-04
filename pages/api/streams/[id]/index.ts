import client from "@/libs/server/client";
import withHandler, { ResponseType } from "@/libs/server/withHandler";
import { withApiSession } from "@/libs/server/withSession";
import { NextApiRequest, NextApiResponse } from "next";

async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ResponseType>
) {
  if (req.query.id) {
    const stream = await client.stream.findUnique({
      where: {
        id: parseInt(req?.query?.id.toString()),
      },
      include: {
        messages: {
          select: {
            message: true,
            user: {
              select: {
                avatar: true,
                name: true,
                id: true,
              },
            },
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

export default withApiSession(withHandler({ methods: ["GET"], handler }));
