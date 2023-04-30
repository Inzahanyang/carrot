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
      query: { latitude, longitude },
    } = req;

    if (latitude && longitude) {
      const communities = await client.community.findMany({
        where: {
          latitude: {
            gte: parseFloat(latitude?.toString()) - 0.1,
            lte: parseFloat(latitude?.toString()) + 0.1,
          },
          longitude: {
            gte: parseFloat(longitude?.toString()) - 0.1,
            lte: parseFloat(longitude?.toString()) + 0.1,
          },
        },
        include: {
          user: {
            select: {
              name: true,
            },
          },
          _count: {
            select: {
              wonders: true,
              answers: true,
            },
          },
        },
      });

      res.status(200).json({
        ok: true,
        communities,
      });
    }
  }
  if (req.method === "POST") {
    const {
      body: { question, latitude, longitude },
      session: { user },
    } = req;

    const { id } = await client.community.create({
      data: {
        question,
        latitude,
        longitude,
        user: {
          connect: {
            id: user?.id,
          },
        },
      },
      select: {
        id: true,
      },
    });

    res.json({
      ok: true,
      id,
    });
  }
}

export default withApiSession(
  withHandler({ methods: ["GET", "POST"], handler })
);
