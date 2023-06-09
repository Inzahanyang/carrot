import client from "@/libs/server/client";
import withHandler, { ResponseType } from "@/libs/server/withHandler";
import { withApiSession } from "@/libs/server/withSession";
import { NextApiRequest, NextApiResponse } from "next";

async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ResponseType>
) {
  const {
    session: { user },
  } = req;

  const purchases = await client.purchase.findMany({
    where: {
      userId: user?.id,
    },
    include: {
      product: {
        select: {
          id: true,
          name: true,
          price: true,
          _count: {
            select: { favs: true },
          },
        },
      },
    },
  });

  res.json({
    ok: true,
    purchases,
  });
}

export default withApiSession(withHandler({ methods: ["GET"], handler }));
