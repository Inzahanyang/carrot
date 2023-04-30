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

  if (!id) {
    return res.status(400).json({ ok: false });
  }

  const product = await client.product.findUnique({
    where: {
      id: +id,
    },
    include: {
      user: {
        select: {
          id: true,
          name: true,
          avatar: true,
        },
      },
    },
  });

  const terms = product?.name.split(" ").map((term) => ({
    name: {
      contains: term,
    },
  }));

  const relatedProduct = await client.product.findMany({
    where: {
      OR: terms,
      AND: {
        id: {
          not: product?.id,
        },
      },
    },
    take: 4,
  });

  const isLiked = Boolean(
    await client.fav.findFirst({
      where: {
        productId: product?.id,
        userId: user?.id,
      },
      select: {
        id: true,
      },
    })
  );

  res.status(200).json({
    ok: true,
    product,
    relatedProduct,
    isLiked,
  });
}

export default withApiSession(withHandler({ methods: ["GET"], handler }));
