import Layout from "@/components/layout";
import useMutation from "@/libs/client/useMutation";
import useUser from "@/libs/client/useUser";
import type { NextPage } from "next";
import { useEffect } from "react";
import { useForm } from "react-hook-form";

interface ProfileForm {
  email?: string;
  phone?: string;
  name?: string;
}

interface EditProfileResponse {
  ok: boolean;
  error?: string;
}

const EditProfile: NextPage = () => {
  const { user } = useUser();
  const {
    register,
    handleSubmit,
    setValue,
    setError,
    formState: { errors },
  } = useForm<ProfileForm>();
  const [editProfile, { data, loading }] =
    useMutation<EditProfileResponse>("/api/users/me");
  const onValid = (form: ProfileForm) => {
    if (loading) return;
    if (form.email === "" && form.phone === "") {
      return setError("root", { message: "장난쳐? 적어도 한개는 적어야지!!" });
    }
    editProfile(form);
  };

  useEffect(() => {
    if (user?.name) setValue("name", user?.name);
    if (user?.email) setValue("email", user?.email);
    if (user?.phone) setValue("phone", user?.phone);
  }, [user, setValue]);

  useEffect(() => {
    if (data && !data.ok && data.error) {
      setError("root", { message: data.error });
    }
  }, [data, setError]);
  return (
    <Layout title="프로필 수정" canGoBack>
      <form onSubmit={handleSubmit(onValid)} className="space-y-4 py-10 px-4">
        <div className="flex items-center space-x-3">
          <div className="h-14 w-14 rounded-full bg-slate-500" />
          <label
            htmlFor="picture"
            className="cursor-pointer rounded-md border border-gray-300 py-2 px-3 text-sm font-medium text-gray-700 shadow-sm focus:ring-2 focus:ring-orange-500 focus:ring-offset-2"
          >
            Change
            <input
              id="picture"
              type="file"
              className="hidden"
              accept="image/*"
            />
          </label>
        </div>
        <div className="space-y-1">
          <label htmlFor="name" className="text-sm font-medium text-gray-700">
            Name
          </label>
          <input
            {...register("name")}
            id="name"
            type="text"
            className="w-full appearance-none rounded-md border border-gray-300 px-3 py-2 placeholder-gray-400 shadow-sm focus:border-orange-500 focus:outline-none focus:ring-orange-500"
          />
        </div>
        <div className="space-y-1">
          <label htmlFor="email" className="text-sm font-medium text-gray-700">
            Email address
          </label>
          <input
            {...register("email")}
            id="email"
            type="email"
            className="w-full appearance-none rounded-md border border-gray-300 px-3 py-2 placeholder-gray-400 shadow-sm focus:border-orange-500 focus:outline-none focus:ring-orange-500"
          />
        </div>
        <div className="space-y-1">
          <label htmlFor="phone" className="text-sm font-medium text-gray-700">
            Phone number
          </label>
          <div className="flex rounded-md shadow-sm">
            <span className="flex select-none items-center justify-center rounded-l-md border border-r-0 border-gray-300 bg-gray-50 px-3 text-sm text-gray-500">
              +82
            </span>
            <input
              {...register("phone")}
              id="input"
              type="text"
              className="w-full appearance-none rounded-md rounded-l-none border border-gray-300 px-3 py-2 placeholder-gray-400 shadow-sm focus:border-orange-500 focus:outline-none focus:ring-orange-500"
            />
          </div>
        </div>
        {errors ? (
          <span className="mt-2 block text-center text-sm text-pink-600">
            {errors.root?.message}
          </span>
        ) : null}
        <button className="mt-5 w-full rounded-md border border-transparent bg-orange-500 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-orange-600 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2 ">
          {loading ? "Loading..." : data?.ok ? "Done" : "Update profile"}
        </button>
      </form>
    </Layout>
  );
};

export default EditProfile;

//  edit profile
// 이름, 이메일, 폰번호 변경가능
// enter page 제외한 모든 페이지 useUser로 제한
