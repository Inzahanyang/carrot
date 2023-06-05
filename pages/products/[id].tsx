import type { NextPage } from "next";
import Layout from "../../components/layout";
import Button from "@/components/button";
import useSWR from "swr";
import { useRouter } from "next/router";
import { Product, User } from "@prisma/client";
import Link from "next/link";
import useMutation from "@/libs/client/useMutation";
import { cls } from "@/libs/client/utils";
import Image from "next/image";

interface ProductWithUser extends Product {
  user: User;
}

interface ProductResponse {
  ok: boolean;
  product: ProductWithUser;
  relatedProduct: Product[];
  isLiked: boolean;
}

const ItemDetail: NextPage = () => {
  const router = useRouter();
  const { data, isLoading, mutate } = useSWR<ProductResponse>(
    router.query.id ? `/api/products/${router.query.id}` : null
  );

  const [fav, { loading }] = useMutation(
    `/api/products/${router.query.id}/fav`
  );

  const onFavClick = () => {
    if (!loading) fav({});
    if (!data) return;
    mutate({ ...data, isLiked: !data?.isLiked }, false);
  };

  return (
    <Layout canGoBack>
      {isLoading ? (
        <div className="mt-20 flex items-center justify-center text-3xl font-bold">
          Loading...
        </div>
      ) : (
        <div className="px-4 py-4">
          <div className="mb-8">
            <div className="relative pb-96">
              <Image
                src={`https://imagedelivery.net/6WVwiW2h0KvJliuEhpAT4A/${data?.product.image}/public`}
                className="object-center"
                alt="product"
                fill
              />
            </div>
            <div className="flex cursor-pointer items-center space-x-3 border-t border-b py-3">
              <Image
                alt="avatar"
                width={48}
                height={48}
                src={`https://imagedelivery.net/6WVwiW2h0KvJliuEhpAT4A/${data?.product.user.avatar}/avatar`}
                className="h-12 w-12 rounded-full bg-slate-300"
              />
              <div>
                <p className="text-sm font-medium text-gray-700">
                  {data?.product?.user?.name}
                </p>
                <Link href={`/users/${data?.product?.user?.id}`}>
                  <p className="text-xs font-medium text-gray-500">
                    View profile &rarr;
                  </p>
                </Link>
              </div>
            </div>
            <div className="mt-5">
              <h1 className="text-3xl font-bold text-gray-900">
                {data?.product?.name}
              </h1>
              <span className="mt-3 block text-2xl text-gray-900">
                ₩ {data?.product?.price?.toLocaleString("ko-KR")} 원
              </span>
              <p className=" my-6 text-gray-700">
                {data?.product?.description}
              </p>
              <div className="flex items-center justify-between space-x-2">
                <Button large text="Talk to seller" />
                <button
                  onClick={onFavClick}
                  className={cls(
                    "flex items-center justify-center rounded-md p-3",
                    data?.isLiked
                      ? "text-red-500 hover:bg-red-100 hover:text-red-500"
                      : "text-gray-400 hover:bg-gray-100 hover:text-gray-500"
                  )}
                >
                  {data?.isLiked ? (
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                      fill="currentColor"
                      className="h-6 w-6"
                    >
                      <path d="M11.645 20.91l-.007-.003-.022-.012a15.247 15.247 0 01-.383-.218 25.18 25.18 0 01-4.244-3.17C4.688 15.36 2.25 12.174 2.25 8.25 2.25 5.322 4.714 3 7.688 3A5.5 5.5 0 0112 5.052 5.5 5.5 0 0116.313 3c2.973 0 5.437 2.322 5.437 5.25 0 3.925-2.438 7.111-4.739 9.256a25.175 25.175 0 01-4.244 3.17 15.247 15.247 0 01-.383.219l-.022.012-.007.004-.003.001a.752.752 0 01-.704 0l-.003-.001z" />
                    </svg>
                  ) : (
                    <svg
                      className="h-6 w-6 "
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      aria-hidden="true"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                      />
                    </svg>
                  )}
                </button>
              </div>
            </div>
          </div>
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Similar items</h2>
            <div className=" mt-6 grid grid-cols-2 gap-4">
              {data?.relatedProduct?.map((product) => (
                <div key={product.id}>
                  <div className="mb-4 h-56 w-full bg-slate-300" />
                  <h3 className="-mb-1 text-gray-700">{product.name}</h3>
                  <span className="text-sm font-medium text-gray-900">
                    ${product.price.toLocaleString("ko-KR")}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </Layout>
  );
};

export default ItemDetail;
