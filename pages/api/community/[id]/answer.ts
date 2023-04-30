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
    body: { answer },
  } = req;

  if (id && user) {
    await client.answer.create({
      data: {
        communityId: +id,
        userId: +user?.id,
        answer,
      },
    });

    res.status(200).json({
      ok: true,
    });
  }
}

export default withApiSession(withHandler({ methods: ["POST"], handler }));
