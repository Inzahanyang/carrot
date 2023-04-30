import Button from "@/components/button";
import Layout from "@/components/layout";
import TextArea from "@/components/textarea";
import { NextPage } from "next";
import { useForm } from "react-hook-form";
import useMutation from "@/libs/client/useMutation";
import { useRouter } from "next/router";
import { useEffect } from "react";
import useCoords from "@/libs/client/useCoords";

interface CommunityForm {
  question: string;
}

interface CommunityResponse {
  ok: boolean;
  id: number;
}

const Write: NextPage = () => {
  const { latitude, longitude } = useCoords();

  const router = useRouter();
  const [question, { data, loading }] =
    useMutation<CommunityResponse>("/api/community");
  const { handleSubmit, register } = useForm<CommunityForm>();
  const onValid = (data: CommunityForm) => {
    if (loading) return;
    question({ ...data, latitude, longitude });
  };
  useEffect(() => {
    if (data && data.ok) {
      router.push(`/community/${data.id}`);
    }
  }, [router, data]);

  return (
    <Layout canGoBack title="Write Post">
      <form onSubmit={handleSubmit(onValid)} className="space-y-4 p-4">
        <TextArea
          register={register("question", { required: true })}
          required
          placeholder="Ask a question!"
        />
        <Button text={loading ? "Loading..." : "Submit"} />
      </form>
    </Layout>
  );
};

export default Write;
