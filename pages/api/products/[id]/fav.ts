import client from "@/libs/server/client";
import withHandler, { ResponseType } from "@/libs/server/withHandler";
import { withApiSession } from "@/libs/server/withSession";
import { NextApiRequest, NextApiResponse } from "next";

async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ResponseType>
) {
  const {
    query: { id },
    session: { user },
  } = req;

  if (id && user) {
    const existsFav = await client.fav.findFirst({
      where: {
        productId: +id.toString(),
        userId: user.id,
      },
    });

    if (existsFav) {
      await client.fav.delete({
        where: {
          id: existsFav.id,
        },
      });
    } else {
      await client.fav.create({
        data: {
          user: {
            connect: {
              id: user.id,
            },
          },
          product: {
            connect: {
              id: +id,
            },
          },
        },
      });
    }
  }

  res.status(200).json({
    ok: true,
  });
}

export default withApiSession(withHandler({ methods: ["POST"], handler }));
