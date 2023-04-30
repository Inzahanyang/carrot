import Layout from "@/components/layout";
import TextArea from "@/components/textarea";
import useMutation from "@/libs/client/useMutation";
import { cls } from "@/libs/client/utils";
import { Answer, Community, User } from "@prisma/client";
import { NextPage } from "next";
import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import useSWR from "swr";

interface AnswerWithUser extends Answer {
  user: User;
}

interface CommunityWithUser extends Community {
  user: User;
  answers: AnswerWithUser[];
  _count: {
    answers: number;
    wonders: number;
  };
}

interface communityResponse {
  ok: boolean;
  community: CommunityWithUser;
  isWonder: boolean;
}

interface AnswerForm {
  answer: string;
}

interface AnswerResponse {
  ok: boolean;
}

const CommunityPostDetail: NextPage = () => {
  const router = useRouter();
  const { data, mutate } = useSWR<communityResponse>(
    router.query.id ? `/api/community/${router.query.id}` : null
  );
  const { handleSubmit, register, reset } = useForm<AnswerForm>();
  const [answer, { data: answerData, loading }] = useMutation<AnswerResponse>(
    `/api/community/${router.query.id}/answer`
  );
  const onValid = (data: AnswerForm) => {
    if (loading) return;
    answer(data);
  };

  const [wonder, { loading: wonderLoading }] = useMutation(
    `/api/community/${data?.community?.id}/wonder`
  );

  const wonderClick = () => {
    if (wonderLoading) return;
    mutate(
      (prev) =>
        prev && {
          ...prev,
          isWonder: !prev.isWonder,
          community: {
            ...prev.community,
            _count: {
              ...prev?.community?._count,
              wonders: data?.isWonder
                ? prev.community._count.wonders - 1
                : prev.community._count.wonders + 1,
            },
          },
        },
      false
    );
    wonder({});
  };

  useEffect(() => {
    if (answerData && answerData.ok) {
      reset();
      mutate();
    }
  }, [answerData, reset, mutate]);
  return (
    <Layout canGoBack>
      <div>
        <span className="my-3 ml-4 inline-flex items-center rounded-full bg-gray-100 px-2.5 py-0.5 text-xs font-medium text-gray-800">
          동네질문
        </span>
        <div className="mb-3 flex cursor-pointer items-center space-x-3  border-b px-4 pb-3">
          <div className="h-10 w-10 rounded-full bg-slate-300" />
          <div>
            <p className="text-sm font-medium text-gray-700">
              {data?.community?.user?.name}
            </p>
            <Link href={`/profile/${data?.community?.user?.id}`}>
              <p className="text-xs font-medium text-gray-500">
                View profile &rarr;
              </p>
            </Link>
          </div>
        </div>
        <div>
          <div className="mt-2 px-4 font-bold text-gray-700">
            <span className=" text-base font-medium text-orange-500">Q. </span>
            {data?.community?.question}
          </div>
          <div className="mt-3 flex w-full space-x-5 border-t border-b-[2px] px-4 py-2.5  text-gray-700">
            <button
              onClick={wonderClick}
              className={cls(
                `flex items-center space-x-2 text-sm`,
                data?.isWonder ? "text-teal-500" : ""
              )}
            >
              <svg
                className="h-4 w-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                ></path>
              </svg>
              <span>궁금해요 {data?.community?._count?.wonders}</span>
            </button>
            <span className="flex items-center space-x-2 text-sm">
              <svg
                className="h-4 w-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                ></path>
              </svg>
              <span>답변 {data?.community?._count?.answers}</span>
            </span>
          </div>
        </div>
        <div className="my-5 space-y-5 px-4">
          {data?.community?.answers?.map((answer) => (
            <div className="flex flex-col" key={answer.id}>
              <div className="flex items-center space-x-3 text-xs">
                <div className="h-5 w-5 rounded-full bg-slate-200" />
                <span className="font-semibold">{answer.user.name}</span>
                <span className="text-gray-500">
                  {new Date(answer.updatedAt).toLocaleDateString()}{" "}
                  {new Date(answer.updatedAt).toLocaleTimeString()}
                </span>
              </div>
              <p className="mt-2 text-gray-700">{answer.answer}</p>
            </div>
          ))}
        </div>
        <form onSubmit={handleSubmit(onValid)} className="px-4">
          <TextArea
            register={register("answer", { required: true, min: 8 })}
            name="description"
            placeholder="Answer this question!"
            required
          />
          <button className="mt-2 w-full rounded-md border border-transparent bg-orange-500 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-orange-600 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2 ">
            {loading ? "Loading..." : "Reply"}
          </button>
        </form>
      </div>
    </Layout>
  );
};

export default CommunityPostDetail;
