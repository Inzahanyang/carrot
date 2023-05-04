import client from "@/libs/server/client";
import withHandler, { ResponseType } from "@/libs/server/withHandler";
import { withApiSession } from "@/libs/server/withSession";
import { NextApiRequest, NextApiResponse } from "next";

async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ResponseType>
) {
  console.log(req.body.message);

  if (req.query.id && req.session.user) {
    const message = await client.streamMessage.create({
      data: {
        message: req.body.message,
        userId: +req.session.user?.id,
        streamId: parseInt(req.query.id.toString()),
      },
    });

    console.log(message);

    res.json({
      ok: true,
      message,
    });
  }
}

export default withApiSession(withHandler({ methods: ["POST"], handler }));
