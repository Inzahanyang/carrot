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
      session: { user },
    } = req;

    if (!user?.id) return res.status(404).json({ ok: false });

    const profile = await client.user.findUnique({
      where: { id: user?.id },
    });
    if (!profile) return res.status(404).json({ ok: false });

    res.json({
      ok: true,
      profile,
    });
  }

  if (req.method === "POST") {
    const {
      session: { user },
      body: { email, phone, name, avatarId },
    } = req;

    const currentUser = await client.user.findUnique({
      where: {
        id: user?.id,
      },
    });

    if (email && email !== currentUser?.email) {
      const existEmail = !!(await client.user.findUnique({
        where: { email },
        select: { id: true },
      }));

      if (existEmail)
        return res.json({
          ok: false,
          error: "이미 사용중인 이메일 주소입니다.",
        });

      await client.user.update({
        where: { id: user?.id },
        data: { email },
      });
    }

    if (phone && phone !== currentUser?.phone) {
      const existPhone = !!(await client.user.findUnique({
        where: { phone },
        select: { id: true },
      }));

      if (existPhone)
        return res.json({
          ok: false,
          error: "이미 사용중인 휴대폰 번호입니다.",
        });

      await client.user.update({
        where: { id: user?.id },
        data: { phone },
      });
    }

    if (name) {
      await client.user.update({
        where: { id: user?.id },
        data: { name },
      });
    }

    if (avatarId) {
      await client.user.update({
        where: { id: user?.id },
        data: {
          avatar: avatarId,
        },
      });
    }

    res.json({ ok: true });
  }
}

export default withApiSession(
  withHandler({ methods: ["GET", "POST"], handler })
);
