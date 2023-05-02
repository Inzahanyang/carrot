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
    // req.session 에서 유저정보와, req.body에서 email, phone을 가져온다.
    // email update 시 동일한 이메일 주소가 있는지 확인하고 존재하면 에러를 보내고 없으면 유저 이메일을 변경하고 response를 보낸다. Phone update 도 동의
    // name 변경시 중복이 가능하므로 바로 업데이트 한다.
    // 이메일과 폰이 동시에 요청이 올 시 기존 이메일과 동일한 이메일인 경우는 에러를 보내고 다른 경우만 에미일과 폰을 수정한다.

    const {
      session: { user },
      body: { email, phone, name },
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
      res.status(200).json({ ok: true });
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
      res.status(200).json({ ok: true });
    }
    if (name) {
      await client.user.update({
        where: { id: user?.id },
        data: { name },
      });
      res.status(200).json({ ok: true });
    }
  }
}

export default withApiSession(
  withHandler({ methods: ["GET", "POST"], handler })
);
