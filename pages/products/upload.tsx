import Button from "@/components/button";
import Input from "@/components/input";
import Layout from "@/components/layout";
import TextArea from "@/components/textarea";
import useMutation from "@/libs/client/useMutation";
import { Product } from "@prisma/client";
import type { NextPage } from "next";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";

interface UploadForm {
  name: string;
  price: string;
  description: string;
  image: FileList;
}

interface uploadResult {
  ok: boolean;
  product: Product;
}

// request cloudflare upload url
// uploadURL? fetch new image by formData
// getID? upload product model image id
// finished? reload product id

const Upload: NextPage = () => {
  const router = useRouter();
  const { register, handleSubmit, watch } = useForm<UploadForm>();
  const [upload, { data, loading, error }] =
    useMutation<uploadResult>("/api/products");

  const [productPreview, setProductPreview] = useState("");
  const uploadImage = watch("image");

  useEffect(() => {
    if (uploadImage && uploadImage.length > 0) {
      const file = uploadImage[0];
      setProductPreview(URL.createObjectURL(file));
    }
  }, [uploadImage]);
  const onValid = async ({ name, price, description, image }: UploadForm) => {
    if (loading) return;
    if (image && image.length > 0) {
      const { uploadURL } = await (await fetch("/api/files")).json();
      const form = new FormData();
      form.append("file", uploadImage[0], name);
      const {
        result: { id },
      } = await (await fetch(uploadURL, { method: "POST", body: form })).json();
      upload({ name, price, description, image: id });
      return;
    } else {
      upload({ name, price, description });
    }
  };

  useEffect(() => {
    if (data?.ok) {
      router.push(`/products/${data.product.id}`);
    }
  }, [data, router]);
  return (
    <Layout canGoBack title="Upload Product">
      <form onSubmit={handleSubmit(onValid)} className="space-y-4 p-4">
        <div>
          {productPreview ? (
            <img src={productPreview} className="h-96 w-full rounded-md" />
          ) : (
            <label className="flex h-48 w-full cursor-pointer items-center justify-center rounded-md border-2 border-dashed border-gray-300 text-gray-600 hover:border-orange-500 hover:text-orange-500">
              <svg
                className="h-12 w-12"
                stroke="currentColor"
                fill="none"
                viewBox="0 0 48 48"
                aria-hidden="true"
              >
                <path
                  d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
                  strokeWidth={2}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
              <input
                {...register("image")}
                className="hidden"
                type="file"
                accept="image/*"
              />
            </label>
          )}
        </div>
        <Input
          label="Name"
          name="name"
          type="text"
          required
          register={register("name", { required: true })}
        />
        <Input
          label="Price"
          name="price"
          type="text"
          kind="price"
          required
          register={register("price", { required: true })}
        />
        <TextArea
          name="description"
          label="Description"
          register={register("description", { required: true })}
        />
        <Button text={loading ? "Loading..." : "상품 올리기"} />
      </form>
    </Layout>
  );
};

export default Upload;
