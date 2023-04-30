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
    const existWonder = await client.wonder.findFirst({
      where: {
        communityId: +id,
        userId: user?.id,
      },
    });
    if (existWonder) {
      await client.wonder.delete({
        where: {
          id: existWonder.id,
        },
      });
    } else {
      await client.wonder.create({
        data: {
          communityId: +id,
          userId: user.id,
        },
      });
    }

    res.status(200).json({
      ok: true,
    });
  }
}

export default withApiSession(withHandler({ methods: ["POST"], handler }));
