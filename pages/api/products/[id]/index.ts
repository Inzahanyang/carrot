// |이 코드는 Next.js에서 API endpoint를 처리하는 함수입니다.
// |
// |좋은 점:
// |- 코드가 간결하고 가독성이 좋습니다.
// |- `async/await`를 사용하여 비동기적으로 데이터를 처리하고 있습니다.
// |- `withHandler`와 `withApiSession`을 사용하여 코드의 재사용성을 높였습니다.
// |
// |나쁜 점:
// |- `+id`와 같이 암시적 형변환이 일어나는 부분이 있어 가독성이 떨어집니다.
// |- `product?.name.split(" ")`와 같이 optional chaining을 사용하면서도 `terms` 변수가 null일 경우를 처리하지 않았습니다. 이 경우 에러가 발생할 수 있습니다.
// |- `relatedProduct`를 찾을 때 `OR`과 `AND`를 함께 사용하여 복잡한 조건을 만들었습니다. 이 경우 코드의 가독성이 떨어질 수 있습니다.
// |
// |개선점:
// |- `+id` 대신 `parseInt(id)`와 같이 명시적 형변환을 사용하면 가독성이 좋아집니다.
// |- `terms` 변수가 null일 경우를 처리하여 코드의 안정성을 높일 수 있습니다.
// |- `relatedProduct`를 찾을 때 `OR`과 `AND`를 분리하여 코드의 가독성을 높일 수 있습니다.
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
    query,
    session: { user },
  } = req;

  if (query.id) {
    const product = await client.product.findUnique({
      where: {
        id: parseInt(query.id?.toString()),
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
}

export default withApiSession(withHandler({ methods: ["GET"], handler }));
