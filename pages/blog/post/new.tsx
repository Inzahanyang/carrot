import { SideLayout } from "@/components/sideLayout";
import useMutation from "@/libs/client/useMutation";
import { faBrain } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";

interface BlogForm {
  topic: string;
  keywords: string;
}

export default function NewPost() {
  const router = useRouter();
  const { register, handleSubmit } = useForm<BlogForm>();
  const [createBlog, { loading, data }] = useMutation("/api/blog/generatePost");
  const onValid = async (form: BlogForm) => {
    try {
      createBlog(form);
    } catch (e) {
      console.log(e);
    }
  };

  useEffect(() => {
    if (data && data.ok) {
      router.push(`/blog/post/${data.id}`);
    }
  }, [data, router]);

  return (
    <div className="h-full overflow-hidden">
      {!!loading && (
        <div className="flex h-full w-full animate-pulse flex-col items-center justify-center text-center text-green-500">
          <FontAwesomeIcon icon={faBrain} className="text-8xl" />
          <h6 className="text-3xl">Generating...</h6>
        </div>
      )}
      {!loading && (
        <div className="flex h-full w-full flex-col overflow-auto">
          <form
            onSubmit={handleSubmit(onValid)}
            className="m-auto w-full max-w-screen-sm space-y-3 rounded-md border border-slate-200 bg-slate-100 p-4 shadow-xl shadow-slate-200"
          >
            <div>
              <label>
                <strong className="text-sm font-semibold">
                  작성한 주제에 대한 블로그 게시물을 생성합니다.
                </strong>
              </label>
              <textarea
                {...register("topic", { required: true, minLength: 8 })}
                className="mt-1 block h-16 w-full resize-none rounded-md border border-black px-2 py-0.5"
              ></textarea>
            </div>
            <div className="flex flex-col">
              <label>
                <strong className="text-sm font-semibold">
                  다음에 작성된 키워드를 타겟팅 합니다.
                </strong>
              </label>
              <textarea
                {...register("keywords", { required: true, minLength: 6 })}
                className="mt-1 block h-16 w-full resize-none rounded-md border border-black px-2 py-0.5"
              ></textarea>
              <small>쉼표로 키워드를 구분합니다.</small>
            </div>
            <button type="submit" className="btn">
              Generate Post
            </button>
          </form>
        </div>
      )}
    </div>
  );
}

NewPost.getLayout = function getLayout(
  page: any,
  pageProps: JSX.IntrinsicAttributes & { children: any }
) {
  return <SideLayout {...pageProps}>{page}</SideLayout>;
};
