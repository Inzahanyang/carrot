import client from "@/libs/server/client";
import withHandler, { ResponseType } from "@/libs/server/withHandler";
import { withApiSession } from "@/libs/server/withSession";
import { NextApiRequest, NextApiResponse } from "next";

async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ResponseType>
) {
  const { query } = req;

  if (!query.id) {
    res.status(422).json({ ok: false, error: "Not found post" });
    return;
  }

  const post = await client.blogPost.findUnique({
    where: {
      id: parseInt(query.id.toString()),
    },
  });

  if (!post) {
    res.status(404).json({ ok: false, error: "Not found post" });
  }

  res.status(200).json({
    ok: true,
    post,
  });
}

export default withApiSession(withHandler({ methods: ["GET"], handler }));
