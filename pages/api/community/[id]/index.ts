// |이 코드는 Next.js API 라우트 핸들러를 정의하는 TypeScript 코드입니다.
// |
// |좋은 점:
// |- `async/await`를 사용하여 비동기적으로 데이터를 가져오고 처리합니다.
// |- `try/catch` 블록이 없지만, `await`를 사용하여 발생할 수 있는 예외를 처리합니다.
// |- `withApiSession`과 `withHandler`를 사용하여 API 요청에 대한 세션 및 핸들러 미들웨어를 적용합니다.
// |- `ResponseType`을 사용하여 API 응답의 타입을 정의합니다.
// |
// |나쁜 점:
// |- `+id`를 사용하여 문자열을 숫자로 변환하는 것은 위험합니다. `parseInt()`를 사용하는 것이 더 안전합니다.
// |- `Boolean()`을 사용하여 불리언 값을 생성하는 것은 필요하지 않습니다. `!!`를 사용하여 불리언 값을 생성하는 것이 더 간단합니다.
// |- `community`와 `isWonder` 변수가 `null` 또는 `undefined`일 수 있으므로, 이를 처리하는 코드가 필요합니다.
// |
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
    const community = await client.community.findUnique({
      where: {
        id: parseInt(id.toString()),
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            avatar: true,
          },
        },
        answers: {
          select: {
            answer: true,
            updatedAt: true,
            user: {
              select: {
                name: true,
                avatar: true,
                id: true,
              },
            },
          },
        },
        _count: {
          select: {
            answers: true,
            wonders: true,
          },
        },
      },
    });

    const isWonder = !!(await client.wonder.findFirst({
      where: {
        communityId: community?.id,
        userId: user?.id,
      },
    }));

    console.log(isWonder);
    res.status(200).json({
      ok: true,
      community,
      isWonder,
    });
  }
}

export default withApiSession(withHandler({ methods: ["GET"], handler }));
