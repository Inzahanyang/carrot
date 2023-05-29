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

  if (!user?.id) {
    res.status(422).json({ ok: false, error: "Not found post" });
    return;
  }

  const posts = await client.blogPost.findMany({
    where: {
      userId: parseInt(user.id.toString()),
    },
    select: {
      topic: true,
      id: true,
    },
  });

  console.log(posts);

  if (!posts) {
    res.status(404).json({ ok: false, error: "Not found posts" });
  }

  res.status(200).json({
    ok: true,
    posts,
  });
}

export default withApiSession(withHandler({ methods: ["GET"], handler }));
