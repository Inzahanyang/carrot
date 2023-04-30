import useSWR from "swr";
import Item from "./item";
import { Product } from "@prisma/client";

interface ProductListProps {
  kind: "sales" | "purchases" | "favs";
}

interface ProductWithCount extends Product {
  _count: {
    favs: number;
  };
}

interface Record {
  id: number;
  product: ProductWithCount;
}

interface ProductResponse {
  [key: string]: Record[];
}

export default function ProductList({ kind }: ProductListProps) {
  const { data } = useSWR<ProductResponse>(`/api/users/me/${kind}`);

  return data ? (
    <>
      {data[kind]?.map((record) => (
        <Item
          id={record.product.id}
          key={record.id}
          title={record.product.name}
          price={record.product.price.toLocaleString("ko-KR")}
          comments={1}
          hearts={record.product._count.favs}
        />
      ))}
    </>
  ) : null;
}
